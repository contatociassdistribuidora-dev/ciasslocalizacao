-- Permite leitura do próprio perfil e administração sem consultar profiles
-- recursivamente dentro de uma policy da própria tabela.
create or replace function public.is_user_active_for_role(required_roles text[])
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.profiles as profile
    where profile.id = auth.uid()
      and profile.active is true
      and profile.role = any(required_roles)
  );
$$;

revoke all on function public.is_user_active_for_role(text[]) from public;
grant execute on function public.is_user_active_for_role(text[]) to authenticated;

drop policy if exists "profiles_self_access" on public.profiles;
create policy "profiles_self_access" on public.profiles
for select to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_admin_manage" on public.profiles;
create policy "profiles_admin_manage" on public.profiles
for all to authenticated
using (public.is_user_active_for_role(array['admin']))
with check (public.is_user_active_for_role(array['admin']));
