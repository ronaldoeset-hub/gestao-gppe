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

create or replace function public.current_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid() and access_status = 'aprovado'
$$;

create or replace function public.current_school_unit_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select school_unit_id from public.profiles where id = auth.uid() and access_status = 'aprovado'
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
