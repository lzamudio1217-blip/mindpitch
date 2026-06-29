# MindPitch — Developer Handoff

## What this is
MindPitch is a mobile-first React web app for youth soccer coaches and players.
Coaches assign personalized mentality modules to players. Players complete them on their phones.
Modules are generated using the Anthropic (Claude) API.

---

## Your job (estimated: 1–3 hours)

1. Set up the project locally
2. Add the API key
3. Deploy to Vercel
4. Confirm PWA install works on iPhone and Android
5. (Optional) Generate app icons

That's it. No database needed — the app uses browser localStorage.

---

## Step 1 — Local setup

```bash
# Clone or unzip the project folder, then:
cd mindpitch
npm install
npm start
# App runs at http://localhost:3000
```

---

## Step 2 — Add the API key

The AI module builder calls the Anthropic API directly from the browser.

1. Get an API key at https://console.anthropic.com
2. Create a file called `.env.local` in the project root (copy from `.env.example`)
3. Add your key:

```
REACT_APP_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```

**Security note:** For production, you should proxy API calls through a serverless function
so the key isn't exposed in the browser bundle. Ask the developer to add a `/api/chat`
Vercel Edge Function if needed. For the pilot, direct browser calls are fine.

---

## Step 3 — Deploy to Vercel

Fastest method (no CLI needed):

1. Push this folder to a GitHub repo (public or private)
2. Go to https://vercel.com → New Project → Import that repo
3. Framework preset: **Create React App**
4. Add environment variable:
   - Key: `REACT_APP_ANTHROPIC_API_KEY`
   - Value: your Anthropic API key
5. Click Deploy

Done. Vercel gives you a live URL like `https://mindpitch.vercel.app`.

To use a custom domain (e.g. mindpitch.app):
- Buy domain at Namecheap or Cloudflare (~$12/year)
- Add it in Vercel: Settings → Domains

---

## Step 4 — Test PWA install

**iPhone (Safari):**
1. Open the live URL in Safari
2. Tap Share → "Add to Home Screen"
3. App icon should appear on home screen
4. Opening it should feel like a native app (no browser chrome)

**Android (Chrome):**
1. Open the live URL in Chrome
2. Tap the three-dot menu → "Add to Home Screen"
   OR Chrome will show an install banner automatically

If the icon shows as a blank square, app icons need to be generated (see Step 5).

---

## Step 5 — Generate app icons (optional but recommended)

The `/public` folder needs two icon files:
- `icon-192.png` — 192×192px
- `icon-512.png` — 512×512px

Design direction: Dark navy (#0D1B2A) background, green (#1D9E75) brain or pitch icon.

Quick option: Use https://realfavicongenerator.net — upload a 512px icon, it generates all sizes.

Also replace `favicon.ico` in `/public` with a matching icon.

---

## Project structure

```
mindpitch/
├── public/
│   ├── index.html          # HTML template with PWA meta tags
│   ├── manifest.json       # PWA manifest (app name, icons, theme)
│   ├── sw.js               # Service worker (offline support)
│   ├── icon-192.png        # App icon — NEEDS TO BE CREATED
│   └── icon-512.png        # App icon — NEEDS TO BE CREATED
├── src/
│   ├── App.jsx             # Entire app (single file)
│   ├── index.js            # Entry point + SW registration
│   └── index.css           # Global styles + Inter font
├── .env.example            # Environment variable template
├── .gitignore
├── package.json
└── vercel.json             # Vercel routing config
```

---

## Key things to know about the app

**Two views:** Toggle between Coach and Player view using the button in the top nav bar.

**Coach view tabs:**
- Dashboard — metrics, attention flags, recent activity
- Roster — all players, tap any to see detail + history
- Builder — library of 5 pre-built modules OR AI generation via Claude API

**Player view:**
- Player selector strip at top (tap to switch players)
- Module list with progress
- Immersive one-question-at-a-time module experience

**Data storage:**
- Uses `window.storage` (Claude artifact storage API) in the demo
- For production, replace `loadStorage()` and `saveStorage()` in App.jsx
  with calls to a real database (Supabase is easiest — free tier is generous)
- Recommended schema: `players` table, `assignments` table, `responses` table

---

## Recommended next steps (beyond this handoff)

| Priority | Task | Effort |
|----------|------|--------|
| High | Add Supabase for real data persistence | 4–6 hrs |
| High | Add auth (Supabase Auth — email magic link) | 2–4 hrs |
| High | Move API key to serverless function | 1–2 hrs |
| Medium | Generate proper app icons | 30 min |
| Medium | Add push notifications for module reminders | 4–6 hrs |
| Low | Submit to App Store via Capacitor | 1–2 days |

---

## Questions?

Contact the founder directly. This handoff doc covers everything needed for the initial deployment.
The app is intentionally kept in a single file (App.jsx) to make it easy to hand off and modify.
