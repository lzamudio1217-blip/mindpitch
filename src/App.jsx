import { useState, useEffect, useRef } from "react";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

const C = {
  navy: "#0D1B2A", navyMid: "#1A2E42", navyLight: "#243447",
  green: "#1D9E75", greenLight: "#E1F5EE", greenDark: "#085041",
  amber: "#EF9F27", amberLight: "#FAEEDA",
  blue: "#378ADD", blueLight: "#E6F1FB",
  purple: "#7F77DD", purpleLight: "#EEEDFE",
  coral: "#D85A30", coralLight: "#FAECE7",
  white: "#FFFFFF", offwhite: "#F7F9F5",
  gray: "#64748B", grayLight: "#F1F5F1", grayMid: "#CBD5CB",
  text: "#1A2A1A", textMuted: "#5A7A6A",
};

const MODULES_LIBRARY = [
  {
    id: "mistake-recovery", title: "Mistake recovery", theme: "Mistake recovery", color: C.green, colorLight: C.greenLight, colorDark: C.greenDark, time: "5–7 min",
    situation: "You've just made a mistake in a game — a bad pass, a missed tackle, a shot that went wide. You can feel yourself tightening up. Your next touch feels heavy. Part of you wants to hide. The team needs you, but right now you're in your own head.",
    questions: ["What does it feel like in your body right after you make a mistake? Where do you feel it?", "What would you say to a teammate who just made that same mistake? Would you say the same thing to yourself?", "Name one player you respect — how do they respond after a mistake? What do you notice about them?", "What does the next 5 minutes look like if you decide to reset right now and play free?"],
    habit: { title: "The flush it routine", body: "After every mistake in training or a game: one deep breath, clap twice, say one word that brings you back. Practice it until it's automatic." }
  },
  {
    id: "confidence-slump", title: "Confidence slumps", theme: "Confidence", color: C.blue, colorLight: C.blueLight, colorDark: "#0C447C", time: "5–7 min",
    situation: "You used to be one of the first to get on the ball. Lately something feels different. You're second-guessing yourself before you touch it. You're making the safe pass instead of the risky one. You tell yourself you're being smart — but deep down you know that's not why.",
    questions: ["Think back to a game where you felt completely free — describe what that felt like. What was different?", "Right now, are you trying to play well — or are you trying not to fail? Be honest.", "What's one specific action you can take in the next game that a confident version of you would do?", "What would your teammates say about you if they described you at your best?"],
    habit: { title: "The one brave action", body: "Before every session this week, decide on ONE specific brave action. Write it in your phone before you arrive. After: did you attempt it?" }
  },
  {
    id: "bench-mentality", title: "Bench mentality", theme: "Bench", color: C.purple, colorLight: C.purpleLight, colorDark: "#3C3489", time: "5–7 min",
    situation: "You've been benched or had your minutes reduced. Part of you is frustrated. You feel like you should be playing. When you sit down, you can feel yourself going quiet — arms crossed, eyes down, disconnected from what's happening on the field.",
    questions: ["What does being on the bench give you the opportunity to see that you can't from the field?", "How does your attitude on the bench affect your teammates on the field right now?", "What's one thing you can do in the next 10 minutes to help the team win from where you are?", "What would a player you look up to do in this situation?"],
    habit: { title: "The scout mindset", body: "When on the bench, pick one opponent to study and one pattern to spot. It keeps you sharp and coaches notice it more than you think." }
  },
  {
    id: "new-player", title: "New to the team", theme: "Belonging", color: C.amber, colorLight: C.amberLight, colorDark: "#633806", time: "5–7 min",
    situation: "You're the new player. Everyone else already knows each other — their jokes, their routines, their way of doing things. You're trying hard but also watching, measuring yourself against players who've been here longer.",
    questions: ["What's the hardest part about being new to this team so far — be specific?", "Think of a time you felt really comfortable on a team. What made it feel that way?", "As a player, what's one thing you bring to a team that you're confident about, even right now?", "What would it feel like to be fully settled here — describe what a normal training session looks like when you're truly comfortable?"],
    habit: { title: "The one connection rule", body: "In every session this week, make one genuine connection with a teammate — not just about soccer. Use their name. Learn one thing about them." }
  },
  {
    id: "pre-game-anxiety", title: "Pre-game anxiety", theme: "Pressure", color: C.coral, colorLight: C.coralLight, colorDark: "#712B13", time: "5–7 min",
    situation: "Big game today. Tournament, rivalry, must-win. You can feel it in your body already — tight chest, restless legs, too many thoughts. In warmup your touch feels off. You start second-guessing things you normally do automatically.",
    questions: ["What does nervous actually feel like in your body right now — where exactly do you feel it?", "Is nervous always a bad thing, or can it mean you're ready? What's the difference?", "What's the ONE thing you personally can control in the first 5 minutes of this game?", "What would you want your teammates to see from you today — describe it specifically?"],
    habit: { title: "Reframe nerves as readiness", body: "When you feel nervous, say to yourself: 'my body is getting ready.' Then name one action you'll take in the first minute. Preparation, not suppression." }
  },
];

// ── Spanish module library ─────────────────────────────────────────────────────
const MODULES_LIBRARY_ES = [
  {
    id: "mistake-recovery", title: "Recuperación tras errores", theme: "Recuperación", color: C.green, colorLight: C.greenLight, colorDark: C.greenDark, time: "5–7 min",
    situation: "Acabas de cometer un error en el partido — un mal pase, una entrada fallida, un disparo que se fue lejos. Sientes que te tensas. Tu siguiente toque se siente pesado. Parte de ti quiere esconderse. El equipo te necesita, pero ahora mismo estás metido en tu cabeza.",
    questions: ["¿Cómo se siente tu cuerpo justo después de cometer un error? ¿Dónde lo sientes?", "¿Qué le dirías a un compañero que acaba de cometer ese mismo error? ¿Te dirías lo mismo a ti mismo?", "Nombra a un jugador que respetes — ¿cómo responde después de un error? ¿Qué notas en él?", "¿Cómo serán los próximos 5 minutos si decides reiniciarte ahora mismo y jugar libre?"],
    habit: { title: "La rutina de borrón y cuenta nueva", body: "Después de cada error en entrenamiento o partido: una respiración profunda, dos palmadas, di una palabra que te devuelva al juego. Practícalo hasta que sea automático." }
  },
  {
    id: "confidence-slump", title: "Baja de confianza", theme: "Confianza", color: C.blue, colorLight: C.blueLight, colorDark: "#0C447C", time: "5–7 min",
    situation: "Antes eras de los primeros en pedir el balón. Últimamente algo se siente diferente. Te cuestionas antes de tocarlo. Haces el pase fácil en lugar del arriesgado. Te dices que estás siendo inteligente — pero en el fondo sabes que esa no es la razón.",
    questions: ["Recuerda un partido donde te sintieras completamente libre — describe cómo se sentía. ¿Qué era diferente?", "Ahora mismo, ¿estás intentando jugar bien — o estás intentando no fallar? Sé honesto.", "¿Cuál es una acción específica que puedes hacer en el próximo partido que haría una versión tuya con confianza?", "¿Qué dirían tus compañeros de ti si te describieran en tu mejor momento?"],
    habit: { title: "La acción valiente", body: "Antes de cada sesión esta semana, decide UNA acción valiente específica. Escríbela en tu teléfono antes de llegar. Después: ¿la intentaste?" }
  },
  {
    id: "bench-mentality", title: "Mentalidad desde el banquillo", theme: "Banquillo", color: C.purple, colorLight: C.purpleLight, colorDark: "#3C3489", time: "5–7 min",
    situation: "Estás en el banquillo o con menos minutos. Parte de ti está frustrado. Sientes que deberías estar jugando. Cuando te sientas, te notas apagado — brazos cruzados, ojos abajo, desconectado de lo que pasa en el campo.",
    questions: ["¿Qué oportunidad te da estar en el banquillo para ver cosas que no puedes ver desde el campo?", "¿Cómo afecta tu actitud en el banquillo a tus compañeros en el campo ahora mismo?", "¿Qué es una cosa que puedes hacer en los próximos 10 minutos para ayudar al equipo a ganar desde donde estás?", "¿Qué haría un jugador que admiras en esta situación?"],
    habit: { title: "La mentalidad del observador", body: "Cuando estés en el banquillo, elige a un rival para estudiar y un patrón que detectar. Te mantiene alerta y los entrenadores lo notan más de lo que crees." }
  },
  {
    id: "new-player", title: "Nuevo en el equipo", theme: "Pertenencia", color: C.amber, colorLight: C.amberLight, colorDark: "#633806", time: "5–7 min",
    situation: "Eres el jugador nuevo. Todos los demás ya se conocen — sus bromas, sus rutinas, su forma de hacer las cosas. Te esfuerzas pero también observas, midiéndote con jugadores que llevan más tiempo aquí.",
    questions: ["¿Cuál es la parte más difícil de ser nuevo en este equipo hasta ahora — sé específico?", "Piensa en una vez que te sentiste muy cómodo en un equipo. ¿Qué lo hizo sentir así?", "Como jugador, ¿qué es una cosa que aportas a un equipo de la que estás seguro, incluso ahora mismo?", "¿Cómo se sentiría estar completamente integrado aquí — describe cómo sería un entrenamiento normal cuando estés verdaderamente cómodo?"],
    habit: { title: "La regla de la conexión", body: "En cada sesión esta semana, haz una conexión genuina con un compañero — no solo de fútbol. Usa su nombre. Aprende algo sobre él." }
  },
  {
    id: "pre-game-anxiety", title: "Ansiedad previa al partido", theme: "Presión", color: C.coral, colorLight: C.coralLight, colorDark: "#712B13", time: "5–7 min",
    situation: "Gran partido hoy. Torneo, rivalidad, hay que ganar. Ya lo sientes en tu cuerpo — pecho tenso, piernas inquietas, demasiados pensamientos. En el calentamiento tu toque se siente mal. Empiezas a dudar de cosas que normalmente haces de forma automática.",
    questions: ["¿Cómo se siente exactamente el nerviosismo en tu cuerpo ahora mismo — dónde lo sientes exactamente?", "¿Los nervios son siempre algo malo, o pueden significar que estás listo? ¿Cuál es la diferencia?", "¿Cuál es la UNA cosa que tú personalmente puedes controlar en los primeros 5 minutos de este partido?", "¿Qué querrías que tus compañeros vieran en ti hoy — descríbelo específicamente?"],
    habit: { title: "Transforma los nervios en preparación", body: "Cuando te sientas nervioso, dite a ti mismo: 'mi cuerpo se está preparando'. Luego nombra una acción que harás en el primer minuto. Preparación, no supresión." }
  },
];

// ── Language system ────────────────────────────────────────────────────────────
const AGE_GROUPS = ["U13", "U14", "U15", "U16", "U17"];
const POSITIONS = ["Goalkeeper", "Center back", "Full back", "Defensive mid", "Central mid", "Attacking mid", "Winger", "Striker"];

const s = {
  app: { fontFamily: "'Inter',-apple-system,sans-serif", background: C.offwhite, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative" },
  navBar: { background: C.navy, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 },
  logo: { color: C.white, fontWeight: 600, fontSize: 17, display: "flex", alignItems: "center", gap: 8 },
  logoDot: { width: 8, height: 8, borderRadius: "50%", background: C.green },
  navRole: { fontSize: 12, color: C.grayMid, cursor: "pointer", padding: "4px 10px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.15)", background: "transparent" },
  screen: { padding: "16px 16px 90px" },
  card: { background: C.white, borderRadius: 14, border: `0.5px solid ${C.grayMid}30`, marginBottom: 12, overflow: "hidden" },
  cardPad: { padding: "14px 16px" },
  label: { fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: C.textMuted, marginBottom: 6 },
  h1: { fontSize: 22, fontWeight: 600, color: C.navy, marginBottom: 4 },
  h2: { fontSize: 17, fontWeight: 600, color: C.navy },
  body: { fontSize: 14, color: C.text, lineHeight: 1.6 },
  muted: { fontSize: 13, color: C.textMuted, lineHeight: 1.55 },
  badge: (bg, text) => ({ fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 20, background: bg, color: text, display: "inline-block" }),
  btn: (bg, text, full) => ({ background: bg, color: text, border: "none", borderRadius: 10, padding: "11px 18px", fontSize: 14, fontWeight: 500, cursor: "pointer", width: full ? "100%" : "auto", display: full ? "block" : "inline-block", textAlign: "center" }),
  btnOutline: (full) => ({ background: "transparent", color: C.navy, border: `1px solid ${C.grayMid}`, borderRadius: 10, padding: "11px 18px", fontSize: 14, fontWeight: 500, cursor: "pointer", width: full ? "100%" : "auto" }),
  input: { width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.grayMid}`, fontSize: 14, color: "#111111", background: C.white, caretColor: "#111111", boxSizing: "border-box", marginBottom: 10 },
  textarea: { width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.grayMid}`, fontSize: 14, color: "#111111", background: C.white, caretColor: "#111111", boxSizing: "border-box", resize: "vertical", minHeight: 90, lineHeight: 1.6 },
  tabBar: { display: "flex", background: C.white, borderTop: `1px solid ${C.grayMid}30`, position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, zIndex: 100 },
  tab: (active) => ({ flex: 1, padding: "10px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", background: "transparent", border: "none", color: active ? C.green : C.gray }),
  tabLabel: (active) => ({ fontSize: 10, fontWeight: active ? 600 : 400, color: active ? C.green : C.gray }),
  avatar: (bg, text, size = 36) => ({ width: size, height: size, borderRadius: "50%", background: bg, color: text, display: "flex", alignItems: "center", justifyContent: size > 40 ? "center" : "center", fontSize: size > 40 ? 15 : 12, fontWeight: 600, flexShrink: 0 }),
  row: { display: "flex", alignItems: "center", gap: 10 },
  rowSB: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  divider: { height: "0.5px", background: `${C.grayMid}40`, margin: "0 16px" },
  statusDot: (color) => ({ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }),
  metricGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 },
  metric: { background: C.white, borderRadius: 12, padding: "12px 14px", border: `0.5px solid ${C.grayMid}30` },
  metricVal: { fontSize: 26, fontWeight: 700, color: C.navy },
  metricLabel: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 13, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 },
  chipRow: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 },
  chip: (selected) => ({ fontSize: 12, padding: "5px 12px", borderRadius: 20, border: `1px solid ${selected ? C.green : C.grayMid}`, background: selected ? C.greenLight : "transparent", color: selected ? C.greenDark : C.gray, cursor: "pointer" }),
};

function statusColor(s) { return s === "completed" ? C.green : s === "in-progress" ? C.amber : C.grayMid; }
function statusLabel(s, lang) { if (lang === "es") return s === "completed" ? "Completado" : s === "in-progress" ? "En progreso" : "Asignado"; return s === "completed" ? "Complete" : s === "in-progress" ? "In progress" : "Assigned"; }
function getModule(id, lang = "en") { const lib = lang === "es" ? MODULES_LIBRARY_ES : MODULES_LIBRARY; return lib.find(m => m.id === id); }
function getPlayer(id, players) { return players.find(p => p.id === id); }
function completionRate(assignments) { if (!assignments.length) return 0; return Math.round(assignments.filter(a => a.status === "completed").length / assignments.length * 100); }


function dbPlayerToApp(row) {
  return {
    id: row.id,
    name: row.name,
    position: row.position,
    age: row.age,
    avatar: row.avatar,
    avatarColor: row.avatar_color,
    avatarText: row.avatar_text,
    coachNote: row.coach_note || "",
    language: row.language || "en",
    playerEmail: row.player_email || "",
  };
}

function appPlayerToDb(player, coachId) {
  return {
    ...(player.id && /^[0-9a-f-]{36}$/i.test(player.id) ? { id: player.id } : {}),
    coach_id: coachId,
    name: player.name,
    position: player.position,
    age: player.age,
    avatar: player.avatar,
    avatar_color: player.avatarColor,
    avatar_text: player.avatarText,
    coach_note: player.coachNote || "",
    language: player.language || "en",
    player_email: player.playerEmail ? player.playerEmail.trim().toLowerCase() : null,
  };
}

function dbAssignmentToApp(row) {
  return {
    id: row.id,
    playerId: row.player_id,
    moduleId: row.module_id,
    moduleData: row.module_data,
    assignedAt: row.assigned_at,
    status: row.status,
    responses: row.responses || [],
    completedAt: row.completed_at,
  };
}

