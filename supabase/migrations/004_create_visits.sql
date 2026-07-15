create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations(id) on delete cascade,
  visit_date timestamptz not null default now(),
  visit_type text,
  notes text,
  latitude numeric,
  longitude numeric,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_visits_location_id on public.visits (location_id);
create index if not exists idx_visits_created_by on public.visits (created_by);
create index if not exists idx_visits_visit_date on public.visits (visit_date);
