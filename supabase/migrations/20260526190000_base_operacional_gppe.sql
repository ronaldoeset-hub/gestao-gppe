create extension if not exists "uuid-ossp";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_role() in ('admin_sme', 'tecnico_gppe')
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_role() = 'admin_sme'
$$;

create or replace function public.can_access_unit(unit_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_staff() or unit_id = public.current_school_unit_id()
$$;

alter table public.profiles
  add column if not exists email text,
  add column if not exists access_status text not null default 'aprovado',
  add column if not exists access_requested_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_access_status_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_access_status_check
      check (access_status in ('pendente', 'aprovado', 'bloqueado'));
  end if;
end $$;

alter table public.school_units
  add column if not exists cnpj text,
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists school_units_set_updated_at on public.school_units;
create trigger school_units_set_updated_at
before update on public.school_units
for each row execute function public.set_updated_at();

create table if not exists public.resource_programs (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  acronym text not null unique,
  source text,
  official_url text,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.unit_financial_balances (
  id uuid primary key default uuid_generate_v4(),
  school_unit_id uuid not null references public.school_units(id) on delete cascade,
  program_id uuid not null references public.resource_programs(id) on delete cascade,
  fiscal_year integer not null,
  opening_balance numeric(14,2) not null default 0,
  received_amount numeric(14,2) not null default 0,
  spent_amount numeric(14,2) not null default 0,
  committed_amount numeric(14,2) not null default 0,
  available_balance numeric(14,2) generated always as (opening_balance + received_amount - spent_amount - committed_amount) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (school_unit_id, program_id, fiscal_year)
);

create table if not exists public.financial_movements (
  id uuid primary key default uuid_generate_v4(),
  school_unit_id uuid not null references public.school_units(id) on delete cascade,
  program_id uuid not null references public.resource_programs(id) on delete restrict,
  movement_type text not null check (movement_type in ('receita', 'despesa', 'estorno', 'ajuste')),
  amount numeric(14,2) not null check (amount >= 0),
  movement_date date not null default current_date,
  description text not null,
  document_number text,
  supplier_name text,
  expense_category text not null default 'outros' check (expense_category in ('custeio', 'capital', 'outros')),
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.accountabilities
  add column if not exists program_id uuid references public.resource_programs(id) on delete set null,
  add column if not exists protocol text,
  add column if not exists notes text,
  add column if not exists operational_status text not null default 'nao_entregue' check (operational_status in ('nao_entregue', 'em_analise', 'aprovada', 'reprovada', 'pendente_correcao')),
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists accountabilities_set_updated_at on public.accountabilities;
create trigger accountabilities_set_updated_at
before update on public.accountabilities
for each row execute function public.set_updated_at();

alter table public.school_councils
  add column if not exists vice_president_name text,
  add column if not exists expected_members_count integer,
  add column if not exists student_count integer,
  add column if not exists election_date date,
  add column if not exists possession_date date,
  add column if not exists registry_date date,
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists school_councils_set_updated_at on public.school_councils;
create trigger school_councils_set_updated_at
before update on public.school_councils
for each row execute function public.set_updated_at();

create table if not exists public.council_members (
  id uuid primary key default uuid_generate_v4(),
  council_id uuid not null references public.school_councils(id) on delete cascade,
  name text not null,
  role text not null,
  cpf_masked text,
  phone text,
  email text,
  start_date date,
  end_date date,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.required_documents (
  id uuid primary key default uuid_generate_v4(),
  scope text not null check (scope in ('unidade', 'conselho', 'prestacao', 'financeiro')),
  name text not null,
  description text,
  required boolean not null default true,
  validity_months integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (scope, name)
);

create table if not exists public.document_records (
  id uuid primary key default uuid_generate_v4(),
  school_unit_id uuid references public.school_units(id) on delete cascade,
  council_id uuid references public.school_councils(id) on delete cascade,
  accountability_id uuid references public.accountabilities(id) on delete cascade,
  category text not null,
  title text not null,
  storage_path text,
  expiration_date date,
  status text not null default 'pendente' check (status in ('valido', 'vencendo', 'vencido', 'pendente')),
  uploaded_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.alerts
  add column if not exists source_module text,
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists alerts_set_updated_at on public.alerts;
create trigger alerts_set_updated_at
before update on public.alerts
for each row execute function public.set_updated_at();

create table if not exists public.analytics_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null default auth.uid(),
  event_name text not null,
  path text,
  module text,
  school_unit_id uuid references public.school_units(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default uuid_generate_v4(),
  school_unit_id uuid references public.school_units(id) on delete cascade,
  opened_by uuid references public.profiles(id) on delete set null default auth.uid(),
  assigned_to uuid references public.profiles(id) on delete set null,
  title text not null,
  description text not null,
  priority text not null default 'media' check (priority in ('baixa', 'media', 'alta', 'critica')),
  status text not null default 'aberto' check (status in ('aberto', 'em_atendimento', 'respondido', 'resolvido', 'cancelado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fnde_links (
  id uuid primary key default uuid_generate_v4(),
  title text not null unique,
  url text not null,
  category text not null,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.transparency_snapshots (
  id uuid primary key default uuid_generate_v4(),
  fiscal_year integer not null,
  program_id uuid references public.resource_programs(id) on delete cascade,
  school_unit_id uuid references public.school_units(id) on delete cascade,
  total_received numeric(14,2) not null default 0,
  total_spent numeric(14,2) not null default 0,
  available_balance numeric(14,2) not null default 0,
  generated_at timestamptz not null default now(),
  unique (fiscal_year, program_id, school_unit_id)
);

create table if not exists public.recursos_educacionais (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  category text not null,
  url text,
  storage_path text,
  image_url text,
  active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists resource_programs_set_updated_at on public.resource_programs;
create trigger resource_programs_set_updated_at before update on public.resource_programs for each row execute function public.set_updated_at();
drop trigger if exists unit_financial_balances_set_updated_at on public.unit_financial_balances;
create trigger unit_financial_balances_set_updated_at before update on public.unit_financial_balances for each row execute function public.set_updated_at();
drop trigger if exists financial_movements_set_updated_at on public.financial_movements;
create trigger financial_movements_set_updated_at before update on public.financial_movements for each row execute function public.set_updated_at();
drop trigger if exists council_members_set_updated_at on public.council_members;
create trigger council_members_set_updated_at before update on public.council_members for each row execute function public.set_updated_at();
drop trigger if exists required_documents_set_updated_at on public.required_documents;
create trigger required_documents_set_updated_at before update on public.required_documents for each row execute function public.set_updated_at();
drop trigger if exists document_records_set_updated_at on public.document_records;
create trigger document_records_set_updated_at before update on public.document_records for each row execute function public.set_updated_at();
drop trigger if exists support_tickets_set_updated_at on public.support_tickets;
create trigger support_tickets_set_updated_at before update on public.support_tickets for each row execute function public.set_updated_at();
drop trigger if exists fnde_links_set_updated_at on public.fnde_links;
create trigger fnde_links_set_updated_at before update on public.fnde_links for each row execute function public.set_updated_at();
drop trigger if exists recursos_educacionais_set_updated_at on public.recursos_educacionais;
create trigger recursos_educacionais_set_updated_at before update on public.recursos_educacionais for each row execute function public.set_updated_at();

create index if not exists idx_profiles_school_unit_id on public.profiles(school_unit_id);
create index if not exists idx_school_units_name on public.school_units(name);
create index if not exists idx_resource_programs_acronym on public.resource_programs(acronym);
create index if not exists idx_balances_unit_program_year on public.unit_financial_balances(school_unit_id, program_id, fiscal_year);
create index if not exists idx_movements_unit_program_date on public.financial_movements(school_unit_id, program_id, movement_date);
create index if not exists idx_accountabilities_unit_program_due on public.accountabilities(school_unit_id, program_id, due_date);
create index if not exists idx_council_members_council on public.council_members(council_id);
create index if not exists idx_document_records_unit on public.document_records(school_unit_id);
create index if not exists idx_alerts_unit_due on public.alerts(school_unit_id, due_date);
create index if not exists idx_analytics_events_created_at on public.analytics_events(created_at);
create index if not exists idx_support_tickets_unit_status on public.support_tickets(school_unit_id, status);
create index if not exists idx_transparency_program_year on public.transparency_snapshots(program_id, fiscal_year);

alter table public.resource_programs enable row level security;
alter table public.unit_financial_balances enable row level security;
alter table public.financial_movements enable row level security;
alter table public.council_members enable row level security;
alter table public.required_documents enable row level security;
alter table public.document_records enable row level security;
alter table public.analytics_events enable row level security;
alter table public.support_tickets enable row level security;
alter table public.fnde_links enable row level security;
alter table public.transparency_snapshots enable row level security;
alter table public.recursos_educacionais enable row level security;

drop policy if exists "resource_programs_select_authenticated" on public.resource_programs;
create policy "resource_programs_select_authenticated" on public.resource_programs for select to authenticated using (true);
drop policy if exists "resource_programs_staff_write" on public.resource_programs;
create policy "resource_programs_staff_write" on public.resource_programs for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "balances_select_by_role" on public.unit_financial_balances;
create policy "balances_select_by_role" on public.unit_financial_balances for select to authenticated using (public.can_access_unit(school_unit_id));
drop policy if exists "balances_staff_write" on public.unit_financial_balances;
create policy "balances_staff_write" on public.unit_financial_balances for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "movements_select_by_role" on public.financial_movements;
create policy "movements_select_by_role" on public.financial_movements for select to authenticated using (public.can_access_unit(school_unit_id));
drop policy if exists "movements_staff_write" on public.financial_movements;
create policy "movements_staff_write" on public.financial_movements for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "council_members_select_by_role" on public.council_members;
create policy "council_members_select_by_role" on public.council_members for select to authenticated using (
  exists (
    select 1 from public.school_councils c
    where c.id = council_members.council_id and public.can_access_unit(c.school_unit_id)
  )
);
drop policy if exists "council_members_staff_write" on public.council_members;
create policy "council_members_staff_write" on public.council_members for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "required_documents_select_authenticated" on public.required_documents;
create policy "required_documents_select_authenticated" on public.required_documents for select to authenticated using (true);
drop policy if exists "required_documents_staff_write" on public.required_documents;
create policy "required_documents_staff_write" on public.required_documents for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "document_records_select_by_role" on public.document_records;
create policy "document_records_select_by_role" on public.document_records for select to authenticated using (school_unit_id is null or public.can_access_unit(school_unit_id));
drop policy if exists "document_records_staff_write" on public.document_records;
create policy "document_records_staff_write" on public.document_records for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "analytics_insert_authenticated" on public.analytics_events;
create policy "analytics_insert_authenticated" on public.analytics_events for insert to authenticated with check (user_id = auth.uid() or user_id is null);
drop policy if exists "analytics_staff_select" on public.analytics_events;
create policy "analytics_staff_select" on public.analytics_events for select to authenticated using (public.is_staff());

drop policy if exists "support_select_by_role" on public.support_tickets;
create policy "support_select_by_role" on public.support_tickets for select to authenticated using (school_unit_id is null or public.can_access_unit(school_unit_id) or opened_by = auth.uid());
drop policy if exists "support_insert_by_role" on public.support_tickets;
create policy "support_insert_by_role" on public.support_tickets for insert to authenticated with check (public.is_staff() or school_unit_id = public.current_school_unit_id());
drop policy if exists "support_staff_update" on public.support_tickets;
create policy "support_staff_update" on public.support_tickets for update to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "fnde_links_select_authenticated" on public.fnde_links;
create policy "fnde_links_select_authenticated" on public.fnde_links for select to authenticated using (active = true or public.is_staff());
drop policy if exists "fnde_links_staff_write" on public.fnde_links;
create policy "fnde_links_staff_write" on public.fnde_links for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "transparency_select_authenticated" on public.transparency_snapshots;
create policy "transparency_select_authenticated" on public.transparency_snapshots for select to authenticated using (school_unit_id is null or public.can_access_unit(school_unit_id));
drop policy if exists "transparency_staff_write" on public.transparency_snapshots;
create policy "transparency_staff_write" on public.transparency_snapshots for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "recursos_educacionais_public_select" on public.recursos_educacionais;
create policy "recursos_educacionais_public_select" on public.recursos_educacionais for select to anon, authenticated using (active = true);
drop policy if exists "recursos_educacionais_staff_write" on public.recursos_educacionais;
create policy "recursos_educacionais_staff_write" on public.recursos_educacionais for all to authenticated using (public.is_staff()) with check (public.is_staff());

insert into public.resource_programs (name, acronym, source, official_url, description)
values
  ('Programa Dinheiro Direto na Escola', 'PDDE', 'FNDE', 'https://www.gov.br/fnde/pt-br/acesso-a-informacao/acoes-e-programas/programas/pdde', 'Repasses suplementares para manutencao, melhorias e autogestao escolar.'),
  ('PDDE Basico', 'PDDE-BASICO', 'FNDE', 'https://www.fnde.gov.br/pdde/manterexecutora.do', 'Acompanhamento operacional do PDDE Basico.'),
  ('PDDE Qualidade', 'PDDE-QUALIDADE', 'FNDE', 'https://www.gov.br/fnde/pt-br/acesso-a-informacao/acoes-e-programas/programas/pdde/acoes-integradas', 'Acoes integradas de qualidade vinculadas ao PDDE.'),
  ('PDDE Estrutura', 'PDDE-ESTRUTURA', 'FNDE', 'https://www.gov.br/fnde/pt-br/acesso-a-informacao/acoes-e-programas/programas/pdde/acoes-integradas', 'Acoes integradas de estrutura vinculadas ao PDDE.'),
  ('Educacao Conectada', 'EDUCACAO-CONECTADA', 'FNDE/MEC', 'https://www.gov.br/fnde', 'Acompanhamento de recursos de conectividade educacional.'),
  ('Programa Nacional de Apoio ao Transporte Escolar', 'PNATE', 'FNDE', 'https://www.gov.br/fnde', 'Acompanhamento de recursos de transporte escolar quando aplicavel.')
on conflict (acronym) do update set
  name = excluded.name,
  source = excluded.source,
  official_url = excluded.official_url,
  description = excluded.description,
  active = true,
  updated_at = now();

insert into public.fnde_links (title, url, category, description)
values
  ('FNDE', 'https://www.gov.br/fnde', 'portal', 'Portal oficial do Fundo Nacional de Desenvolvimento da Educacao.'),
  ('PDDE - pagina oficial', 'https://www.gov.br/fnde/pt-br/acesso-a-informacao/acoes-e-programas/programas/pdde', 'pdde', 'Pagina oficial do Programa Dinheiro Direto na Escola.'),
  ('Acoes Integradas do PDDE', 'https://www.gov.br/fnde/pt-br/acesso-a-informacao/acoes-e-programas/programas/pdde/acoes-integradas', 'pdde', 'Orientacoes sobre acoes integradas do PDDE.'),
  ('PDDEWeb', 'https://www.fnde.gov.br/pdde/brasilcidadao.do', 'sistema', 'Acesso ao sistema PDDEWeb.'),
  ('Sistema PDDE', 'https://www.fnde.gov.br/pdde/manterexecutora.do', 'sistema', 'Sistema oficial do PDDE.'),
  ('Consulta Escola PDDE', 'https://www.fnde.gov.br/pddeinfo/pddeinfo/escola/consultar', 'consulta', 'Consulta de informacoes do PDDE por escola.'),
  ('SiGPC / Contas Online', 'https://www.gov.br/fnde/pt-br/acesso-a-informacao/acoes-e-programas/acoes/prestacao-de-contas/como-acessar-o-sigpc', 'prestacao', 'Orientacoes oficiais para acesso ao SiGPC.'),
  ('SiGPC sistema', 'https://www.fnde.gov.br/sigpc', 'sistema', 'Sistema de Gestao de Prestacao de Contas.'),
  ('Manual SiGPC', 'https://www.gov.br/fnde/pt-br/acesso-a-informacao/acoes-e-programas/acoes/prestacao-de-contas/materiais-de-apoio-sigpc', 'manual', 'Materiais de apoio e manuais do SiGPC.')
on conflict (title) do update set
  url = excluded.url,
  category = excluded.category,
  description = excluded.description,
  active = true,
  updated_at = now();

insert into public.required_documents (scope, name, description, required, validity_months)
values
  ('unidade', 'Dados cadastrais atualizados', 'Cadastro administrativo da unidade com contatos e responsaveis.', true, 12),
  ('conselho', 'Ata de eleicao do conselho', 'Ata vigente de eleicao e composicao do conselho escolar.', true, 36),
  ('conselho', 'Documentos dos membros', 'Documentacao basica dos membros do conselho, sem CPF aberto.', true, 36),
  ('prestacao', 'Comprovantes de execucao financeira', 'Comprovantes vinculados a despesa ou aplicacao do recurso.', true, null),
  ('prestacao', 'Protocolo de entrega', 'Registro de envio ou entrega da prestacao de contas.', true, null),
  ('financeiro', 'Extrato bancario', 'Extrato para conciliacao financeira por programa.', true, 1)
on conflict (scope, name) do update set
  description = excluded.description,
  required = excluded.required,
  validity_months = excluded.validity_months,
  updated_at = now();
