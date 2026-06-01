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

export async function createResourceTransfer(_state: FormActionState, formData: FormData): Promise<FormActionState> {
  const schoolUnitId = text(formData, "school_unit_id");
  const program = text(formData, "program");
  const amount = Number(formData.get("amount") ?? 0);
  const balanceValue = text(formData, "balance");
  const balance = balanceValue ? Number(balanceValue) : amount;

  if (!schoolUnitId) return { ok: false, message: "Selecione uma unidade escolar." };
  if (program.length < 2) return { ok: false, message: "Informe o programa do recurso." };
  if (!Number.isFinite(amount) || amount <= 0) return { ok: false, message: "Informe um valor maior que zero." };
  if (!Number.isFinite(balance) || balance < 0) return { ok: false, message: "Informe um saldo valido." };

  const supabase = await createClient();
  const { error } = await supabase.from("resource_transfers").insert({
    school_unit_id: schoolUnitId,
    program,
    source: text(formData, "source") || null,
    amount,
    released_at: text(formData, "released_at"),
    balance,
    status: text(formData, "status") || "regular"
  });

  if (error) {
    return { ok: false, message: `Erro ao salvar: ${error.message}` };
  }

  revalidatePath("/recursos");
  revalidatePath("/dashboard");
  revalidatePath("/transparencia");
  revalidatePath("/relatorios");

  return { ok: true, message: "Recurso cadastrado com sucesso." };
}
