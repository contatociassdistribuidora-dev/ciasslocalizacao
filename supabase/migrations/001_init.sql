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
  latitude numeric,
  longitude numeric,
  contact_name text,
  phone text,
  email text,
  notes text,
  status text check (status in ('active','inactive')) default 'active',
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.location_photos (
  id uuid primary key default uuid_generate_v4(),
  location_id uuid references public.locations(id) on delete cascade,
  storage_path text not null,
  file_url text not null,
  description text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

create table if not exists public.visits (
  id uuid primary key default uuid_generate_v4(),
  location_id uuid references public.locations(id) on delete cascade,
  visit_date timestamptz default now(),
  visit_type text,
  notes text,
  latitude numeric,
  longitude numeric,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid,
  action text,
  table_name text,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz default now()
);

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function public.is_user_active_for_role(required_roles text[])
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.active = true
      and p.role = any(required_roles)
  );
$$;

alter table public.profiles enable row level security;
alter table public.locations enable row level security;
alter table public.location_photos enable row level security;
alter table public.visits enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles_self_access" on public.profiles
for select using (auth.uid() = id);

create policy "profiles_self_update" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "profiles_admin_manage" on public.profiles
for all using (public.is_user_active_for_role(array['admin'])) with check (public.is_user_active_for_role(array['admin']));

create policy "locations_view_authenticated" on public.locations
for select using (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator','viewer']));

create policy "locations_insert_admin_operator" on public.locations
for insert with check (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator']));

create policy "locations_update_admin_operator" on public.locations
for update using (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator']))
with check (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator']));

create policy "locations_delete_admin_operator" on public.locations
for delete using (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator']));

create policy "location_photos_view_authenticated" on public.location_photos
for select using (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator','viewer']));

create policy "location_photos_manage_admin_operator" on public.location_photos
for all using (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator']))
with check (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator']));

create policy "visits_view_authenticated" on public.visits
for select using (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator','viewer']));

create policy "visits_manage_admin_operator" on public.visits
for all using (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator']))
with check (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator']));

create policy "audit_logs_view_admin" on public.audit_logs
for select using (public.is_user_active_for_role(array['admin']));

create trigger update_profiles_updated_at before update on public.profiles
for each row execute function public.update_updated_at();

create trigger update_locations_updated_at before update on public.locations
for each row execute function public.update_updated_at();

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role, active)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email, 'viewer', true)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create index if not exists idx_locations_name on public.locations(name);
create index if not exists idx_locations_document_number on public.locations(document_number);
create index if not exists idx_locations_city on public.locations(city);
create index if not exists idx_locations_neighborhood on public.locations(neighborhood);
create index if not exists idx_locations_category on public.locations(category);
create index if not exists idx_locations_status on public.locations(status);
create index if not exists idx_locations_created_at on public.locations(created_at);
create index if not exists idx_locations_created_by on public.locations(created_by);
