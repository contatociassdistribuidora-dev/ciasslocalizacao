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
