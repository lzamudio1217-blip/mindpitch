# MindPitch #11 Patch Notes

This patched copy includes:

- Secure `/api/chat` Vercel serverless function for Anthropic calls.
- Frontend AI calls changed from `https://api.anthropic.com/v1/messages` to `/api/chat`.
- `ANTHROPIC_API_KEY` server-side environment variable.
- `localStorage` fallback when `window.storage` is unavailable on Vercel.
- AI coach input text visibility fix.
- AI coach input bar moved above bottom nav.
- AI-generated module assignment fix for newly created players.
- More reliable new player IDs using `crypto.randomUUID()`.
