-- ============================================================
-- AUDITORIA GERAL v2 — EduConecta / GPPE
-- Data: 2026-06-01
-- Objetivo: corrigir problemas críticos, adicionar tabelas
--           faltantes e melhorar segurança geral.
-- ============================================================

-- ============================================================
-- 1. CORREÇÃO CRÍTICA: current_role() deve bloquear 'bloqueado'
-- ============================================================
create or replace function public.current_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid()
    and access_status = 'aprovado'
$$;

create or replace function public.current_school_unit_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select school_unit_id
  from public.profiles
  where id = auth.uid()
    and access_status = 'aprovado'
$$;

-- ============================================================
-- 2. TRIGGER updated_at genérico
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- 3. CORRIGIR profiles — garantir colunas e constraints
-- ============================================================
alter table public.profiles
  add column if not exists updated_at timestamptz default now(),
  add column if not exists updated_by uuid references public.profiles(id) on delete set null,
  add column if not exists deleted_at timestamptz;

-- Garantir que access_status padrão é pendente (novo user)
alter table public.profiles
  alter column access_status set default 'pendente';

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- 4. CORRIGIR school_units — adicionar campos faltantes
-- ============================================================
alter table public.school_units
  add column if not exists cnpj text,
  add column if not exists zip_code text,
  add column if not exists updated_at timestamptz default now(),
  add column if not exists deleted_at timestamptz,
  add column if not exists updated_by uuid references public.profiles(id) on delete set null;

drop trigger if exists school_units_set_updated_at on public.school_units;
create trigger school_units_set_updated_at
  before update on public.school_units
  for each row execute function public.set_updated_at();

-- ============================================================
-- 5. CORRIGIR school_councils — adicionar campos faltantes
-- ============================================================
alter table public.school_councils
  add column if not exists expected_members_count integer,
  add column if not exists student_count integer,
  add column if not exists election_date date,
  add column if not exists possession_date date,
  add column if not exists registry_date date,
  add column if not exists updated_at timestamptz default now(),
  add column if not exists deleted_at timestamptz,
  add column if not exists updated_by uuid references public.profiles(id) on delete set null;

drop trigger if exists school_councils_set_updated_at on public.school_councils;
create trigger school_councils_set_updated_at
  before update on public.school_councils
  for each row execute function public.set_updated_at();