function appAssignmentToDb(assignment, coachId) {
  return {
    coach_id: coachId,
    player_id: assignment.playerId,
    module_id: assignment.moduleId,
    module_data: assignment.moduleData,
    assigned_at: assignment.assignedAt,
    status: assignment.status || "assigned",
    responses: assignment.responses || [],
    completed_at: assignment.completedAt || null,
  };
}

function dbSavedModuleToApp(row) {
  const raw = row.raw_module || {};
  return {
    ...raw,
    id: row.id,
    title: raw.title || row.title,
    situation: raw.situation || row.situation,
    questions: raw.questions || row.questions || [],
    habit: raw.habit || row.habit,
    coachNote: raw.coachNote || row.coach_note || "",
    savedAt: row.created_at ? row.created_at.split("T")[0] : raw.savedAt,
  };
}


// ── Soccer IQ briefs — position-specific tactical context for AI coaching ──────
const SOCCER_IQ = {
  "Goalkeeper": `
GOALKEEPER SOCCER IQ:
The defining decisions for a goalkeeper with high soccer IQ are: reading shape before the ball is played (not reacting after), organising the defensive line with specific and early communication, distributing under pressure to the right foot of the right player, and resetting the team's mentality immediately after conceding. A goalkeeper with poor IQ reacts to the ball instead of anticipating it, shouts without meaning, and goes silent after mistakes — which is the worst thing they can do for team psychology. At U13-U15, the most common IQ mistake is ball-watching instead of reading the shape in front. At U16-U17, it's distribution — choosing the easy option instead of the right option. When coaching a goalkeeper, always connect mentality to these specific decisions. "How you respond after you concede shapes what your defenders believe is possible in the next minute." The mental and the tactical are inseparable for a goalkeeper.`,

  "Center back": `
CENTER BACK SOCCER IQ:
Center backs need to constantly scan the field — not just watching the ball, but reading the positions of their full backs and measuring the distance between themselves and the opponents' forwards at all times. This continuous scanning is what allows a center back to organise, anticipate, and communicate before problems develop rather than reacting after they have already happened.

Communication and being consistently vocal are the IQ secrets for center backs. Not generic shouting — specific, actionable, real-time information delivered to teammates while the play is happening. A high-IQ center back sounds like this during live play: "Jose, close off the inner right side — force him to move to his left and closer to the sideline. The attacker is right-footed, and if he beats you I have your back and will cut him off." That single sentence does four things simultaneously: it positions the full back correctly, it communicates the opponent's weakness, it assigns responsibility, and it gives the full back confidence to engage because he knows there is cover behind him. That is center back IQ in action.

The greatest center backs in the world share two traits that have nothing to do with pace or physicality. The first is emotional intensity that transfers to teammates — a center back who communicates with conviction and belief makes the entire defensive unit believe they can defend anything. The second is positional intelligence so advanced that they rarely need to sprint because they are already in the right position before the ball moves. They read the game a pass ahead. They don't react to runs — they anticipate them before they happen and eliminate them by being in the right place before the attacker even starts moving.

A center back with poor IQ reacts to the ball instead of the shape, communicates reactively with vague calls like "away" or "man on" after the problem has already arrived, and steps out of line without telling anyone. At U13-U15, the most common IQ mistake is focusing on the ball carrier and losing track of the run in behind — the attacker they aren't watching is the one who hurts them. At U16-U17, it's communication volume and specificity — they might see the right thing but say nothing, or shout too late to be useful.

When coaching a center back, always probe whether their mental struggles are rooted in their scanning habits and communication. "In the moments the game went against you, were you telling your full backs what you were seeing — or were you silent and hoping they'd figure it out?" A center back who stops talking has already stopped leading. And ask them: "The last time your team kept a clean sheet, how much were you talking compared to the games where you conceded?" The answer is almost always the same.`,

  "Striker": `
STRIKER SOCCER IQ:
The defining decisions for a striker with high soccer IQ are: movement off the ball that creates space (not just asks for the ball), reading when to check short vs run in behind, timing runs to stay onside while being first to the ball, and how to stay involved when not receiving the ball. A striker with poor IQ stands still waiting for the ball, makes predictable runs, and disengages from the game when not scoring. At U13-U15, the most common IQ mistake is holding their run too long — being in the right place too early. At U16-U17, it's the second phase — not recovering after losing possession. When coaching a striker, always probe whether their mentality problem is actually a movement problem. "When you go quiet in games, are you still making runs or are you waiting for the ball to come to you?" A striker who stops moving has already given up mentally.`,

  "Midfielder": `
MIDFIELDER SOCCER IQ:
All midfielders need to master these foundational skills to combine them with their individual talents and excel in their position. The four pillars of midfielder soccer IQ are: shoulder checks (scanning before receiving so they know what is available before the ball arrives), receiving and controlling balls at every intensity and speed (first touch under pressure is what separates good midfielders from great ones), knowing ball distribution decisions before receiving the ball (the decision is made before the touch, not after), and mastering body feints to create space and time in tight areas.

The best midfielders in the world appear to have more time than everyone else not because they are faster, but because they have already seen and decided before the ball reaches them. That is not a physical trait — it is a mental habit built through deliberate practice.

A midfielder with poor soccer IQ receives the ball facing the wrong direction, makes their decision after the ball arrives, and either presses everything or presses nothing. At U13-U15, the most common IQ mistake is skipping the shoulder check — they receive blind and then look, which costs them a half-second that compounds into poor decisions. At U16-U17, it's distribution under pressure — choosing the safe pass when the forward pass is on, which is confidence disguised as caution.

When coaching a midfielder, always connect their mental state to these four pillars. "In the moments you played your best football, were you scanning before the ball came to you or were you reacting after it arrived?" A midfielder who stops shoulder-checking has already lost the mental battle for the ball before it even arrives.`,

  "Defensive mid": `
DEFENSIVE MIDFIELDER SOCCER IQ:
The defining decisions for a defensive midfielder with high soccer IQ are: positioning to cut passing lanes before the ball moves (not reacting to where it goes), reading when to tackle vs screen, protecting space not just the ball carrier, and being the team's calm point under pressure. A defensive mid with poor IQ chases the ball, leaves gaps by pressing at the wrong moment, and loses concentration during sustained possession phases. At U13-U15, the most common IQ mistake is going to ground too early — getting a touch instead of delaying. At U16-U17, it's positional — being drawn too narrow or too high. When coaching a defensive mid, the mental question is always about control. "Do you make your best decisions when the game is chaotic or when you've slowed it down? What do you do to slow it down inside your own head?"`,

  "Attacking mid": `
ATTACKING MIDFIELDER SOCCER IQ:
The defining decisions for an attacking midfielder with high soccer IQ are: finding pockets of space between the lines, timing runs to arrive late into the box, recognising when to hold the ball and when to release quickly, and tracking back with genuine intensity when the team is out of possession. An attacking mid with poor IQ stands in the same space all game, makes predictable combinations, and jogs back instead of pressing. At U13-U15, the most common IQ mistake is wanting the ball to feet when they should be running beyond. At U16-U17, it's decision speed — one touch too many in tight spaces. When coaching an attacking mid, probe the connection between creativity and confidence. "Do you take more risks when you're confident or do you become more cautious? Where do your best decisions come from?"`,

  "Winger": `
WINGER SOCCER IQ:
The defining decisions for a winger with high soccer IQ are: when to take on their defender 1v1 vs play early, recognising the fullback's position before receiving, understanding when crossing is the right decision vs cutting inside, and defensive tracking when the team is out of possession. A winger with poor IQ receives the ball facing the wrong direction, always makes the same decision, and disappears defensively. At U13-U15, the most common IQ mistake is looking down when receiving instead of knowing what's available before the ball arrives. At U16-U17, it's consistency — brilliant in one half, invisible in the next. When coaching a winger, connect confidence directly to their willingness to receive and take on. "When you're in a difficult patch in a game, do you ask for the ball more or less? What does that tell you about where your head is?"`,

  "Full back": `
FULL BACK SOCCER IQ:
Full backs are unique because they genuinely play two positions within the same game — and the mental challenge is knowing which position they are in at any given moment, and switching between the two with intelligence and speed.

DEFENSIVE FULL BACK IQ:
The defensive IQ of a full back begins before the ball arrives. A high-IQ full back reads the attacking forward's tendencies while the opponent is still building play in their own defensive end — so by the time the ball is coming their way, they are already in the right position and at the right distance from both the ball and the opponent. They are never caught cold because they have been studying the forward the entire time.

The key to individual defending as a full back is analysing the opponent during the game to find their weakness and exploit it consistently. If the opponent is right-footed, shift your body to the right — force them to use their weaker foot every single time they receive the ball. Do this on every touch, not just in obvious moments. A forward who is forced onto their weak foot on every touch will make constant mistakes, lose confidence, and become predictable. This is not luck — it is deliberate, intelligent pressure applied with discipline throughout the entire game.

Every forward has an attacking trait — a preferred side, a favourite run, a go-to move when they are in space. Full backs need to read those tendencies, recognise the pattern early, and communicate what they are seeing to their teammates so the opponent's attack becomes predictable and collectively manageable. Ball control, shielding the ball, and using the body physically and legally to win tackles are the technical foundations of defensive full back play — but it is the reading and communication that separates good from great. The best full backs in the world are fearless in one-on-one defending — they do not back off, they engage, they are physical, and they make the attacker feel uncomfortable every single time.

OFFENSIVE FULL BACK IQ:
The transition from defending to attacking is where full back IQ is most visible. The moment a full back wins a tackle and secures the ball, they must scan the field instantly — not after a touch, not after settling the ball, but in the same moment they gain possession. That immediate scan determines everything that follows.

The timing of the attacking run is the most undercoached element of full back play. The highest-IQ full backs do not telegraph their overlaps — they go at the exact moment the defender cannot follow, arriving late into dangerous positions at full sprint rather than making early runs that are easy to track. They read the moment — a teammate receiving the ball, a defender's weight shifting the wrong way, a half-second of space opening on the outside — and they go instantly, without hesitation.

The offensive full back creates plays either by dribbling forward or by holding the ball — and the decision between those two options is driven entirely by what they saw in that instant scan. The most technically advanced full backs can cut inside rather than staying wide, combining as a midfielder in tight spaces using body feints and two-touch combinations before accelerating into space. They are not just a wide option — they are an extra creative player. Knowing every single teammate and their strengths is not optional — it is essential. A full back who knows their striker holds the ball well will play differently than one who knows their striker makes runs in behind. That knowledge shapes every offensive decision they make.

Explosive pace down the flank is a weapon — sprinting into crossing positions at full speed without slowing down to deliver the ball, being available on the overlap to receive in stride and cross in one motion, and having the shooting technique and confidence to finish when a genuine opening to goal presents itself. The full back who can arrive into the box and score is the one that opposing defences have no answer for.

Beyond ball possession, full backs support attacking play without the ball — sprinting down the sideline to receive a crossing pass and create a scoring opportunity, staying open down the sideline waiting for a pass to deliver a cross into the box, and being willing and positioned to shoot when a genuine opening to goal presents itself. The full back who only defends is half a player. The full back who understands both roles and executes both with intelligence is one of the most valuable and dangerous players on the field.

When coaching a full back on their mentality, always connect it to the transition moment — the split second between winning the ball and deciding what to do next. "When you win a tackle, what is the first thing you look for? Do you see your teammates before or after you control the ball?" And on the attacking side: "When you make an overlapping run and the ball doesn't come to you, what do you do next — and is that the right decision?" That question reveals whether they are playing reactively or with genuine soccer intelligence.`,
};

// ── Position IQ lookup — match player position to IQ brief ────────────────────
function getPositionIQ(position) {
  if (!position) return "";
  const p = position.toLowerCase();
  if (p.includes("goal")) return SOCCER_IQ["Goalkeeper"];
  if (p.includes("center back") || p.includes("centre back") || p.includes("cb")) return SOCCER_IQ["Center back"];
  if (p.includes("full") || p.includes("fb") || p.includes("lb") || p.includes("rb")) return SOCCER_IQ["Full back"];
  if (p.includes("defensive mid") || p.includes("def mid") || p.includes("dm") || p.includes("holding")) return SOCCER_IQ["Defensive mid"];
  if (p.includes("attack") && p.includes("mid")) return SOCCER_IQ["Attacking mid"];
  if (p.includes("wing") || p.includes("winger") || p.includes("lw") || p.includes("rw")) return SOCCER_IQ["Winger"];
  if (p.includes("striker") || p.includes("forward") || p.includes("centre forward") || p.includes("cf") || p.includes("st")) return SOCCER_IQ["Striker"];
  if (p.includes("mid")) return SOCCER_IQ["Midfielder"];
  return "";
}

