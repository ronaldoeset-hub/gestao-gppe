create extension if not exists "uuid-ossp";

do $$
begin
  if exists (select 1 from pg_type where typname = 'alert_severity') then
    alter type public.alert_severity add value if not exists 'critica';
  end if;
end $$;

alter table public.profiles
  add column if not exists email text,
  add column if not exists access_status text not null default 'aprovado',
  add column if not exists access_requested_at timestamptz not null default now(),
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid references public.profiles(id) on delete set null,
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

create or replace function public.current_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid()
    and coalesce(access_status, 'aprovado') = 'aprovado'
$$;

create or replace function public.current_school_unit_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select school_unit_id
  from public.profiles
  where id = auth.uid()
    and coalesce(access_status, 'aprovado') = 'aprovado'
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_school uuid;
  requested_role public.user_role;
begin
  select id into selected_school
  from public.school_units
  where name = new.raw_user_meta_data->>'selected_school_name'
  limit 1;

  requested_role := coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'gestor_escolar');

  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    school_unit_id,
    phone,
    access_status,
    access_requested_at
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    requested_role,
    selected_school,
    nullif(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'access_status', 'pendente'),
    now()
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role,
    school_unit_id = coalesce(excluded.school_unit_id, public.profiles.school_unit_id),
    phone = excluded.phone,
    access_status = excluded.access_status,
    access_requested_at = coalesce(public.profiles.access_requested_at, excluded.access_requested_at),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.school_units enable row level security;
alter table public.school_councils enable row level security;
alter table public.resource_transfers enable row level security;
alter table public.accountabilities enable row level security;
alter table public.documents enable row level security;
alter table public.alerts enable row level security;

drop policy if exists "profiles_select_own_or_staff" on public.profiles;
create policy "profiles_select_own_or_staff" on public.profiles
for select to authenticated
using (id = auth.uid() or public.current_role() in ('admin_sme', 'tecnico_gppe'));

drop policy if exists "profiles_admin_write" on public.profiles;
create policy "profiles_admin_write" on public.profiles
for all to authenticated
using (public.current_role() = 'admin_sme')
with check (public.current_role() = 'admin_sme');

drop policy if exists "school_units_select_by_role" on public.school_units;
create policy "school_units_select_by_role" on public.school_units
for select to authenticated
using (public.current_role() in ('admin_sme', 'tecnico_gppe') or id = public.current_school_unit_id());

drop policy if exists "school_units_staff_write" on public.school_units;
create policy "school_units_staff_write" on public.school_units
for all to authenticated
using (public.current_role() in ('admin_sme', 'tecnico_gppe'))
with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

drop policy if exists "councils_select_by_role" on public.school_councils;
create policy "councils_select_by_role" on public.school_councils
for select to authenticated
using (public.current_role() in ('admin_sme', 'tecnico_gppe') or school_unit_id = public.current_school_unit_id());

drop policy if exists "councils_staff_write" on public.school_councils;
create policy "councils_staff_write" on public.school_councils
for all to authenticated
using (public.current_role() in ('admin_sme', 'tecnico_gppe'))
with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

drop policy if exists "resource_transfers_select_by_role" on public.resource_transfers;
create policy "resource_transfers_select_by_role" on public.resource_transfers
for select to authenticated
using (public.current_role() in ('admin_sme', 'tecnico_gppe') or school_unit_id = public.current_school_unit_id());

drop policy if exists "resource_transfers_staff_write" on public.resource_transfers;
create policy "resource_transfers_staff_write" on public.resource_transfers
for all to authenticated
using (public.current_role() in ('admin_sme', 'tecnico_gppe'))
with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

drop policy if exists "accountabilities_select_by_role" on public.accountabilities;
create policy "accountabilities_select_by_role" on public.accountabilities
for select to authenticated
using (public.current_role() in ('admin_sme', 'tecnico_gppe') or school_unit_id = public.current_school_unit_id());

drop policy if exists "accountabilities_staff_write" on public.accountabilities;
create policy "accountabilities_staff_write" on public.accountabilities
for all to authenticated
using (public.current_role() in ('admin_sme', 'tecnico_gppe'))
with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

drop policy if exists "documents_select_by_role" on public.documents;
create policy "documents_select_by_role" on public.documents
for select to authenticated
using (school_unit_id is null or public.current_role() in ('admin_sme', 'tecnico_gppe') or school_unit_id = public.current_school_unit_id());

drop policy if exists "documents_insert_by_role" on public.documents;
create policy "documents_insert_by_role" on public.documents
for insert to authenticated
with check (public.current_role() in ('admin_sme', 'tecnico_gppe') or school_unit_id = public.current_school_unit_id());

drop policy if exists "documents_staff_update" on public.documents;
create policy "documents_staff_update" on public.documents
for update to authenticated
using (public.current_role() in ('admin_sme', 'tecnico_gppe'))
with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

drop policy if exists "alerts_select_by_role" on public.alerts;
create policy "alerts_select_by_role" on public.alerts
for select to authenticated
using (school_unit_id is null or public.current_role() in ('admin_sme', 'tecnico_gppe') or school_unit_id = public.current_school_unit_id());

drop policy if exists "alerts_staff_write" on public.alerts;
create policy "alerts_staff_write" on public.alerts
for all to authenticated
using (public.current_role() in ('admin_sme', 'tecnico_gppe'))
with check (public.current_role() in ('admin_sme', 'tecnico_gppe'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gppe-documentos',
  'gppe-documentos',
  false,
  52428800,
  array['application/pdf', 'image/png', 'image/jpeg', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "gppe_documentos_staff_upload" on storage.objects;
create policy "gppe_documentos_staff_upload" on storage.objects
for insert to authenticated
with check (bucket_id = 'gppe-documentos' and public.current_role() in ('admin_sme', 'tecnico_gppe', 'gestor_escolar', 'conselho_escolar'));

drop policy if exists "gppe_documentos_authenticated_read" on storage.objects;
create policy "gppe_documentos_authenticated_read" on storage.objects
for select to authenticated
using (bucket_id = 'gppe-documentos');
