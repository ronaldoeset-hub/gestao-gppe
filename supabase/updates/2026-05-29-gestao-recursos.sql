-- 2026-05-29: Módulo Gestão de Recursos v1.0
-- Tabelas: gestao_programas, financeiro_unidade, auditoria_financeira
-- Adiciona cnpj ao school_units (nullable)

-- ── 0. cnpj em school_units ─────────────────────────────────────────────────
alter table public.school_units
  add column if not exists cnpj text,
  add column if not exists status_ativo boolean not null default true;

-- ── 1. Programas ─────────────────────────────────────────────────────────────
create table if not exists public.gestao_programas (
  id         uuid primary key default uuid_generate_v4(),
  nome       text not null unique,
  descricao  text,
  ativo      boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.gestao_programas enable row level security;

drop policy if exists "gestao_programas_read" on public.gestao_programas;
create policy "gestao_programas_read" on public.gestao_programas
  for select using (auth.role() = 'authenticated');

drop policy if exists "gestao_programas_write" on public.gestao_programas;
create policy "gestao_programas_write" on public.gestao_programas
  for all using (public.current_user_role() = 'admin_sme')
  with check (public.current_user_role() = 'admin_sme');

insert into public.gestao_programas (nome, descricao) values
  ('PDDE Básico',              'Programa Dinheiro Direto na Escola – Básico'),
  ('PDDE Qualidade',           'PDDE Ações Integradas – Qualidade'),
  ('Educação Conectada',       'Programa de Inovação Educação Conectada'),
  ('Escola em Tempo Integral', 'Programa Escola em Tempo Integral'),
  ('Sala de Recursos',         'PDDE Estrutura – Sala de Recursos'),
  ('Emendas Parlamentares',    'Recursos via emendas parlamentares'),
  ('Recursos Próprios',        'Recursos municipais próprios'),
  ('Outros',                   'Outros programas e recursos')
on conflict (nome) do nothing;

-- ── 2. Controle financeiro principal ─────────────────────────────────────────
create table if not exists public.financeiro_unidade (
  id                     uuid primary key default uuid_generate_v4(),
  unidade_id             uuid not null references public.school_units(id) on delete cascade,
  programa_id            uuid not null references public.gestao_programas(id) on delete restrict,
  exercicio              integer not null default 2026,

  -- Receitas
  saldo_anterior_custeio numeric(14,2) not null default 0,
  saldo_anterior_capital numeric(14,2) not null default 0,
  creditado_custeio      numeric(14,2) not null default 0,
  creditado_capital      numeric(14,2) not null default 0,
  rendimento_custeio     numeric(14,2) not null default 0,
  rendimento_capital     numeric(14,2) not null default 0,

  -- Despesas
  despesa_custeio        numeric(14,2) not null default 0,
  despesa_capital        numeric(14,2) not null default 0,

  -- Controle
  observacao             text,
  atualizado_por         uuid references public.profiles(id) on delete set null,
  data_atualizacao       timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),

  constraint financeiro_unidade_unique unique (unidade_id, programa_id, exercicio)
);

create index if not exists financeiro_unidade_unidade_exercicio_idx
  on public.financeiro_unidade(unidade_id, exercicio);
create index if not exists financeiro_unidade_programa_idx
  on public.financeiro_unidade(programa_id);

alter table public.financeiro_unidade enable row level security;

drop policy if exists "financeiro_unidade_select" on public.financeiro_unidade;
create policy "financeiro_unidade_select" on public.financeiro_unidade
  for select using (public.current_user_role() in ('admin_sme', 'tecnico_gppe'));

drop policy if exists "financeiro_unidade_insert" on public.financeiro_unidade;
create policy "financeiro_unidade_insert" on public.financeiro_unidade
  for insert with check (public.current_user_role() in ('admin_sme', 'tecnico_gppe'));

drop policy if exists "financeiro_unidade_update" on public.financeiro_unidade;
create policy "financeiro_unidade_update" on public.financeiro_unidade
  for update using (public.current_user_role() in ('admin_sme', 'tecnico_gppe'))
  with check (public.current_user_role() in ('admin_sme', 'tecnico_gppe'));

drop policy if exists "financeiro_unidade_delete" on public.financeiro_unidade;
create policy "financeiro_unidade_delete" on public.financeiro_unidade
  for delete using (public.current_user_role() = 'admin_sme');

-- Trigger updated_at
create or replace function public.set_financeiro_unidade_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  new.data_atualizacao = now();
  return new;
end;
$$;

drop trigger if exists financeiro_unidade_updated_at on public.financeiro_unidade;
create trigger financeiro_unidade_updated_at
  before update on public.financeiro_unidade
  for each row execute function public.set_financeiro_unidade_updated_at();

-- ── 3. Auditoria ─────────────────────────────────────────────────────────────
create table if not exists public.auditoria_financeira (
  id               uuid primary key default uuid_generate_v4(),
  usuario          uuid references public.profiles(id) on delete set null,
  acao             text not null,
  tabela           text not null default 'financeiro_unidade',
  registro_id      uuid,
  data             timestamptz not null default now(),
  dados_anteriores jsonb,
  dados_novos      jsonb
);

create index if not exists auditoria_financeira_data_idx
  on public.auditoria_financeira(data desc);

alter table public.auditoria_financeira enable row level security;

drop policy if exists "auditoria_read" on public.auditoria_financeira;
create policy "auditoria_read" on public.auditoria_financeira
  for select using (public.current_user_role() = 'admin_sme');

drop policy if exists "auditoria_insert" on public.auditoria_financeira;
create policy "auditoria_insert" on public.auditoria_financeira
  for insert with check (public.current_user_role() in ('admin_sme', 'tecnico_gppe'));

-- Trigger de auditoria automática
create or replace function public.trg_auditoria_financeira_unidade()
returns trigger language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' then
    insert into public.auditoria_financeira(acao, registro_id, dados_novos)
    values ('INSERT', new.id, to_jsonb(new));
  elsif tg_op = 'UPDATE' then
    insert into public.auditoria_financeira(acao, registro_id, dados_anteriores, dados_novos)
    values ('UPDATE', new.id, to_jsonb(old), to_jsonb(new));
  elsif tg_op = 'DELETE' then
    insert into public.auditoria_financeira(acao, registro_id, dados_anteriores)
    values ('DELETE', old.id, to_jsonb(old));
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists auditoria_financeira_unidade_trg on public.financeiro_unidade;
create trigger auditoria_financeira_unidade_trg
  after insert or update or delete on public.financeiro_unidade
  for each row execute function public.trg_auditoria_financeira_unidade();
