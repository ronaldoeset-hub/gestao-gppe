"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type FormActionState = {
  ok: boolean;
  message: string;
};

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function createDocument(_state: FormActionState, formData: FormData): Promise<FormActionState> {
  const file = formData.get("file");
  const title = text(formData, "title");
  const schoolUnitId = text(formData, "school_unit_id");
  const category = text(formData, "category");

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Selecione um arquivo antes de enviar." };
  }

  if (file.size > 25 * 1024 * 1024) {
    return { ok: false, message: "O arquivo deve ter no maximo 25 MB." };
  }

  if (!schoolUnitId) return { ok: false, message: "Selecione uma unidade escolar." };
  if (title.length < 3) return { ok: false, message: "Informe um titulo com pelo menos 3 caracteres." };
  if (!category) return { ok: false, message: "Selecione a categoria do documento." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const storagePath = `${schoolUnitId}/${Date.now()}-${safeName}`;
  const { error: uploadError } = await supabase.storage.from("documentos-gppe").upload(storagePath, file, { upsert: false });

  if (uploadError) {
    return { ok: false, message: `Erro no upload: ${uploadError.message}` };
  }

  const { error: insertError } = await supabase.from("documents").insert({
    school_unit_id: schoolUnitId,
    uploaded_by: user?.id ?? null,
    title,
    category,
    storage_path: storagePath,
    mime_type: file.type || null,
    file_size: file.size
  });

  if (insertError) {
    return { ok: false, message: `Arquivo enviado, mas houve erro ao salvar registro: ${insertError.message}` };
  }

  revalidatePath("/documentos");
  revalidatePath("/diagnostico-dados");
  revalidatePath("/dashboard");

  return { ok: true, message: "Documento enviado e registrado com sucesso." };
}
