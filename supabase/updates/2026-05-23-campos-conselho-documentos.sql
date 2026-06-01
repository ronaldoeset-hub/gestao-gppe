alter table public.school_councils
  add column if not exists cnpj text,
  add column if not exists assembly_date date,
  add column if not exists student_count integer,
  add column if not exists class_count integer,
  add column if not exists expected_members_count integer,
  add column if not exists election_notice_date date,
  add column if not exists election_date date,
  add column if not exists possession_date date,
  add column if not exists reelection_count integer default 0,
  add column if not exists registry_date date,
  add column if not exists registry_number text;

create table if not exists public.council_members (
  id uuid primary key default uuid_generate_v4(),
  council_id uuid not null references public.school_councils(id) on delete cascade,
  full_name text not null,
  cpf text,
  rg text,
  role text not null,
  segment text,
  phone text,
  email text,
  address text,
  created_at timestamptz not null default now()
);

create table if not exists public.council_required_documents (
  id uuid primary key default uuid_generate_v4(),
  council_id uuid not null references public.school_councils(id) on delete cascade,
  document_type text not null,
  required boolean not null default true,
  document_id uuid references public.documents(id) on delete set null,
  status public.workflow_status not null default 'pendente',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.council_regularities (
  id uuid primary key default uuid_generate_v4(),
  council_id uuid not null references public.school_councils(id) on delete cascade,
  item text not null,
  status public.workflow_status not null default 'pendente',
  due_date date,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.council_members enable row level security;
alter table public.council_required_documents enable row level security;
alter table public.council_regularities enable row level security;

drop policy if exists "council_members_select_by_role" on public.council_members;
create policy "council_members_select_by_role" on public.council_members
for select using (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  or exists (
    select 1
    from public.school_councils c
    where c.id = council_id
      and c.school_unit_id = public.current_school_unit_id()
  )
);

drop policy if exists "council_members_staff_write" on public.council_members;
create policy "council_members_staff_write" on public.council_members
for all using (public.current_role() in ('admin_sme', 'tecnico_gppe'))
with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

drop policy if exists "council_required_documents_select_by_role" on public.council_required_documents;
create policy "council_required_documents_select_by_role" on public.council_required_documents
for select using (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  or exists (
    select 1
    from public.school_councils c
    where c.id = council_id
      and c.school_unit_id = public.current_school_unit_id()
  )
);

drop policy if exists "council_required_documents_staff_write" on public.council_required_documents;
create policy "council_required_documents_staff_write" on public.council_required_documents
for all using (public.current_role() in ('admin_sme', 'tecnico_gppe'))
with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

drop policy if exists "council_regularities_select_by_role" on public.council_regularities;
create policy "council_regularities_select_by_role" on public.council_regularities
for select using (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  or exists (
    select 1
    from public.school_councils c
    where c.id = council_id
      and c.school_unit_id = public.current_school_unit_id()
  )
);

drop policy if exists "council_regularities_staff_write" on public.council_regularities;
create policy "council_regularities_staff_write" on public.council_regularities
for all using (public.current_role() in ('admin_sme', 'tecnico_gppe'))
with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));
