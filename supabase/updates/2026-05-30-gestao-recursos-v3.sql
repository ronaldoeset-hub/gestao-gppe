-- 2026-05-30: Gestão de Recursos v3
-- Novos campos: fonte_recurso, situacao_programa, tipo_programa
-- Nova tabela: fontes_recurso

-- ── 1. Fontes de recurso ──────────────────────────────────────────────────────
create table if not exists public.fontes_recurso (
  id     uuid primary key default uuid_generate_v4(),
  nome   text not null unique,
  ativo  boolean not null default true
);

alter table public.fontes_recurso enable row level security;

drop policy if exists "fontes_recurso_read" on public.fontes_recurso;
create policy "fontes_recurso_read" on public.fontes_recurso
  for select using (auth.role() = 'authenticated');

drop policy if exists "fontes_recurso_write" on public.fontes_recurso;
create policy "fontes_recurso_write" on public.fontes_recurso
  for all using (public.current_user_role() = 'admin_sme')
  with check (public.current_user_role() = 'admin_sme');

insert into public.fontes_recurso (nome) values
  ('Federal'),
  ('Estadual'),
  ('Municipal'),
  ('FNDE'),
  ('Emenda Parlamentar Federal'),
  ('Emenda Parlamentar Estadual'),
  ('Recursos Próprios'),
  ('Outros')
on conflict (nome) do nothing;

-- ── 2. Campos extras em financeiro_unidade ────────────────────────────────────
alter table public.financeiro_unidade
  add column if not exists fonte_recurso_id  uuid references public.fontes_recurso(id) on delete set null,
  add column if not exists situacao_programa text
    constraint financeiro_unidade_situacao_check
    check (situacao_programa in ('Em Execução','Encerrado','Reprogramado','Aguardando Utilização')),
  add column if not exists tipo_programa     text not null default 'Custeio e Capital'
    constraint financeiro_unidade_tipo_check
    check (tipo_programa in ('Custeio','Capital','Custeio e Capital'));

-- ── 3. Garantir observacao_tecnica ───────────────────────────────────────────
-- (idempotente – não falha se já existir)
alter table public.financeiro_unidade
  add column if not exists observacao_tecnica text;

-- ── 4. Campos de gestores na school_units (completar v2) ─────────────────────
alter table public.school_units
  add column if not exists vice_diretor_nome          text,
  add column if not exists vice_diretor_email         text,
  add column if not exists vice_diretor_whatsapp      text,
  add column if not exists diretor_email              text;
