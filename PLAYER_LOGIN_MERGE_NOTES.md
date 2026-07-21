# MindPitch #12 + Supabase + Player Login merge

This merge keeps the Supabase magic-link login, `/api/chat` Anthropic proxy, Spanish fixes, module-assignment fixes, AI coach layout fixes, and adds Omar's player-login flow.

## What changed

- `players.player_email` is saved to Supabase from Add/Edit Player.
- After magic-link login, the app checks whether the logged-in email matches a `players.player_email`.
- If it matches, the app sets role to `player`, loads only that player, and loads that player's assignments.
- If not a player, the app checks `user_roles` for `coach`, `director`, or `founder`.
- If no role row exists, the app defaults to `coach` and loads the signed-in coach's own roster.
- Player users can update their own assignment progress/completions via RLS policies.

## Required SQL

Run `SUPABASE_PLAYER_LOGIN_SQL.sql` in Supabase SQL Editor before deploying.
