create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  role text not null default 'viewer' check (role in ('admin','operator','viewer')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_email on public.profiles (email);
create index if not exists idx_profiles_role on public.profiles (role);
create index if not exists idx_profiles_active on public.profiles (active);

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

create table if not exists public.location_photos (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations(id) on delete cascade,
  storage_path text not null,
  file_url text,
  description text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_location_photos_location_id on public.location_photos (location_id);
create index if not exists idx_location_photos_created_by on public.location_photos (created_by);

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

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  action text not null,
  table_name text not null,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_user_id on public.audit_logs (user_id);
create index if not exists idx_audit_logs_table_name on public.audit_logs (table_name);
create index if not exists idx_audit_logs_record_id on public.audit_logs (record_id);
create index if not exists idx_audit_logs_created_at on public.audit_logs (created_at);

create or replace function public.update_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (id, full_name, email, role, active)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', null),
    new.email,
    'viewer',
    true
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at();

drop trigger if exists update_locations_updated_at on public.locations;
create trigger update_locations_updated_at
before update on public.locations
for each row execute function public.update_updated_at();

alter table public.profiles enable row level security;
alter table public.locations enable row level security;
alter table public.location_photos enable row level security;
alter table public.visits enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.is_user_active_for_role(required_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.active = true
      and p.role = any(required_roles)
  );
$$;

drop policy if exists profiles_admin_manage on public.profiles;
drop policy if exists profiles_self_access on public.profiles;
drop policy if exists profiles_self_update on public.profiles;
create policy "profiles_admin_manage" on public.profiles for all using (auth.uid() is not null and public.is_user_active_for_role(array['admin'])) with check (auth.uid() is not null and public.is_user_active_for_role(array['admin']));
create policy "profiles_self_access" on public.profiles for select using (auth.uid() = id);
create policy "profiles_self_update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists locations_view_authenticated on public.locations;
drop policy if exists locations_insert_admin_operator on public.locations;
drop policy if exists locations_update_admin_operator on public.locations;
drop policy if exists locations_delete_admin_operator on public.locations;
create policy "locations_view_authenticated" on public.locations for select using (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator','viewer']));
create policy "locations_insert_admin_operator" on public.locations for insert with check (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator']));
create policy "locations_update_admin_operator" on public.locations for update using (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator'])) with check (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator']));
create policy "locations_delete_admin_operator" on public.locations for delete using (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator']));

drop policy if exists location_photos_view_authenticated on public.location_photos;
drop policy if exists location_photos_manage_admin_operator on public.location_photos;
create policy "location_photos_view_authenticated" on public.location_photos for select using (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator','viewer']));
create policy "location_photos_manage_admin_operator" on public.location_photos for all using (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator'])) with check (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator']));

drop policy if exists visits_view_authenticated on public.visits;
drop policy if exists visits_manage_admin_operator on public.visits;
create policy "visits_view_authenticated" on public.visits for select using (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator','viewer']));
create policy "visits_manage_admin_operator" on public.visits for all using (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator'])) with check (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator']));

drop policy if exists audit_logs_view_admin on public.audit_logs;
create policy "audit_logs_view_admin" on public.audit_logs for select using (public.is_user_active_for_role(array['admin']));

insert into public.profiles (id, full_name, email, role, active)
select id, raw_user_meta_data->>'full_name', email, 'viewer', true
from auth.users
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, availsize, file_size_limit, allowed_mime_types)
values ('location-photos', 'location-photos', false, 104857600, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do nothing;