-- ============================================================
-- 6. NOVA TABELA: membros_conselho
-- ============================================================
create table if not exists public.council_members (
  id uuid primary key default gen_random_uuid(),
  council_id uuid not null references public.school_councils(id) on delete cascade,
  name text not null,
  cpf text,
  segment text not null,
  role_in_council text not null default 'membro',
  phone text,
  email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.council_members.segment is
  'Segmento: pais, alunos, professores, servidores, comunidade';
comment on column public.council_members.role_in_council is
  'presidente, vice_presidente, secretario, tesoureiro, membro';

create index if not exists council_members_council_idx on public.council_members(council_id);
create index if not exists council_members_cpf_idx on public.council_members(cpf);

alter table public.council_members enable row level security;

drop trigger if exists council_members_set_updated_at on public.council_members;
create trigger council_members_set_updated_at
  before update on public.council_members
  for each row execute function public.set_updated_at();

drop policy if exists "council_members_select_by_role" on public.council_members;
create policy "council_members_select_by_role" on public.council_members
for select using (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  or exists (
    select 1 from public.school_councils sc
    where sc.id = council_members.council_id
      and sc.school_unit_id = public.current_school_unit_id()
  )
);

drop policy if exists "council_members_staff_write" on public.council_members;
create policy "council_members_staff_write" on public.council_members
for all using (public.current_role() in ('admin_sme', 'tecnico_gppe'))
with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

-- ============================================================
-- 7. NOVA TABELA: audit_logs
-- ============================================================
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  user_email text,
  action text not null,
  entity_type text not null,
  entity_id text,
  old_data jsonb,
  new_data jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

comment on table public.audit_logs is
  'Registro imutável de ações sensíveis no sistema';
comment on column public.audit_logs.action is
  'Ex: create, update, delete, approve_user, block_user, submit_accountability';
comment on column public.audit_logs.entity_type is
  'Ex: profiles, school_units, financial_allocations, accountabilities';

create index if not exists audit_logs_user_idx on public.audit_logs(user_id);
create index if not exists audit_logs_entity_idx on public.audit_logs(entity_type, entity_id);
create index if not exists audit_logs_created_at_idx on public.audit_logs(created_at desc);
create index if not exists audit_logs_action_idx on public.audit_logs(action);

alter table public.audit_logs enable row level security;

drop policy if exists "audit_logs_admin_select" on public.audit_logs;
create policy "audit_logs_admin_select" on public.audit_logs
for select using (public.current_role() in ('admin_sme', 'tecnico_gppe'));

-- Ninguém atualiza ou deleta audit_logs diretamente
drop policy if exists "audit_logs_insert_server" on public.audit_logs;
create policy "audit_logs_insert_server" on public.audit_logs
for insert with check (true);

-- ============================================================
-- 8. NOVA TABELA: notificacoes
-- ============================================================
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  school_unit_id uuid references public.school_units(id) on delete cascade,
  title text not null,
  body text not null,
  type text not null default 'info',
  entity_type text,
  entity_id text,
  is_read boolean not null default false,
  read_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

comment on column public.notifications.type is
  'info, warning, danger, success';
comment on column public.notifications.entity_type is
  'Tipo do objeto relacionado: council, accountability, alert, etc.';

create index if not exists notifications_user_idx on public.notifications(user_id, is_read);
create index if not exists notifications_school_idx on public.notifications(school_unit_id);
create index if not exists notifications_created_at_idx on public.notifications(created_at desc);

alter table public.notifications enable row level security;

drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own" on public.notifications
for select using (
  user_id = auth.uid()
  or (
    user_id is null
    and school_unit_id = public.current_school_unit_id()
  )
  or public.current_role() in ('admin_sme', 'tecnico_gppe')
);

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications
for update using (user_id = auth.uid() or public.current_role() in ('admin_sme'))
with check (user_id = auth.uid() or public.current_role() in ('admin_sme'));

drop policy if exists "notifications_staff_insert" on public.notifications;
create policy "notifications_staff_insert" on public.notifications
for insert with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

-- ============================================================
-- 9. NOVA TABELA: system_settings
-- ============================================================
create table if not exists public.system_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text,
  value_json jsonb,
  description text,
  is_public boolean not null default false,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create index if not exists system_settings_key_idx on public.system_settings(key);

alter table public.system_settings enable row level security;

drop policy if exists "system_settings_select" on public.system_settings;
create policy "system_settings_select" on public.system_settings
for select using (
  is_public = true
  or public.current_role() in ('admin_sme', 'tecnico_gppe')
);

drop policy if exists "system_settings_admin_write" on public.system_settings;
create policy "system_settings_admin_write" on public.system_settings
for all using (public.current_role() = 'admin_sme')
with check (public.current_role() = 'admin_sme');

-- ============================================================
-- 10. NOVA TABELA: feature_flags
-- ============================================================
create table if not exists public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  enabled boolean not null default false,
  description text,
  allowed_roles text[] default '{}',
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.feature_flags enable row level security;

drop policy if exists "feature_flags_select_authenticated" on public.feature_flags;
create policy "feature_flags_select_authenticated" on public.feature_flags
for select using (auth.role() = 'authenticated');

drop policy if exists "feature_flags_admin_write" on public.feature_flags;
create policy "feature_flags_admin_write" on public.feature_flags
for all using (public.current_role() = 'admin_sme')
with check (public.current_role() = 'admin_sme');

-- ============================================================
-- 11. SEGURANÇA: Revogar write anon de gppe_financial_control_sync
-- ============================================================
revoke insert, update on public.gppe_financial_control_sync from anon;
grant select on public.gppe_financial_control_sync to anon;

drop policy if exists "gppe_financial_control_sync_public_insert" on public.gppe_financial_control_sync;
drop policy if exists "gppe_financial_control_sync_public_update" on public.gppe_financial_control_sync;

drop policy if exists "gppe_financial_control_sync_auth_insert" on public.gppe_financial_control_sync;
create policy "gppe_financial_control_sync_auth_insert"
on public.gppe_financial_control_sync
for insert
to authenticated
with check (
  unit_id ~ '^UE-[0-9]{2}$'
  and jsonb_typeof(payload) = 'object'
  and public.current_role() in ('admin_sme', 'tecnico_gppe')
);

drop policy if exists "gppe_financial_control_sync_auth_update" on public.gppe_financial_control_sync;
create policy "gppe_financial_control_sync_auth_update"
on public.gppe_financial_control_sync
for update
to authenticated
using (unit_id ~ '^UE-[0-9]{2}$')
with check (
  unit_id ~ '^UE-[0-9]{2}$'
  and jsonb_typeof(payload) = 'object'
  and public.current_role() in ('admin_sme', 'tecnico_gppe')
);

-- ============================================================
-- 12. TRIGGERS updated_at nas tabelas financeiras
-- ============================================================
drop trigger if exists financial_allocations_updated_at on public.financial_allocations;
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'financial_allocations'
      and column_name = 'updated_at'
  ) then
    alter table public.financial_allocations add column updated_at timestamptz default now();
  end if;
