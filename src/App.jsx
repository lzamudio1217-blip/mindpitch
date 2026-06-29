import { useState, useEffect, useRef } from "react";

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
  { id:"mistake-recovery", title:"Mistake recovery", theme:"Mistake recovery", color:C.green, colorLight:C.greenLight, colorDark:C.greenDark, time:"5–7 min",
    situation:"You've just made a mistake in a game — a bad pass, a missed tackle, a shot that went wide. You can feel yourself tightening up. Your next touch feels heavy. Part of you wants to hide. The team needs you, but right now you're in your own head.",
    questions:["What does it feel like in your body right after you make a mistake? Where do you feel it?","What would you say to a teammate who just made that same mistake? Would you say the same thing to yourself?","Name one player you respect — how do they respond after a mistake? What do you notice about them?","What does the next 5 minutes look like if you decide to reset right now and play free?"],
    habit:{ title:"The flush it routine", body:"After every mistake in training or a game: one deep breath, clap twice, say one word that brings you back. Practice it until it's automatic." }},
  { id:"confidence-slump", title:"Confidence slumps", theme:"Confidence", color:C.blue, colorLight:C.blueLight, colorDark:"#0C447C", time:"5–7 min",
    situation:"You used to be one of the first to get on the ball. Lately something feels different. You're second-guessing yourself before you touch it. You're making the safe pass instead of the risky one. You tell yourself you're being smart — but deep down you know that's not why.",
    questions:["Think back to a game where you felt completely free — describe what that felt like. What was different?","Right now, are you trying to play well — or are you trying not to fail? Be honest.","What's one specific action you can take in the next game that a confident version of you would do?","What would your teammates say about you if they described you at your best?"],
    habit:{ title:"The one brave action", body:"Before every session this week, decide on ONE specific brave action. Write it in your phone before you arrive. After: did you attempt it?" }},
  { id:"bench-mentality", title:"Bench mentality", theme:"Bench", color:C.purple, colorLight:C.purpleLight, colorDark:"#3C3489", time:"5–7 min",
    situation:"You've been benched or had your minutes reduced. Part of you is frustrated. You feel like you should be playing. When you sit down, you can feel yourself going quiet — arms crossed, eyes down, disconnected from what's happening on the field.",
    questions:["What does being on the bench give you the opportunity to see that you can't from the field?","How does your attitude on the bench affect your teammates on the field right now?","What's one thing you can do in the next 10 minutes to help the team win from where you are?","What would a player you look up to do in this situation?"],
    habit:{ title:"The scout mindset", body:"When on the bench, pick one opponent to study and one pattern to spot. It keeps you sharp and coaches notice it more than you think." }},
  { id:"new-player", title:"New to the team", theme:"Belonging", color:C.amber, colorLight:C.amberLight, colorDark:"#633806", time:"5–7 min",
    situation:"You're the new player. Everyone else already knows each other — their jokes, their routines, their way of doing things. You're trying hard but also watching, measuring yourself against players who've been here longer.",
    questions:["What's the hardest part about being new to this team so far — be specific?","Think of a time you felt really comfortable on a team. What made it feel that way?","As a player, what's one thing you bring to a team that you're confident about, even right now?","What would it feel like to be fully settled here — describe what a normal training session looks like when you're truly comfortable?"],
    habit:{ title:"The one connection rule", body:"In every session this week, make one genuine connection with a teammate — not just about soccer. Use their name. Learn one thing about them." }},
  { id:"pre-game-anxiety", title:"Pre-game anxiety", theme:"Pressure", color:C.coral, colorLight:C.coralLight, colorDark:"#712B13", time:"5–7 min",
    situation:"Big game today. Tournament, rivalry, must-win. You can feel it in your body already — tight chest, restless legs, too many thoughts. In warmup your touch feels off. You start second-guessing things you normally do automatically.",
    questions:["What does nervous actually feel like in your body right now — where exactly do you feel it?","Is nervous always a bad thing, or can it mean you're ready? What's the difference?","What's the ONE thing you personally can control in the first 5 minutes of this game?","What would you want your teammates to see from you today — describe it specifically?"],
    habit:{ title:"Reframe nerves as readiness", body:"When you feel nervous, say to yourself: 'my body is getting ready.' Then name one action you'll take in the first minute. Preparation, not suppression." }},
];

const POSITIONS = ["Goalkeeper","Center back","Full back","Defensive mid","Central mid","Attacking mid","Winger","Striker"];
const AGE_GROUPS = ["U10","U11","U12","U13","U14","U15","U16","U17","U18"];

const DEMO_PLAYERS = [
  { id:"p1", name:"Marcus T.", position:"Goalkeeper", age:"U14", avatar:"MT", avatarColor:C.greenLight, avatarText:C.greenDark },
  { id:"p2", name:"Jake M.", position:"Striker", age:"U14", avatar:"JM", avatarColor:C.blueLight, avatarText:"#0C447C" },
  { id:"p3", name:"Dylan K.", position:"Center back", age:"U14", avatar:"DK", avatarColor:C.amberLight, avatarText:"#633806" },
  { id:"p4", name:"Sofia R.", position:"Central mid", age:"U14", avatar:"SR", avatarColor:C.purpleLight, avatarText:"#3C3489" },
  { id:"p5", name:"Aiden L.", position:"Central mid", age:"U14", avatar:"AL", avatarColor:C.coralLight, avatarText:"#712B13" },
];

const DEMO_ASSIGNMENTS = [
  { id:"a1", playerId:"p1", moduleId:"mistake-recovery", assignedAt:"2026-06-01", status:"completed", responses:["I feel it in my chest and stomach, like everything tightens up.","I'd tell a teammate it's fine and to move on. I never say that to myself though.","Manuel Neuer — he just walks back to his post, no drama. Looks like it didn't happen.","I'd call the line louder and be first to the next cross."], completedAt:"2026-06-03" },
  { id:"a2", playerId:"p2", moduleId:"confidence-slump", assignedAt:"2026-06-03", status:"in-progress", responses:["Tournament last month — I just played, didn't think about it. Got two assists.","Trying not to fail. I know that's it.","",""], completedAt:null },
  { id:"a3", playerId:"p3", moduleId:"new-player", assignedAt:"2026-06-05", status:"assigned", responses:[], completedAt:null },
  { id:"a4", playerId:"p4", moduleId:"bench-mentality", assignedAt:"2026-05-28", status:"completed", responses:["I can see the shape better — the left side kept getting exposed.","Honestly my body language was bad. I felt it pulling the team down.","I started tracking the right back and showed the coach after.","She'd be the first one up cheering and the loudest voice when she came on."], completedAt:"2026-05-30" },
];

