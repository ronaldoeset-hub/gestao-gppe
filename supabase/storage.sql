insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documentos-gppe',
  'documentos-gppe',
  false,
  26214400,
  array['application/pdf', 'image/png', 'image/jpeg', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'financeiro-gppe',
  'financeiro-gppe',
  false,
  26214400,
  array['application/pdf', 'image/png', 'image/jpeg', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "documentos_select_by_authenticated_user" on storage.objects;
create policy "documentos_select_by_authenticated_user"
on storage.objects for select
using (
  bucket_id = 'documentos-gppe'
  and (
    public.current_role() in ('admin_sme', 'tecnico_gppe')
    or exists (
      select 1
      from public.documents document
      where document.storage_path = storage.objects.name
        and document.school_unit_id = public.current_school_unit_id()
    )
  )
);

drop policy if exists "documentos_insert_by_authenticated_user" on storage.objects;
create policy "documentos_insert_by_authenticated_user"
on storage.objects for insert
with check (
  bucket_id = 'documentos-gppe'
  and (
    public.current_role() in ('admin_sme', 'tecnico_gppe')
    or split_part(storage.objects.name, '/', 1) = public.current_school_unit_id()::text
  )
);

drop policy if exists "financeiro_select_by_role" on storage.objects;
create policy "financeiro_select_by_role"
on storage.objects for select
using (
  bucket_id = 'financeiro-gppe'
  and (
    public.current_role() in ('admin_sme', 'tecnico_gppe')
    or exists (
      select 1
      from public.financial_documents document
      where document.storage_path = storage.objects.name
        and document.school_unit_id = public.current_school_unit_id()
    )
  )
);

drop policy if exists "financeiro_insert_by_role" on storage.objects;
create policy "financeiro_insert_by_role"
on storage.objects for insert
with check (
  bucket_id = 'financeiro-gppe'
  and (
    public.current_role() in ('admin_sme', 'tecnico_gppe')
    or split_part(storage.objects.name, '/', 1) = public.current_school_unit_id()::text
  )
);
