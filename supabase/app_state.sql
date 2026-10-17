-- "Save my progress": one row per person per saved app key (see lib/sync/engine.ts).
-- Run once in Supabase: SQL Editor → New query → paste → Run.

create table if not exists public.app_state (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  key text not null check (key ~ '^[a-z][a-z0-9:._-]{0,63}$'),
  value text check (value is null or length(value) <= 2000000),
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

alter table public.app_state enable row level security;

drop policy if exists "Read own progress" on public.app_state;
drop policy if exists "Add own progress" on public.app_state;
drop policy if exists "Update own progress" on public.app_state;
drop policy if exists "Delete own progress" on public.app_state;

create policy "Read own progress" on public.app_state for select to authenticated using (auth.uid() = user_id);
create policy "Add own progress" on public.app_state for insert to authenticated with check (auth.uid() = user_id);
create policy "Update own progress" on public.app_state for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Delete own progress" on public.app_state for delete to authenticated using (auth.uid() = user_id);
