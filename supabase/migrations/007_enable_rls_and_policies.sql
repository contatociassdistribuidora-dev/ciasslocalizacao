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

create policy if not exists "profiles_admin_manage" on public.profiles
for all
using (auth.uid() is not null and public.is_user_active_for_role(array['admin']))
with check (auth.uid() is not null and public.is_user_active_for_role(array['admin']));

create policy if not exists "profiles_self_access" on public.profiles
for select
using (auth.uid() = id);

create policy if not exists "profiles_self_update" on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy if not exists "locations_view_authenticated" on public.locations
for select
using (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator','viewer']));

create policy if not exists "locations_insert_admin_operator" on public.locations
for insert
with check (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator']));

create policy if not exists "locations_update_admin_operator" on public.locations
for update
using (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator']))
with check (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator']));

create policy if not exists "locations_delete_admin_operator" on public.locations
for delete
using (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator']));

create policy if not exists "location_photos_view_authenticated" on public.location_photos
for select
using (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator','viewer']));

create policy if not exists "location_photos_manage_admin_operator" on public.location_photos
for all
using (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator']))
with check (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator']));

create policy if not exists "visits_view_authenticated" on public.visits
for select
using (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator','viewer']));

create policy if not exists "visits_manage_admin_operator" on public.visits
for all
using (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator']))
with check (auth.role() = 'authenticated' and public.is_user_active_for_role(array['admin','operator']));

create policy if not exists "audit_logs_view_admin" on public.audit_logs
for select
using (public.is_user_active_for_role(array['admin']));
