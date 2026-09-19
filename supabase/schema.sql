-- FoodMesh hackathon demo schema
-- Run this in the Supabase SQL editor for the FoodMesh project.
-- The anonymous policies below are intentionally limited to demo records.
-- Do not store sensitive recipient information in these tables.

create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id text primary key,
  name text not null,
  distance_miles numeric not null,
  receiving_window text not null,
  capacity_servings integer not null,
  refrigerated boolean not null default false,
  frozen boolean not null default false,
  accepts jsonb not null default '[]'::jsonb,
  dietary_routing jsonb not null default '[]'::jsonb,
  accessibility jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  donation jsonb not null,
  matches jsonb not null default '[]'::jsonb,
  intake_mode text not null check (intake_mode in ('ai', 'demo')),
  created_at timestamptz not null default now()
);

alter table public.organizations enable row level security;
alter table public.donations enable row level security;

drop policy if exists "demo organizations readable" on public.organizations;
create policy "demo organizations readable"
on public.organizations
for select
to anon
using (true);

drop policy if exists "demo donations readable" on public.donations;
create policy "demo donations readable"
on public.donations
for select
to anon
using (true);

drop policy if exists "demo donations insertable" on public.donations;
create policy "demo donations insertable"
on public.donations
for insert
to anon
with check (true);

insert into public.organizations (
  id, name, distance_miles, receiving_window, capacity_servings,
  refrigerated, frozen, accepts, dietary_routing, accessibility
)
values
  (
    'community-kitchen',
    'Community Kitchen',
    1.4,
    'Today until 9:30 PM',
    80,
    true,
    false,
    '["prepared_meal","produce","bakery","beverage","mixed"]'::jsonb,
    '["vegetarian","vegan","gluten-free"]'::jsonb,
    '["Step-free entrance","Accessible parking","Curbside handoff available"]'::jsonb
  ),
  (
    'neighborhood-pantry',
    'Neighborhood Food Pantry',
    2.2,
    'Today until 7:00 PM',
    120,
    true,
    true,
    '["produce","bakery","dairy","protein","pantry","beverage","mixed"]'::jsonb,
    '["vegetarian","vegan","gluten-free"]'::jsonb,
    '["Wheelchair-accessible entrance","Bus stop nearby"]'::jsonb
  ),
  (
    'community-fridge',
    'Community Fridge Hub',
    0.8,
    'Open access today',
    30,
    true,
    false,
    '["produce","bakery","dairy","pantry","beverage","mixed"]'::jsonb,
    '["vegetarian","vegan","gluten-free"]'::jsonb,
    '["Ground-level access","No appointment required"]'::jsonb
  ),
  (
    'shelter-meal-program',
    'Shelter Meal Program',
    3.1,
    'Today until 10:00 PM',
    200,
    true,
    true,
    '["prepared_meal","produce","bakery","protein","beverage","mixed"]'::jsonb,
    '["vegetarian"]'::jsonb,
    '["Step-free receiving entrance","Curbside handoff available"]'::jsonb
  )
on conflict (id) do update set
  name = excluded.name,
  distance_miles = excluded.distance_miles,
  receiving_window = excluded.receiving_window,
  capacity_servings = excluded.capacity_servings,
  refrigerated = excluded.refrigerated,
  frozen = excluded.frozen,
  accepts = excluded.accepts,
  dietary_routing = excluded.dietary_routing,
  accessibility = excluded.accessibility;
