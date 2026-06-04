-- Migration: 2026-06-03 — Cadastro com aprovação manual obrigatória
-- Reescreve handle_new_user para forçar access_status = 'pendente' no servidor,
-- ignorando qualquer valor enviado pelo cliente (fecha brecha de auto-aprovação).
-- Manter id: "estrutura" dos dados financeiros intacto (alterado apenas o rótulo no front).

-- Garante que a coluna access_status existe com valor padrão 'pendente'
alter table public.profiles
  add column if not exists access_status text not null default 'pendente',
  add column if not exists access_requested_at timestamptz;

-- Remove trigger antigo para recriar limpo
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Função que cria o perfil sempre como pendente, resolve unidade pelo nome
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_school_unit_id uuid;
  v_role           text;
  v_school_name    text;
begin
  -- Papel solicitado (padrão: gestor_escolar)
  v_role        := coalesce(new.raw_user_meta_data->>'role', 'gestor_escolar');
  v_school_name := coalesce(new.raw_user_meta_data->>'selected_school_name', '');

  -- Resolve id da unidade escolar pelo nome, se informada
  if v_school_name <> '' then
    select id into v_school_unit_id
      from public.school_units
     where lower(trim(name)) = lower(trim(v_school_name))
     limit 1;
  end if;

  insert into public.profiles (
    id,
    full_name,
    phone,
    role,
    school_unit_id,
    -- access_status é SEMPRE 'pendente' — jamais lido do cliente
    access_status,
    access_requested_at,
    created_at,
    updated_at
  ) values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    v_role,
    v_school_unit_id,
    'pendente',
    now(),
    now(),
    now()
  )
  on conflict (id) do update
    set
      full_name           = excluded.full_name,
      phone               = excluded.phone,
      role                = excluded.role,
      school_unit_id      = excluded.school_unit_id,
      -- nunca atualiza access_status via trigger (preserva aprovações manuais)
      access_requested_at = coalesce(profiles.access_requested_at, excluded.access_requested_at),
      updated_at          = now();

  return new;
end;
$$;

-- Recria o trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Garante que perfis existentes sem status tenham o padrão correto
update public.profiles
   set access_status = 'pendente'
 where access_status is null or access_status = '';
