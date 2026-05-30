-- 2026-05-29: Tabela de controle financeiro com catálogo fixo por código
-- Substitui dependência de pdde_programs (UUIDs) por programa_codigo (texto).

create table if not exists public.financeiro_balances (
  id               uuid primary key default uuid_generate_v4(),
  school_unit_id   uuid not null references public.school_units(id) on delete cascade,
  programa_codigo  text not null,
  exercise_year    integer not null default 2026,
  saldo_anterior_c  numeric(14,2) not null default 0,
  saldo_anterior_k  numeric(14,2) not null default 0,
  valor_creditado_c numeric(14,2) not null default 0,
  valor_creditado_k numeric(14,2) not null default 0,
  rendimento_c      numeric(14,2) not null default 0,
  rendimento_k      numeric(14,2) not null default 0,
  valor_gasto_c     numeric(14,2) not null default 0,
  valor_gasto_k     numeric(14,2) not null default 0,
  updated_at        timestamptz not null default now(),
  updated_by        uuid references public.profiles(id) on delete set null,
  constraint financeiro_balances_unique unique (school_unit_id, programa_codigo, exercise_year)
);

create index if not exists financeiro_balances_school_year_idx
  on public.financeiro_balances(school_unit_id, exercise_year);

alter table public.financeiro_balances enable row level security;

-- Leitura: admin e tecnico vêem tudo; outros vêem apenas a própria unidade
drop policy if exists "financeiro_select" on public.financeiro_balances;
create policy "financeiro_select" on public.financeiro_balances
for select using (
  public.current_user_role() in ('admin_sme', 'tecnico_gppe')
  or school_unit_id = public.current_user_school_unit()
);

-- Inserção e edição: somente admin e tecnico
drop policy if exists "financeiro_insert" on public.financeiro_balances;
create policy "financeiro_insert" on public.financeiro_balances
for insert with check (
  public.current_user_role() in ('admin_sme', 'tecnico_gppe')
);

drop policy if exists "financeiro_update" on public.financeiro_balances;
create policy "financeiro_update" on public.financeiro_balances
for update using (
  public.current_user_role() in ('admin_sme', 'tecnico_gppe')
) with check (
  public.current_user_role() in ('admin_sme', 'tecnico_gppe')
);

-- Trigger updated_at
create or replace function public.set_financeiro_balances_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists financeiro_balances_updated_at on public.financeiro_balances;
create trigger financeiro_balances_updated_at
before update on public.financeiro_balances
for each row execute function public.set_financeiro_balances_updated_at();