const s = {
  app:{ fontFamily:"'Inter',-apple-system,sans-serif", background:C.offwhite, minHeight:"100vh", maxWidth:480, margin:"0 auto", position:"relative" },
  navBar:{ background:C.navy, padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 },
  logo:{ color:C.white, fontWeight:600, fontSize:17, display:"flex", alignItems:"center", gap:8 },
  logoDot:{ width:8, height:8, borderRadius:"50%", background:C.green },
  navRole:{ fontSize:12, color:C.grayMid, cursor:"pointer", padding:"4px 10px", borderRadius:20, border:"1px solid rgba(255,255,255,0.15)", background:"transparent" },
  screen:{ padding:"16px 16px 90px" },
  card:{ background:C.white, borderRadius:14, border:`0.5px solid ${C.grayMid}30`, marginBottom:12, overflow:"hidden" },
  cardPad:{ padding:"14px 16px" },
  label:{ fontSize:11, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase", color:C.textMuted, marginBottom:6 },
  h1:{ fontSize:22, fontWeight:600, color:C.navy, marginBottom:4 },
  h2:{ fontSize:17, fontWeight:600, color:C.navy },
  body:{ fontSize:14, color:C.text, lineHeight:1.6 },
  muted:{ fontSize:13, color:C.textMuted, lineHeight:1.55 },
  badge:(bg,text)=>({ fontSize:11, fontWeight:500, padding:"3px 9px", borderRadius:20, background:bg, color:text, display:"inline-block" }),
  btn:(bg,text,full)=>({ background:bg, color:text, border:"none", borderRadius:10, padding:"11px 18px", fontSize:14, fontWeight:500, cursor:"pointer", width:full?"100%":"auto", display:full?"block":"inline-block", textAlign:"center" }),
  btnOutline:(full)=>({ background:"transparent", color:C.navy, border:`1px solid ${C.grayMid}`, borderRadius:10, padding:"11px 18px", fontSize:14, fontWeight:500, cursor:"pointer", width:full?"100%":"auto" }),
  input:{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1px solid ${C.grayMid}`, fontSize:14, color:C.text, background:C.white, boxSizing:"border-box", marginBottom:10 },
  textarea:{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1px solid ${C.grayMid}`, fontSize:14, color:C.text, background:C.white, boxSizing:"border-box", resize:"vertical", minHeight:90, lineHeight:1.6 },
  tabBar:{ display:"flex", background:C.white, borderTop:`1px solid ${C.grayMid}30`, position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, zIndex:100 },
  tab:(active)=>({ flex:1, padding:"10px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer", background:"transparent", border:"none", color:active?C.green:C.gray }),
  tabLabel:(active)=>({ fontSize:10, fontWeight:active?600:400, color:active?C.green:C.gray }),
  avatar:(bg,text,size=36)=>({ width:size, height:size, borderRadius:"50%", background:bg, color:text, display:"flex", alignItems:"center", justifyContent:size>40?"center":"center", fontSize:size>40?15:12, fontWeight:600, flexShrink:0 }),
  row:{ display:"flex", alignItems:"center", gap:10 },
  divider:{ height:"0.5px", background:`${C.grayMid}40`, margin:"0 16px" },
  statusDot:(color)=>({ width:8, height:8, borderRadius:"50%", background:color, flexShrink:0 }),
  metricGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 },
  metric:{ background:C.white, borderRadius:12, padding:"12px 14px", border:`0.5px solid ${C.grayMid}30` },
  metricVal:{ fontSize:26, fontWeight:700, color:C.navy },
  metricLabel:{ fontSize:12, color:C.textMuted, marginTop:2 },
  section:{ marginBottom:20 },
  sectionTitle:{ fontSize:13, fontWeight:600, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:10 },
  chipRow:{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 },
  chip:(selected)=>({ fontSize:12, padding:"5px 12px", borderRadius:20, border:`1px solid ${selected?C.green:C.grayMid}`, background:selected?C.greenLight:"transparent", color:selected?C.greenDark:C.gray, cursor:"pointer" }),
};

function statusColor(s){ return s==="completed"?C.green:s==="in-progress"?C.amber:C.grayMid; }
function statusLabel(s){ return s==="completed"?"Complete":s==="in-progress"?"In progress":"Assigned"; }
function getModule(id){ return MODULES_LIBRARY.find(m=>m.id===id); }
function getPlayer(id,players){ return players.find(p=>p.id===id); }
function completionRate(assignments){ if(!assignments.length)return 0; return Math.round(assignments.filter(a=>a.status==="completed").length/assignments.length*100); }

const SYSTEM_PROMPT = (player) => `You are a mental performance coach inside MindPitch, a youth soccer mentality app. You are coaching ${player.name}, a ${player.age} ${player.position}.

Your coaching style is: direct, focused, and challenging. You don't coddle players. You ask sharp follow-up questions that make them think harder. You use specific soccer situations. You're brief — responses are 2-4 sentences max unless the player needs more. You never give generic advice. Every response is grounded in what the player actually said. You challenge vague answers: "that's not specific enough — give me an example." You affirm genuine insight but push past surface-level responses. You are not a therapist. You are a coach who cares about this player's development and doesn't let them off the hook.`;

const Icon = ({ name, size=20, color="currentColor" }) => {
  const icons = {
    home:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    users:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    brain:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96-.44 2.5 2.5 0 01-2.96-3.08 3 3 0 01-.34-5.58 2.5 2.5 0 013.32-3.97A2.5 2.5 0 019.5 2z"/><path d="M14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96-.44 2.5 2.5 0 002.96-3.08 3 3 0 00.34-5.58 2.5 2.5 0 00-3.32-3.97A2.5 2.5 0 0014.5 2z"/></svg>,
    plus:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    check:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    arrow:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    back:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
    ball:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/><path d="M2 12h20"/></svg>,
    chat:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    send:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    bolt:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  };
  return icons[name]||null;
};

function ProgressBar({ value, color=C.green, height=4 }) {
  return <div style={{ height, background:`${C.grayMid}40`, borderRadius:height }}><div style={{ width:`${Math.min(value,100)}%`, height, background:color, borderRadius:height, transition:"width 0.4s" }}/></div>;
}

function Avatar({ player, size=36 }) {
  return <div style={s.avatar(player.avatarColor, player.avatarText, size)}>{player.avatar}</div>;
}