end $$;

create trigger financial_allocations_updated_at
  before update on public.financial_allocations
  for each row execute function public.set_updated_at();

-- ============================================================
-- 13. VIEW: ranking de saldos parados
-- ============================================================
create or replace view public.v_ranking_saldos_parados as
select
  unit.id as school_unit_id,
  unit.name as escola,
  unit.type as tipo,
  coalesce(sum(fa.current_balance), 0) as saldo_total_parado,
  coalesce(sum(fa.received_amount), 0) as total_recebido,
  coalesce(sum(fa.received_amount - fa.current_balance), 0) as total_executado,
  case
    when coalesce(sum(fa.received_amount), 0) = 0 then 0
    else round(
      (coalesce(sum(fa.received_amount - fa.current_balance), 0) /
       coalesce(sum(fa.received_amount), 1)) * 100, 1
    )
  end as percentual_execucao,
  count(fa.id) as num_alocacoes,
  max(fa.released_at) as ultima_liberacao
from public.school_units unit
left join public.financial_allocations fa
  on fa.school_unit_id = unit.id
  and fa.status not in ('encerrado')
where unit.active = true
  and unit.deleted_at is null
group by unit.id, unit.name, unit.type
order by saldo_total_parado desc;

-- ============================================================
-- 14. VIEW: conselhos vencidos e vencendo em 90 dias
-- ============================================================
create or replace view public.v_conselhos_situacao as
select
  sc.id,
  unit.name as escola,
  unit.id as school_unit_id,
  sc.president_name as presidente,
  sc.mandate_start as inicio_mandato,
  sc.mandate_end as fim_mandato,
  sc.members_count as membros_ativos,
  sc.expected_members_count as membros_previstos,
  sc.student_count as alunos,
  sc.status,
  case
    when sc.mandate_end < current_date then 'vencido'
    when sc.mandate_end <= current_date + interval '90 days' then 'vencendo_90d'
    else 'regular'
  end as situacao_mandato,
  (current_date - sc.mandate_end) as dias_vencido,
  sc.registry_date as data_cartorio,
  sc.possession_date as data_posse,
  sc.election_date as data_eleicao
from public.school_councils sc
join public.school_units unit on unit.id = sc.school_unit_id
where sc.deleted_at is null
  and unit.deleted_at is null
order by sc.mandate_end asc;

-- ============================================================
-- 15. VIEW: resumo financeiro por escola (para dashboard)
-- ============================================================
create or replace view public.v_financial_summary as
select
  unit.id as school_unit_id,
  unit.name as escola,
  coalesce(sum(fa.received_amount), 0) as total_recebido,
  coalesce(sum(fa.received_amount - fa.current_balance), 0) as total_executado,
  coalesce(sum(fa.current_balance), 0) as saldo_disponivel,
  count(fa.id) as num_programas,
  count(case when fa.status = 'atencao' then 1 end) as programas_atencao,
  count(case when fa.status = 'pendente' then 1 end) as programas_pendentes
from public.school_units unit
left join public.financial_allocations fa on fa.school_unit_id = unit.id
where unit.active = true
  and unit.deleted_at is null
group by unit.id, unit.name
order by unit.name;

-- VIEW global SME (sem filtro por escola)
create or replace view public.v_dashboard_sme as
select
  count(distinct unit.id) as total_unidades,
  coalesce(sum(fa.received_amount), 0) as total_recebido,
  coalesce(sum(fa.received_amount - fa.current_balance), 0) as total_executado,
  coalesce(sum(fa.current_balance), 0) as saldo_disponivel,
  (
    select count(*) from public.school_councils sc
    where sc.mandate_end < current_date
      and sc.deleted_at is null
  ) as conselhos_vencidos,
  (
    select count(*) from public.school_councils sc
    where sc.mandate_end between current_date and current_date + interval '90 days'
      and sc.deleted_at is null
  ) as conselhos_vencendo_90d,
  (
    select count(*) from public.financial_accountability_reports r
    where r.status in ('pendente', 'vencido')
  ) as prestacoes_pendentes
