# MindPitch — Developer Handoff
**Version:** 1.1 — includes AI player chat feature  
**Date:** June 2026

---

## What this is
MindPitch is a mobile-first React PWA (installable web app) with two sides:
- **Coach dashboard** — roster management, module assignment, AI module builder
- **Player experience** — module completion, post-module AI debrief, open AI coach chat

The AI features call the Anthropic Claude API directly from the browser.

---

## Project structure
```
mindpitch/
├── public/
│   ├── index.html          # App shell + PWA meta tags
│   ├── manifest.json       # PWA config (name, icons, theme color)
│   ├── sw.js               # Service worker (offline/installable support)
│   ├── icon-192.png        # Home screen icon
│   ├── icon-512.png        # Home screen icon (large)
│   └── favicon.ico
├── src/
│   ├── App.jsx             # Entire app (single file for v1)
│   └── index.js            # React entry point + service worker registration
├── package.json
├── vercel.json             # Vercel deployment config (SPA routing)
├── .env.example            # Environment variable template
├── .gitignore
└── DEVELOPER_HANDOFF.md    # This file
```

---

## New in v1.1 — AI player chat

Two new AI conversation features have been added:

### 1. Post-module debrief
After a player completes all reflection questions, they're taken to a debrief screen. The AI has read every answer they wrote and opens with a single direct, challenging question targeting the weakest response. The player then has a real back-and-forth conversation with their AI mental performance coach.

### 2. Open coach chat
In player view, a new "AI Coach" tab sits alongside "My modules." Players can talk to their AI coach any time — about anything on their mind related to their game, mindset, or development. The AI knows which modules the player has completed and coaches from that context.

### AI coaching persona
The system prompt instructs the AI to be: direct, focused, challenging. Not a therapist. Not a cheerleader. A mental performance coach who asks sharp follow-up questions and doesn't accept vague answers. 2–4 sentence responses max.

---

## Setup (estimated time: 30–45 minutes)

### 1. Prerequisites
- Node.js 18+ — https://nodejs.org
- Git — https://git-scm.com
- GitHub account (free) — https://github.com
- Vercel account (free) — https://vercel.com
- Anthropic API key — https://console.anthropic.com

### 2. Install dependencies
```bash
cd mindpitch
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```
Open `.env` and add:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 4. Run locally
```bash
npm start
# Opens at http://localhost:3000
```

### 5. Test the build
```bash
npm run build
# Should complete with no errors
```

---

## Deploy to Vercel (~15 minutes)

### Option A — Vercel CLI (fastest)
```bash
npm install -g vercel
vercel login
vercel --prod
```
When prompted:
- Project name: `mindpitch`
- Build command: `npm run build`
- Output directory: `build`
- Add env variable: `ANTHROPIC_API_KEY`

### Option B — GitHub + Vercel dashboard
1. Push to a new GitHub repo
2. Go to vercel.com → New Project → Import from GitHub
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Click Deploy

You'll get a live URL like `mindpitch.vercel.app` instantly.  
Add a custom domain (e.g. `mindpitch.app`) in Vercel → Settings → Domains.

---

## PWA — "Add to Home Screen"

Once deployed, coaches and players can install it like a native app.

**iPhone (Safari):**
1. Open the URL in Safari
2. Tap the Share button (box with arrow)
3. Tap "Add to Home Screen"
4. Tap "Add"

**Android (Chrome):**
1. Open the URL in Chrome
2. Tap the three-dot menu
3. Tap "Add to Home screen"
4. Tap "Add"

---

## Key files to understand

### src/App.jsx — main sections
| Section | What it does |
|---|---|
| `MODULES_LIBRARY` | 5 pre-built mentality modules — edit content here |
| `DEMO_PLAYERS` | Starting roster — coaches add real players in-app |
| `DEMO_ASSIGNMENTS` | Sample assignments for demo purposes |
| `SYSTEM_PROMPT` | AI coaching persona — edit tone/style here |
| `AIChat` | Reusable AI chat component (used for both features) |
| `ModuleDebrief` | Post-module AI debrief screen |
| `OpenCoachChat` | Player's persistent open chat tab |
| `ModuleExperience` | Immersive one-question-at-a-time module flow |
| `ModuleBuilder` | Coach tool: library + AI module generation |
| `CoachDashboard` | Coach home screen with metrics |
| `CoachRoster` | Roster + player profiles |

### public/manifest.json
Controls PWA appearance — app name, icon, theme color, splash screen.

### public/sw.js
Service worker for offline support and installability.

---

## API key security

The v1 build calls the Anthropic API directly from the browser. The API key is visible in the client bundle.

**For the pilot (1–3 clubs): acceptable.**

**Before scaling (10+ clubs), add a backend proxy:**
- Create a Next.js API route or Express server
- Move the API key server-side
- Frontend calls your proxy, not Anthropic directly
- Estimated dev time: 2–3 hours with Next.js

---

## Storage

Currently uses `window.storage` (Claude artifact storage API).

**For production, replace with one of:**
- `localStorage` — simple, browser-only, no account needed (quick fix)
- **Supabase** — recommended. Free tier, real database, built-in auth. Coaches get real accounts, data persists across devices, you get an admin panel to see usage.

---

## Recommended next steps after deployment

| Priority | Task | Est. time |
|---|---|---|
| 1 | Custom domain (mindpitch.app on Namecheap ~$12/yr) | 30 min |
| 2 | Replace window.storage with localStorage | 1 hour |
| 3 | Add Supabase auth (coach accounts) | 4–6 hours |
| 4 | Add Supabase database (real data persistence) | 4–6 hours |
| 5 | Backend API proxy (protect API key) | 2–3 hours |
| 6 | Push notifications (remind players to complete modules) | 3–4 hours |

---

## Testing the AI features

To test the post-module debrief:
1. Toggle to "Player view" (top right)
2. Select any player with an assigned module
3. Tap "Start module"
4. Answer all questions
5. Tap "Finish & talk to coach"
6. The AI opens with a direct challenge based on their answers

To test the open coach chat:
1. Toggle to "Player view"
2. Tap the "AI Coach" tab at the bottom
3. Type anything — the AI coaches from the player's module history

To test the AI module builder (coach side):
1. Toggle to "Coach view"
2. Tap "Builder" tab
3. Select "AI builder"
4. Describe a player situation and tap Generate

---

## Questions?
This handoff document covers everything needed to go from zip file to live URL.
The founder can clarify any product decisions — the code is intentionally kept
simple and readable for v1.

Good luck — this is a product coaches actually need.