// ── AI Chat Component (reused for both debrief and open chat) ─────────────────
function AIChat({ player, initialMessages=[], systemContext="", placeholder="Talk to your coach...", accentColor=C.green, onBack=null, backLabel="Back" }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg = { role:"user", content:text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:1000,
          system: SYSTEM_PROMPT(player) + (systemContext ? "\n\n" + systemContext : ""),
          messages: updated.map(m=>({ role:m.role, content:m.content }))
        })
      });
      const data = await res.json();
      const reply = data.content?.find(b=>b.type==="text")?.text || "I didn't catch that. Try again.";
      setMessages(prev=>[...prev, { role:"assistant", content:reply }]);
    } catch(e) {
      setError("Connection issue — check your API key and try again.");
    }
    setLoading(false);
    setTimeout(()=>inputRef.current?.focus(), 100);
  }

  function handleKey(e) { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); send(); } }

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", minHeight:"100vh" }}>
      {onBack && (
        <div style={{ background:C.navy, padding:"14px 16px", display:"flex", alignItems:"center", gap:10 }}>
          <button style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex" }} onClick={onBack}>
            <Icon name="back" size={20} color={C.white}/>
          </button>
          <div style={{ color:C.white, fontSize:15, fontWeight:500 }}>{backLabel}</div>
          <div style={{ marginLeft:"auto" }}><span style={s.badge(accentColor+"25", accentColor)}>AI Coach</span></div>
        </div>
      )}

      <div style={{ flex:1, overflowY:"auto", padding:"16px", paddingBottom:80 }}>
        {messages.length === 0 && (
          <div style={{ textAlign:"center", padding:"40px 20px 20px" }}>
            <div style={{ width:52, height:52, borderRadius:"50%", background:accentColor+"20", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
              <Icon name="bolt" size={24} color={accentColor}/>
            </div>
            <div style={{ fontSize:16, fontWeight:600, color:C.navy, marginBottom:6 }}>Your mental performance coach</div>
            <div style={{ fontSize:13, color:C.textMuted, lineHeight:1.6 }}>Direct. Focused. No fluff. Ask anything about your game, your mindset, or what's going on in your head.</div>
          </div>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <div key={i} style={{ display:"flex", justifyContent:isUser?"flex-end":"flex-start", marginBottom:10 }}>
              {!isUser && (
                <div style={{ width:28, height:28, borderRadius:"50%", background:accentColor, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginRight:8, alignSelf:"flex-end" }}>
                  <Icon name="bolt" size={13} color={C.white}/>
                </div>
              )}
              <div style={{ maxWidth:"80%", padding:"10px 13px", borderRadius:isUser?"14px 14px 4px 14px":"14px 14px 14px 4px", background:isUser?accentColor:C.white, color:isUser?C.white:C.text, fontSize:14, lineHeight:1.6, boxShadow:`0 1px 3px rgba(0,0,0,0.08)`, border:isUser?"none":`0.5px solid ${C.grayMid}30` }}>
                {msg.content}
              </div>
              {isUser && (
                <div style={{ width:28, height:28, borderRadius:"50%", background:player.avatarColor, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginLeft:8, alignSelf:"flex-end", fontSize:10, fontWeight:600, color:player.avatarText }}>
                  {player.avatar}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div style={{ display:"flex", alignItems:"flex-end", marginBottom:10 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:accentColor, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginRight:8 }}>
              <Icon name="bolt" size={13} color={C.white}/>
            </div>
            <div style={{ padding:"10px 14px", borderRadius:"14px 14px 14px 4px", background:C.white, border:`0.5px solid ${C.grayMid}30` }}>
              <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                {[0,1,2].map(i=><div key={i} style={{ width:6, height:6, borderRadius:"50%", background:accentColor, animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite`, opacity:0.7 }}/>)}
              </div>
            </div>
          </div>
        )}
        {error && <div style={{ fontSize:12, color:"#E24B4A", textAlign:"center", padding:"8px 0" }}>{error}</div>}
        <div ref={bottomRef}/>
      </div>

      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:C.white, borderTop:`1px solid ${C.grayMid}30`, padding:"10px 12px", zIndex:50 }}>
        <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
          <textarea ref={inputRef} style={{ ...s.textarea, flex:1, minHeight:40, maxHeight:100, marginBottom:0, borderColor:input.trim()?accentColor:C.grayMid, borderRadius:12, padding:"10px 12px", fontSize:14, resize:"none" }} placeholder={placeholder} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey} rows={1}/>
          <button style={{ width:40, height:40, borderRadius:10, background:input.trim()?accentColor:C.grayLight, border:"none", cursor:input.trim()?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }} onClick={send} disabled={!input.trim()||loading}>
            <Icon name="send" size={16} color={input.trim()?C.white:C.grayMid}/>
          </button>
        </div>
        <div style={{ fontSize:10, color:C.textMuted, textAlign:"center", marginTop:6 }}>Press Enter to send</div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}

// ── Post-Module Debrief ───────────────────────────────────────────────────────
function ModuleDebrief({ player, module: mod, responses, onBack }) {
  const contextSummary = `The player just completed the "${mod.title}" module. Here are their responses:\n\n` +
    mod.questions.map((q,i) => `Q: ${q}\nA: ${responses[i]||"(no response)"}`).join("\n\n") +
    `\n\nYour job: open a debrief conversation. Pick the most revealing or vague response and push them on it. Start with one sharp, direct question — not a compliment. Don't summarize what they said back to them. Engage with it.`;

  const openingContext = `Context: ${player.name} just finished the "${mod.title}" module. Their responses are in your context. Start the debrief now with a single direct question targeting the response that needs the most work.`;

  const [started, setStarted] = useState(false);
  const [initialAI, setInitialAI] = useState([]);
  const [kicking, setKicking] = useState(false);

  async function startDebrief() {
    setKicking(true);
    try {
      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:400,
          system: SYSTEM_PROMPT(player) + "\n\n" + contextSummary,
          messages:[{ role:"user", content: openingContext }]
        })
      });
      const data = await res.json();
      const reply = data.content?.find(b=>b.type==="text")?.text || "Good work finishing the module. Let's dig into one of your answers. Which response do you feel was the most honest?";
      setInitialAI([{ role:"assistant", content:reply }]);
    } catch {
      setInitialAI([{ role:"assistant", content:`Good work finishing that module, ${player.name.split(" ")[0]}. Let's not move on too fast. Which answer felt the hardest to write — and why?` }]);
    }
    setStarted(true);
    setKicking(false);
  }

  if (!started) return (
    <div style={s.screen}>
      <button style={{ background:"none", border:"none", cursor:"pointer", ...s.row, marginBottom:20, padding:0 }} onClick={onBack}>
        <Icon name="back" size={20} color={C.navy}/><span style={{ fontSize:14, color:C.navy }}>Back to modules</span>
      </button>
      <div style={{ textAlign:"center", padding:"20px 0 24px" }}>
        <div style={{ width:56, height:56, borderRadius:"50%", background:C.greenLight, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
          <Icon name="check" size={24} color={C.green}/>
        </div>
        <div style={{ ...s.h1, marginBottom:4 }}>Module complete</div>
        <div style={s.muted}>Good work, {player.name.split(" ")[0]}.</div>
      </div>

      <div style={{ ...s.card, borderLeft:`3px solid ${C.amber}` }}>
        <div style={s.cardPad}>
          <div style={{ ...s.label, color:"#633806", marginBottom:6 }}>Your mental habit this week</div>
          <div style={{ fontWeight:600, fontSize:15, color:C.navy, marginBottom:6 }}>{mod.habit?.title}</div>
          <div style={{ fontSize:13, color:C.textMuted, lineHeight:1.6 }}>{mod.habit?.body}</div>
        </div>
      </div>

      <div style={{ ...s.card, marginTop:4 }}>
        <div style={s.cardPad}>
          <div style={s.label}>Your responses</div>
          {responses.map((r,i)=>r?(
            <div key={i} style={{ marginBottom:12 }}>
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:3 }}>Q{i+1}: {mod.questions[i].slice(0,55)}...</div>
              <div style={{ fontSize:13, color:C.text, fontStyle:"italic" }}>"{r}"</div>
            </div>
          ):null)}
        </div>
      </div>

      <div style={{ background:C.navy, borderRadius:14, padding:"18px 16px", marginTop:4 }}>
        <div style={{ ...s.row, marginBottom:10 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:C.green, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="bolt" size={16} color={C.white}/>
          </div>
          <div>
            <div style={{ color:C.white, fontWeight:600, fontSize:14 }}>Talk to your AI coach</div>
            <div style={{ color:C.grayMid, fontSize:12 }}>Direct debrief on what you just wrote</div>
          </div>
        </div>
        <div style={{ fontSize:13, color:C.grayMid, lineHeight:1.6, marginBottom:14 }}>
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
    .filter(a=>a.playerId===player.id && a.status==="completed")
    .map(a=>{ const m=getModule(a.moduleId); return m?`Completed: ${m.title}`:""; })
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
    />
  );
}

// ── Player: Module List ───────────────────────────────────────────────────────
function PlayerModuleList({ player, assignments, onStartModule }) {
  const myAssignments = assignments.filter(a=>a.playerId===player.id);
  const pending = myAssignments.filter(a=>a.status!=="completed");
  const done = myAssignments.filter(a=>a.status==="completed");
  return (
    <div style={s.screen}>
      <div style={{ background:C.navy, borderRadius:14, padding:"18px 16px", marginBottom:20 }}>
        <div style={s.row}>
          <Avatar player={player} size={44}/>
          <div><div style={{ color:C.white, fontWeight:600, fontSize:17 }}>{player.name}</div><div style={{ color:C.grayMid, fontSize:13 }}>{player.position} · {player.age}</div></div>
        </div>
        <div style={{ display:"flex", gap:8, marginTop:12 }}>
          {[["Assigned",myAssignments.length,C.white],["Completed",done.length,C.green],["Pending",pending.length,C.amber]].map(([lbl,val,col])=>(
            <div key={lbl} style={{ flex:1, background:"rgba(255,255,255,0.08)", borderRadius:8, padding:"8px 10px" }}>
              <div style={{ color:C.grayMid, fontSize:11 }}>{lbl}</div>
              <div style={{ color:col, fontWeight:600, fontSize:18 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
      {pending.length>0&&(
        <div style={s.section}>
          <div style={s.sectionTitle}>Your modules</div>
          {pending.map(a=>{
            const mod=getModule(a.moduleId)||a.moduleData; if(!mod)return null;
            const progress=a.responses.filter(Boolean).length; const total=mod.questions?.length||4;
            return (
              <div key={a.id} style={{ ...s.card, borderLeft:`3px solid ${mod.color}` }}>
                <div style={s.cardPad}>
                  <div style={{ ...s.row, marginBottom:10 }}>
                    <div style={{ flex:1 }}>
                      <span style={s.badge(mod.colorLight,mod.colorDark)}>{mod.theme}</span>
                      <div style={{ fontWeight:600, fontSize:15, color:C.navy, marginTop:4 }}>{mod.title}</div>
                    </div>
                  </div>
                  {progress>0&&(<div style={{ marginBottom:10 }}><div style={{ fontSize:12, color:C.textMuted, marginBottom:4 }}>{progress} of {total} questions answered</div><ProgressBar value={progress/total*100} color={mod.color}/></div>)}
                  <button style={s.btn(mod.color,C.white,true)} onClick={()=>onStartModule(a,mod)}>
                    {progress>0?"Continue module":"Start module"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {done.length>0&&(
        <div style={s.section}>
          <div style={s.sectionTitle}>Completed</div>
          {done.map(a=>{
            const mod=getModule(a.moduleId)||a.moduleData; if(!mod)return null;
            return (
              <div key={a.id} style={{ ...s.card, opacity:0.75 }}>
                <div style={s.cardPad}>
                  <div style={s.row}>
                    <div style={{ flex:1 }}><div style={{ fontWeight:600, fontSize:14, color:C.navy }}>{mod.title}</div><div style={{ fontSize:12, color:C.textMuted }}>Completed {a.completedAt}</div></div>
                    <Icon name="check" size={18} color={C.green}/>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {myAssignments.length===0&&(
        <div style={{ textAlign:"center", padding:"40px 20px" }}>
          <Icon name="ball" size={36} color={C.grayMid}/>
          <div style={{ ...s.muted, marginTop:12 }}>No modules assigned yet. Check back after your next session.</div>
        </div>
      )}
    </div>
  );
}

// ── Player: Module Experience ─────────────────────────────────────────────────
function ModuleExperience({ assignment, module: mod, player, onComplete, onBack }) {
  const [step, setStep] = useState("intro");
  const [qIndex, setQIndex] = useState(()=>{ const f=assignment.responses.findIndex(r=>!r); return f===-1?0:f; });
  const [responses, setResponses] = useState(()=>{ const r=[...(assignment.responses||[])]; while(r.length<mod.questions.length)r.push(""); return r; });
  const [current, setCurrent] = useState(responses[qIndex]||"");
  const [finalResponses, setFinalResponses] = useState([]);
  const total = mod.questions.length;

  function nextQ() {
    const updated=[...responses]; updated[qIndex]=current; setResponses(updated);
    if(qIndex<total-1){ setQIndex(qIndex+1); setCurrent(updated[qIndex+1]||""); }
    else { setFinalResponses(updated); setStep("debrief"); onComplete({ ...assignment, responses:updated, status:"completed", completedAt:new Date().toISOString().split("T")[0] }); }
  }
  function prevQ() {
    const updated=[...responses]; updated[qIndex]=current; setResponses(updated);
    if(qIndex>0){ setQIndex(qIndex-1); setCurrent(updated[qIndex-1]||""); } else setStep("intro");
  }

  if(step==="intro") return (
    <div style={s.screen}>
      <button style={{ background:"none", border:"none", cursor:"pointer", ...s.row, marginBottom:16, padding:0 }} onClick={onBack}><Icon name="back" size={20} color={C.navy}/><span style={{ fontSize:14, color:C.navy }}>Back</span></button>
      <div style={{ background:mod.color, borderRadius:14, padding:"24px 20px", marginBottom:20, color:C.white }}>
        <span style={{ ...s.badge(mod.colorLight,mod.colorDark), marginBottom:12, display:"inline-block" }}>{mod.theme}</span>
        <div style={{ fontSize:22, fontWeight:700, marginBottom:8 }}>{mod.title}</div>
        <div style={{ fontSize:13, opacity:0.85 }}>{total} questions · {mod.time}</div>
      </div>
      <div style={s.card}><div style={s.cardPad}><div style={s.label}>Your situation</div><div style={{ ...s.body, fontStyle:"italic", color:C.textMuted, lineHeight:1.7 }}>{mod.situation}</div></div></div>
      <div style={{ padding:"12px 0" }}><div style={{ fontSize:14, color:C.textMuted, lineHeight:1.6 }}>Take 5–7 minutes with this. Honest answers only — your AI coach will debrief you when you're done.</div></div>
      <button style={s.btn(mod.color,C.white,true)} onClick={()=>setStep("questions")}>Begin module</button>
    </div>
  );

  if(step==="questions") return (
    <div style={s.screen}>
      <div style={{ marginBottom:20 }}>
        <div style={{ ...s.row, marginBottom:10 }}>
          <button style={{ background:"none", border:"none", cursor:"pointer", padding:0 }} onClick={prevQ}><Icon name="back" size={20} color={C.navy}/></button>
          <div style={{ flex:1, marginLeft:8 }}><ProgressBar value={qIndex/total*100} color={mod.color} height={5}/></div>
          <div style={{ fontSize:13, color:C.textMuted, marginLeft:10, whiteSpace:"nowrap" }}>{qIndex+1} / {total}</div>
        </div>
      </div>
      <div style={{ minHeight:120, marginBottom:20 }}>
        <div style={{ ...s.label, marginBottom:8 }}>Question {qIndex+1}</div>
        <div style={{ fontSize:19, fontWeight:500, color:C.navy, lineHeight:1.5 }}>{mod.questions[qIndex]}</div>
      </div>
      <textarea style={{ ...s.textarea, minHeight:140, fontSize:15, border:`1.5px solid ${mod.color}`, borderRadius:10 }} placeholder="Write your honest answer here..." value={current} onChange={e=>setCurrent(e.target.value)} autoFocus/>
      <button style={{ ...s.btn(current.trim()?mod.color:C.grayMid,C.white,true), marginTop:8, opacity:current.trim()?1:0.6 }} onClick={nextQ} disabled={!current.trim()}>
        {qIndex<total-1?"Next question":"Finish & talk to coach"}
      </button>
    </div>
  );

  if(step==="debrief") return (
    <ModuleDebrief player={player} module={mod} responses={finalResponses} onBack={onBack}/>
  );
}

// ── Coach: Dashboard ──────────────────────────────────────────────────────────
function CoachDashboard({ players, assignments, onNav, onViewPlayer }) {
  const recent=[...assignments].sort((a,b)=>new Date(b.assignedAt)-new Date(a.assignedAt)).slice(0,4);
  const needsAttention=assignments.filter(a=>a.status!=="completed").slice(0,3);
  return (
    <div style={s.screen}>
      <div style={{ marginBottom:20 }}><div style={s.label}>Good evening, Coach</div><div style={s.h1}>Your team overview</div></div>
      <div style={s.metricGrid}>
        <div style={s.metric}><div style={s.metricVal}>{players.length}</div><div style={s.metricLabel}>Players rostered</div></div>
        <div style={s.metric}><div style={s.metricVal}>{completionRate(assignments)}%</div><div style={s.metricLabel}>Completion rate</div></div>
        <div style={s.metric}><div style={s.metricVal}>{assignments.filter(a=>a.status==="completed").length}</div><div style={s.metricLabel}>Modules completed</div></div>
        <div style={s.metric}><div style={s.metricVal}>{assignments.filter(a=>a.status==="assigned").length}</div><div style={s.metricLabel}>Awaiting response</div></div>
      </div>
      <div style={s.section}>
        <div style={s.sectionTitle}>Needs attention</div>
        <div style={s.card}>
          {needsAttention.length===0?(<div style={{ ...s.cardPad, ...s.muted }}>All players are up to date.</div>)
          :needsAttention.map((a,i)=>{ const player=getPlayer(a.playerId,players); const mod=getModule(a.moduleId); if(!player||!mod)return null; return (
            <div key={a.id}>
              {i>0&&<div style={s.divider}/>}
              <div style={{ ...s.cardPad, cursor:"pointer" }} onClick={()=>onViewPlayer(player)}>
                <div style={{ ...s.row, marginBottom:6 }}>
                  <Avatar player={player}/>
                  <div style={{ flex:1 }}><div style={{ fontWeight:600, fontSize:14, color:C.navy }}>{player.name}</div><div style={s.muted}>{mod.title}</div></div>
                  <span style={s.badge(a.status==="in-progress"?C.amberLight:C.grayLight, a.status==="in-progress"?"#633806":C.gray)}>{statusLabel(a.status)}</span>
                </div>
                <ProgressBar value={a.responses.filter(Boolean).length/(mod.questions.length)*100} color={a.status==="in-progress"?C.amber:C.grayMid}/>
              </div>
            </div>
          );})}
        </div>
      </div>
      <div style={s.section}>
        <div style={s.sectionTitle}>Recent activity</div>
        <div style={s.card}>
          {recent.map((a,i)=>{ const player=getPlayer(a.playerId,players); const mod=getModule(a.moduleId); if(!player||!mod)return null; return (
            <div key={a.id}>
              {i>0&&<div style={s.divider}/>}
              <div style={s.cardPad}>
                <div style={s.row}>
                  <div style={s.statusDot(statusColor(a.status))}/>
                  <div style={{ flex:1 }}><div style={{ fontSize:13, color:C.text }}><strong>{player.name}</strong> — {mod.title}</div><div style={{ fontSize:12, color:C.textMuted }}>{a.assignedAt}</div></div>
                  <span style={s.badge(a.status==="completed"?C.greenLight:a.status==="in-progress"?C.amberLight:C.grayLight, statusColor(a.status))}>{statusLabel(a.status)}</span>
                </div>
              </div>
            </div>
          );})}
        </div>
      </div>
      <button style={s.btn(C.navy,C.white,true)} onClick={()=>onNav("builder")}>+ Build a new module with AI</button>
    </div>
  );
}

// ── Coach: Roster ─────────────────────────────────────────────────────────────
function CoachRoster({ players, assignments, onViewPlayer, onAddPlayer }) {
  return (
    <div style={s.screen}>
      <div style={{ ...s.row, marginBottom:20 }}>
        <div><div style={s.label}>U14 Squad</div><div style={s.h1}>Roster</div></div>
        <button style={{ ...s.btn(C.green,C.white), marginLeft:"auto" }} onClick={onAddPlayer}><Icon name="plus" size={16} color={C.white}/></button>
      </div>
      <div style={s.card}>
        {players.map((player,i)=>{ const pa=assignments.filter(a=>a.playerId===player.id); const latest=pa.sort((a,b)=>new Date(b.assignedAt)-new Date(a.assignedAt))[0]; const mod=latest?getModule(latest.moduleId):null; const done=pa.filter(a=>a.status==="completed").length; return (
          <div key={player.id}>
            {i>0&&<div style={s.divider}/>}
            <div style={{ ...s.cardPad, cursor:"pointer" }} onClick={()=>onViewPlayer(player)}>
              <div style={{ ...s.row, marginBottom:mod?8:0 }}>
                <Avatar player={player}/>
                <div style={{ flex:1 }}><div style={{ fontWeight:600, fontSize:14, color:C.navy }}>{player.name}</div><div style={s.muted}>{player.position} · {player.age}</div></div>
                {mod&&<span style={s.badge(mod.colorLight,mod.colorDark)}>{mod.theme}</span>}
              </div>
              {mod&&(<div style={{ ...s.row, gap:8 }}><div style={{ flex:1 }}><ProgressBar value={latest.responses.filter(Boolean).length/mod.questions.length*100} color={mod.color}/></div><div style={{ fontSize:12, color:C.textMuted, whiteSpace:"nowrap" }}>{done} done</div></div>)}
              {!mod&&<div style={{ fontSize:12, color:C.textMuted }}>No modules assigned yet</div>}
            </div>
          </div>
        );})}
      </div>
    </div>
  );
}

// ── Coach: Player Detail ──────────────────────────────────────────────────────
function PlayerDetail({ player, assignments, onBack, onAssignModule }) {
  const pa=assignments.filter(a=>a.playerId===player.id);
  return (
    <div style={s.screen}>
      <button style={{ background:"none", border:"none", cursor:"pointer", ...s.row, marginBottom:16, padding:0 }} onClick={onBack}><Icon name="back" size={20} color={C.navy}/><span style={{ fontSize:14, color:C.navy }}>Back to roster</span></button>
      <div style={{ ...s.card }}>
        <div style={{ background:C.navy, padding:"20px 16px", borderRadius:"14px 14px 0 0" }}>
          <div style={{ ...s.row, marginBottom:12 }}><Avatar player={player} size={48}/><div><div style={{ color:C.white, fontWeight:600, fontSize:18 }}>{player.name}</div><div style={{ color:C.grayMid, fontSize:13 }}>{player.position} · {player.age}</div></div></div>
          <div style={{ display:"flex", gap:8 }}>
            {[["Assigned",pa.length],["Completed",pa.filter(a=>a.status==="completed").length]].map(([l,v])=>(
              <div key={l} style={{ flex:1, background:"rgba(255,255,255,0.08)", borderRadius:8, padding:"10px 12px" }}><div style={{ color:C.grayMid, fontSize:11 }}>{l}</div><div style={{ color:l==="Completed"?C.green:C.white, fontWeight:600, fontSize:20 }}>{v}</div></div>
            ))}
          </div>
        </div>
        <div style={s.cardPad}><button style={s.btn(C.green,C.white,true)} onClick={()=>onAssignModule(player)}>Assign new module</button></div>
      </div>
      {pa.length>0&&(
        <div style={{ marginTop:20 }}>
          <div style={s.sectionTitle}>Module history</div>
          {pa.map(a=>{ const mod=getModule(a.moduleId); if(!mod)return null; return (
            <div key={a.id} style={{ ...s.card, borderLeft:`3px solid ${mod.color}` }}>
              <div style={s.cardPad}>
                <div style={{ ...s.row, marginBottom:8 }}>
                  <div style={{ flex:1 }}><div style={{ fontWeight:600, fontSize:14, color:C.navy }}>{mod.title}</div><div style={{ fontSize:12, color:C.textMuted }}>Assigned {a.assignedAt}</div></div>
                  <span style={s.badge(a.status==="completed"?C.greenLight:a.status==="in-progress"?C.amberLight:C.grayLight, statusColor(a.status))}>{statusLabel(a.status)}</span>
                </div>
                {a.responses.filter(Boolean).length>0&&(
                  <div style={{ background:C.offwhite, borderRadius:8, padding:"10px 12px" }}>
                    <div style={{ fontSize:12, color:C.textMuted, marginBottom:4 }}>Latest response</div>
                    <div style={{ fontSize:13, color:C.text, fontStyle:"italic" }}>"{a.responses.find(Boolean)}"</div>
                  </div>
                )}
              </div>
            </div>
          );})}
        </div>
      )}
    </div>
  );
}

// ── Coach: Module Builder ─────────────────────────────────────────────────────
function ModuleBuilder({ players, onAssigned, onBack }) {
  const [tab, setTab] = useState("library");
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [aiDesc, setAiDesc] = useState(""); const [aiPosition, setAiPosition] = useState("Center back"); const [aiAge, setAiAge] = useState("U14"); const [aiTheme, setAiTheme] = useState("Confidence");
  const [aiResult, setAiResult] = useState(null); const [aiLoading, setAiLoading] = useState(false); const [aiError, setAiError] = useState("");
  const [assigned, setAssigned] = useState(false);
  const themes=["Mistake recovery","Confidence","Pre-game anxiety","Bench mentality","Belonging","Leadership","Pressure"];

  async function generateModule() {
    if(!aiDesc.trim()){ setAiError("Please describe the player situation first."); return; }
    setAiLoading(true); setAiError(""); setAiResult(null);
    try {
      const res=await fetch("/api/chat",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1000, messages:[{ role:"user", content:`You are MindPitch. Generate a personalized youth soccer mentality module for: Position: ${aiPosition}, Age: ${aiAge}, Theme: ${aiTheme}, Description: "${aiDesc}". Respond ONLY with JSON (no markdown): {"title":"...","situation":"2-3 sentence immersive scenario in second person","questions":["q1","q2","q3","q4"],"habit":{"title":"...","body":"..."},"coachNote":"1-2 sentences"}` }] }) });
      const data=await res.json(); const text=data.content?.find(b=>b.type==="text")?.text||""; const clean=text.replace(/```json|```/g,"").trim(); const parsed=JSON.parse(clean);
      setAiResult({ ...parsed, id:"ai-"+Date.now(), color:C.purple, colorLight:C.purpleLight, colorDark:"#3C3489", theme:aiTheme });
    } catch(e){ setAiError("Couldn't generate module — check your API connection."); }
    setAiLoading(false);
  }

  function doAssign(module) {
    if(!selectedPlayer){ setSelectedModule(module); return; }
    const today=new Date().toISOString().split("T")[0];
    onAssigned({ id:"a"+Date.now(), playerId:selectedPlayer.id, moduleId:module.id||"ai-custom", moduleData:module, assignedAt:today, status:"assigned", responses:[], completedAt:null });
    setAssigned(true);
  }

  if(assigned) return (
    <div style={{ ...s.screen, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"70vh", textAlign:"center" }}>
      <div style={{ width:64, height:64, borderRadius:"50%", background:C.greenLight, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}><Icon name="check" size={28} color={C.green}/></div>
      <div style={{ ...s.h1, marginBottom:8 }}>Module assigned</div>
      <div style={{ ...s.muted, marginBottom:24 }}>{selectedPlayer?.name} will see it in their module list.</div>
      <button style={s.btn(C.navy,C.white,false)} onClick={onBack}>Back to dashboard</button>
    </div>
  );

  if(selectedModule&&!selectedPlayer) return (
    <div style={s.screen}>
      <button style={{ background:"none", border:"none", cursor:"pointer", ...s.row, marginBottom:16, padding:0 }} onClick={()=>setSelectedModule(null)}><Icon name="back" size={20} color={C.navy}/><span style={{ fontSize:14, color:C.navy }}>Back</span></button>
      <div style={{ ...s.label, marginBottom:6 }}>Assigning</div>
      <div style={{ ...s.h2, marginBottom:16 }}>{selectedModule.title}</div>
      <div style={s.sectionTitle}>Choose a player</div>
      <div style={s.card}>
        {players.map((p,i)=>(
          <div key={p.id}>{i>0&&<div style={s.divider}/>}<div style={{ ...s.cardPad, cursor:"pointer" }} onClick={()=>{ setSelectedPlayer(p); doAssign(selectedModule); }}><div style={s.row}><Avatar player={p}/><div style={{ flex:1 }}><div style={{ fontWeight:600, fontSize:14, color:C.navy }}>{p.name}</div><div style={s.muted}>{p.position} · {p.age}</div></div><Icon name="arrow" size={16} color={C.grayMid}/></div></div></div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={s.screen}>
      <div style={{ marginBottom:20 }}><div style={s.label}>Module builder</div><div style={s.h1}>Assign a module</div></div>
      <div style={{ ...s.row, background:C.white, borderRadius:10, padding:4, marginBottom:20, border:`0.5px solid ${C.grayMid}30` }}>
        {["library","ai"].map(t=>(<button key={t} style={{ flex:1, padding:"8px 0", borderRadius:8, border:"none", cursor:"pointer", background:tab===t?C.navy:"transparent", color:tab===t?C.white:C.gray, fontSize:13, fontWeight:tab===t?600:400 }} onClick={()=>setTab(t)}>{t==="library"?"Module library":"AI builder"}</button>))}
      </div>
      {tab==="library"&&(<div><div style={s.sectionTitle}>{MODULES_LIBRARY.length} ready-to-assign modules</div>{MODULES_LIBRARY.map(mod=>(<div key={mod.id} style={{ ...s.card, borderLeft:`3px solid ${mod.color}` }}><div style={s.cardPad}><div style={{ ...s.row, marginBottom:8 }}><span style={s.badge(mod.colorLight,mod.colorDark)}>{mod.theme}</span><span style={{ ...s.muted, marginLeft:"auto" }}>{mod.time}</span></div><div style={{ ...s.h2, marginBottom:4 }}>{mod.title}</div><div style={{ ...s.muted, marginBottom:12 }}>{mod.situation.slice(0,90)}...</div><button style={s.btn(mod.color,C.white,true)} onClick={()=>setSelectedModule(mod)}>Assign this module</button></div></div>))}</div>)}
      {tab==="ai"&&(
        <div>
          <div style={s.card}><div style={s.cardPad}>
            <div style={{ ...s.label, marginBottom:8 }}>Describe what you're seeing</div>
            <textarea style={s.textarea} placeholder="e.g. My U14 center back is new to the team and struggling to communicate..." value={aiDesc} onChange={e=>setAiDesc(e.target.value)} rows={4}/>
            <div style={{ ...s.label, marginBottom:8, marginTop:4 }}>Position</div>
            <div style={s.chipRow}>{["Goalkeeper","Defender","Midfielder","Striker"].map(p=>(<div key={p} style={s.chip(aiPosition===p)} onClick={()=>setAiPosition(p)}>{p}</div>))}</div>
            <div style={{ ...s.label, marginBottom:8 }}>Age group</div>
            <div style={s.chipRow}>{["U12","U13","U14","U15","U16"].map(a=>(<div key={a} style={s.chip(aiAge===a)} onClick={()=>setAiAge(a)}>{a}</div>))}</div>
            <div style={{ ...s.label, marginBottom:8 }}>Theme</div>
            <div style={s.chipRow}>{themes.map(t=>(<div key={t} style={s.chip(aiTheme===t)} onClick={()=>setAiTheme(t)}>{t}</div>))}</div>
            {aiError&&<div style={{ fontSize:13, color:"#E24B4A", marginBottom:10 }}>{aiError}</div>}
            <button style={s.btn(C.navy,C.white,true)} onClick={generateModule} disabled={aiLoading}>{aiLoading?"Generating...":"Generate module with AI"}</button>
          </div></div>
          {aiResult&&(
            <div style={{ ...s.card, borderLeft:`3px solid ${C.purple}`, marginTop:16 }}>
              <div style={{ background:C.purpleLight, padding:"10px 16px", borderBottom:`0.5px solid ${C.grayMid}30` }}>
                <div style={{ fontSize:12, fontWeight:600, color:"#3C3489" }}>AI-GENERATED MODULE</div>
                <div style={{ fontWeight:600, fontSize:16, color:C.navy, marginTop:2 }}>{aiResult.title}</div>
              </div>
              <div style={s.cardPad}>
                <div style={{ ...s.label, marginBottom:4 }}>Situation</div>
                <div style={{ ...s.body, marginBottom:14, fontStyle:"italic", color:C.textMuted }}>{aiResult.situation}</div>
                <div style={{ ...s.label, marginBottom:6 }}>Reflection questions</div>
                {aiResult.questions?.map((q,i)=>(<div key={i} style={{ ...s.row, alignItems:"flex-start", marginBottom:8, gap:8 }}><div style={{ width:22, height:22, borderRadius:"50%", background:C.purple, color:C.white, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:600, flexShrink:0, marginTop:1 }}>{i+1}</div><div style={{ fontSize:13, color:C.text, lineHeight:1.55, flex:1 }}>{q}</div></div>))}
                <div style={{ background:C.amberLight, borderRadius:8, padding:"10px 12px", marginTop:10, marginBottom:14 }}><div style={{ fontSize:12, fontWeight:600, color:"#633806", marginBottom:3 }}>{aiResult.habit?.title}</div><div style={{ fontSize:13, color:"#412402", lineHeight:1.55 }}>{aiResult.habit?.body}</div></div>
                {aiResult.coachNote&&(<div style={{ background:C.grayLight, borderRadius:8, padding:"10px 12px", marginBottom:14 }}><div style={{ fontSize:11, fontWeight:600, color:C.textMuted, letterSpacing:"0.04em", marginBottom:3 }}>COACH NOTE</div><div style={{ fontSize:13, color:C.text, lineHeight:1.55, fontStyle:"italic" }}>{aiResult.coachNote}</div></div>)}
                <button style={s.btn(C.purple,C.white,true)} onClick={()=>setSelectedModule(aiResult)}>Assign this module</button>
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
  const [name,setName]=useState(""); const [position,setPosition]=useState("Center back"); const [age,setAge]=useState("U14");
  const colors=[{bg:C.greenLight,text:C.greenDark},{bg:C.blueLight,text:"#0C447C"},{bg:C.amberLight,text:"#633806"},{bg:C.purpleLight,text:"#3C3489"},{bg:C.coralLight,text:"#712B13"}];
  function add(){ if(!name.trim())return; const initials=name.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(); const c=colors[Math.floor(Math.random()*colors.length)]; onAdd({ id:"p"+Date.now(), name:name.trim(), position, age, avatar:initials, avatarColor:c.bg, avatarText:c.text }); }
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div style={{ background:C.white, borderRadius:"16px 16px 0 0", padding:20, width:"100%", maxWidth:480 }}>
        <div style={{ ...s.row, marginBottom:20 }}><div style={s.h2}>Add player</div><button style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", fontSize:18, color:C.gray }} onClick={onClose}>✕</button></div>
        <input style={s.input} placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} autoFocus/>
        <div style={s.label}>Position</div>
        <div style={{ ...s.chipRow, marginBottom:14 }}>{POSITIONS.map(p=>(<div key={p} style={s.chip(position===p)} onClick={()=>setPosition(p)}>{p}</div>))}</div>
        <div style={s.label}>Age group</div>
        <div style={{ ...s.chipRow, marginBottom:20 }}>{AGE_GROUPS.map(a=>(<div key={a} style={s.chip(age===a)} onClick={()=>setAge(a)}>{a}</div>))}</div>
        <button style={s.btn(C.green,C.white,true)} onClick={add}>Add to roster</button>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [role,setRole]=useState("coach");
  const [coachTab,setCoachTab]=useState("dashboard");
  const [playerTab,setPlayerTab]=useState("modules");
  const [players,setPlayers]=useState(DEMO_PLAYERS);
  const [assignments,setAssignments]=useState(DEMO_ASSIGNMENTS);
  const [selectedPlayer,setSelectedPlayer]=useState(null);
  const [activeModule,setActiveModule]=useState(null);
  const [showAddPlayer,setShowAddPlayer]=useState(false);
  const [viewingAs,setViewingAs]=useState(DEMO_PLAYERS[0]);

  async function loadStorage(){
    try {
      if (window.storage?.get) {
        const pr=await window.storage.get("players"); const ar=await window.storage.get("assignments");
        if(pr)setPlayers(JSON.parse(pr.value)); if(ar)setAssignments(JSON.parse(ar.value));
        return;
      }
      const pr=localStorage.getItem("players"); const ar=localStorage.getItem("assignments");
      if(pr)setPlayers(JSON.parse(pr)); if(ar)setAssignments(JSON.parse(ar));
    } catch {}
  }
  async function saveStorage(p,a){
    try {
      if (window.storage?.set) {
        await window.storage.set("players",JSON.stringify(p)); await window.storage.set("assignments",JSON.stringify(a));
        return;
      }
      localStorage.setItem("players",JSON.stringify(p)); localStorage.setItem("assignments",JSON.stringify(a));
    } catch {}
  }
  useEffect(()=>{ loadStorage(); },[]);
  function addPlayer(p){ const u=[...players,p]; setPlayers(u); saveStorage(u,assignments); setShowAddPlayer(false); }
  function addAssignment(a){ const u=[...assignments,a]; setAssignments(u); saveStorage(players,u); setCoachTab("dashboard"); }
  function updateAssignment(updated){ const all=assignments.map(a=>a.id===updated.id?updated:a); setAssignments(all); saveStorage(players,all); }

  const isCoach=role==="coach";

  return (
    <div style={s.app}>
      <div style={s.navBar}>
        <div style={s.logo}><div style={s.logoDot}/>MindPitch</div>
        <button style={s.navRole} onClick={()=>{ setRole(isCoach?"player":"coach"); setCoachTab("dashboard"); setPlayerTab("modules"); setSelectedPlayer(null); setActiveModule(null); }}>
          {isCoach?"Coach view":"Player view"} ↕
        </button>
      </div>

      {isCoach&&(
        <>
          {selectedPlayer?(<PlayerDetail player={selectedPlayer} assignments={assignments} onBack={()=>setSelectedPlayer(null)} onAssignModule={()=>{ setSelectedPlayer(null); setCoachTab("builder"); }}/>)
          :coachTab==="dashboard"?(<CoachDashboard players={players} assignments={assignments} onNav={setCoachTab} onViewPlayer={p=>setSelectedPlayer(p)}/>)
          :coachTab==="roster"?(<CoachRoster players={players} assignments={assignments} onViewPlayer={p=>setSelectedPlayer(p)} onAddPlayer={()=>setShowAddPlayer(true)}/>)
          :(<ModuleBuilder players={players} onAssigned={a=>addAssignment(a)} onBack={()=>setCoachTab("dashboard")}/>)}
          <div style={s.tabBar}>
            {[["dashboard","home","Dashboard"],["roster","users","Roster"],["builder","brain","Builder"]].map(([tab,icon,label])=>(
              <button key={tab} style={s.tab(coachTab===tab)} onClick={()=>{ setCoachTab(tab); setSelectedPlayer(null); }}>
                <Icon name={icon} size={20} color={coachTab===tab?C.green:C.gray}/><span style={s.tabLabel(coachTab===tab)}>{label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {!isCoach&&(
        <>
          {activeModule?(
            <ModuleExperience assignment={activeModule.assignment} module={activeModule.module} player={viewingAs} onComplete={updated=>{ updateAssignment(updated); setActiveModule(null); }} onBack={()=>setActiveModule(null)}/>
          ):(
            <>
              <div style={{ ...s.tabBar, top:57, bottom:"auto", borderBottom:`1px solid ${C.grayMid}30`, borderTop:"none" }}>
                <div style={{ display:"flex", width:"100%", padding:"4px 8px", gap:4 }}>
                  {players.slice(0,5).map(p=>(
                    <div key={p.id} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer", padding:"6px 0" }} onClick={()=>setViewingAs(p)}>
                      <div style={{ ...s.avatar(p.avatarColor,p.avatarText,viewingAs.id===p.id?32:28), border:viewingAs.id===p.id?`2px solid ${C.green}`:"none" }}>{p.avatar}</div>
                      <span style={{ fontSize:9, color:viewingAs.id===p.id?C.green:C.gray, fontWeight:viewingAs.id===p.id?600:400 }}>{p.name.split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ paddingTop:60 }}>
                {playerTab==="modules"?(
                  <PlayerModuleList player={viewingAs} assignments={assignments} onStartModule={(a,mod)=>setActiveModule({ assignment:a, module:mod })}/>
                ):(
                  <OpenCoachChat player={viewingAs} assignments={assignments}/>
                )}
              </div>
              <div style={s.tabBar}>
                {[["modules","ball","My modules"],["chat","chat","AI coach"]].map(([tab,icon,label])=>(
                  <button key={tab} style={s.tab(playerTab===tab)} onClick={()=>setPlayerTab(tab)}>
                    <Icon name={icon} size={20} color={playerTab===tab?C.green:C.gray}/><span style={s.tabLabel(playerTab===tab)}>{label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {showAddPlayer&&<AddPlayerModal onAdd={addPlayer} onClose={()=>setShowAddPlayer(false)}/>}
    </div>
  );
}
