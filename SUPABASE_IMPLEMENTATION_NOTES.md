# MindPitch Supabase implementation notes

This build adds Supabase Auth magic-link login and cloud persistence for:

- coach profiles
- players
- assignments
- saved AI modules

## Required Vercel environment variables

```env
REACT_APP_SUPABASE_URL=https://wmspeggdppsbeunlqmbg.supabase.co
REACT_APP_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
ANTHROPIC_API_KEY=sk-ant-...
```

Do not add `REACT_APP_ANTHROPIC_API_KEY`.

## Required extra SQL

If the first Supabase schema was already run, run this once in Supabase SQL Editor:

```sql
alter table public.players
add column if not exists coach_note text;
```

## Auth redirect URLs

Set Supabase Authentication → URL Configuration:

Site URL:

```txt
https://mindpitch.net
```

Redirect URLs:

```txt
https://mindpitch.net/**
https://www.mindpitch.net/**
https://mindpitch.vercel.app/**
http://localhost:3000/**
```

## Testing checklist

1. Open the app.
2. Enter coach email and send magic link.
3. Open the Supabase login email.
4. Confirm the app opens signed in.
5. Add a new player.
6. Refresh the app and confirm the player stays.
7. Generate an AI module.
8. Assign it to the new player.
9. Confirm it appears on player profile and Player view.
10. Complete the module in Player view.
11. Refresh and confirm completed status persists.
12. Open a second browser/device, sign in with the same coach email, and confirm the same data appears.
