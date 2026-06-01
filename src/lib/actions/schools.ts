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

export async function createSchoolUnit(_state: FormActionState, formData: FormData): Promise<FormActionState> {
  const name = text(formData, "name");
  const email = text(formData, "email");

  if (name.length < 3) {
    return { ok: false, message: "Informe um nome de unidade com pelo menos 3 caracteres." };
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Informe um e-mail valido." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("school_units").insert({
    name,
    inep: text(formData, "inep") || null,
    type: text(formData, "type") || "escola",
    district: text(formData, "district") || null,
    address: text(formData, "address") || null,
    manager_name: text(formData, "manager_name") || null,
    phone: text(formData, "phone") || null,
    email: email || null
  });

  if (error) {
    return { ok: false, message: `Erro ao salvar: ${error.message}` };
  }

  revalidatePath("/unidades");
  revalidatePath("/alimentar-dados");
  revalidatePath("/diagnostico-dados");
  revalidatePath("/relatorios");

  return { ok: true, message: "Unidade cadastrada com sucesso." };
}
