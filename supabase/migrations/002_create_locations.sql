create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  document_number text,
  category text,
  address text,
  address_number text,
  complement text,
  neighborhood text,
  city text,
  state text,
  zip_code text,
  latitude numeric,
  longitude numeric,
  contact_name text,
  phone text,
  email text,
  notes text,
  status text not null default 'active' check (status in ('active','inactive')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_locations_name on public.locations (name);
create index if not exists idx_locations_document_number on public.locations (document_number);
create index if not exists idx_locations_category on public.locations (category);
create index if not exists idx_locations_city on public.locations (city);
create index if not exists idx_locations_neighborhood on public.locations (neighborhood);
create index if not exists idx_locations_state on public.locations (state);
create index if not exists idx_locations_status on public.locations (status);
create index if not exists idx_locations_created_at on public.locations (created_at);
create index if not exists idx_locations_created_by on public.locations (created_by);
