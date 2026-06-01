"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CouncilInput = {
  school_unit_id: string;
  president_name: string;
  vice_president_name?: string;
  mandate_start: string;
  mandate_end: string;
  members_count: number;
  expected_members_count?: number;
  student_count?: number;
  election_date?: string;
  possession_date?: string;
  registry_date?: string;
  status?: string;
};

export type FormActionState = {
  ok: boolean;
  message: string;
};

async function tryAuditLog(
  supabase: Awaited<ReturnType<typeof createClient>>,
  entry: {
    user_id: string;
    action: string;
    entity_type: string;
    entity_id: string;
    old_data?: Record<string, unknown>;
    new_data?: Record<string, unknown>;
  }
) {
  try {
    await supabase.from("audit_logs").insert(entry);
  } catch {
    // tabela ainda não existe — ignora silenciosamente
  }
}

export async function createCouncil(input: CouncilInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { data, error } = await supabase
    .from("school_councils")
    .insert(input)
    .select()
    .single();

  if (error) return { error: error.message };

  await tryAuditLog(supabase, {
    user_id: user.id,
    action: "create",
    entity_type: "school_councils",
    entity_id: data.id,
    new_data: input as Record<string, unknown>,
  });

  revalidatePath("/conselhos");
  revalidatePath("/central-prazos");
  revalidatePath("/relatorios");
  return { success: true, data };
}

export async function createCouncilFromForm(_state: FormActionState, formData: FormData): Promise<FormActionState> {
  const input: CouncilInput = {
    school_unit_id: String(formData.get("school_unit_id") ?? ""),
    president_name: String(formData.get("president_name") ?? ""),
    vice_president_name: String(formData.get("vice_president_name") ?? "") || undefined,
    mandate_start: String(formData.get("mandate_start") ?? ""),
    mandate_end: String(formData.get("mandate_end") ?? ""),
    members_count: Number(formData.get("members_count") ?? 0),
    status: String(formData.get("status") ?? "regular")
  };

  const result = await createCouncil(input);

  if (result.error) {
    return { ok: false, message: `Erro ao salvar: ${result.error}` };
  }

  return { ok: true, message: "Conselho cadastrado com sucesso." };
}

export async function updateCouncil(id: string, input: Partial<CouncilInput>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { data: old } = await supabase
    .from("school_councils")
    .select()
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("school_councils")
    .update(input)
    .eq("id", id);

  if (error) return { error: error.message };

  await tryAuditLog(supabase, {
    user_id: user.id,
    action: "update",
    entity_type: "school_councils",
    entity_id: id,
    old_data: old as Record<string, unknown>,
    new_data: input as Record<string, unknown>,
  });

  revalidatePath("/conselhos");
  return { success: true };
}