from public.school_units unit
left join public.financial_allocations fa on fa.school_unit_id = unit.id
where unit.active = true
  and unit.deleted_at is null;

-- ============================================================
-- 16. SEEDS: system_settings iniciais
-- ============================================================
insert into public.system_settings (key, value, description, is_public)
values
  ('app_name', 'EduConecta', 'Nome do sistema', true),
  ('app_slogan', 'Gestão Educacional Inteligente', 'Slogan do sistema', true),
  ('municipio', 'Águas Lindas de Goiás', 'Município', true),
  ('estado', 'Goiás', 'Estado', true),
  ('secretaria', 'Secretaria Municipal de Educação', 'Nome da secretaria', true),
  ('sigla_secretaria', 'SME', 'Sigla da secretaria', true),
  ('gerencia', 'Gerência de Projetos e Programas Educacionais', 'Nome da gerência', true),
  ('sigla_gerencia', 'GPPE', 'Sigla da gerência', true),
  ('ano_exercicio', '2026', 'Ano do exercício fiscal corrente', true),
  ('prazo_saldo_parado', '2027-02-20', 'Prazo final para execução antes de devolução', true),
  ('alerta_saldo_parado_ativo', 'true', 'Exibir alerta de saldo parado no painel', true),
  ('contato_email', 'gppe@aguaslindasdegoias.go.gov.br', 'E-mail de contato da GPPE', true),
  ('aprovacao_usuarios_automatica', 'false', 'Aprovar usuários automaticamente ao cadastrar', false)
on conflict (key) do nothing;

-- ============================================================
-- 17. SEEDS: feature_flags iniciais
-- ============================================================
insert into public.feature_flags (key, enabled, description, allowed_roles)
values
  ('modulo_ia', false, 'Módulo de IA Educacional', '{"admin_sme"}'),
  ('modulo_analytics', false, 'Módulo de Analytics avançado', '{"admin_sme", "tecnico_gppe"}'),
  ('notificacoes_email', false, 'Enviar notificações por e-mail', '{"admin_sme"}'),
  ('notificacoes_whatsapp', false, 'Enviar notificações por WhatsApp', '{"admin_sme"}'),
  ('exportacao_pdf', true, 'Exportar relatórios em PDF', '{"admin_sme", "tecnico_gppe"}'),
  ('exportacao_excel', true, 'Exportar dados em CSV/Excel', '{"admin_sme", "tecnico_gppe"}'),
  ('modo_manutencao', false, 'Modo de manutenção — bloqueia acesso', '{}')
on conflict (key) do nothing;

-- ============================================================
-- 18. SEEDS: financial_programs completos (10 programas GPPE)
-- ============================================================
insert into public.financial_programs (code, name, source, description, active)
values
  ('PDDE-BASICO',       'PDDE Básico',                'Federal', 'Programa Dinheiro Direto na Escola — Básico', true),
  ('PDDE-EDUC-FAMILIA', 'PDDE Educação e Família',    'Federal', 'PDDE Educação e Família', true),
  ('PDDE-ESC-COMUN',    'PDDE Escola e Comunidade',   'Federal', 'PDDE Escola e Comunidade', true),
  ('PNAE',              'PNAE',                       'Federal', 'Programa Nacional de Alimentação Escolar', true),
  ('PNATE',             'PNATE',                      'Federal', 'Programa Nacional de Apoio ao Transporte Escolar', true),
  ('PTE',               'PTE',                        'Federal', 'Programa de Transporte Escolar', true),
  ('TEMPO-INTEGRAL',    'Tempo Integral',             'Federal', 'Programa de Escola em Tempo Integral', true),
  ('MP',                'MP',                         'Federal', 'Medida Provisória / Recursos Extraordinários', true),
  ('APOIO-SUPLEMENTAR', 'Apoio Suplementar',          'Municipal', 'Recursos suplementares municipais', true),
  ('BRASIL-CARINHOSO',  'Brasil Carinhoso',           'Federal', 'Programa Brasil Carinhoso', true)
on conflict (code) do nothing;

-- ============================================================
-- 19. INDEX: melhorar performance de queries frequentes
-- ============================================================
create index if not exists profiles_access_status_idx on public.profiles(access_status);
create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists school_units_active_idx on public.school_units(active) where active = true;
create index if not exists school_councils_mandate_end_idx on public.school_councils(mandate_end);
create index if not exists school_councils_school_unit_idx on public.school_councils(school_unit_id);
create index if not exists financial_allocations_balance_idx on public.financial_allocations(current_balance desc);
