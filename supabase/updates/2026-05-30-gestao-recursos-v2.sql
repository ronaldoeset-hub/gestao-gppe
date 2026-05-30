-- 2026-05-30: Gestão de Recursos v2
-- Novas tabelas: exercicios
-- Campos extras: school_units (contatos, conselho)
-- Perfis futuros: estrutura reservada (sem implementação ativa)

-- ── 1. Exercícios ─────────────────────────────────────────────────────────────
create table if not exists public.exercicios (
  id     uuid primary key default uuid_generate_v4(),
  ano    integer not null unique,
  status text not null default 'aberto'
    constraint exercicios_status_check check (status in ('aberto', 'encerrado'))
);

alter table public.exercicios enable row level security;

drop policy if exists "exercicios_read" on public.exercicios;
create policy "exercicios_read" on public.exercicios
  for select using (auth.role() = 'authenticated');

drop policy if exists "exercicios_write" on public.exercicios;
create policy "exercicios_write" on public.exercicios
  for all using (public.current_user_role() = 'admin_sme')
  with check (public.current_user_role() = 'admin_sme');

insert into public.exercicios (ano, status) values
  (2024, 'encerrado'),
  (2025, 'encerrado'),
  (2026, 'aberto')
on conflict (ano) do nothing;

-- ── 2. Campos extras em school_units ─────────────────────────────────────────
alter table public.school_units
  add column if not exists data_vencimento_conselho  date,
  add column if not exists status_conselho           text,
  add column if not exists diretor_whatsapp          text,
  add column if not exists presidente_conselho       text,
  add column if not exists presidente_whatsapp       text,
  add column if not exists tecnico_gppe_responsavel  text,
  add column if not exists tecnico_gppe_whatsapp     text;

-- ── 3. Adiciona observacao_tecnica em financeiro_unidade ─────────────────────
-- (renomeia observacao → observacao_tecnica se existir)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='financeiro_unidade' and column_name='observacao'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='financeiro_unidade' and column_name='observacao_tecnica'
  ) then
    alter table public.financeiro_unidade rename column observacao to observacao_tecnica;
  end if;
end;
$$;

alter table public.financeiro_unidade
  add column if not exists observacao_tecnica text;

-- ── 4. Estrutura reservada para perfis futuros ───────────────────────────────
-- Nenhuma permissão ativa nesta versão.
-- Futuro: secretario, subsecretario, superintendente, diretor_escolar,
--         unidade_escolar, consulta_publica
-- Adicionar ao enum user_role quando habilitado.
-- O middleware exibirá: "Perfil cadastrado, mas acesso ao módulo ainda não habilitado."
comment on table public.profiles is
  'Perfis futuros reservados: secretario, subsecretario, superintendente, diretor_escolar, unidade_escolar, consulta_publica';
