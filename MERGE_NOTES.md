# MindPitch Spanish merged patch

This folder starts from Omar's July 20 build that fixes Spanish module display, then reapplies the Vercel/pilot fixes:

- `/api/chat.js` serverless proxy for Anthropic
- `ANTHROPIC_API_KEY` stays server-side
- `vercel.json` preserves `/api/*` routes
- localStorage fallback for normal Vercel hosting
- AI coach input text color/caret fix
- AI coach input bar lifted above bottom nav
- Assign generated module to newly-created player bug fix
- AI-generated modules show in roster and player history
- Player view top selector shows all players horizontally
- Removed unused translation helpers that fail CRA/Vercel CI
