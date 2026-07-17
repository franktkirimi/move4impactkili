-- Early-access interest signups (home "wear" section + apparel page).
-- Run this once in the Supabase SQL editor for project afmgdffqkhttlmzlkvdn.
create table if not exists public.interest_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  kind text not null,
  created_at timestamptz not null default now(),
  constraint interest_signups_email_kind_unique unique (email, kind)
);

alter table public.interest_signups enable row level security;

-- Visitors may add themselves to the list, but nobody can read it with the
-- anon key: no select policy is defined on purpose.
create policy "Allow anonymous interest signups"
  on public.interest_signups
  for insert
  to anon
  with check (true);
