create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text check (role in ('admin','operator','viewer')) default 'viewer',
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.locations (
  id uuid primary key default uuid_generate_v4(),
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
  latitude double precision,
  longitude double precision,
  contact_name text,
  phone text,
  email text,
  notes text,
  status text check (status in ('active','inactive')) default 'active',
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.location_photos (
  id uuid primary key default uuid_generate_v4(),
  location_id uuid references public.locations(id) on delete cascade,
  file_url text not null,
  description text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists public.visits (
  id uuid primary key default uuid_generate_v4(),
  location_id uuid references public.locations(id) on delete cascade,
  visit_date timestamptz default now(),
  visit_type text,
  notes text,
  latitude double precision,
  longitude double precision,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  action text,
  table_name text,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.locations enable row level security;
alter table public.location_photos enable row level security;
alter table public.visits enable row level security;
alter table public.audit_logs enable row level security;

create policy "Admins can manage all profiles" on public.profiles for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "Users can read own profile" on public.profiles for select using (id = auth.uid());

create policy "Admins can manage all locations" on public.locations for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "Operators can insert locations" on public.locations for insert with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','operator'))
);

create policy "Operators and viewers can read locations" on public.locations for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','operator','viewer'))
);

create policy "Operators can update own locations" on public.locations for update using (
  created_by = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "Admins can manage photos" on public.location_photos for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "Users can read photos" on public.location_photos for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','operator','viewer'))
);

create policy "Users can manage visits" on public.visits for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','operator'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','operator'))
);

create policy "Users can read audit logs" on public.audit_logs for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
