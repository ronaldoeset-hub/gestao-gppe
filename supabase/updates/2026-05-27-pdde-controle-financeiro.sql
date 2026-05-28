-- 2026-05-27: Controle financeiro PDDE por escola

create table if not exists public.pdde_programs (
  id uuid primary key default uuid_generate_v4(),
  group_name text not null,
  program_name text not null,
  sort_order integer not null default 0,
  active boolean not null default true
);

create index if not exists pdde_programs_sort_idx on public.pdde_programs(sort_order);

alter table public.pdde_programs enable row level security;

drop policy if exists "pdde_programs_authenticated_read" on public.pdde_programs;
create policy "pdde_programs_authenticated_read" on public.pdde_programs
for select using (auth.role() = 'authenticated');

drop policy if exists "pdde_programs_staff_write" on public.pdde_programs;
create policy "pdde_programs_staff_write" on public.pdde_programs
for all using (public.current_role() in ('admin_sme', 'tecnico_gppe'))
with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

-- Balances per school per program per year
create table if not exists public.pdde_balances (
  id uuid primary key default uuid_generate_v4(),
  school_unit_id uuid not null references public.school_units(id) on delete cascade,
  program_id uuid not null references public.pdde_programs(id) on delete cascade,
  exercise_year integer not null default 2026,
  saldo_anterior_c numeric(14,2) not null default 0,
  saldo_anterior_k numeric(14,2) not null default 0,
  valor_creditado_c numeric(14,2) not null default 0,
  valor_creditado_k numeric(14,2) not null default 0,
  rendimento_c numeric(14,2) not null default 0,
  rendimento_k numeric(14,2) not null default 0,
  valor_gasto_c numeric(14,2) not null default 0,
  valor_gasto_k numeric(14,2) not null default 0,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null,
  constraint pdde_balances_unique unique (school_unit_id, program_id, exercise_year)
);

create index if not exists pdde_balances_school_year_idx on public.pdde_balances(school_unit_id, exercise_year);

alter table public.pdde_balances enable row level security;

drop policy if exists "pdde_balances_select" on public.pdde_balances;
create policy "pdde_balances_select" on public.pdde_balances
for select using (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  or school_unit_id = public.current_school_unit_id()
);

drop policy if exists "pdde_balances_staff_insert" on public.pdde_balances;
create policy "pdde_balances_staff_insert" on public.pdde_balances
for insert with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

drop policy if exists "pdde_balances_staff_update" on public.pdde_balances;
create policy "pdde_balances_staff_update" on public.pdde_balances
for update using (public.current_role() in ('admin_sme', 'tecnico_gppe'))
with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

create or replace function public.set_pdde_balances_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists pdde_balances_updated_at on public.pdde_balances;
create trigger pdde_balances_updated_at
before update on public.pdde_balances
for each row execute function public.set_pdde_balances_updated_at();

-- Programas PDDE (dados de referencia)
insert into public.pdde_programs (group_name, program_name, sort_order) values
('PDDE', 'PDDE BASICO (ATUAL)',     10),
('PDDE', 'PDDE BASICO (VELHO)',     20),
('PDDE', 'DESEMPENHO',              30),
('QUALIDADE', 'ED. CONECTADA',      40),
('QUALIDADE', 'CANTINHO DA LEITURA',50),
('QUALIDADE', 'EDUCACAO E FAMILIA', 60),
('QUALIDADE', 'ESCOLA E COMUNIDADE',70),
('QUALIDADE', 'TEMPO DE APRENDER',  80),
('QUALIDADE', 'MAIS ALFABETIZACAO', 90),
('QUALIDADE', 'EMERGENCIAL',        100),
('PDDE ESTRUTURA', 'CAMPO',         110),
('PDDE ESTRUTURA', 'SALA DE RECURSO',120),
('PDDE-INTEGRAL', 'INTEGRAL',       130)
on conflict do nothing;
