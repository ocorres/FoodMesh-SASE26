-- FoodMesh organization workflow migration
-- Run this once after the initial schema.sql setup.

alter table public.donations
  add column if not exists route_status text not null default 'pending';

alter table public.donations
  add column if not exists current_match_index integer not null default 0;

alter table public.donations
  add column if not exists accepted_by text;

alter table public.donations
  add column if not exists impact_servings integer;

alter table public.donations
  add column if not exists updated_at timestamptz not null default now();

drop policy if exists "demo donations updateable" on public.donations;
create policy "demo donations updateable"
on public.donations
for update
to anon
using (true)
with check (true);
