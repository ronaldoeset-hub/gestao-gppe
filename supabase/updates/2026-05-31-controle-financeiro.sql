-- Migration: controle financeiro GPPE
-- Data: 2026-05-31
-- Objetivo: criar uma estrutura parecida com a planilha original de controle financeiro,
-- mas normalizada para uso no Supabase.

create extension if not exists "uuid-ossp";

do $$
begin
  create type public.financial_resource_type as enum ('custeio', 'capital', 'outros');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.financial_allocation_status as enum ('regular', 'atencao', 'pendente', 'vencido', 'encerrado');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.financial_item_status as enum ('planejado', 'aprovado', 'comprado', 'cancelado');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.financial_movement_type as enum ('compra', 'pagamento', 'devolucao', 'ajuste', 'cancelamento');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.financial_report_status as enum ('pendente', 'em_analise', 'aprovado', 'reprovado', 'vencido');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.financial_periods (
  id uuid primary key default uuid_generate_v4(),
  year integer not null,
  label text not null,
  starts_at date,
  ends_at date,
  status text not null default 'ativo',
  notes text,
  created_at timestamptz not null default now(),
  unique (year, label)
);

create table if not exists public.financial_programs (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  name text not null,
  source text,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.financial_allocations (
  id uuid primary key default uuid_generate_v4(),
  school_unit_id uuid not null references public.school_units(id) on delete cascade,
  program_id uuid references public.financial_programs(id) on delete set null,
  period_id uuid references public.financial_periods(id) on delete set null,
  resource_type public.financial_resource_type not null default 'custeio',
  planned_amount numeric(14,2) not null default 0,
  received_amount numeric(14,2) not null default 0,
  released_at date,
  current_balance numeric(14,2) not null default 0,
  status public.financial_allocation_status not null default 'regular',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.financial_plan_items (
  id uuid primary key default uuid_generate_v4(),
  allocation_id uuid not null references public.financial_allocations(id) on delete cascade,
  item_name text not null,
  category text,
  quantity numeric(14,3) not null default 0,
  unit_label text,
  unit_price numeric(14,2) not null default 0,
  planned_total numeric(14,2) generated always as (round((quantity * unit_price)::numeric, 2)) stored,
  priority text,
  status public.financial_item_status not null default 'planejado',
  source_observation text,
  created_at timestamptz not null default now()
);

create table if not exists public.financial_suppliers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  cnpj text,
  cpf text,
  category text,
  phone text,
  email text,
  address text,
  bank_name text,
  agency text,
  account_number text,
  pix_key text,
  notes text,
  created_at timestamptz not null default now(),
  constraint financial_suppliers_document_check check (
    cnpj is not null or cpf is not null or name is not null
  )
);

create table if not exists public.financial_movements (
  id uuid primary key default uuid_generate_v4(),
  allocation_id uuid not null references public.financial_allocations(id) on delete cascade,
  plan_item_id uuid references public.financial_plan_items(id) on delete set null,
  supplier_id uuid references public.financial_suppliers(id) on delete set null,
  movement_type public.financial_movement_type not null default 'compra',
  document_number text,
  issued_at date,
  paid_at date,
  amount numeric(14,2) not null default 0,
  payment_method text,
  status text not null default 'pendente',
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.financial_documents (
  id uuid primary key default uuid_generate_v4(),
  school_unit_id uuid not null references public.school_units(id) on delete cascade,
  allocation_id uuid references public.financial_allocations(id) on delete set null,
  movement_id uuid references public.financial_movements(id) on delete set null,
  document_id uuid references public.documents(id) on delete set null,
  category text not null,
  title text not null,
  document_number text,
  storage_path text,
  mime_type text,
  file_size bigint,
  document_date date,
  competence text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.financial_accountability_reports (
  id uuid primary key default uuid_generate_v4(),
  school_unit_id uuid not null references public.school_units(id) on delete cascade,
  program_id uuid references public.financial_programs(id) on delete set null,
  period_id uuid references public.financial_periods(id) on delete set null,
  reference text not null,
  due_date date not null,
  submitted_at date,
  status public.financial_report_status not null default 'pendente',
  planned_amount numeric(14,2) not null default 0,
  executed_amount numeric(14,2) not null default 0,
  balance numeric(14,2) not null default 0,
  technical_opinion text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.financial_alerts (
  id uuid primary key default uuid_generate_v4(),
  school_unit_id uuid references public.school_units(id) on delete cascade,
  program_id uuid references public.financial_programs(id) on delete set null,
  period_id uuid references public.financial_periods(id) on delete set null,
  title text not null,
  description text not null,
  severity public.alert_severity not null default 'media',
  due_date date,
  status text not null default 'aberto',
  resolved_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists financial_periods_year_idx on public.financial_periods(year);
create index if not exists financial_programs_code_idx on public.financial_programs(code);
create index if not exists financial_allocations_school_idx on public.financial_allocations(school_unit_id);
create index if not exists financial_allocations_program_idx on public.financial_allocations(program_id);
create index if not exists financial_allocations_period_idx on public.financial_allocations(period_id);
create index if not exists financial_allocations_type_idx on public.financial_allocations(resource_type);
create index if not exists financial_plan_items_allocation_idx on public.financial_plan_items(allocation_id);
create index if not exists financial_plan_items_status_idx on public.financial_plan_items(status);
create index if not exists financial_movements_allocation_idx on public.financial_movements(allocation_id);
create index if not exists financial_movements_item_idx on public.financial_movements(plan_item_id);
create index if not exists financial_movements_paid_at_idx on public.financial_movements(paid_at);
create index if not exists financial_documents_school_idx on public.financial_documents(school_unit_id);
create index if not exists financial_documents_allocation_idx on public.financial_documents(allocation_id);
create index if not exists financial_reports_school_idx on public.financial_accountability_reports(school_unit_id);
create index if not exists financial_reports_due_date_idx on public.financial_accountability_reports(due_date);
create index if not exists financial_alerts_school_idx on public.financial_alerts(school_unit_id);
create index if not exists financial_alerts_due_date_idx on public.financial_alerts(due_date);

alter table public.financial_periods enable row level security;
alter table public.financial_programs enable row level security;
alter table public.financial_allocations enable row level security;
alter table public.financial_plan_items enable row level security;
alter table public.financial_suppliers enable row level security;
alter table public.financial_movements enable row level security;
alter table public.financial_documents enable row level security;
alter table public.financial_accountability_reports enable row level security;
alter table public.financial_alerts enable row level security;

drop policy if exists "financial_periods_select_authenticated" on public.financial_periods;
create policy "financial_periods_select_authenticated" on public.financial_periods
for select using (auth.role() = 'authenticated');

drop policy if exists "financial_periods_staff_write" on public.financial_periods;
create policy "financial_periods_staff_write" on public.financial_periods
for all using (public.current_role() in ('admin_sme', 'tecnico_gppe'))
with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

drop policy if exists "financial_programs_select_authenticated" on public.financial_programs;
create policy "financial_programs_select_authenticated" on public.financial_programs
for select using (auth.role() = 'authenticated');

drop policy if exists "financial_programs_staff_write" on public.financial_programs;
create policy "financial_programs_staff_write" on public.financial_programs
for all using (public.current_role() in ('admin_sme', 'tecnico_gppe'))
with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

drop policy if exists "financial_allocations_select_by_role" on public.financial_allocations;
create policy "financial_allocations_select_by_role" on public.financial_allocations
for select using (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  or school_unit_id = public.current_school_unit_id()
);

drop policy if exists "financial_allocations_staff_write" on public.financial_allocations;
create policy "financial_allocations_staff_write" on public.financial_allocations
for all using (public.current_role() in ('admin_sme', 'tecnico_gppe'))
with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

drop policy if exists "financial_plan_items_select_by_role" on public.financial_plan_items;
create policy "financial_plan_items_select_by_role" on public.financial_plan_items
for select using (
  exists (
    select 1
    from public.financial_allocations allocation
    where allocation.id = financial_plan_items.allocation_id
      and (
        public.current_role() in ('admin_sme', 'tecnico_gppe')
        or allocation.school_unit_id = public.current_school_unit_id()
      )
  )
);

drop policy if exists "financial_plan_items_write_by_role" on public.financial_plan_items;
create policy "financial_plan_items_write_by_role" on public.financial_plan_items
for all using (
  exists (
    select 1
    from public.financial_allocations allocation
    where allocation.id = financial_plan_items.allocation_id
      and (
        public.current_role() in ('admin_sme', 'tecnico_gppe')
        or allocation.school_unit_id = public.current_school_unit_id()
      )
  )
)
with check (
  exists (
    select 1
    from public.financial_allocations allocation
    where allocation.id = financial_plan_items.allocation_id
      and (
        public.current_role() in ('admin_sme', 'tecnico_gppe')
        or allocation.school_unit_id = public.current_school_unit_id()
      )
  )
);

drop policy if exists "financial_suppliers_select_staff" on public.financial_suppliers;
create policy "financial_suppliers_select_staff" on public.financial_suppliers
for select using (public.current_role() in ('admin_sme', 'tecnico_gppe'));

drop policy if exists "financial_suppliers_staff_write" on public.financial_suppliers;
create policy "financial_suppliers_staff_write" on public.financial_suppliers
for all using (public.current_role() in ('admin_sme', 'tecnico_gppe'))
with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

drop policy if exists "financial_movements_select_by_role" on public.financial_movements;
create policy "financial_movements_select_by_role" on public.financial_movements
for select using (
  exists (
    select 1
    from public.financial_allocations allocation
    where allocation.id = financial_movements.allocation_id
      and (
        public.current_role() in ('admin_sme', 'tecnico_gppe')
        or allocation.school_unit_id = public.current_school_unit_id()
      )
  )
);

drop policy if exists "financial_movements_write_by_role" on public.financial_movements;
create policy "financial_movements_write_by_role" on public.financial_movements
for all using (
  exists (
    select 1
    from public.financial_allocations allocation
    where allocation.id = financial_movements.allocation_id
      and (
        public.current_role() in ('admin_sme', 'tecnico_gppe')
        or allocation.school_unit_id = public.current_school_unit_id()
      )
  )
)
with check (
  exists (
    select 1
    from public.financial_allocations allocation
    where allocation.id = financial_movements.allocation_id
      and (
        public.current_role() in ('admin_sme', 'tecnico_gppe')
        or allocation.school_unit_id = public.current_school_unit_id()
      )
  )
);

drop policy if exists "financial_documents_select_by_role" on public.financial_documents;
create policy "financial_documents_select_by_role" on public.financial_documents
for select using (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  or school_unit_id = public.current_school_unit_id()
);

drop policy if exists "financial_documents_write_by_role" on public.financial_documents;
create policy "financial_documents_write_by_role" on public.financial_documents
for all using (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  or school_unit_id = public.current_school_unit_id()
)
with check (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  or school_unit_id = public.current_school_unit_id()
);

drop policy if exists "financial_reports_select_by_role" on public.financial_accountability_reports;
create policy "financial_reports_select_by_role" on public.financial_accountability_reports
for select using (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  or school_unit_id = public.current_school_unit_id()
);

drop policy if exists "financial_reports_write_by_role" on public.financial_accountability_reports;
create policy "financial_reports_write_by_role" on public.financial_accountability_reports
for all using (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  or school_unit_id = public.current_school_unit_id()
)
with check (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  or school_unit_id = public.current_school_unit_id()
);

drop policy if exists "financial_alerts_select_by_role" on public.financial_alerts;
create policy "financial_alerts_select_by_role" on public.financial_alerts
for select using (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  or school_unit_id = public.current_school_unit_id()
  or school_unit_id is null
);

drop policy if exists "financial_alerts_staff_write" on public.financial_alerts;
create policy "financial_alerts_staff_write" on public.financial_alerts
for all using (public.current_role() in ('admin_sme', 'tecnico_gppe'))
with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

create or replace view public.v_controle_financeiro_original_like as
select
  unit.name as unidade_escolar,
  upper(allocation.resource_type::text) as tipo_de_recurso,
  item.item_name as item,
  item.quantity as quantidade,
  item.unit_label as unidade,
  item.unit_price as valor_unitario,
  item.planned_total as valor_total,
  item.source_observation as observacao,
  program.code as programa_codigo,
  program.name as programa_nome,
  period.year as periodo_ano,
  allocation.status as status_alocacao
from public.financial_plan_items item
join public.financial_allocations allocation on allocation.id = item.allocation_id
join public.school_units unit on unit.id = allocation.school_unit_id
left join public.financial_programs program on program.id = allocation.program_id
left join public.financial_periods period on period.id = allocation.period_id;

insert into public.financial_periods (year, label, starts_at, ends_at, status, notes)
values (2026, 'Exercicio 2026', '2026-01-01', '2026-12-31', 'ativo', 'Periodo inicial para controle financeiro GPPE')
on conflict (year, label) do nothing;

insert into public.financial_programs (code, name, source, description, active)
values
  ('PDDE-BASICO', 'PDDE Basico', 'Federal', 'Programa Dinheiro Direto na Escola', true),
  ('MUNICIPAL', 'Recurso Municipal', 'Municipal', 'Recursos proprios do municipio', true)
on conflict (code) do nothing;

