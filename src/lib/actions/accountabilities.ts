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

export async function createAccountability(_state: FormActionState, formData: FormData): Promise<FormActionState> {
  const schoolUnitId = text(formData, "school_unit_id");
  const referencePeriod = text(formData, "reference_period");
  const dueDate = text(formData, "due_date");
  const submittedAt = text(formData, "submitted_at");

  if (!schoolUnitId) return { ok: false, message: "Selecione uma unidade escolar." };
  if (referencePeriod.length < 3) return { ok: false, message: "Informe a referencia da prestacao." };
  if (!dueDate) return { ok: false, message: "Informe o prazo da prestacao." };
  if (submittedAt && new Date(submittedAt) > new Date()) {
    return { ok: false, message: "A data de envio nao pode ser futura." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("accountabilities").insert({
    school_unit_id: schoolUnitId,
    reference_period: referencePeriod,
    due_date: dueDate,
    submitted_at: submittedAt || null,
    status: text(formData, "status") || "pendente",
    technical_opinion: text(formData, "technical_opinion") || null
  });

  if (error) {
    return { ok: false, message: `Erro ao salvar: ${error.message}` };
  }

  revalidatePath("/prestacao-contas");
  revalidatePath("/central-prazos");
  revalidatePath("/dashboard");
  revalidatePath("/transparencia");

  return { ok: true, message: "Prestacao cadastrada com sucesso." };
}
