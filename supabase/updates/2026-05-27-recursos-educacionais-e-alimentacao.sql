-- 2026-05-27: Tabela educational_resources + acesso publico ao storage

-- Tabela de recursos educacionais para o portal publico e gestao interna
create table if not exists public.educational_resources (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null,
  stage text,
  modality text,
  type text not null,
  description text,
  tags text[] not null default '{}',
  file_path text,
  external_url text,
  status text not null default 'rascunho',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint educational_resources_status_check check (status in ('publico', 'rascunho', 'arquivado'))
);

create index if not exists educational_resources_status_idx on public.educational_resources(status);
create index if not exists educational_resources_category_idx on public.educational_resources(category);
create index if not exists educational_resources_created_at_idx on public.educational_resources(created_at desc);

alter table public.educational_resources enable row level security;

-- Qualquer pessoa (inclusive anonima) pode ler recursos publicados
drop policy if exists "educational_resources_public_read" on public.educational_resources;
create policy "educational_resources_public_read" on public.educational_resources
for select using (status = 'publico');

-- Staff pode ler todos (incluindo rascunhos e arquivados)
drop policy if exists "educational_resources_staff_read" on public.educational_resources;
create policy "educational_resources_staff_read" on public.educational_resources
for select using (public.current_role() in ('admin_sme', 'tecnico_gppe'));

-- Staff pode inserir
drop policy if exists "educational_resources_staff_insert" on public.educational_resources;
create policy "educational_resources_staff_insert" on public.educational_resources
for insert with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

-- Staff pode atualizar
drop policy if exists "educational_resources_staff_update" on public.educational_resources;
create policy "educational_resources_staff_update" on public.educational_resources
for update using (public.current_role() in ('admin_sme', 'tecnico_gppe'))
with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

-- Staff pode excluir/arquivar
drop policy if exists "educational_resources_staff_delete" on public.educational_resources;
create policy "educational_resources_staff_delete" on public.educational_resources
for delete using (public.current_role() in ('admin_sme', 'tecnico_gppe'));

-- Trigger para manter updated_at atualizado
create or replace function public.set_educational_resources_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists educational_resources_updated_at on public.educational_resources;
create trigger educational_resources_updated_at
before update on public.educational_resources
for each row execute function public.set_educational_resources_updated_at();

-- Acesso publico anonimo aos arquivos do portal de recursos educacionais no Storage
drop policy if exists "portal_recursos_public_read" on storage.objects;
create policy "portal_recursos_public_read"
on storage.objects for select
using (
  bucket_id = 'documentos-gppe'
  and name like 'portal-recursos-educacionais/%'
);

-- Comentario sobre estrutura de pastas recomendada no bucket documentos-gppe:
-- unidades/              -> documentos de unidades escolares
-- conselhos/             -> documentos de conselhos
-- prestacao-contas/      -> documentos de prestacao de contas
-- pareceres/             -> pareceres tecnicos
-- atas/                  -> atas de reunioes
-- recursos/              -> comprovantes de recursos financeiros
-- portal-recursos-educacionais/  -> arquivos publicos do portal educacional
