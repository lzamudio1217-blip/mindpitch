# MindPitch Vercel Deploy Notes

This zip has been adjusted for Vercel:

- Anthropic calls now go through `/api/chat` instead of calling Anthropic directly from the browser.
- The API key should be saved in Vercel as `ANTHROPIC_API_KEY`, not `REACT_APP_ANTHROPIC_API_KEY`.
- Browser persistence now falls back to `localStorage` when `window.storage` is unavailable.
- `.DS_Store` was removed.

Vercel settings:

- Framework Preset: Create React App
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `build`
- Environment Variable: `ANTHROPIC_API_KEY=sk-ant-...`

After deployment, test:

1. Open the live URL.
2. Use the Coach view → Builder → AI generation.
3. Add a player, refresh the page, and confirm the player remains saved.
4. Test Add to Home Screen on iPhone Safari and Android Chrome.
