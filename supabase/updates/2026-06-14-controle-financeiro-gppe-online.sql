-- Controle financeiro online: somente equipe GPPE aprovada pode ler e gravar.

create table if not exists public.gppe_financial_control_sync (
  unit_id text primary key,
  unit_name text not null,
  payload jsonb not null default '{}'::jsonb,
  updated_by text,
  updated_at timestamptz not null default now()
);

create index if not exists idx_gppe_financial_control_sync_updated_at
  on public.gppe_financial_control_sync (updated_at desc);

alter table public.gppe_financial_control_sync enable row level security;

revoke all on public.gppe_financial_control_sync from anon, authenticated;
grant select, insert, update on public.gppe_financial_control_sync to authenticated;

drop policy if exists "gppe_financial_control_sync_public_read" on public.gppe_financial_control_sync;
drop policy if exists "gppe_financial_control_sync_public_insert" on public.gppe_financial_control_sync;
drop policy if exists "gppe_financial_control_sync_public_update" on public.gppe_financial_control_sync;
drop policy if exists "sync_select_authenticated" on public.gppe_financial_control_sync;
drop policy if exists "sync_select_anon" on public.gppe_financial_control_sync;
drop policy if exists "sync_insert_authenticated" on public.gppe_financial_control_sync;
drop policy if exists "sync_update_authenticated" on public.gppe_financial_control_sync;

create policy "sync_select_gppe_staff"
on public.gppe_financial_control_sync
for select
to authenticated
using (public.current_role() in ('admin_sme', 'tecnico_gppe'));

create policy "sync_insert_gppe_staff"
on public.gppe_financial_control_sync
for insert
to authenticated
with check (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  and unit_id ~ '^UE-[0-9]{2}$'
  and jsonb_typeof(payload) = 'object'
  and octet_length(payload::text) < 524288
);

create policy "sync_update_gppe_staff"
on public.gppe_financial_control_sync
for update
to authenticated
using (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  and unit_id ~ '^UE-[0-9]{2}$'
)
with check (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  and unit_id ~ '^UE-[0-9]{2}$'
  and jsonb_typeof(payload) = 'object'
  and octet_length(payload::text) < 524288
);
