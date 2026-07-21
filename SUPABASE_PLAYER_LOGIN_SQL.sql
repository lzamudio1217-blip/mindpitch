-- MindPitch player login + roles update
-- Run this after the original MindPitch Supabase schema.

alter table public.players
add column if not exists player_email text;

create index if not exists players_email_idx
on public.players (player_email);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text not null check (role in ('coach','director','founder')),
  created_at timestamptz default now()
);

alter table public.user_roles enable row level security;

-- Users can read their own role row.
drop policy if exists "Users can view their own role" on public.user_roles;
create policy "Users can view their own role"
on public.user_roles
for select
to authenticated
using (lower(email) = lower(auth.jwt() ->> 'email'));

-- A logged-in player can read only their own player row by email.
drop policy if exists "Players can view their own player row" on public.players;
create policy "Players can view their own player row"
on public.players
for select
to authenticated
using (lower(player_email) = lower(auth.jwt() ->> 'email'));

-- A logged-in player can read their own assignments.
drop policy if exists "Players can view their own assignments" on public.assignments;
create policy "Players can view their own assignments"
on public.assignments
for select
to authenticated
using (
  exists (
    select 1
    from public.players p
    where p.id = assignments.player_id
      and lower(p.player_email) = lower(auth.jwt() ->> 'email')
  )
);

-- A logged-in player can update only progress fields on their own assignments.
drop policy if exists "Players can update their own assignment progress" on public.assignments;
create policy "Players can update their own assignment progress"
on public.assignments
for update
to authenticated
using (
  exists (
    select 1
    from public.players p
    where p.id = assignments.player_id
      and lower(p.player_email) = lower(auth.jwt() ->> 'email')
  )
)
with check (
  exists (
    select 1
    from public.players p
    where p.id = assignments.player_id
      and lower(p.player_email) = lower(auth.jwt() ->> 'email')
  )
);

-- Director/founder read access for dashboards. Add trusted emails to user_roles.
drop policy if exists "Directors and founders can view all players" on public.players;
create policy "Directors and founders can view all players"
on public.players
for select
to authenticated
using (
  exists (
    select 1
    from public.user_roles ur
    where lower(ur.email) = lower(auth.jwt() ->> 'email')
      and ur.role in ('director','founder')
  )
);

drop policy if exists "Directors and founders can view all assignments" on public.assignments;
create policy "Directors and founders can view all assignments"
on public.assignments
for select
to authenticated
using (
  exists (
    select 1
    from public.user_roles ur
    where lower(ur.email) = lower(auth.jwt() ->> 'email')
      and ur.role in ('director','founder')
  )
);

drop policy if exists "Directors and founders can view all AI modules" on public.ai_modules;
create policy "Directors and founders can view all AI modules"
on public.ai_modules
for select
to authenticated
using (
  exists (
    select 1
    from public.user_roles ur
    where lower(ur.email) = lower(auth.jwt() ->> 'email')
      and ur.role in ('director','founder')
  )
);

-- Optional examples. Replace with real trusted emails if needed.
-- insert into public.user_roles (email, role)
-- values ('omar@example.com', 'founder')
-- on conflict (email) do update set role = excluded.role;
