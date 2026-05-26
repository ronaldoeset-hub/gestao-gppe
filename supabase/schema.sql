create extension if not exists "uuid-ossp";

create type public.user_role as enum ('admin_sme', 'tecnico_gppe', 'gestor_escolar', 'conselho_escolar');
create type public.workflow_status as enum ('regular', 'atencao', 'pendente', 'vencido');
create type public.school_type as enum ('escola', 'creche', 'cemei', 'conveniada');
create type public.alert_severity as enum ('alta', 'media', 'baixa');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'gestor_escolar',
  school_unit_id uuid,
  phone text,
  created_at timestamptz not null default now()
);

create table public.school_units (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  inep text unique,
  type public.school_type not null default 'escola',
  district text,
  address text,
  manager_name text,
  phone text,
  email text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles
  add constraint profiles_school_unit_id_fkey foreign key (school_unit_id) references public.school_units(id);

create table public.school_councils (
  id uuid primary key default uuid_generate_v4(),
  school_unit_id uuid not null references public.school_units(id) on delete cascade,
  president_name text not null,
  vice_president_name text,
  mandate_start date not null,
  mandate_end date not null,
  members_count integer not null default 0,
  status public.workflow_status not null default 'regular',
  notes text,
  created_at timestamptz not null default now()
);

create table public.resource_transfers (
  id uuid primary key default uuid_generate_v4(),
  school_unit_id uuid not null references public.school_units(id) on delete cascade,
  program text not null,
  source text,
  amount numeric(14,2) not null default 0,
  released_at date not null,
  balance numeric(14,2) not null default 0,
  status public.workflow_status not null default 'regular',
  created_at timestamptz not null default now()
);

create table public.accountabilities (
  id uuid primary key default uuid_generate_v4(),
  resource_transfer_id uuid references public.resource_transfers(id) on delete set null,
  school_unit_id uuid not null references public.school_units(id) on delete cascade,
  reference_period text not null,
  due_date date not null,
  submitted_at date,
  approved_at date,
  status public.workflow_status not null default 'pendente',
  technical_opinion text,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default uuid_generate_v4(),
  school_unit_id uuid references public.school_units(id) on delete cascade,
  accountability_id uuid references public.accountabilities(id) on delete cascade,
  uploaded_by uuid references public.profiles(id) on delete set null,
  title text not null,
  category text not null,
  storage_path text not null,
  mime_type text,
  file_size bigint,
  created_at timestamptz not null default now()
);

create table public.alerts (
  id uuid primary key default uuid_generate_v4(),
  school_unit_id uuid references public.school_units(id) on delete cascade,
  title text not null,
  description text not null,
  severity public.alert_severity not null default 'media',
  due_date date,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.school_units enable row level security;
alter table public.school_councils enable row level security;
alter table public.resource_transfers enable row level security;
alter table public.accountabilities enable row level security;
alter table public.documents enable row level security;
alter table public.alerts enable row level security;

create or replace function public.current_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid() and coalesce(access_status, 'aprovado') = 'aprovado'
$$;

create or replace function public.current_school_unit_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select school_unit_id from public.profiles where id = auth.uid() and coalesce(access_status, 'aprovado') = 'aprovado'
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'gestor_escolar')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles
  add column if not exists access_status text not null default 'aprovado',
  add column if not exists access_requested_at timestamptz default now(),
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid references public.profiles(id) on delete set null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_access_status_check'
  ) then
    alter table public.profiles
      add constraint profiles_access_status_check
      check (access_status in ('pendente', 'aprovado', 'bloqueado')) not valid;
  end if;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_school uuid;
begin
  select id into selected_school
  from public.school_units
  where name = new.raw_user_meta_data->>'selected_school_name'
  limit 1;

  insert into public.profiles (id, full_name, role, school_unit_id, phone, access_status, access_requested_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'gestor_escolar'),
    selected_school,
    nullif(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'access_status', 'pendente'),
    now()
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    role = excluded.role,
    school_unit_id = coalesce(excluded.school_unit_id, public.profiles.school_unit_id),
    phone = excluded.phone,
    access_status = excluded.access_status;
  return new;
end;
$$;

create policy "profiles_select_own_or_staff" on public.profiles
for select using (
  id = auth.uid() or public.current_role() in ('admin_sme', 'tecnico_gppe')
);

create policy "profiles_admin_write" on public.profiles
for all using (public.current_role() = 'admin_sme')
with check (public.current_role() = 'admin_sme');

create policy "school_units_select_by_role" on public.school_units
for select using (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  or id = public.current_school_unit_id()
);

create policy "school_units_staff_write" on public.school_units
for all using (public.current_role() in ('admin_sme', 'tecnico_gppe'))
with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

create policy "councils_select_by_role" on public.school_councils
for select using (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  or school_unit_id = public.current_school_unit_id()
);

create policy "councils_staff_write" on public.school_councils
for all using (public.current_role() in ('admin_sme', 'tecnico_gppe'))
with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

create policy "resources_select_by_role" on public.resource_transfers
for select using (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  or school_unit_id = public.current_school_unit_id()
);

