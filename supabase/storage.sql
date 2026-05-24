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

create policy "documentos_select_by_authenticated_user"
on storage.objects for select
using (
  bucket_id = 'documentos-gppe'
  and auth.role() = 'authenticated'
);

create policy "documentos_insert_by_authenticated_user"
on storage.objects for insert
with check (
  bucket_id = 'documentos-gppe'
  and auth.role() = 'authenticated'
);
