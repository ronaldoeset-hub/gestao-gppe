-- Sincronizacao web do controle financeiro estatico.
-- Necessario para a pagina public/controle-financeiro/index.html salvar dados no Supabase.

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

revoke delete on public.gppe_financial_control_sync from anon, authenticated;
grant select, insert, update on public.gppe_financial_control_sync to anon, authenticated;

drop policy if exists "gppe_financial_control_sync_public_read" on public.gppe_financial_control_sync;
create policy "gppe_financial_control_sync_public_read"
on public.gppe_financial_control_sync
for select
to anon, authenticated
using (true);

drop policy if exists "gppe_financial_control_sync_public_insert" on public.gppe_financial_control_sync;
create policy "gppe_financial_control_sync_public_insert"
on public.gppe_financial_control_sync
for insert
to anon, authenticated
with check (
  unit_id ~ '^UE-[0-9]{2}$'
  and jsonb_typeof(payload) = 'object'
);

drop policy if exists "gppe_financial_control_sync_public_update" on public.gppe_financial_control_sync;
create policy "gppe_financial_control_sync_public_update"
on public.gppe_financial_control_sync
for update
to anon, authenticated
using (unit_id ~ '^UE-[0-9]{2}$')
with check (
  unit_id ~ '^UE-[0-9]{2}$'
  and jsonb_typeof(payload) = 'object'
);
