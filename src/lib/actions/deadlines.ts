"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function markDeadlineCompleted(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const kind = String(formData.get("kind") ?? "");

  if (!id) {
    return;
  }

  try {
    const supabase = await createClient();
    if (kind === "prestacao") {
      await supabase.from("financial_accountability_reports").update({ status: "aprovado" }).eq("id", id);
      await supabase.from("accountabilities").update({ status: "regular" }).eq("id", id);
    }
    if (kind === "conselho") {
      await supabase.from("school_councils").update({ status: "regular" }).eq("id", id);
    }
  } catch {
    // A ação é resiliente: em modo mock ou sem permissão, apenas mantém a UI estável.
  }

  revalidatePath("/central-prazos");
  revalidatePath("/dashboard");
}
