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
