insert into storage.buckets (id, name, public, availsize, file_size_limit, allowed_mime_types)
values ('location-photos', 'location-photos', false, 104857600, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do nothing;

create policy if not exists "bucket_admin_full_access" on storage.objects
for all
using ((auth.role() = 'authenticated') and public.is_user_active_for_role(array['admin']))
with check ((auth.role() = 'authenticated') and public.is_user_active_for_role(array['admin']));

create policy if not exists "bucket_operator_upload_delete" on storage.objects
for insert
with check ((auth.role() = 'authenticated') and public.is_user_active_for_role(array['admin','operator']));

create policy if not exists "bucket_operator_delete_owned" on storage.objects
for delete
using ((auth.role() = 'authenticated') and public.is_user_active_for_role(array['admin','operator']));

create policy if not exists "bucket_view_authenticated" on storage.objects
for select
using ((auth.role() = 'authenticated') and public.is_user_active_for_role(array['admin','operator','viewer']));