// ── System prompt — enriched with position-specific soccer IQ ─────────────────
const SYSTEM_PROMPT = (player, coachNote = "") => {
  const iq = getPositionIQ(player.position);
  const isSpanish = player.language === "es";
  const ageCalibration = {
    "U13": isSpanish
      ? `Este jugador tiene categoría U13. Usa lenguaje simple y claro. Haz una pregunta a la vez. Enfócate en hábitos básicos que pueda practicar en la próxima sesión. Sé alentador pero honesto. No lo abrumes.`
      : `This player is U13. Use simple, clear language. Ask one question at a time. Focus on basic positional concepts and simple habits they can practise at their next session. Be encouraging when they show genuine effort but still hold them to honest answers. Do not overwhelm them.`,
    "U14": isSpanish
      ? `Este jugador tiene categoría U14. Puede manejar preguntas tácticas más específicas que un U13. Conecta los hábitos mentales con situaciones concretas del partido. Desafía las respuestas vagas con firmeza pero sin dureza.`
      : `This player is U14. They can handle more specific tactical questions than U13. Connect mental habits to specific game situations they have recently experienced. Challenge vague answers firmly but not harshly.`,
    "U15": isSpanish
      ? `Este jugador tiene categoría U15. Espera reflexión sobre su toma de decisiones, no solo sobre sus sentimientos. Empújalo a ser específico sobre lo que vio, lo que decidió y por qué.`
      : `This player is U15. Expect them to reflect on their decision-making, not just their feelings. Push them to be specific about what they saw, what they decided, and why.`,
    "U16": isSpanish
      ? `Este jugador tiene categoría U16. Trátalo como un jugador sénior en desarrollo. Espera una autorreflexión de alta calidad. Desafíalo sobre la brecha entre lo que sabe que debe hacer y lo que realmente hace bajo presión.`
      : `This player is U16. Treat them as a developing senior player. Expect high-quality self-reflection. Challenge them on the gap between what they know they should do and what they actually do under pressure.`,
    "U17": isSpanish
      ? `Este jugador tiene categoría U17. Nivel casi sénior. Sé directo y exigente. Espera que analicen su propio juego con sofisticación. No bajes el listón.`
      : `This player is U17. This is near-senior level development. Be direct and demanding. Expect them to analyse their own game at a sophisticated level. Do not lower expectations.`,
  }[player.age] || (isSpanish
    ? `Este jugador tiene categoría ${player.age}. Calibra tu lenguaje y profundidad de preguntas según su etapa de desarrollo.`
    : `This player is ${player.age}. Calibrate your language and question depth to their developmental stage.`);

  const langInstruction = isSpanish
    ? `\nIDIOMA: Responde SIEMPRE en español. Toda la conversación es en español. Usa un español claro y natural — no formal ni rígido. Habla como un entrenador real, no como un libro de texto.`
    : ``;

  return `You are a mental performance coach inside MindPitch, a youth soccer mentality app. You are coaching ${player.name}, a ${player.age} ${player.position}.

Your coaching style is: direct, focused, and challenging. You don't coddle players. You ask sharp follow-up questions that make them think harder. You use specific soccer situations. You're brief — responses are 2-4 sentences max unless the player needs more. You never give generic advice. Every response is grounded in what the player actually said. You challenge vague answers: "that's not specific enough — give me an example." You affirm genuine insight but push past surface-level responses. You are not a therapist. You are a coach who cares about this player's development and doesn't let them off the hook.
${langInstruction}
AGE-LEVEL CALIBRATION:
${ageCalibration}
${iq ? `\nPOSITION-SPECIFIC SOCCER IQ CONTEXT:\nThis player is a ${player.position}. Use this tactical knowledge to make your coaching conversations specific and intelligent — connect their mental state to the real decisions their position demands.\n${iq}` : ""}${coachNote ? `\n\nCOACH'S NOTE ABOUT THIS PLAYER:\n${coachNote}` : ""}

When a player gives a vague answer about their mental state, connect it to a real positional decision they face. Never let the conversation stay abstract. Ground everything in what this position actually demands on the field.`;
};

const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>,
    brain: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96-.44 2.5 2.5 0 01-2.96-3.08 3 3 0 01-.34-5.58 2.5 2.5 0 013.32-3.97A2.5 2.5 0 019.5 2z" /><path d="M14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96-.44 2.5 2.5 0 002.96-3.08 3 3 0 00.34-5.58 2.5 2.5 0 00-3.32-3.97A2.5 2.5 0 0014.5 2z" /></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>,
    back: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>,
    ball: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /><path d="M2 12h20" /></svg>,
    chat: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
    bolt: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z" /></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>,
  };
  return icons[name] || null;
};

function ProgressBar({ value, color = C.green, height = 4 }) {
  return <div style={{ height, background: `${C.grayMid}40`, borderRadius: height }}><div style={{ width: `${Math.min(value, 100)}%`, height, background: color, borderRadius: height, transition: "width 0.4s" }} /></div>;
}

function Avatar({ player, size = 36 }) {
  return <div style={s.avatar(player.avatarColor, player.avatarText, size)}>{player.avatar}</div>;
}

function AuthScreen() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMagicLink(e) {
    e.preventDefault();
    if (!email.trim() || !supabase) return;

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  }

  return (
    <div style={s.app}>
      <div style={s.navBar}>
        <div style={s.logo}><div style={s.logoDot} />MindPitch</div>
      </div>
      <div style={{ ...s.screen, minHeight: "75vh", display: "flex", alignItems: "center" }}>
        <div style={{ ...s.card, width: "100%" }}>
          <div style={{ ...s.cardPad, padding: "24px 20px" }}>
            <div style={{ ...s.label, marginBottom: 8 }}>Coach login</div>
            <div style={{ ...s.h1, marginBottom: 8 }}>Sign in to MindPitch</div>
            <div style={{ ...s.muted, marginBottom: 18 }}>Enter your email and we'll send you a secure magic link. No password needed.</div>
            {sent ? (
              <div style={{ background: C.greenLight, border: `1px solid ${C.green}40`, borderRadius: 10, padding: "12px 14px", color: C.greenDark, fontSize: 13, lineHeight: 1.5 }}>
                Check your email for the login link. Open it on this same browser to finish signing in.
              </div>
            ) : (
              <form onSubmit={sendMagicLink}>
                <input
                  style={s.input}
                  type="email"
                  placeholder="coach@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoFocus
                />
                {error && <div style={{ fontSize: 13, color: C.coral, marginBottom: 10 }}>{error}</div>}
                <button style={s.btn(C.green, C.white, true)} disabled={loading || !email.trim()} type="submit">
                  {loading ? "Sending..." : "Send magic link"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── AI Chat Component (reused for both debrief and open chat) ─────────────────
function AIChat({ player, initialMessages = [], systemContext = "", placeholder = "Talk to your coach...", accentColor = C.green, onBack = null, backLabel = "Back", bottomOffset = 0 }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: SYSTEM_PROMPT(player, player.coachNote || "") + (systemContext ? "\n\n" + systemContext : ""),
          messages: updated.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "I didn't catch that. Try again.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setError("Connection issue — check your API key and try again.");
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function handleKey(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "100vh" }}>
      {onBack && (
        <div style={{ background: C.navy, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }} onClick={onBack}>
            <Icon name="back" size={20} color={C.white} />
          </button>
          <div style={{ color: C.white, fontSize: 15, fontWeight: 500 }}>{backLabel}</div>
          <div style={{ marginLeft: "auto" }}><span style={s.badge(accentColor + "25", accentColor)}>AI Coach</span></div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", padding: "16px", paddingBottom: bottomOffset ? 160 : 80 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px 20px" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: accentColor + "20", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Icon name="bolt" size={24} color={accentColor} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 6 }}>Your mental performance coach</div>
            <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>Direct. Focused. No fluff. Ask anything about your game, your mindset, or what's going on in your head.</div>
          </div>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <div key={i} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 10 }}>
              {!isUser && (
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: accentColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: 8, alignSelf: "flex-end" }}>
                  <Icon name="bolt" size={13} color={C.white} />
                </div>
              )}
              <div style={{ maxWidth: "80%", padding: "10px 13px", borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: isUser ? accentColor : C.white, color: isUser ? C.white : C.text, fontSize: 14, lineHeight: 1.6, boxShadow: `0 1px 3px rgba(0,0,0,0.08)`, border: isUser ? "none" : `0.5px solid ${C.grayMid}30` }}>
                {msg.content}
              </div>
              {isUser && (
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: player.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 8, alignSelf: "flex-end", fontSize: 10, fontWeight: 600, color: player.avatarText }}>
                  {player.avatar}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: accentColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: 8 }}>
              <Icon name="bolt" size={13} color={C.white} />
            </div>
            <div style={{ padding: "10px 14px", borderRadius: "14px 14px 14px 4px", background: C.white, border: `0.5px solid ${C.grayMid}30` }}>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: accentColor, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`, opacity: 0.7 }} />)}
              </div>
            </div>
          </div>
        )}
        {error && <div style={{ fontSize: 12, color: "#E24B4A", textAlign: "center", padding: "8px 0" }}>{error}</div>}
        <div ref={bottomRef} />
      </div>

      <div style={{ position: "fixed", bottom: bottomOffset, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: C.white, borderTop: `1px solid ${C.grayMid}30`, padding: "10px 12px", zIndex: 90 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <textarea ref={inputRef} style={{ ...s.textarea, flex: 1, minHeight: 40, maxHeight: 100, marginBottom: 0, borderColor: input.trim() ? accentColor : C.grayMid, borderRadius: 12, padding: "10px 12px", fontSize: 14, resize: "none", color: "#111111", WebkitTextFillColor: "#111111", caretColor: "#111111", background: C.white }} placeholder={placeholder} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} rows={1} />
          <button style={{ width: 40, height: 40, borderRadius: 10, background: input.trim() ? accentColor : C.grayLight, border: "none", cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} onClick={send} disabled={!input.trim() || loading}>
            <Icon name="send" size={16} color={input.trim() ? C.white : C.grayMid} />
          </button>
        </div>
        <div style={{ fontSize: 10, color: C.textMuted, textAlign: "center", marginTop: 6 }}>Press Enter to send</div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}

// ── Post-Module Debrief ───────────────────────────────────────────────────────
function ModuleDebrief({ player, module: mod, responses, onBack }) {
  const contextSummary = `The player just completed the "${mod.title}" module. Here are their responses:\n\n` +
    mod.questions.map((q, i) => `Q: ${q}\nA: ${responses[i] || "(no response)"}`).join("\n\n") +
    `\n\nYour job: open a debrief conversation. Pick the most revealing or vague response and push them on it. Start with one sharp, direct question — not a compliment. Don't summarize what they said back to them. Engage with it.`;

  const openingContext = `Context: ${player.name} just finished the "${mod.title}" module. Their responses are in your context. Start the debrief now with a single direct question targeting the response that needs the most work.`;

  const [started, setStarted] = useState(false);
  const [initialAI, setInitialAI] = useState([]);
  const [kicking, setKicking] = useState(false);

  async function startDebrief() {
    setKicking(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 400,
          system: SYSTEM_PROMPT(player, player.coachNote || "") + "\n\n" + contextSummary,
          messages: [{ role: "user", content: openingContext }]
        })
      });
      const data = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "Good work finishing the module. Let's dig into one of your answers. Which response do you feel was the most honest?";
      setInitialAI([{ role: "assistant", content: reply }]);
    } catch {
      setInitialAI([{ role: "assistant", content: `Good work finishing that module, ${player.name.split(" ")[0]}. Let's not move on too fast. Which answer felt the hardest to write — and why?` }]);
    }
    setStarted(true);
    setKicking(false);
  }

  if (!started) return (
    <div style={s.screen}>
      <button style={{ background: "none", border: "none", cursor: "pointer", ...s.row, marginBottom: 20, padding: 0 }} onClick={onBack}>
        <Icon name="back" size={20} color={C.navy} /><span style={{ fontSize: 14, color: C.navy }}>Back to modules</span>
      </button>
      <div style={{ textAlign: "center", padding: "20px 0 24px" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
          <Icon name="check" size={24} color={C.green} />
        </div>
        <div style={{ ...s.h1, marginBottom: 4 }}>Module complete</div>
        <div style={s.muted}>Good work, {player.name.split(" ")[0]}.</div>
      </div>

      <div style={{ ...s.card, borderLeft: `3px solid ${C.amber}` }}>
        <div style={s.cardPad}>
          <div style={{ ...s.label, color: "#633806", marginBottom: 6 }}>Your mental habit this week</div>
          <div style={{ fontWeight: 600, fontSize: 15, color: C.navy, marginBottom: 6 }}>{mod.habit?.title}</div>
          <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>{mod.habit?.body}</div>
        </div>
      </div>

      <div style={{ ...s.card, marginTop: 4 }}>
        <div style={s.cardPad}>
          <div style={s.label}>Your responses</div>
          {responses.map((r, i) => r ? (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 3 }}>Q{i + 1}: {mod.questions[i].slice(0, 55)}...</div>
              <div style={{ fontSize: 13, color: C.text, fontStyle: "italic" }}>"{r}"</div>
            </div>
          ) : null)}
        </div>
      </div>

      <div style={{ background: C.navy, borderRadius: 14, padding: "18px 16px", marginTop: 4 }}>
        <div style={{ ...s.row, marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="bolt" size={16} color={C.white} />
          </div>
          <div>
            <div style={{ color: C.white, fontWeight: 600, fontSize: 14 }}>Talk to your AI coach</div>
            <div style={{ color: C.grayMid, fontSize: 12 }}>Direct debrief on what you just wrote</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: C.grayMid, lineHeight: 1.6, marginBottom: 14 }}>
          Your coach has read your responses. They'll push you on the ones that need more work. Not a pat on the back — a real conversation.
        </div>
        <button style={{ ...s.btn(C.green, C.white, true) }} onClick={startDebrief} disabled={kicking}>
          {kicking ? "Starting debrief..." : "Start debrief with AI coach →"}
        </button>
      </div>
    </div>
  );

  return (
    <AIChat
      player={player}
      initialMessages={initialAI}
      systemContext={contextSummary}
      placeholder="Respond to your coach..."
      accentColor={mod.color}
      onBack={onBack}
      backLabel={`${mod.title} debrief`}
    />
  );
}

// ── Open Coach Chat ───────────────────────────────────────────────────────────
function OpenCoachChat({ player, assignments }) {
  const completedModules = assignments
    .filter(a => a.playerId === player.id && a.status === "completed")
    .map(a => { const m = getModule(a.moduleId, player.language || "en") || a.moduleData; return m ? `Completed: ${m.title}` : ""; })
    .filter(Boolean);

  const context = completedModules.length > 0
    ? `Player history — modules this player has completed: ${completedModules.join(", ")}. Use this to give contextually relevant coaching. Reference their previous work if it's relevant to what they bring up.`
    : `This player has not completed any modules yet. They're new to MindPitch. Help them identify what they want to work on.`;

  return (
    <AIChat
      player={player}
      initialMessages={[]}
      systemContext={context}
      placeholder="Ask your coach anything..."
      accentColor={C.green}
      bottomOffset={58}
    />
  );
}