create policy "resources_staff_write" on public.resource_transfers
for all using (public.current_role() in ('admin_sme', 'tecnico_gppe'))
with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

create policy "accountability_select_by_role" on public.accountabilities
for select using (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  or school_unit_id = public.current_school_unit_id()
);

create policy "accountability_write_by_role" on public.accountabilities
for all using (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  or school_unit_id = public.current_school_unit_id()
)
with check (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  or school_unit_id = public.current_school_unit_id()
);

create policy "documents_select_by_role" on public.documents
for select using (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  or school_unit_id = public.current_school_unit_id()
);

create policy "documents_insert_by_role" on public.documents
for insert with check (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  or school_unit_id = public.current_school_unit_id()
);

create policy "alerts_select_by_role" on public.alerts
for select using (
  public.current_role() in ('admin_sme', 'tecnico_gppe')
  or school_unit_id = public.current_school_unit_id()
  or school_unit_id is null
);

create policy "alerts_staff_write" on public.alerts
for all using (public.current_role() in ('admin_sme', 'tecnico_gppe'))
with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

insert into public.school_units (name, inep, type, district, manager_name)
values
  ('Escola M. Acelina Alves de Araújo', '52100001', 'escola', 'Camping Clube', 'Gestor(a) da Unidade 01'),
  ('Escola M. Ana Lúcia Oliveira da Silva', '52100002', 'escola', 'Jardim América II', 'Gestor(a) da Unidade 02'),
  ('Escola M. Antônio Cícero Araújo da Costa', '52100003', 'escola', 'Mansões Odisséia', 'Gestor(a) da Unidade 03'),
  ('Escola Municipal Antônio de Jesus Leite', '52100004', 'escola', 'Jardim Querência', 'Gestor(a) da Unidade 04'),
  ('Escola Municipal Antônio Luiz Gonzaga', '52100005', 'escola', 'Parque da Barragem Setor 11', 'Gestor(a) da Unidade 05'),
  ('Escola Municipal Camargo II', '52100006', 'escola', 'Zona Rural', 'Gestor(a) da Unidade 06'),
  ('Escola Municipal Darci Ribeiro', '52100007', 'escola', 'Parque da Barragem Setor 08', 'Gestor(a) da Unidade 07'),
  ('Escola M. Domingos Simão de Oliveira', '52100008', 'escola', 'Jardim América IV', 'Gestor(a) da Unidade 08'),
  ('Escola Municipal Edinaldo Pereira', '52100009', 'escola', 'Mansões Coimbra', 'Gestor(a) da Unidade 09'),
  ('Escola M. Ednalda Guedes de Souza', '52100010', 'escola', 'Parque Águas Bonitas I', 'Gestor(a) da Unidade 10'),
  ('Escola M. Ednalva Valdevino dos Santos', '52100011', 'escola', 'Jardim Santa Lúcia', 'Gestor(a) da Unidade 11'),
  ('Escola M. Emília Ferreira de Souza', '52100012', 'escola', 'Águas Lindas de Goiás', 'Gestor(a) da Unidade 12'),
  ('Escola Municipal Erotides Dias da Costa', '52100013', 'escola', 'Águas Lindas de Goiás', 'Gestor(a) da Unidade 13'),
  ('Escola M. Fernando Cunha Junior', '52100014', 'escola', 'Águas Lindas de Goiás', 'Gestor(a) da Unidade 14'),
  ('Escola M. Francisca Ferreira da Silva', '52100015', 'escola', 'Jardim Barragem V', 'Gestor(a) da Unidade 15'),
  ('Escola M. Geracina Pereira da Silva', '52100016', 'escola', 'Parque da Barragem Setor 02', 'Gestor(a) da Unidade 16'),
  ('Escola M. Inácio Carneiro da Costa', '52100017', 'escola', 'Jardim Barragem II', 'Gestor(a) da Unidade 17'),
  ('Escola Municipal Jardim das Oliveiras', '52100018', 'escola', 'Jardim das Oliveiras', 'Gestor(a) da Unidade 18'),
  ('Escola M. João Elízio Lima Pessoa', '52100019', 'escola', 'Águas Lindas de Goiás', 'Gestor(a) da Unidade 19'),
  ('Escola M. José A. de Araújo - Zé Chevrolet', '52100020', 'escola', 'Águas Lindas de Goiás', 'Gestor(a) da Unidade 20'),
  ('Escola Municipal José Vitorino de Souza', '52100021', 'escola', 'Águas Lindas de Goiás', 'Gestor(a) da Unidade 21'),
  ('Escola Municipal Juliana Eloy da Silva', '52100022', 'escola', 'Águas Lindas de Goiás', 'Gestor(a) da Unidade 22'),
  ('Escola Municipal Luiza Tereza', '52100023', 'escola', 'Águas Lindas de Goiás', 'Gestor(a) da Unidade 23'),
  ('Escola Municipal Maria de Fátima Alves', '52100024', 'escola', 'Águas Lindas de Goiás', 'Gestor(a) da Unidade 24'),
  ('Escola M. Maria do Livramento Felipe', '52100025', 'escola', 'Quinta das Angélicas', 'Gestor(a) da Unidade 25'),
  ('Escola Municipal Maria José Costa Lima', '52100026', 'escola', 'Recreio Águas Lindas III', 'Gestor(a) da Unidade 26'),
  ('Escola M. Maria Machado de Matos', '52100027', 'escola', 'Jardim Guaíra', 'Gestor(a) da Unidade 27'),
  ('Escola Municipal Maristela Regina Neris', '52100028', 'escola', 'Jardim Pérola I', 'Gestor(a) da Unidade 28'),
  ('Escola M. Joaquim Pedro Gomes da Cruz', '52071561', 'escola', 'Mansões Village', 'Gestor(a) da Unidade 29'),
  ('Escola Municipal MEG-LUZ', '52100030', 'escola', 'Parque da Barragem Setor 03', 'Gestor(a) da Unidade 30'),
  ('Escola Municipal Mestre Zezito', '52100031', 'escola', 'Águas Bonitas I', 'Gestor(a) da Unidade 31'),
  ('Escola Municipal Milena Barbosa Gama', '52100032', 'escola', 'Águas Lindas de Goiás', 'Gestor(a) da Unidade 32'),
  ('Escola M. Nilzon Periquito de Lima', '52100033', 'escola', 'Mansões Olinda', 'Gestor(a) da Unidade 33'),
  ('Escola M. Orlando Soares de Sousa', '52100034', 'escola', 'Camping Clube', 'Gestor(a) da Unidade 34'),
  ('Escola M. P. Edileuza de A. Cavalcante', '52100035', 'escola', 'Águas Lindas de Goiás', 'Gestor(a) da Unidade 35'),
  ('Escola M. Profª. Erika Flávia Vieira de Souza', '52100036', 'escola', 'Águas Lindas de Goiás', 'Gestor(a) da Unidade 36'),
  ('Escola Municipal Roberto Alves da Silva', '52100037', 'escola', 'Águas Lindas de Goiás', 'Gestor(a) da Unidade 37'),
  ('Escola Municipal Rui Barbosa', '52100038', 'escola', 'Águas Lindas de Goiás', 'Gestor(a) da Unidade 38'),
  ('Escola Municipal São Bartolomeu', '52100039', 'escola', 'Águas Lindas de Goiás', 'Gestor(a) da Unidade 39'),
  ('Escola M. Senador Emival Ramos Caiado', '52100040', 'escola', 'Águas Lindas de Goiás', 'Gestor(a) da Unidade 40'),
  ('Escola M. Vereador Érico Souza Ferreira', '52100041', 'escola', 'Jardim Brasília', 'Gestor(a) da Unidade 41'),
  ('Escola M. Vicente de Paula Lisboa', '52100042', 'escola', 'Jardim Águas Lindas II', 'Gestor(a) da Unidade 42'),
  ('Escola Municipal Zélia Correa Cotrim', '52100043', 'escola', 'Recreio da Barragem', 'Gestor(a) da Unidade 43'),
  ('CEMEI - Centro Municipal de Educação Inclusiva', '52100044', 'cemei', 'Jardim Brasília', 'Gestor(a) da Unidade 44'),
  ('Creche M. Dona Mª Pires Perillo', '52100045', 'creche', 'Parque da Barragem Setor 08', 'Gestor(a) da Unidade 45'),
  ('Creche M. Indiara Carneiro Machado Lisboa', '52100046', 'creche', 'Jardim Santa Lúcia', 'Gestor(a) da Unidade 46'),
  ('Creche Municipal Prof. Fátima Enes Muniz', '52100047', 'creche', 'Jardim América II', 'Gestor(a) da Unidade 47'),
  ('Creche M. Jardim Brasília II', '52100048', 'creche', 'Jardim Brasília II', 'Gestor(a) da Unidade 48'),
  ('Creche Municipal Profª. Vilma Maria da Costa Araújo', '52100049', 'creche', 'Jardim Guaíra I', 'Gestor(a) da Unidade 49'),
  ('Creche Municipal Eliene Martins Braga', '52100050', 'creche', 'Residencial Jardim Paraíso', 'Gestor(a) da Unidade 50'),
  ('Creche Municipal Prof. Ivaldo Rodrigues Lima', '52100051', 'creche', 'Jardim Pérola I', 'Gestor(a) da Unidade 51'),
  ('Creche M. José Rodrigues Bezerra', '52100052', 'creche', 'Jardim Barragem VI', 'Gestor(a) da Unidade 52'),
  ('Creche M. Mundo Encantado', '52100053', 'creche', 'Jardim Brasília', 'Gestor(a) da Unidade 53'),
  ('Creche Municipal Prof. Luiz Antônio Gonçalves de Oliveira', '52100054', 'creche', 'Parque Águas Bonitas I', 'Gestor(a) da Unidade 54'),
  ('Creche M. Pr. Geraldo Evaristo dos Santos', '52100055', 'creche', 'Mansões Pôr do Sol', 'Gestor(a) da Unidade 55');
