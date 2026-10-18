-- "Tell us your idea" on /build. Anyone can send one; only you can read them
-- (Supabase → Table Editor → build_inquiries).
-- Run once in Supabase: SQL Editor → New query → paste → Run.

create table if not exists public.build_inquiries (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null check (length(name) between 1 and 100),
  email text not null check (length(email) between 3 and 200),
  org_type text not null check (length(org_type) <= 40),
  idea text not null check (length(idea) between 20 and 2000),
  sketch jsonb,
  page text check (length(page) <= 100)
);

alter table public.build_inquiries enable row level security;

drop policy if exists "Anyone can send an idea" on public.build_inquiries;
create policy "Anyone can send an idea" on public.build_inquiries for insert to anon, authenticated with check (true);
-- No select, update or delete policies: inquiries are only visible in the Supabase dashboard.