// ── Player: Module List ───────────────────────────────────────────────────────
function PlayerModuleList({ player, assignments, onStartModule }) {
  const myAssignments = assignments.filter(a => a.playerId === player.id);
  const pending = myAssignments.filter(a => a.status !== "completed");
  const done = myAssignments.filter(a => a.status === "completed");
  return (
    <div style={s.screen}>
      <div style={{ background: C.navy, borderRadius: 14, padding: "18px 16px", marginBottom: 20 }}>
        <div style={s.row}>
          <Avatar player={player} size={44} />
          <div><div style={{ color: C.white, fontWeight: 600, fontSize: 17 }}>{player.name}</div><div style={{ color: C.grayMid, fontSize: 13 }}>{player.position} · {player.age}</div></div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {[["Assigned", myAssignments.length, C.white], ["Completed", done.length, C.green], ["Pending", pending.length, C.amber]].map(([lbl, val, col]) => (
            <div key={lbl} style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ color: C.grayMid, fontSize: 11 }}>{lbl}</div>
              <div style={{ color: col, fontWeight: 600, fontSize: 18 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
      {pending.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>Your modules</div>
          {pending.map(a => {
            const mod = getModule(a.moduleId, player.language || "en") || a.moduleData; if (!mod) return null;
            const progress = a.responses.filter(Boolean).length; const total = mod.questions?.length || 4;
            return (
              <div key={a.id} style={{ ...s.card, borderLeft: `3px solid ${mod.color}` }}>
                <div style={s.cardPad}>
                  <div style={{ ...s.row, marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      <span style={s.badge(mod.colorLight, mod.colorDark)}>{mod.theme}</span>
                      <div style={{ fontWeight: 600, fontSize: 15, color: C.navy, marginTop: 4 }}>{mod.title}</div>
                    </div>
                  </div>
                  {progress > 0 && (<div style={{ marginBottom: 10 }}><div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>{progress} of {total} questions answered</div><ProgressBar value={progress / total * 100} color={mod.color} /></div>)}
                  <button style={s.btn(mod.color, C.white, true)} onClick={() => onStartModule(a, mod)}>
                    {progress > 0 ? "Continue module" : "Start module"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {done.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>Completed</div>
          {done.map(a => {
            const mod = getModule(a.moduleId, player.language || "en") || a.moduleData; if (!mod) return null;
            return (
              <div key={a.id} style={{ ...s.card, opacity: 0.75 }}>
                <div style={s.cardPad}>
                  <div style={s.row}>
                    <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14, color: C.navy }}>{mod.title}</div><div style={{ fontSize: 12, color: C.textMuted }}>Completed {a.completedAt}</div></div>
                    <Icon name="check" size={18} color={C.green} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {myAssignments.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <Icon name="ball" size={36} color={C.grayMid} />
          <div style={{ ...s.muted, marginTop: 12 }}>No modules assigned yet. Check back after your next session.</div>
        </div>
      )}
    </div>
  );
}

// ── Player: Module Experience ─────────────────────────────────────────────────
function ModuleExperience({ assignment, module: mod, player, onComplete, onBack }) {
  const [step, setStep] = useState("intro");
  const [qIndex, setQIndex] = useState(() => { const f = assignment.responses.findIndex(r => !r); return f === -1 ? 0 : f; });
  const [responses, setResponses] = useState(() => { const r = [...(assignment.responses || [])]; while (r.length < mod.questions.length) r.push(""); return r; });
  const [current, setCurrent] = useState(responses[qIndex] || "");
  const [finalResponses, setFinalResponses] = useState([]);
  const total = mod.questions.length;

  function nextQ() {
    const updated = [...responses]; updated[qIndex] = current; setResponses(updated);
    if (qIndex < total - 1) { setQIndex(qIndex + 1); setCurrent(updated[qIndex + 1] || ""); }
    else { setFinalResponses(updated); setStep("debrief"); }
  }
  function prevQ() {
    const updated = [...responses]; updated[qIndex] = current; setResponses(updated);
    if (qIndex > 0) { setQIndex(qIndex - 1); setCurrent(updated[qIndex - 1] || ""); } else setStep("intro");
  }

  if (step === "intro") return (
    <div style={s.screen}>
      <button style={{ background: "none", border: "none", cursor: "pointer", ...s.row, marginBottom: 16, padding: 0 }} onClick={onBack}><Icon name="back" size={20} color={C.navy} /><span style={{ fontSize: 14, color: C.navy }}>Back</span></button>
      <div style={{ background: mod.color, borderRadius: 14, padding: "24px 20px", marginBottom: 20, color: C.white }}>
        <span style={{ ...s.badge(mod.colorLight, mod.colorDark), marginBottom: 12, display: "inline-block" }}>{mod.theme}</span>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{mod.title}</div>
        <div style={{ fontSize: 13, opacity: 0.85 }}>{total} questions · {mod.time}</div>
      </div>
      <div style={s.card}><div style={s.cardPad}><div style={s.label}>Your situation</div><div style={{ ...s.body, fontStyle: "italic", color: C.textMuted, lineHeight: 1.7 }}>{mod.situation}</div></div></div>
      <div style={{ padding: "12px 0" }}><div style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>Take 5–7 minutes with this. Honest answers only — your AI coach will debrief you when you're done.</div></div>
      <button style={s.btn(mod.color, C.white, true)} onClick={() => setStep("questions")}>Begin module</button>
    </div>
  );

  if (step === "questions") return (
    <div style={s.screen}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ ...s.row, marginBottom: 10 }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }} onClick={prevQ}><Icon name="back" size={20} color={C.navy} /></button>
          <div style={{ flex: 1, marginLeft: 8 }}><ProgressBar value={qIndex / total * 100} color={mod.color} height={5} /></div>
          <div style={{ fontSize: 13, color: C.textMuted, marginLeft: 10, whiteSpace: "nowrap" }}>{qIndex + 1} / {total}</div>
        </div>
      </div>
      <div style={{ minHeight: 120, marginBottom: 20 }}>
        <div style={{ ...s.label, marginBottom: 8 }}>Question {qIndex + 1}</div>
        <div style={{ fontSize: 19, fontWeight: 500, color: C.navy, lineHeight: 1.5 }}>{mod.questions[qIndex]}</div>
      </div>
      <textarea style={{ ...s.textarea, minHeight: 140, fontSize: 15, border: `1.5px solid ${mod.color}`, borderRadius: 10 }} placeholder="Write your honest answer here..." value={current} onChange={e => setCurrent(e.target.value)} autoFocus />
      <button style={{ ...s.btn(current.trim() ? mod.color : C.grayMid, C.white, true), marginTop: 8, opacity: current.trim() ? 1 : 0.6 }} onClick={nextQ} disabled={!current.trim()}>
        {qIndex < total - 1 ? "Next question" : "Finish & talk to coach"}
      </button>
    </div>
  );

  if (step === "debrief") return (
    <ModuleDebrief player={player} module={mod} responses={finalResponses} onBack={() => { onComplete({ ...assignment, responses: finalResponses, status: "completed", completedAt: new Date().toISOString().split("T")[0] }); }} />
  );
}

// ── Coach: Dashboard ──────────────────────────────────────────────────────────
function CoachDashboard({ players, assignments, onNav, onViewPlayer }) {
  const recent = [...assignments].sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt)).slice(0, 4);
  const needsAttention = assignments.filter(a => a.status !== "completed").slice(0, 3);

  if (players.length === 0) return (
    <div style={s.screen}>
      <div style={{ marginBottom: 20 }}><div style={s.label}>Welcome to MindPitch</div><div style={s.h1}>Let's get started</div></div>
      <div style={{ background: C.greenLight, border: `1px solid ${C.green}40`, borderRadius: 14, padding: "16px 16px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: C.greenDark, lineHeight: 1.6, marginBottom: 4 }}>Three steps to get your first player working on their mentality.</div>
      </div>
      {[
        ["1", "Add your players", "Go to Roster and add the players you want to work with first. Start with 2–3.", true],
        ["2", "Build a module", "Describe a player situation in the Builder tab. The AI generates a personalised module in seconds.", false],
        ["3", "Assign and watch", "Assign the module to a player. They complete it on their phone and get an AI debrief.", false],
      ].map(([num, title, body, active]) => (
        <div key={num} style={{ background: active ? C.white : `${C.offwhite}`, border: `0.5px solid ${active ? C.green + "60" : C.grayMid}`, borderRadius: 12, padding: "13px 14px", marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 12, opacity: active ? 1 : 0.6 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: active ? C.greenLight : "#F0F0F0", border: `1px solid ${active ? C.green + "50" : C.grayMid}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: active ? C.greenDark : C.gray, flexShrink: 0 }}>{num}</div>
          <div><div style={{ fontSize: 13, fontWeight: 500, color: C.navy, marginBottom: 3 }}>{title}</div><div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{body}</div></div>
        </div>
      ))}
      <button style={{ ...s.btn(C.green, C.white, true), marginTop: 8 }} onClick={() => onNav("roster")}>Add your first player →</button>
    </div>
  );

  return (
    <div style={s.screen}>
      <div style={{ marginBottom: 20 }}><div style={s.label}>Good evening, Coach</div><div style={s.h1}>Your team overview</div></div>
      <div style={s.metricGrid}>
        <div style={s.metric}><div style={s.metricVal}>{players.length}</div><div style={s.metricLabel}>Players rostered</div></div>
        <div style={s.metric}><div style={s.metricVal}>{completionRate(assignments)}%</div><div style={s.metricLabel}>Completion rate</div></div>
        <div style={s.metric}><div style={s.metricVal}>{assignments.filter(a => a.status === "completed").length}</div><div style={s.metricLabel}>Modules completed</div></div>
        <div style={s.metric}><div style={s.metricVal}>{assignments.filter(a => a.status === "assigned").length}</div><div style={s.metricLabel}>Awaiting response</div></div>
      </div>
      <div style={s.section}>
        <div style={s.sectionTitle}>Needs attention</div>
        <div style={s.card}>
          {needsAttention.length === 0 ? (<div style={{ ...s.cardPad, ...s.muted }}>All players are up to date.</div>)
            : needsAttention.map((a, i) => {
              const player = getPlayer(a.playerId, players); const mod = getModule(a.moduleId, player?.language || "en") || a.moduleData; if (!player || !mod) return null; return (
                <div key={a.id}>
                  {i > 0 && <div style={s.divider} />}
                  <div style={{ ...s.cardPad, cursor: "pointer" }} onClick={() => onViewPlayer(player)}>
                    <div style={{ ...s.row, marginBottom: 6 }}>
                      <Avatar player={player} />
                      <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14, color: C.navy }}>{player.name}</div><div style={s.muted}>{mod.title}</div></div>
                      <span style={s.badge(a.status === "in-progress" ? C.amberLight : C.grayLight, a.status === "in-progress" ? "#633806" : C.gray)}>{statusLabel(a.status, player?.language || "en")}</span>
                    </div>
                    <ProgressBar value={a.responses.filter(Boolean).length / (mod.questions.length) * 100} color={a.status === "in-progress" ? C.amber : C.grayMid} />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div style={s.section}>
        <div style={s.sectionTitle}>Recent activity</div>
        <div style={s.card}>
          {recent.map((a, i) => {
            const player = getPlayer(a.playerId, players); const mod = getModule(a.moduleId, player?.language || "en") || a.moduleData; if (!player || !mod) return null; return (
              <div key={a.id}>
                {i > 0 && <div style={s.divider} />}
                <div style={s.cardPad}>
                  <div style={s.row}>
                    <div style={s.statusDot(statusColor(a.status))} />
                    <div style={{ flex: 1 }}><div style={{ fontSize: 13, color: C.text }}><strong>{player.name}</strong> — {mod.title}</div><div style={{ fontSize: 12, color: C.textMuted }}>{a.assignedAt}</div></div>
                    <span style={s.badge(a.status === "completed" ? C.greenLight : a.status === "in-progress" ? C.amberLight : C.grayLight, statusColor(a.status))}>{statusLabel(a.status, player?.language || "en")}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <button style={s.btn(C.navy, C.white, true)} onClick={() => onNav("builder")}>+ Build a new module with AI</button>
    </div>
  );
}
// ── Coach: Module Summary ─────────────────────────────────────────────────────
function CoachSummary({ players, assignments }) {
  const [expanded, setExpanded] = useState(null);
  const completed = assignments.filter(a => a.status === "completed").sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  const pending = assignments.filter(a => a.status !== "completed");

  function getAiInsight(mod, player, responses) {
    const filled = responses.filter(Boolean);
    if (filled.length === 0) return null;
    const depth = filled.filter(r => r.length > 60).length;
    const honest = filled.some(r => r.toLowerCase().includes("i know") || r.toLowerCase().includes("i hate") || r.toLowerCase().includes("honestly") || r.toLowerCase().includes("i admit"));
    const specific = filled.some(r => r.length > 80);
    const insights = [];
    if (honest) insights.push(`${player.name.split(" ")[0]} showed uncommon honesty in their responses — this is a player ready for a deeper conversation.`);
    if (depth >= 3) insights.push(`Strong response depth across all questions — this player is engaging genuinely, not just ticking a box.`);
    if (depth <= 1) insights.push(`Responses were brief. Consider a follow-up conversation before the next module — they may need more context on why this work matters.`);
    if (specific) insights.push(`At least one response showed real specificity — use that detail as the starting point for your next one-on-one conversation.`);
    if (insights.length === 0) insights.push(`${player.name.split(" ")[0]} completed the module. Review their responses and look for the gap between what they wrote and what you observe in training.`);
    return insights.join(" ");
  }

  function getFlags(mod, player, responses) {
    const flags = [];
    const filled = responses.filter(Boolean);
    const avg = filled.reduce((s, r) => s + r.length, 0) / (filled.length || 1);
    if (avg > 80) flags.push({ type: "strength", text: "Above-average response depth — this player is engaging thoughtfully" });
    if (avg < 40 && filled.length > 0) flags.push({ type: "watch", text: "Short responses — may need encouragement to reflect more deeply next time" });
    const q4 = responses[3];
    if (q4 && q4.length > 50) flags.push({ type: "strength", text: `Strong answer to the final question — use it as a coaching anchor this week` });
    flags.push({ type: "action", text: `In next training, watch for the habit: "${mod.habit?.title || "mental reset"}" — did it show up?` });
    return flags.slice(0, 3);
  }

  if (assignments.length === 0) return (
    <div style={s.screen}>
      <div style={{ ...s.label, marginBottom: 4 }}>This week</div>
      <div style={{ ...s.h1, marginBottom: 20 }}>Module summaries</div>
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.greenLight, border: `1px solid ${C.green}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Icon name="check" size={24} color={C.green} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 500, color: C.navy, marginBottom: 8 }}>No summaries yet</div>
        <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>Summaries appear here once players complete their assigned modules.</div>
      </div>
    </div>
  );

  return (
    <div style={s.screen}>
      <div style={{ ...s.label, marginBottom: 4 }}>This week</div>
      <div style={{ ...s.h1, marginBottom: 4 }}>Module summaries</div>
      <div style={{ ...s.muted, marginBottom: 16 }}>{completed.length} completed · {pending.length} pending</div>

      <div style={s.metricGrid}>
        {[["Completed", completed.length, C.green], ["Pending", pending.length, C.amber]].map(([l, v, c]) => (
          <div key={l} style={s.metric}><div style={{ ...s.metricVal, color: c }}>{v}</div><div style={s.metricLabel}>{l}</div></div>
        ))}
      </div>

      {completed.length > 0 && <>
        <div style={{ ...s.sectionTitle, marginBottom: 10 }}>Completed</div>
        {completed.map((a, i) => {
          const player = getPlayer(a.playerId, players);
          const mod = getModule(a.moduleId, player?.language || "en") || a.moduleData;
          if (!player || !mod) return null;
          const isOpen = expanded === a.id;
          const insight = getAiInsight(mod, player, a.responses || []);
          const flags = getFlags(mod, player, a.responses || []);
          return (
            <div key={a.id} style={{ ...s.card, marginBottom: 12 }}>
              <div style={{ padding: "13px 16px", cursor: "pointer" }} onClick={() => setExpanded(isOpen ? null : a.id)}>
                <div style={{ ...s.row, marginBottom: 8 }}>
                  <Avatar player={player} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: C.navy }}>{player.name}</div>
                    <div style={s.muted}>{player.position} · {player.age}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={s.badge(mod.colorLight || C.greenLight, mod.color || C.green)}>{mod.theme}</span>
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>{a.completedAt}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 13, color: C.textMuted }}>{mod.title}</div>
                  <div style={{ fontSize: 12, color: C.green, fontWeight: 500 }}>{isOpen ? "Hide ↑" : "View summary ↓"}</div>
                </div>
              </div>

              {isOpen && <>
                {insight && (
                  <div style={{ padding: "12px 16px", background: C.greenLight, borderTop: `0.5px solid ${C.grayMid}30` }}>
                    <div style={{ ...s.label, color: C.greenDark, marginBottom: 6 }}>AI coach insight</div>
                    <div style={{ fontSize: 13, color: C.text, lineHeight: 1.65 }}>{insight}</div>
                  </div>
                )}

                <div style={{ padding: "12px 16px", borderTop: `0.5px solid ${C.grayMid}30` }}>
                  <div style={{ ...s.label, marginBottom: 8 }}>What to take into training</div>
                  {flags.map((flag, fi) => (
                    <div key={fi} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 0", borderBottom: fi < flags.length - 1 ? `0.5px solid ${C.grayMid}20` : "none" }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, background: flag.type === "strength" ? C.greenLight : flag.type === "watch" ? C.amberLight : C.blueLight, color: flag.type === "strength" ? C.greenDark : flag.type === "watch" ? "#633806" : "#0C447C" }}>
                        {flag.type === "strength" ? "✓" : flag.type === "watch" ? "👁" : "→"}
                      </div>
                      <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{flag.text}</div>
                    </div>
                  ))}
                </div>

                {(a.responses || []).filter(Boolean).length > 0 && (
                  <div style={{ padding: "12px 16px", borderTop: `0.5px solid ${C.grayMid}30` }}>
                    <div style={{ ...s.label, marginBottom: 8 }}>Player responses</div>
                    {(a.responses || []).map((r, ri) => {
                      if (!r || !mod.questions?.[ri]) return null; return (
                        <div key={ri} style={{ marginBottom: ri < (a.responses.length - 1) ? 12 : 0 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 4 }}>Q{ri + 1}: {mod.questions[ri].slice(0, 70)}{mod.questions[ri].length > 70 ? "..." : ""}</div>
                          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6, background: C.offwhite, borderRadius: 8, padding: "8px 10px", fontStyle: "italic" }}>"{r}"</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {mod.habit && (
                  <div style={{ padding: "12px 16px", background: `${mod.colorLight || C.greenLight}60`, borderTop: `0.5px solid ${C.grayMid}30` }}>
                    <div style={{ ...s.label, marginBottom: 4 }}>Habit assigned</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: mod.color || C.green }}>{mod.habit.title}</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>The mental habit {player.name.split(" ")[0]} is practising this week</div>
                  </div>
                )}
              </>}
            </div>
          );
        })}
      </>}

      {pending.length > 0 && <>
        <div style={{ ...s.sectionTitle, marginTop: 8, marginBottom: 10 }}>Pending</div>
        <div style={s.card}>
          {pending.map((a, i) => {
            const player = getPlayer(a.playerId, players); const mod = getModule(a.moduleId, player?.language || "en") || a.moduleData; if (!player || !mod) return null; return (
              <div key={a.id}>
                {i > 0 && <div style={s.divider} />}
                <div style={{ ...s.cardPad }}>
                  <div style={{ ...s.row }}>
                    <Avatar player={player} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: C.navy }}>{player.name}</div>
                      <div style={s.muted}>{mod.title} · assigned {a.assignedAt}</div>
                    </div>
                    <span style={s.badge(a.status === "in-progress" ? C.amberLight : C.grayLight, a.status === "in-progress" ? C.amber : C.gray)}>{statusLabel(a.status, player?.language || "en")}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>}

      <div style={{ background: C.greenLight, border: `0.5px solid ${C.green}40`, borderRadius: 12, padding: "12px 14px", marginTop: 8 }}>
        <div style={{ fontSize: 12, color: C.greenDark, lineHeight: 1.6 }}>
          <strong>Coaching tip:</strong> The most valuable thing in these summaries is the gap between what a player writes and what you observe in training. That gap tells you where the real work is.
        </div>
      </div>
    </div>
  );
}

// ── Coach: Roster ─────────────────────────────────────────────────────────────
function CoachRoster({ players, assignments, onViewPlayer, onAddPlayer }) {
  if (players.length === 0) return (
    <div style={s.screen}>
      <div style={{ ...s.row, marginBottom: 20 }}>
        <div><div style={s.label}>Your squad</div><div style={s.h1}>Roster</div></div>
        <button style={{ ...s.btn(C.green, C.white), marginLeft: "auto" }} onClick={onAddPlayer}><Icon name="plus" size={16} color={C.white} /></button>
      </div>
      <div style={{ textAlign: "center", padding: "40px 20px 32px" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.greenLight, border: `1px solid ${C.green}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Icon name="users" size={24} color={C.green} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 500, color: C.navy, marginBottom: 8 }}>No players yet</div>
        <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6, marginBottom: 24 }}>Add the players you want to work with. Start with 2–3 — you can add more any time.</div>
        <button style={s.btn(C.green, C.white, true)} onClick={onAddPlayer}>Add first player</button>
      </div>
      <div style={{ background: C.offwhite, border: `0.5px solid ${C.grayMid}`, borderRadius: 12, padding: "13px 14px" }}>
        <div style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: C.gray, marginBottom: 10 }}>Tips for your first roster</div>
        {["Start with players you already have a conversation with — they'll engage more readily.", "Pick players dealing with something specific — mistake recovery, confidence, bench time — so you can assign a relevant module straight away.", "Always use MindPitch on the same device and browser — your roster is saved here until accounts are added."].map((tip, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, paddingBottom: i < 2 ? 8 : 0, marginBottom: i < 2 ? 8 : 0, borderBottom: i < 2 ? `0.5px solid ${C.grayMid}` : undefined }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, flexShrink: 0, marginTop: 5 }} />
            <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.55 }}>{tip}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={s.screen}>
      <div style={{ ...s.row, marginBottom: 20 }}>
        <div><div style={s.label}>Your squad</div><div style={s.h1}>Roster</div></div>
        <button style={{ ...s.btn(C.green, C.white), marginLeft: "auto" }} onClick={onAddPlayer}><Icon name="plus" size={16} color={C.white} /></button>
      </div>
      <div style={s.card}>
        {players.map((player, i) => {
          const pa = assignments.filter(a => a.playerId === player.id); const latest = pa.sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt))[0]; const mod = latest ? (getModule(latest.moduleId, player.language || "en") || latest.moduleData) : null; const done = pa.filter(a => a.status === "completed").length; return (
            <div key={player.id}>
              {i > 0 && <div style={s.divider} />}
              <div style={{ ...s.cardPad, cursor: "pointer" }} onClick={() => onViewPlayer(player)}>
                <div style={{ ...s.row, marginBottom: mod ? 8 : 0 }}>
                  <Avatar player={player} />
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14, color: C.navy }}>{player.name}</div><div style={s.muted}>{player.position} · {player.age}</div></div>
                  {mod && <span style={s.badge(mod.colorLight, mod.colorDark)}>{mod.theme}</span>}
                </div>
                {mod && (<div style={{ ...s.row, gap: 8 }}><div style={{ flex: 1 }}><ProgressBar value={latest.responses.filter(Boolean).length / mod.questions.length * 100} color={mod.color} /></div><div style={{ fontSize: 12, color: C.textMuted, whiteSpace: "nowrap" }}>{done} done</div></div>)}
                {!mod && <div style={{ fontSize: 12, color: C.textMuted }}>No modules assigned yet</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Coach: Player Detail ──────────────────────────────────────────────────────
function PlayerDetail({ player, assignments, onBack, onAssignModule, onEdit, onRemove }) {
  const pa = assignments.filter(a => a.playerId === player.id);
  const [confirmRemove, setConfirmRemove] = useState(false);
  return (
    <div style={s.screen}>
      <div style={{ ...s.row, marginBottom: 16 }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", ...s.row, padding: 0 }} onClick={onBack}><Icon name="back" size={20} color={C.navy} /><span style={{ fontSize: 14, color: C.navy }}>Back to roster</span></button>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button style={{ background: "none", border: `1px solid ${C.grayMid}`, borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={() => onEdit(player)} title="Edit player"><Icon name="edit" size={16} color={C.navy} /></button>
          <button style={{ background: "none", border: `1px solid ${C.coral || "#D85A30"}`, borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={() => setConfirmRemove(true)} title="Remove player"><Icon name="trash" size={16} color={C.coral || "#D85A30"} /></button>
        </div>
      </div>
      <div style={{ ...s.card }}>
        <div style={{ background: C.navy, padding: "20px 16px", borderRadius: "14px 14px 0 0" }}>
          <div style={{ ...s.row, marginBottom: 12 }}><Avatar player={player} size={48} /><div><div style={{ color: C.white, fontWeight: 600, fontSize: 18 }}>{player.name}</div><div style={{ color: C.grayMid, fontSize: 13 }}>{player.position} · {player.age}</div></div></div>
          <div style={{ display: "flex", gap: 8 }}>
            {[["Assigned", pa.length], ["Completed", pa.filter(a => a.status === "completed").length]].map(([l, v]) => (
              <div key={l} style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "10px 12px" }}><div style={{ color: C.grayMid, fontSize: 11 }}>{l}</div><div style={{ color: l === "Completed" ? C.green : C.white, fontWeight: 600, fontSize: 20 }}>{v}</div></div>
            ))}
          </div>
        </div>
        <div style={s.cardPad}><button style={s.btn(C.green, C.white, true)} onClick={() => onAssignModule(player)}>Assign new module</button></div>
      </div>
      {confirmRemove && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: C.white, borderRadius: 16, padding: 24, width: "100%", maxWidth: 360 }}>
            <div style={{ fontWeight: 600, fontSize: 16, color: C.navy, marginBottom: 8 }}>Remove {player.name}?</div>
            <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 20, lineHeight: 1.5 }}>This removes them from your roster. Their module history will no longer be visible. This can't be undone.</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ ...s.btn(C.white, C.navy, true), border: `1px solid ${C.grayMid}` }} onClick={() => setConfirmRemove(false)}>Cancel</button>
              <button style={{ ...s.btn(C.coral || "#D85A30", C.white, true) }} onClick={() => { onRemove(player); setConfirmRemove(false); }}>Remove</button>
            </div>
          </div>
        </div>
      )}
      {pa.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={s.sectionTitle}>Module history</div>
          {pa.map(a => {
            const mod = getModule(a.moduleId, player.language || "en") || a.moduleData; if (!mod) return null; return (
              <div key={a.id} style={{ ...s.card, borderLeft: `3px solid ${mod.color}` }}>
                <div style={s.cardPad}>
                  <div style={{ ...s.row, marginBottom: 8 }}>
                    <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14, color: C.navy }}>{mod.title}</div><div style={{ fontSize: 12, color: C.textMuted }}>Assigned {a.assignedAt}</div></div>
                    <span style={s.badge(a.status === "completed" ? C.greenLight : a.status === "in-progress" ? C.amberLight : C.grayLight, statusColor(a.status))}>{statusLabel(a.status, player?.language || "en")}</span>
                  </div>
                  {a.responses.filter(Boolean).length > 0 && (
                    <div style={{ background: C.offwhite, borderRadius: 8, padding: "10px 12px" }}>
                      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Latest response</div>
                      <div style={{ fontSize: 13, color: C.text, fontStyle: "italic" }}>"{a.responses.find(Boolean)}"</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Coach: Module Builder ─────────────────────────────────────────────────────
function ModuleBuilder({ players, savedModules, onSaveModule, onDeleteModule, onAssigned, onBack }) {
  const [tab, setTab] = useState("library");
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [aiDesc, setAiDesc] = useState(""); const [aiPosition, setAiPosition] = useState("Center back"); const [aiAge, setAiAge] = useState("U14"); const [aiTheme, setAiTheme] = useState("Confidence");
  const [aiResult, setAiResult] = useState(null); const [aiLoading, setAiLoading] = useState(false); const [aiError, setAiError] = useState("");
  const [assigned, setAssigned] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const themes = ["Mistake recovery", "Confidence", "Pre-game anxiety", "Bench mentality", "Belonging", "Leadership", "Pressure"];

  async function generateModule() {
    if (!aiDesc.trim()) { setAiError("Please describe the player situation first."); return; }
    setAiLoading(true); setAiError(""); setAiResult(null); setJustSaved(false);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: `You are MindPitch. Generate a personalized youth soccer mentality module for: Position: ${aiPosition}, Age: ${aiAge}, Theme: ${aiTheme}, Description: "${aiDesc}". Respond ONLY with JSON (no markdown): {"title":"...","situation":"2-3 sentence immersive scenario in second person","questions":["q1","q2","q3","q4"],"habit":{"title":"...","body":"..."},"coachNote":"1-2 sentences"}` }] }) });
      const data = await res.json(); const text = data.content?.find(b => b.type === "text")?.text || ""; const clean = text.replace(/```json|```/g, "").trim(); const parsed = JSON.parse(clean);
      setAiResult({ ...parsed, id: "ai-" + Date.now(), color: C.purple, colorLight: C.purpleLight, colorDark: "#3C3489", theme: aiTheme, forPosition: aiPosition, forAge: aiAge });
    } catch (e) { setAiError("Couldn't generate module — check your API connection."); }
    setAiLoading(false);
  }

  async function handleSave(mod) { await onSaveModule(mod); setJustSaved(true); }

  async function doAssign(module, playerToAssign = selectedPlayer) {
    if (!playerToAssign) {
      setSelectedModule(module);
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    try {
      await onAssigned({
        id: "a-" + Date.now(),
        playerId: playerToAssign.id,
        moduleId: module.id || "ai-custom",
        moduleData: module,
        assignedAt: today,
        status: "assigned",
        responses: [],
        completedAt: null
      });

      setSelectedPlayer(playerToAssign);
      setAssigned(true);
    } catch (error) {
      console.error("Assignment failed", error);
      alert("Could not assign this module. Please try again.");
    }
  }

  if (assigned) return (
    <div style={{ ...s.screen, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><Icon name="check" size={28} color={C.green} /></div>
      <div style={{ ...s.h1, marginBottom: 8 }}>Module assigned</div>
      <div style={{ ...s.muted, marginBottom: 24 }}>{selectedPlayer?.name} will see it in their module list.</div>
      <button style={s.btn(C.navy, C.white, false)} onClick={onBack}>Back to dashboard</button>
    </div>
  );

  if (selectedModule && !selectedPlayer) return (
    <div style={s.screen}>
      <button style={{ background: "none", border: "none", cursor: "pointer", ...s.row, marginBottom: 16, padding: 0 }} onClick={() => setSelectedModule(null)}><Icon name="back" size={20} color={C.navy} /><span style={{ fontSize: 14, color: C.navy }}>Back</span></button>
      <div style={{ ...s.label, marginBottom: 6 }}>Assigning</div>
      <div style={{ ...s.h2, marginBottom: 16 }}>{selectedModule.title}</div>
      <div style={s.sectionTitle}>Choose a player</div>
      {players.length === 0 ? (
        <div style={{ ...s.card }}>
          <div style={{ ...s.cardPad, textAlign: "center", padding: "24px 16px" }}>
            <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6, marginBottom: 16 }}>No players on your roster yet. Add players first, then come back to assign this module.</div>
            <button style={s.btn(C.green, C.white, true)} onClick={() => setSelectedModule(null)}>Back to modules</button>
          </div>
        </div>
      ) : (
        <div style={s.card}>
          {players.map((p, i) => (
            <div key={p.id}>{i > 0 && <div style={s.divider} />}<div style={{ ...s.cardPad, cursor: "pointer" }} onClick={() => doAssign(selectedModule, p)}><div style={s.row}><Avatar player={p} /><div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14, color: C.navy }}>{p.name}</div><div style={s.muted}>{p.position} · {p.age}</div></div><Icon name="arrow" size={16} color={C.grayMid} /></div></div></div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={s.screen}>
      <div style={{ marginBottom: 20 }}><div style={s.label}>Module builder</div><div style={s.h1}>Assign a module</div></div>
      <div style={{ display: "flex", background: C.white, borderRadius: 10, padding: 4, marginBottom: 20, border: `0.5px solid ${C.grayMid}30`, gap: 2 }}>
        {[["library", "Library"], ["saved", `Saved${savedModules?.length > 0 ? " (" + savedModules.length + ")" : ""}`], ["ai", "AI builder"]].map(([t, label]) => (
          <button key={t} style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: "none", cursor: "pointer", background: tab === t ? C.navy : "transparent", color: tab === t ? C.white : C.gray, fontSize: 12, fontWeight: tab === t ? 600 : 400 }} onClick={() => setTab(t)}>{label}</button>
        ))}
      </div>
      {tab === "library" && (<div><div style={{ background: C.greenLight, border: `0.5px solid ${C.green}40`, borderRadius: 10, padding: "10px 12px", marginBottom: 14, fontSize: 12, color: C.greenDark, lineHeight: 1.5 }}><strong>Start here</strong> — tap any module to assign it to a player in one step.</div><div style={s.sectionTitle}>{MODULES_LIBRARY.length} ready-to-assign modules</div>{MODULES_LIBRARY.map(mod => (<div key={mod.id} style={{ ...s.card, borderLeft: `3px solid ${mod.color}` }}><div style={s.cardPad}><div style={{ ...s.row, marginBottom: 8 }}><span style={s.badge(mod.colorLight, mod.colorDark)}>{mod.theme}</span><span style={{ ...s.muted, marginLeft: "auto" }}>{mod.time}</span></div><div style={{ ...s.h2, marginBottom: 4 }}>{mod.title}</div><div style={{ ...s.muted, marginBottom: 12 }}>{mod.situation.slice(0, 90)}...</div><button style={s.btn(mod.color, C.white, true)} onClick={() => setSelectedModule(mod)}>Assign this module</button></div></div>))}</div>)}
      {tab === "saved" && (
        <div>
          {!savedModules || savedModules.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.purpleLight, border: `1px solid ${C.purple}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><Icon name="brain" size={24} color={C.purple} /></div>
              <div style={{ fontSize: 16, fontWeight: 500, color: C.navy, marginBottom: 8 }}>No saved modules yet</div>
              <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6, marginBottom: 20 }}>Generate a module in the AI builder and tap "Save to library" — it will appear here ready to reuse with any player.</div>
              <button style={s.btn(C.purple, C.white, true)} onClick={() => setTab("ai")}>Go to AI builder →</button>
            </div>
          ) : (
            <div>
              <div style={{ background: C.purpleLight, border: `0.5px solid ${C.purple}40`, borderRadius: 10, padding: "10px 12px", marginBottom: 14, fontSize: 12, color: "#3C3489", lineHeight: 1.5 }}>Your personal library — built from real situations with your players. Grows every time you save a generated module.</div>
              <div style={s.sectionTitle}>{savedModules.length} saved module{savedModules.length !== 1 ? "s" : ""}</div>
              {savedModules.map(mod => (
                <div key={mod.id} style={{ ...s.card, borderLeft: `3px solid ${C.purple}` }}>
                  <div style={s.cardPad}>
                    <div style={{ ...s.row, marginBottom: 8, flexWrap: "wrap", gap: 4 }}>
                      <span style={s.badge(C.purpleLight, "#3C3489")}>{mod.theme}</span>
                      {mod.forPosition && <span style={{ ...s.muted, fontSize: 11 }}>{mod.forPosition} · {mod.forAge}</span>}
                      <span style={{ ...s.muted, marginLeft: "auto", fontSize: 11 }}>{mod.savedAt}</span>
                    </div>
                    <div style={{ ...s.h2, marginBottom: 4 }}>{mod.title}</div>
                    <div style={{ ...s.muted, marginBottom: 12 }}>{mod.situation?.slice(0, 90)}...</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{ ...s.btn(C.purple, C.white, false), flex: 1 }} onClick={() => setSelectedModule(mod)}>Assign</button>
                      <button style={{ ...s.btnOutline(false), padding: "11px 14px", fontSize: 18, lineHeight: 1 }} onClick={() => { if (window.confirm("Remove this module from your library?")) onDeleteModule(mod.id); }} title="Remove">✕</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {tab === "ai" && (
        <div>
          <div style={s.card}><div style={s.cardPad}>
            <div style={{ ...s.label, marginBottom: 8 }}>Describe what you're seeing</div>
            <textarea style={s.textarea} placeholder="e.g. My U14 center back is new to the team and struggling to communicate..." value={aiDesc} onChange={e => setAiDesc(e.target.value)} rows={4} />
            <div style={{ ...s.label, marginBottom: 8, marginTop: 4 }}>Position</div>
            <div style={s.chipRow}>{["Goalkeeper", "Defender", "Midfielder", "Striker"].map(p => (<div key={p} style={s.chip(aiPosition === p)} onClick={() => setAiPosition(p)}>{p}</div>))}</div>
            <div style={{ ...s.label, marginBottom: 8 }}>Age group</div>
            <div style={s.chipRow}>{["U13", "U14", "U15", "U16", "U17"].map(a => (<div key={a} style={s.chip(aiAge === a)} onClick={() => setAiAge(a)}>{a}</div>))}</div>
            <div style={{ ...s.label, marginBottom: 8 }}>Theme</div>
            <div style={s.chipRow}>{themes.map(t => (<div key={t} style={s.chip(aiTheme === t)} onClick={() => setAiTheme(t)}>{t}</div>))}</div>
            {aiError && <div style={{ fontSize: 13, color: "#E24B4A", marginBottom: 10 }}>{aiError}</div>}
            <button style={s.btn(C.navy, C.white, true)} onClick={generateModule} disabled={aiLoading}>{aiLoading ? "Generating..." : "Generate module with AI"}</button>
          </div></div>
          {aiResult && (
            <div style={{ ...s.card, borderLeft: `3px solid ${C.purple}`, marginTop: 16 }}>
              <div style={{ background: C.purpleLight, padding: "10px 16px", borderBottom: `0.5px solid ${C.grayMid}30` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#3C3489" }}>AI-GENERATED MODULE</div>
                <div style={{ fontWeight: 600, fontSize: 16, color: C.navy, marginTop: 2 }}>{aiResult.title}</div>
              </div>
              <div style={s.cardPad}>
                <div style={{ ...s.label, marginBottom: 4 }}>Situation</div>
                <div style={{ ...s.body, marginBottom: 14, fontStyle: "italic", color: C.textMuted }}>{aiResult.situation}</div>
                <div style={{ ...s.label, marginBottom: 6 }}>Reflection questions</div>
                {aiResult.questions?.map((q, i) => (<div key={i} style={{ ...s.row, alignItems: "flex-start", marginBottom: 8, gap: 8 }}><div style={{ width: 22, height: 22, borderRadius: "50%", background: C.purple, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0, marginTop: 1 }}>{i + 1}</div><div style={{ fontSize: 13, color: C.text, lineHeight: 1.55, flex: 1 }}>{q}</div></div>))}
                <div style={{ background: C.amberLight, borderRadius: 8, padding: "10px 12px", marginTop: 10, marginBottom: 14 }}><div style={{ fontSize: 12, fontWeight: 600, color: "#633806", marginBottom: 3 }}>{aiResult.habit?.title}</div><div style={{ fontSize: 13, color: "#412402", lineHeight: 1.55 }}>{aiResult.habit?.body}</div></div>
                {aiResult.coachNote && (<div style={{ background: C.grayLight, borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}><div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, letterSpacing: "0.04em", marginBottom: 3 }}>COACH NOTE</div><div style={{ fontSize: 13, color: C.text, lineHeight: 1.55, fontStyle: "italic" }}>{aiResult.coachNote}</div></div>)}
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <button style={{ ...s.btn(C.purple, C.white, false), flex: 1 }} onClick={() => setSelectedModule(aiResult)}>Assign this module</button>
                  <button style={{ ...s.btn(justSaved ? C.green : C.navy, C.white, false), flex: 1 }} onClick={() => { if (!justSaved) handleSave(aiResult); }}>{justSaved ? "✓ Saved" : "Save to library"}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Add Player Modal ──────────────────────────────────────────────────────────
function AddPlayerModal({ onAdd, onClose }) {
  const [name, setName] = useState(""); const [position, setPosition] = useState("Center back"); const [age, setAge] = useState("U14"); const [coachNote, setCoachNote] = useState(""); const [language, setLanguage] = useState("en"); const [playerEmail, setPlayerEmail] = useState("");
  const colors = [{ bg: C.greenLight, text: C.greenDark }, { bg: C.blueLight, text: "#0C447C" }, { bg: C.amberLight, text: "#633806" }, { bg: C.purpleLight, text: "#3C3489" }, { bg: C.coralLight, text: "#712B13" }];
  function add() { if (!name.trim()) return; const initials = name.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(); const c = colors[Math.floor(Math.random() * colors.length)]; onAdd({ id: crypto.randomUUID ? crypto.randomUUID() : "p-" + Date.now(), name: name.trim(), position, age, avatar: initials, avatarColor: c.bg, avatarText: c.text, coachNote: coachNote.trim(), language, playerEmail: playerEmail.trim().toLowerCase() }); }
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: C.white, borderRadius: "16px 16px 0 0", padding: 20, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ ...s.row, marginBottom: 20 }}><div style={s.h2}>Add player</div><button style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.gray }} onClick={onClose}>✕</button></div>
        <input style={s.input} placeholder="Full name" value={name} onChange={e => setName(e.target.value)} autoFocus />
        <div style={s.label}>Position</div>
        <div style={{ ...s.chipRow, marginBottom: 14 }}>{POSITIONS.map(p => (<div key={p} style={s.chip(position === p)} onClick={() => setPosition(p)}>{p}</div>))}</div>
        <div style={s.label}>Age group</div>
        <div style={{ ...s.chipRow, marginBottom: 14 }}>{AGE_GROUPS.map(a => (<div key={a} style={s.chip(age === a)} onClick={() => setAge(a)}>{a}</div>))}</div>
        <div style={s.label}>Language <span style={{ fontSize: 11, color: C.gray, fontWeight: 400 }}>— player's preferred language for modules and AI coach</span></div>
        <div style={{ ...s.chipRow, marginBottom: 14 }}>
          {[["en", "🇺🇸 English"], ["es", "🇲🇽 Español"]].map(([code, label]) => (<div key={code} style={s.chip(language === code)} onClick={() => setLanguage(code)}>{label}</div>))}
        </div>
        <div style={s.label}>Player email <span style={{ fontSize: 11, color: C.gray, fontWeight: 400 }}>— lets them log in independently on their own phone (optional)</span></div>
        <input style={{ ...s.input, marginBottom: 6 }} placeholder="e.g. jake@email.com" value={playerEmail} onChange={e => setPlayerEmail(e.target.value)} type="email" autoCapitalize="none" autoCorrect="off" />
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 14, lineHeight: 1.5 }}>💡 U15 and above — add their email so they can log in on their own phone. U13–U14 — leave blank and use your phone for now.</div>
        <div style={s.label}>Coach note <span style={{ fontSize: 11, color: C.gray, fontWeight: 400 }}>— soccer IQ context for the AI coach (optional)</span></div>
        <textarea style={{ ...s.input, height: 72, resize: "none", fontSize: 13, marginBottom: 16 }} placeholder="e.g. Strong positionally, needs to communicate more. Goes backwards under pressure instead of turning." value={coachNote} onChange={e => setCoachNote(e.target.value)} />
        <button style={s.btn(C.green, C.white, true)} onClick={add}>Add to roster</button>
      </div>
    </div>
  );
}

// ── Edit Player Modal ──────────────────────────────────────────────────────────
function EditPlayerModal({ player, onSave, onClose }) {
  const [name, setName] = useState(player.name); const [position, setPosition] = useState(player.position); const [age, setAge] = useState(player.age); const [coachNote, setCoachNote] = useState(player.coachNote || ""); const [language, setLanguage] = useState(player.language || "en"); const [playerEmail, setPlayerEmail] = useState(player.playerEmail || "");
  function save() { if (!name.trim()) return; const initials = name.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(); onSave({ ...player, name: name.trim(), position, age, avatar: initials, coachNote: coachNote.trim(), language, playerEmail: playerEmail.trim().toLowerCase() }); }
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: C.white, borderRadius: "16px 16px 0 0", padding: 20, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ ...s.row, marginBottom: 20 }}><div style={s.h2}>Edit player</div><button style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.gray }} onClick={onClose}>✕</button></div>
        <input style={s.input} placeholder="Full name" value={name} onChange={e => setName(e.target.value)} autoFocus />
        <div style={s.label}>Position</div>
        <div style={{ ...s.chipRow, marginBottom: 14 }}>{POSITIONS.map(p => (<div key={p} style={s.chip(position === p)} onClick={() => setPosition(p)}>{p}</div>))}</div>
        <div style={s.label}>Age group</div>
        <div style={{ ...s.chipRow, marginBottom: 14 }}>{AGE_GROUPS.map(a => (<div key={a} style={s.chip(age === a)} onClick={() => setAge(a)}>{a}</div>))}</div>
        <div style={s.label}>Language</div>
        <div style={{ ...s.chipRow, marginBottom: 14 }}>
          {[["en", "🇺🇸 English"], ["es", "🇲🇽 Español"]].map(([code, label]) => (<div key={code} style={s.chip(language === code)} onClick={() => setLanguage(code)}>{label}</div>))}
        </div>
        <div style={s.label}>Player email <span style={{ fontSize: 11, color: C.gray, fontWeight: 400 }}>— lets them log in on their own phone (optional)</span></div>
        <input style={{ ...s.input, marginBottom: 6 }} placeholder="e.g. jake@email.com" value={playerEmail} onChange={e => setPlayerEmail(e.target.value)} type="email" autoCapitalize="none" autoCorrect="off" />
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 14, lineHeight: 1.5 }}>
          {playerEmail ? `✓ ${playerEmail.split("@")[0]} can log in independently at mindpitch.net` : "No email set — use your phone to run modules for this player."}
        </div>
        <div style={s.label}>Coach note <span style={{ fontSize: 11, color: C.gray, fontWeight: 400 }}>— soccer IQ context for the AI coach (optional)</span></div>
        <textarea style={{ ...s.input, height: 72, resize: "none", fontSize: 13, marginBottom: 16 }} placeholder="e.g. Strong positionally, needs to communicate more. Goes backwards under pressure instead of turning." value={coachNote} onChange={e => setCoachNote(e.target.value)} />
        <button style={s.btn(C.green, C.white, true)} onClick={save}>Save changes</button>
      </div>
    </div>
  );
}

// ── Founder Dashboard ─────────────────────────────────────────────────────────
function FounderDashboard({ players, assignments, savedModules }) {
  const [tab, setTab] = useState("overview");
  const completed = assignments.filter(a => a.status === "completed");
  const pending = assignments.filter(a => a.status !== "completed");
  const completionRate = assignments.length ? Math.round(completed.length / assignments.length * 100) : 0;
  const spanishPlayers = players.filter(p => p.language === "es");
  const apiCost = (assignments.length * 0.03).toFixed(2);

  const DEMO_CLUBS = [
    { name: "Silicon Valley FC", coaches: 5, players: 18, rate: 87, status: "Active", sc: C.green, sb: C.greenLight },
    { name: "FC Bay Area", coaches: 4, players: 22, rate: 61, status: "Check in", sc: C.amber, sb: C.amberLight },
    { name: "Nor-Cal United", coaches: 5, players: players.length, rate: completionRate, status: "Active", sc: C.green, sb: C.greenLight },
  ];

  const tabs = [["overview", "Overview"], ["clubs", "Clubs"], ["engagement", "Engagement"], ["product", "Product"], ["revenue", "Revenue"]];

  return (
    <div style={{ ...s.screen, paddingBottom: 20 }}>
      <div style={{ background: C.navy, borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
        <div style={{ ...s.row, marginBottom: 4 }}>
          <div style={s.logo}><div style={s.logoDot} />MINDPITCH</div>
          <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20, background: "rgba(29,158,117,0.2)", border: "0.5px solid rgba(29,158,117,0.4)", color: C.green }}>Founder view</span>
        </div>
        <div style={{ fontSize: 12, color: "#9FE1CB" }}>Platform dashboard · Live data</div>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {tabs.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 500, whiteSpace: "nowrap", background: tab === key ? C.navy : C.white, color: tab === key ? C.white : C.gray, flexShrink: 0 }}>{label}</button>
        ))}
      </div>

      {tab === "overview" && (<>
        <div style={{ ...s.sectionTitle, marginBottom: 10 }}>Platform · July 2026</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}>
          {[[`${completionRate}%`, "Completion", C.green], [players.length, "Players", C.text], [assignments.length, "Modules", C.text]].map(([v, l, c]) => (
            <div key={l} style={s.metric}><div style={{ ...s.metricVal, color: c }}>{v}</div><div style={s.metricLabel}>{l}</div></div>
          ))}
        </div>
        <div style={{ ...s.sectionTitle, marginBottom: 10 }}>Alerts — act on these</div>
        <div style={s.card}>
          {[
            [C.amberLight, C.amber, "👁", "FC Bay Area — coach inactive 9 days", "Coach Rivera hasn't assigned a module since last week. Send a check-in before they disengage."],
            [C.greenLight, C.green, "★", "Silicon Valley FC — pilot ending in 12 days", "87% completion rate. Best candidate for first conversion conversation."],
            [C.blueLight, C.blue, "↑", `AI usage up · $${apiCost} this month`, "Well within the $50 cap. Coaches are engaging with the AI builder."],
          ].map(([bg, tc, ic, title, desc], i, arr) => (
            <div key={i} style={{ padding: "11px 14px", borderBottom: i < arr.length - 1 ? `0.5px solid ${C.grayMid}20` : "none", display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: bg, color: tc, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{ic}</div>
              <div><div style={{ fontSize: 13, fontWeight: 500, color: C.navy, marginBottom: 2 }}>{title}</div><div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{desc}</div></div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
          <div style={s.metric}><div style={{ fontSize: 14, fontWeight: 500, color: C.green, marginBottom: 3 }}>Mistake recovery</div><div style={s.metricLabel}>Most assigned module</div></div>
          <div style={s.metric}><div style={{ ...s.metricVal, fontSize: 20 }}>{spanishPlayers.length}</div><div style={s.metricLabel}>Spanish players</div></div>
        </div>
      </>)}

      {tab === "clubs" && (<>
        <div style={{ ...s.sectionTitle, marginBottom: 10 }}>All pilot clubs</div>
        <div style={s.card}>
          {DEMO_CLUBS.map((c, i) => (
            <div key={c.name} style={{ padding: "12px 14px", borderBottom: i < DEMO_CLUBS.length - 1 ? `0.5px solid ${C.grayMid}20` : "none" }}>
              <div style={{ ...s.rowSB, marginBottom: 6 }}>
                <div><div style={{ fontWeight: 600, fontSize: 14, color: C.navy }}>{c.name}</div><div style={s.muted}>{c.coaches} coaches · {c.players} players</div></div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: c.rate >= 80 ? C.green : C.amber }}>{c.rate}%</div>
                  <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 20, background: c.sb, color: c.sc }}>{c.status}</span>
                </div>
              </div>
              <div style={{ height: 4, background: C.greenLight, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${c.rate}%`, height: 4, background: c.rate >= 80 ? C.green : C.amber, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </>)}

      {tab === "engagement" && (<>
        <div style={{ ...s.sectionTitle, marginBottom: 10 }}>Coach engagement</div>
        <div style={s.card}>
          {[
            ["Coach Martinez", "Silicon Valley FC", "Today", 100, C.green, C.greenLight, "Thriving"],
            ["Coach Rivera", "FC Bay Area", "9 days ago", 20, C.amber, C.amberLight, "Check in"],
            ["Coach Chen", "Nor-Cal United", "2 days ago", 72, C.green, C.greenLight, "Active"],
            ["Coach Williams", "Silicon Valley FC", "Yesterday", 88, C.green, C.greenLight, "Active"],
          ].map(([name, club, last, pct, tc, bg, status], i, arr) => (
            <div key={name} style={{ padding: "11px 14px", borderBottom: i < arr.length - 1 ? `0.5px solid ${C.grayMid}20` : "none" }}>
              <div style={{ ...s.rowSB, marginBottom: 6 }}>
                <div style={s.row}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.greenLight, color: C.greenDark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{name.split(" ")[1].slice(0, 2)}</div>
                  <div><div style={{ fontSize: 13, fontWeight: 500, color: C.navy }}>{name}</div><div style={s.muted}>{club} · {last}</div></div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 20, background: bg, color: tc }}>{status}</span>
              </div>
              <div style={{ height: 4, background: C.greenLight, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: 4, background: tc, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ ...s.sectionTitle, marginTop: 8, marginBottom: 10 }}>Players overdue 7+ days</div>
        <div style={s.card}>
          {pending.slice(0, 3).map((a, i) => {
            const player = players.find(p => p.id === a.playerId); if (!player) return null; return (
              <div key={a.id} style={{ padding: "10px 14px", borderBottom: i < 2 ? `0.5px solid ${C.grayMid}20` : "none", display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar player={player} />
                <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500, color: C.navy }}>{player.name}</div><div style={s.muted}>Module assigned · pending</div></div>
                <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 20, background: C.amberLight, color: C.amber }}>Pending</span>
              </div>
            );
          })}
        </div>
      </>)}

      {tab === "product" && (<>
        <div style={{ ...s.sectionTitle, marginBottom: 10 }}>Module performance</div>
        <div style={s.card}><div style={s.cardPad}>
          {[["Mistake recovery", 84, C.green], ["Confidence slumps", 77, C.blue], ["Bench mentality", 81, C.purple], ["Pre-game anxiety", 72, C.coral], ["New to the team", 57, C.amber]].map(([title, rate, color], i, arr) => (
            <div key={title} style={{ padding: "8px 0", borderBottom: i < arr.length - 1 ? `0.5px solid ${C.grayMid}20` : "none" }}>
              <div style={{ ...s.rowSB, marginBottom: 4 }}><span style={{ fontSize: 13, color: C.navy }}>{title}</span><span style={{ fontSize: 12, fontWeight: 600, color }}>{rate}%</span></div>
              <div style={{ height: 4, background: C.greenLight, borderRadius: 2, overflow: "hidden" }}><div style={{ width: `${rate}%`, height: 4, background: color, borderRadius: 2 }} /></div>
            </div>
          ))}
        </div></div>
        <div style={{ ...s.sectionTitle, marginTop: 8, marginBottom: 10 }}>AI builder usage</div>
        <div style={s.card}><div style={s.cardPad}>
          {[["AI modules generated", savedModules.length || 0], ["Saved to library", Math.floor((savedModules.length || 0) * 0.6)], ["Spanish conversations", spanishPlayers.length], ["Avg messages per debrief", "6.2"]].map(([l, v], i, arr) => (
            <div key={l} style={{ ...s.rowSB, padding: "7px 0", borderBottom: i < arr.length - 1 ? `0.5px solid ${C.grayMid}20` : "none" }}>
              <span style={{ fontSize: 13, color: C.textMuted }}>{l}</span><span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{v}</span>
            </div>
          ))}
        </div></div>
      </>)}

      {tab === "revenue" && (<>
        <div style={{ background: C.greenLight, border: `0.5px solid ${C.green}40`, borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.greenDark, marginBottom: 6 }}>PILOT PHASE — $0 MRR</div>
          <div style={{ fontSize: 13, color: C.greenDark, lineHeight: 1.65 }}>3 clubs on free 60-day pilot. First conversion opportunity: Silicon Valley FC pilot ends July 21 — 12 days away. At $99/team/month with 6 teams that's $594/month.</div>
        </div>
        <div style={{ ...s.sectionTitle, marginBottom: 10 }}>Revenue potential</div>
        <div style={s.card}><div style={s.cardPad}>
          {[["Silicon Valley FC", "6 teams", "$594/mo", true], ["FC Bay Area", "4 teams", "$396/mo", false], ["Nor-Cal United", "5 teams", "$495/mo", false]].map(([club, teams, mrr, ready], i, arr) => (
            <div key={club} style={{ padding: "9px 0", borderBottom: i < arr.length - 1 ? `0.5px solid ${C.grayMid}20` : "none" }}>
              <div style={{ ...s.rowSB }}><span style={{ fontSize: 13, fontWeight: 500, color: C.navy }}>{club}</span><span style={{ fontSize: 14, fontWeight: 600, color: ready ? C.green : C.textMuted }}>{mrr}</span></div>
              <div style={s.muted}>{teams} · $99/team/month</div>
            </div>
          ))}
          <div style={{ borderTop: `0.5px solid ${C.grayMid}20`, paddingTop: 10, marginTop: 4, ...s.rowSB }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>Total potential MRR</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: C.green }}>$1,485/mo</span>
          </div>
        </div></div>
        <div style={s.card}><div style={s.cardPad}>
          {[["API cost this month", `$${apiCost}`], ["Projected at 3 paying clubs", "~$12–18/mo"], ["Gross margin at $1,485 MRR", "~99%"], ["Anthropic spending cap", "$50/month"]].map(([l, v], i, arr) => (
            <div key={l} style={{ ...s.rowSB, padding: "7px 0", borderBottom: i < arr.length - 1 ? `0.5px solid ${C.grayMid}20` : "none" }}>
              <span style={{ fontSize: 13, color: C.textMuted }}>{l}</span><span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{v}</span>
            </div>
          ))}
        </div></div>
        <div style={{ background: C.greenLight, border: `0.5px solid ${C.green}40`, borderRadius: 12, padding: "12px 14px", marginTop: 4 }}>
          <div style={{ fontSize: 12, color: C.greenDark, lineHeight: 1.65 }}><strong>Most important action:</strong> Call Silicon Valley FC director this week. 87% completion, all coaches active. This is your first paying club.</div>
        </div>
      </>)}
    </div>
  );
}

// ── Director Dashboard ────────────────────────────────────────────────────────
function DirectorDashboard({ players, assignments }) {
  const [tab, setTab] = useState("overview");
  const completed = assignments.filter(a => a.status === "completed");
  const pending = assignments.filter(a => a.status !== "completed");
  const completionRate = assignments.length ? Math.round(completed.length / assignments.length * 100) : 0;

  const TEAMS = [
    { name: "U14 Boys", coach: "Coach Martinez", players: 6, completed: 8, assigned: 8, rate: 100, color: C.green, bg: C.greenLight, status: "Outstanding" },
    { name: "U16 Girls", coach: "Coach Williams", players: 5, completed: 5, assigned: 6, rate: 83, color: C.blue, bg: C.blueLight, status: "Strong" },
    { name: "U15 Boys", coach: "Coach Garcia", players: players.length, completed: completed.length, assigned: assignments.length, rate: completionRate, color: completionRate >= 80 ? C.green : C.amber, bg: completionRate >= 80 ? C.greenLight : C.amberLight, status: completionRate >= 80 ? "Strong" : "Building" },
    { name: "U13 Boys", coach: "Coach Chen", players: 5, completed: 3, assigned: 5, rate: 60, color: C.amber, bg: C.amberLight, status: "Building" },
    { name: "U17 Girls", coach: "Coach Kim", players: 4, completed: 4, assigned: 5, rate: 80, color: C.purple, bg: C.purpleLight, status: "Strong" },
  ];

  const tabs = [["overview", "Club overview"], ["teams", "Teams"], ["coaches", "Coaches"], ["players", "Players"]];

  return (
    <div style={{ ...s.screen, paddingBottom: 20 }}>
      <div style={{ background: C.navy, borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
        <div style={{ ...s.row, marginBottom: 4 }}>
          <div style={s.logo}><div style={s.logoDot} />MINDPITCH</div>
          <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20, background: "rgba(29,158,117,0.2)", border: "0.5px solid rgba(29,158,117,0.4)", color: C.green }}>Director view</span>
        </div>
        <div style={{ fontSize: 12, color: "#9FE1CB" }}>Silicon Valley FC · Pilot ends Sept 19</div>
      </div>

      <div style={{ display: "flex", gap: 3, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {tabs.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 500, whiteSpace: "nowrap", background: tab === key ? C.navy : C.white, color: tab === key ? C.white : C.gray, flexShrink: 0 }}>{label}</button>
        ))}
      </div>

      {tab === "overview" && (<>
        <div style={{ ...s.sectionTitle, marginBottom: 10 }}>Silicon Valley FC · July 2026</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginBottom: 14 }}>
          {[[`${completionRate}%`, "Club completion", C.green], [players.length, "Players active", C.text], [assignments.length, "Modules assigned", C.text], [completed.length, "Completed", C.green]].map(([v, l, c]) => (
            <div key={l} style={s.metric}><div style={{ ...s.metricVal, color: c }}>{v}</div><div style={s.metricLabel}>{l}</div></div>
          ))}
        </div>
        <div style={{ ...s.sectionTitle, marginBottom: 10 }}>What your coaches are seeing</div>
        <div style={s.card}>
          {[
            [C.greenLight, C.greenDark, "✓", "U14 Boys — 100% completion this week", "Coach Martinez reports noticeable change in how players talk about mistakes after training."],
            [C.greenLight, C.greenDark, "✓", "U16 Girls — confidence module complete", "One player who had been disengaging is now asking for the ball in tight spaces again."],
            [C.amberLight, "#633806", "👁", "U13 Boys — 2 players not started", "Module assigned 5 days ago. Coach Chen following up at today's training."],
          ].map(([bg, tc, ic, title, desc], i, arr) => (
            <div key={i} style={{ padding: "11px 14px", borderBottom: i < arr.length - 1 ? `0.5px solid ${C.grayMid}20` : "none", display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: bg, color: tc, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>{ic}</div>
              <div><div style={{ fontSize: 13, fontWeight: 500, color: C.navy, marginBottom: 2 }}>{title}</div><div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{desc}</div></div>
            </div>
          ))}
        </div>
        <div style={{ background: C.greenLight, border: `0.5px solid ${C.green}40`, borderRadius: 12, padding: "12px 14px", marginTop: 8 }}>
          <div style={{ fontSize: 12, color: C.greenDark, lineHeight: 1.65 }}><strong>Pilot ends Sept 19 — 61 days away.</strong> At $99/team/month for your teams that's a straightforward monthly investment. Talk to your MindPitch contact about converting before the season ends.</div>
        </div>
      </>)}

      {tab === "teams" && (<>
        <div style={{ ...s.sectionTitle, marginBottom: 10 }}>All teams</div>
        <div style={s.card}>
          {TEAMS.map((t, i) => (
            <div key={t.name} style={{ padding: "12px 14px", borderBottom: i < TEAMS.length - 1 ? `0.5px solid ${C.grayMid}20` : "none" }}>
              <div style={{ ...s.rowSB, marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.navy }}>{t.name}</div>
                  <div style={s.muted}>{t.coach} · {t.players} players</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: t.color }}>{t.rate}%</div>
                  <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 20, background: t.bg, color: t.color }}>{t.status}</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 4, background: C.greenLight, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${t.rate}%`, height: 4, background: t.color, borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 11, color: C.textMuted }}>{t.completed}/{t.assigned}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ ...s.sectionTitle, marginTop: 8, marginBottom: 10 }}>Club health</div>
        <div style={s.card}><div style={s.cardPad}>
          {[["Teams above 80%", `${TEAMS.filter(t => t.rate >= 80).length} of ${TEAMS.length}`, C.green], ["Teams at 100%", `${TEAMS.filter(t => t.rate === 100).length} of ${TEAMS.length}`, C.green], ["Teams needing attention", `${TEAMS.filter(t => t.rate < 70).length}`, C.amber], ["Club average", `${Math.round(TEAMS.reduce((s, t) => s + t.rate, 0) / TEAMS.length)}%`, C.navy]].map(([l, v, c], i, arr) => (
            <div key={l} style={{ ...s.rowSB, padding: "7px 0", borderBottom: i < arr.length - 1 ? `0.5px solid ${C.grayMid}20` : "none" }}>
              <span style={{ fontSize: 13, color: C.textMuted }}>{l}</span><span style={{ fontSize: 13, fontWeight: 600, color: c }}>{v}</span>
            </div>
          ))}
        </div></div>
      </>)}

      {tab === "coaches" && (<>
        <div style={{ ...s.sectionTitle, marginBottom: 10 }}>Coaching staff</div>
        <div style={s.card}>
          {TEAMS.map((t, i) => (
            <div key={t.name} style={{ padding: "11px 14px", borderBottom: i < TEAMS.length - 1 ? `0.5px solid ${C.grayMid}20` : "none" }}>
              <div style={{ ...s.rowSB, marginBottom: 6 }}>
                <div style={s.row}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.greenLight, color: C.greenDark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{t.coach.split(" ")[1].slice(0, 2)}</div>
                  <div><div style={{ fontSize: 13, fontWeight: 500, color: C.navy }}>{t.coach}</div><div style={s.muted}>{t.name}</div></div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 20, background: t.rate >= 80 ? C.greenLight : C.amberLight, color: t.rate >= 80 ? C.green : C.amber }}>{t.rate >= 80 ? "Active" : "Building"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, maxWidth: 120, height: 4, background: C.greenLight, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${t.rate}%`, height: 4, background: t.rate >= 80 ? C.green : C.amber, borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 11, color: C.textMuted }}>{t.assigned} modules · {t.rate}%</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: C.greenLight, border: `0.5px solid ${C.green}40`, borderRadius: 12, padding: "12px 14px", marginTop: 8 }}>
          <div style={{ fontSize: 12, color: C.greenDark, lineHeight: 1.65 }}>All coaches are actively using MindPitch. The platform is working across your entire coaching staff — not just one or two early adopters.</div>
        </div>
      </>)}

      {tab === "players" && (<>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          <div style={s.metric}><div style={{ ...s.metricVal, color: C.green }}>{completed.length}</div><div style={s.metricLabel}>Modules completed</div></div>
          <div style={s.metric}><div style={{ ...s.metricVal, color: C.amber }}>{pending.length}</div><div style={s.metricLabel}>Modules pending</div></div>
        </div>
        <div style={{ ...s.sectionTitle, marginBottom: 10 }}>Mental habits being practised</div>
        <div style={s.card}><div style={s.cardPad}>
          {[["The flush it routine", "Reset after mistakes — one breath, clap, reset word", 12, C.green], ["The one brave action", "Pre-session commitment to one confident choice", 8, C.blue], ["The scout mindset", "Staying engaged and observant from the bench", 5, C.purple], ["The reset anchor", "Pre-match mental film — see the right decision first", 4, C.amber]].map(([habit, desc, count, color], i, arr) => (
            <div key={habit} style={{ padding: "9px 0", borderBottom: i < arr.length - 1 ? `0.5px solid ${C.grayMid}20` : "none" }}>
              <div style={{ ...s.rowSB, marginBottom: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.navy }}>{habit}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color }}>{count} players</span>
              </div>
              <div style={s.muted}>{desc}</div>
              <div style={{ height: 4, background: C.greenLight, borderRadius: 2, overflow: "hidden", marginTop: 6 }}>
                <div style={{ width: `${Math.round(count / players.length * 100)}%`, height: 4, background: color, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div></div>
        <div style={{ background: C.greenLight, border: `0.5px solid ${C.green}40`, borderRadius: 12, padding: "12px 14px", marginTop: 8 }}>
          <div style={{ fontSize: 12, color: C.greenDark, lineHeight: 1.65 }}><strong>Coaching tip:</strong> These are observable behaviours — ask your coaches what they're noticing on the training pitch that corresponds to these habits.</div>
        </div>
      </>)}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState("coach");
  const ROLES = [["coach", "Coach view"], ["player", "Player view"], ["director", "Director view"], ["founder", "Founder view"]];
  const [coachTab, setCoachTab] = useState("dashboard");
  const [playerTab, setPlayerTab] = useState("modules");
  const [players, setPlayers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [viewingAs, setViewingAs] = useState(null);
  const [savedModules, setSavedModules] = useState([]);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [dataLoading, setDataLoading] = useState(false);

  async function loadStorage() {
    try {
      if (window.storage?.get) {
        const pr = await window.storage.get("players");
        const ar = await window.storage.get("assignments");
        const sr = await window.storage.get("savedModules");
        if (pr) setPlayers(JSON.parse(pr.value));
        if (ar) setAssignments(JSON.parse(ar.value));
        if (sr) setSavedModules(JSON.parse(sr.value));
        return;
      }

      const pr = localStorage.getItem("players");
      const ar = localStorage.getItem("assignments");
      const sr = localStorage.getItem("savedModules");
      if (pr) setPlayers(JSON.parse(pr));
      if (ar) setAssignments(JSON.parse(ar));
      if (sr) setSavedModules(JSON.parse(sr));
    } catch (e) {
      console.error("Storage load failed", e);
    }
  }

  async function saveStorage(p, a, sm) {
    try {
      const modulesToSave = sm || savedModules;

      if (window.storage?.set) {
        await window.storage.set("players", JSON.stringify(p));
        await window.storage.set("assignments", JSON.stringify(a));
        await window.storage.set("savedModules", JSON.stringify(modulesToSave));
        return;
      }

      localStorage.setItem("players", JSON.stringify(p));
      localStorage.setItem("assignments", JSON.stringify(a));
      localStorage.setItem("savedModules", JSON.stringify(modulesToSave));
    } catch (e) {
      console.error("Storage save failed", e);
    }
  }

  async function loadCloudData(userId) {
    if (!supabase || !userId) return;
    setDataLoading(true);
    try {
      const [playersRes, assignmentsRes, modulesRes] = await Promise.all([
        supabase.from("players").select("*").eq("coach_id", userId).order("created_at", { ascending: true }),
        supabase.from("assignments").select("*").eq("coach_id", userId).order("created_at", { ascending: true }),
        supabase.from("ai_modules").select("*").eq("coach_id", userId).order("created_at", { ascending: false }),
      ]);

      if (playersRes.error) throw playersRes.error;
      if (assignmentsRes.error) throw assignmentsRes.error;
      if (modulesRes.error) throw modulesRes.error;

      const loadedPlayers = (playersRes.data || []).map(dbPlayerToApp);
      const loadedAssignments = (assignmentsRes.data || []).map(dbAssignmentToApp);
      const loadedModules = (modulesRes.data || []).map(dbSavedModuleToApp);

      setPlayers(loadedPlayers);
      setAssignments(loadedAssignments);
      setSavedModules(loadedModules);
      setSelectedPlayer(null);
      setActiveModule(null);
      setViewingAs(current => loadedPlayers.find(p => p.id === current?.id) || loadedPlayers[0] || null);
    } catch (error) {
      console.error("Supabase load failed", error);
      alert("Could not load MindPitch data from Supabase. Check the console and Supabase settings.");
    } finally {
      setDataLoading(false);
    }
  }

  async function loadAllCloudData() {
    if (!supabase) return;
    const [playersRes, assignmentsRes, modulesRes] = await Promise.all([
      supabase.from("players").select("*").order("created_at", { ascending: true }),
      supabase.from("assignments").select("*").order("created_at", { ascending: true }),
      supabase.from("ai_modules").select("*").order("created_at", { ascending: false }),
    ]);

    if (playersRes.error) throw playersRes.error;
    if (assignmentsRes.error) throw assignmentsRes.error;
    if (modulesRes.error) throw modulesRes.error;

    const loadedPlayers = (playersRes.data || []).map(dbPlayerToApp);
    setPlayers(loadedPlayers);
    setAssignments((assignmentsRes.data || []).map(dbAssignmentToApp));
    setSavedModules((modulesRes.data || []).map(dbSavedModuleToApp));
    setSelectedPlayer(null);
    setActiveModule(null);
    setViewingAs(current => loadedPlayers.find(p => p.id === current?.id) || loadedPlayers[0] || null);
  }

  async function loadPlayerCloudData(userEmail) {
    if (!supabase || !userEmail) return false;
    const normalizedEmail = userEmail.trim().toLowerCase();

    const { data: playerRow, error: playerError } = await supabase
      .from("players")
      .select("*")
      .ilike("player_email", normalizedEmail)
      .limit(1)
      .maybeSingle();

    if (playerError) throw playerError;
    if (!playerRow) return false;

    const { data: assignmentRows, error: assignmentError } = await supabase
      .from("assignments")
      .select("*")
      .eq("player_id", playerRow.id)
      .order("created_at", { ascending: true });

    if (assignmentError) throw assignmentError;

    const player = dbPlayerToApp(playerRow);
    const playerAssignments = (assignmentRows || []).map(dbAssignmentToApp);

    setRole("player");
    setPlayers([player]);
    setAssignments(playerAssignments);
    setSavedModules([]);
    setSelectedPlayer(null);
    setActiveModule(null);
    setViewingAs(player);
    setPlayerTab("modules");
    return true;
  }

  async function getRoleForEmail(userEmail) {
    if (!supabase || !userEmail) return "coach";
    const normalizedEmail = userEmail.trim().toLowerCase();
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .ilike("email", normalizedEmail)
      .limit(1)
      .maybeSingle();

    if (error && error.code !== "PGRST116") throw error;
    return data?.role || "coach";
  }

  async function loadSessionData(currentSession) {
    if (!supabase || !currentSession?.user) return;
    setDataLoading(true);
    try {
      const userEmail = currentSession.user.email || "";

      const isPlayer = await loadPlayerCloudData(userEmail);
      if (isPlayer) return;

      const nextRole = await getRoleForEmail(userEmail);
      setRole(nextRole);

      if (nextRole === "director" || nextRole === "founder") {
        await loadAllCloudData();
      } else {
        await ensureCoachProfile(currentSession.user);
        await loadCloudData(currentSession.user.id);
      }
    } catch (error) {
      console.error("Supabase role/data load failed", error);
      alert("Could not load MindPitch data from Supabase. Check player email, user role, RLS policies, and console logs.");
    } finally {
      setDataLoading(false);
    }
  }

  async function ensureCoachProfile(user) {
    if (!supabase || !user) return;
    const { error } = await supabase.from("coach_profiles").upsert({
      id: user.id,
      email: user.email,
    });
    if (error) console.error("Coach profile upsert failed", error);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthLoading(false);
      loadStorage();
      return;
    }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session || null);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession || null);
      setAuthLoading(false);
    });

    return () => {
      active = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    if (session?.user) {
      loadSessionData(session);
    } else {
      setRole("coach");
      setPlayers([]);
      setAssignments([]);
      setSavedModules([]);
      setSelectedPlayer(null);
      setViewingAs(null);
      setActiveModule(null);
    }
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (players.length === 0) {
      setViewingAs(null);
    } else if (!viewingAs || !players.some(p => p.id === viewingAs.id)) {
      setViewingAs(players[0]);
    }
  }, [players, viewingAs]);

  async function addPlayer(p) {
    if (supabase && session?.user) {
      const { data, error } = await supabase
        .from("players")
        .insert(appPlayerToDb(p, session.user.id))
        .select()
        .single();
      if (error) throw error;
      const saved = dbPlayerToApp(data);
      setPlayers(prev => [...prev, saved]);
      setShowAddPlayer(false);
      return saved;
    }

    const u = [...players, p];
    setPlayers(u);
    saveStorage(u, assignments);
    setShowAddPlayer(false);
    return p;
  }

  async function editPlayer(updated) {
    if (supabase && session?.user) {
      const { data, error } = await supabase
        .from("players")
        .update(appPlayerToDb(updated, session.user.id))
        .eq("id", updated.id)
        .eq("coach_id", session.user.id)
        .select()
        .single();
      if (error) throw error;
      const saved = dbPlayerToApp(data);
      setPlayers(prev => prev.map(p => p.id === saved.id ? saved : p));
      setEditingPlayer(null);
      setSelectedPlayer(saved);
      if (viewingAs?.id === saved.id) setViewingAs(saved);
      return saved;
    }

    const u = players.map(p => p.id === updated.id ? updated : p);
    setPlayers(u);
    saveStorage(u, assignments);
    setEditingPlayer(null);
    setSelectedPlayer(updated);
    if (viewingAs?.id === updated.id) setViewingAs(updated);
    return updated;
  }

  async function removePlayer(player) {
    if (supabase && session?.user) {
      const { error } = await supabase
        .from("players")
        .delete()
        .eq("id", player.id)
        .eq("coach_id", session.user.id);
      if (error) throw error;
      setPlayers(prev => {
        const next = prev.filter(p => p.id !== player.id);
        if (viewingAs?.id === player.id) setViewingAs(next[0] || null);
        return next;
      });
      setAssignments(prev => prev.filter(a => a.playerId !== player.id));
      setSelectedPlayer(null);
      return;
    }

    const u = players.filter(p => p.id !== player.id);
    const ua = assignments.filter(a => a.playerId !== player.id);
    setPlayers(u);
    setAssignments(ua);
    saveStorage(u, ua);
    setSelectedPlayer(null);
    if (viewingAs?.id === player.id && u.length) setViewingAs(u[0]);
  }

  async function addAssignment(a) {
    if (supabase && session?.user) {
      const { data, error } = await supabase
        .from("assignments")
        .insert(appAssignmentToDb(a, session.user.id))
        .select()
        .single();
      if (error) throw error;
      const saved = dbAssignmentToApp(data);
      setAssignments(prev => [...prev, saved]);
      return saved;
    }

    const u = [...assignments, a];
    setAssignments(u);
    saveStorage(players, u);
    return a;
  }

  async function updateAssignment(updated) {
    if (supabase && session?.user && role === "player") {
      const { data, error } = await supabase
        .from("assignments")
        .update({
          status: updated.status,
          responses: updated.responses || [],
          completed_at: updated.completedAt || null,
        })
        .eq("id", updated.id)
        .select()
        .single();
      if (error) throw error;
      const saved = dbAssignmentToApp(data);
      setAssignments(prev => prev.map(a => a.id === saved.id ? saved : a));
      return saved;
    }

    if (supabase && session?.user) {
      const { data, error } = await supabase
        .from("assignments")
        .update(appAssignmentToDb(updated, session.user.id))
        .eq("id", updated.id)
        .eq("coach_id", session.user.id)
        .select()
        .single();
      if (error) throw error;
      const saved = dbAssignmentToApp(data);
      setAssignments(prev => prev.map(a => a.id === saved.id ? saved : a));
      return saved;
    }

    const all = assignments.map(a => a.id === updated.id ? updated : a);
    setAssignments(all);
    saveStorage(players, all);
    return updated;
  }

  async function saveModule(mod) {
    const withId = { ...mod, id: mod.id || "saved-" + Date.now(), savedAt: new Date().toISOString().split("T")[0] };

    if (supabase && session?.user) {
      const { data, error } = await supabase
        .from("ai_modules")
        .insert({
          coach_id: session.user.id,
          title: withId.title,
          situation: withId.situation,
          questions: withId.questions || [],
          habit: typeof withId.habit === "string" ? withId.habit : withId.habit?.title || null,
          coach_note: withId.coachNote || withId.coach_note || null,
          raw_module: withId,
        })
        .select()
        .single();
      if (error) throw error;
      const saved = dbSavedModuleToApp(data);
      setSavedModules(prev => [saved, ...prev]);
      return saved;
    }

    const u = [withId, ...savedModules];
    setSavedModules(u);
    saveStorage(players, assignments, u);
    return withId;
  }

  async function deleteModule(id) {
    if (supabase && session?.user) {
      const { error } = await supabase
        .from("ai_modules")
        .delete()
        .eq("id", id)
        .eq("coach_id", session.user.id);
      if (error) throw error;
      setSavedModules(prev => prev.filter(m => m.id !== id));
      return;
    }

    const u = savedModules.filter(m => m.id !== id);
    setSavedModules(u);
    saveStorage(players, assignments, u);
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
  }

  const isCoach = role === "coach";
  const roleOptions = role === "player" ? [["player", "Player view"]] : ROLES;

  if (authLoading) {
    return (
      <div style={s.app}>
        <div style={s.navBar}><div style={s.logo}><div style={s.logoDot} />MindPitch</div></div>
        <div style={{ ...s.screen, textAlign: "center", paddingTop: 80 }}>
          <div style={{ ...s.muted }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (isSupabaseConfigured && !session) {
    return <AuthScreen />;
  }

  return (
    <div style={s.app}>
      <div style={s.navBar}>
        <div style={s.logo}><div style={s.logoDot} />MindPitch</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <select
            value={role}
            onChange={e => { setRole(e.target.value); setCoachTab("dashboard"); setPlayerTab("modules"); setSelectedPlayer(null); setActiveModule(null); }}
            style={{ ...s.navRole, color: C.white, outline: "none" }}
            aria-label="Switch MindPitch view"
          >
            {roleOptions.map(([r, label]) => (
              <option
                key={r}
                value={r}
                style={{ color: "#111111", backgroundColor: "#ffffff" }}
              >
                {label}
              </option>
            ))}
          </select>
          {isSupabaseConfigured && session && (
            <button style={s.navRole} onClick={signOut}>Sign out</button>
          )}
        </div>
      </div>
      {dataLoading && (
        <div style={{ position: "fixed", top: 57, left: "50%", transform: "translateX(-50%)", maxWidth: 480, width: "100%", background: C.greenLight, color: C.greenDark, fontSize: 12, textAlign: "center", padding: "6px 0", zIndex: 120 }}>
          Syncing roster...
        </div>
      )}

      {isCoach && (
        <>
          {selectedPlayer ? (<PlayerDetail player={selectedPlayer} assignments={assignments} onBack={() => setSelectedPlayer(null)} onAssignModule={() => { setSelectedPlayer(null); setCoachTab("builder"); }} onEdit={p => setEditingPlayer(p)} onRemove={p => removePlayer(p)} />)
            : coachTab === "dashboard" ? (<CoachDashboard players={players} assignments={assignments} onNav={setCoachTab} onViewPlayer={p => setSelectedPlayer(p)} />)
              : coachTab === "roster" ? (<CoachRoster players={players} assignments={assignments} onViewPlayer={p => setSelectedPlayer(p)} onAddPlayer={() => setShowAddPlayer(true)} />)
                : coachTab === "summary" ? (<CoachSummary players={players} assignments={assignments} />)
                  : (<ModuleBuilder players={players} savedModules={savedModules} onSaveModule={saveModule} onDeleteModule={deleteModule} onAssigned={a => addAssignment(a)} onBack={() => setCoachTab("dashboard")} />)}
          <div style={s.tabBar}>
            {[["dashboard", "home", "Dashboard"], ["roster", "users", "Roster"], ["summary", "check", "Summary"], ["builder", "brain", "Builder"]].map(([tab, icon, label]) => (
              <button key={tab} style={s.tab(coachTab === tab)} onClick={() => { setCoachTab(tab); setSelectedPlayer(null); }}>
                <Icon name={icon} size={20} color={coachTab === tab ? C.green : C.gray} /><span style={s.tabLabel(coachTab === tab)}>{label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {role === "player" && (
        <>
          {activeModule ? (
            <ModuleExperience assignment={activeModule.assignment} module={activeModule.module} player={viewingAs} onComplete={updated => { updateAssignment(updated); setActiveModule(null); }} onBack={() => setActiveModule(null)} />
          ) : (
            <>
              <div style={{ ...s.tabBar, top: 57, bottom: "auto", borderBottom: `1px solid ${C.grayMid}30`, borderTop: "none" }}>
                <div style={{ display: "flex", width: "100%", padding: "4px 8px", gap: 12, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                  {players.map(p => (
                    <div key={p.id} style={{ minWidth: 64, flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", padding: "6px 0" }} onClick={() => setViewingAs(p)}>
                      <div style={{ ...s.avatar(p.avatarColor, p.avatarText, viewingAs?.id === p.id ? 32 : 28), border: viewingAs?.id === p.id ? `2px solid ${C.green}` : "none" }}>{p.avatar}</div>
                      <span style={{ fontSize: 9, color: viewingAs?.id === p.id ? C.green : C.gray, fontWeight: viewingAs?.id === p.id ? 600 : 400 }}>{p.name.split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ paddingTop: 60 }}>
                {!viewingAs ? (
                  <div style={s.screen}>
                    <div style={s.card}>
                      <div style={{ ...s.cardPad, textAlign: "center", padding: "28px 18px" }}>
                        <div style={{ ...s.h2, marginBottom: 8 }}>No players yet</div>
                        <div style={s.muted}>Add players from Coach view → Roster before using Player view.</div>
                      </div>
                    </div>
                  </div>
                ) : playerTab === "modules" ? (
                  <PlayerModuleList player={viewingAs} assignments={assignments} onStartModule={(a, mod) => setActiveModule({ assignment: a, module: mod })} />
                ) : (
                  <OpenCoachChat player={viewingAs} assignments={assignments} />
                )}
              </div>
              <div style={s.tabBar}>
                {[["modules", "ball", "My modules"], ["chat", "chat", "AI coach"]].map(([tab, icon, label]) => (
                  <button key={tab} style={s.tab(playerTab === tab)} onClick={() => setPlayerTab(tab)}>
                    <Icon name={icon} size={20} color={playerTab === tab ? C.green : C.gray} /><span style={s.tabLabel(playerTab === tab)}>{label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}


      {role === "director" && (<DirectorDashboard players={players} assignments={assignments} />)}
      {role === "founder" && (<FounderDashboard players={players} assignments={assignments} savedModules={savedModules} />)}

      {showAddPlayer && <AddPlayerModal onAdd={addPlayer} onClose={() => setShowAddPlayer(false)} />}
      {editingPlayer && <EditPlayerModal player={editingPlayer} onSave={editPlayer} onClose={() => setEditingPlayer(null)} />}
    </div>
  );
}
