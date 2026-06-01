"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FormActionState } from "@/lib/actions/councils";

export async function createAlert(_state: FormActionState, formData: FormData): Promise<FormActionState> {
  const supabase = await createClient();
  const schoolUnitId = String(formData.get("school_unit_id") ?? "");

  const { error } = await supabase.from("alerts").insert({
    school_unit_id: schoolUnitId || null,
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    severity: String(formData.get("severity") ?? "media"),
    due_date: String(formData.get("due_date") ?? "") || null
  });

  if (error) {
    return { ok: false, message: `Erro ao salvar: ${error.message}` };
  }

  revalidatePath("/alertas");
  revalidatePath("/central-prazos");
  revalidatePath("/relatorios");

  return { ok: true, message: "Alerta cadastrado com sucesso." };
}
