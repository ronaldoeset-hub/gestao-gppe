"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

async function getSessionAndRole() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, role: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return { supabase, user, role: profile?.role ?? null };
}

export async function approveUser(userId: string) {
  const { supabase, user, role } = await getSessionAndRole();
  if (!user) return { error: "Não autenticado" };
  if (role !== "admin_sme") return { error: "Sem permissão" };

  const { error } = await supabase
    .from("profiles")
    .update({
      access_status: "aprovado",
      approved_at: new Date().toISOString(),
      approved_by: user.id,
    })
    .eq("id", userId);

  if (error) return { error: error.message };

  await tryAuditLog(supabase, {
    user_id: user.id,
    action: "approve_user",
    entity_type: "profiles",
    entity_id: userId,
    new_data: { access_status: "aprovado" },
  });

  revalidatePath("/administracao");
  revalidatePath("/perfis");
  return { success: true };
}

export async function blockUser(userId: string) {
  const { supabase, user, role } = await getSessionAndRole();
  if (!user) return { error: "Não autenticado" };
  if (role !== "admin_sme") return { error: "Sem permissão" };

  const { data: target } = await supabase
    .from("profiles")
    .select("access_status")
    .eq("id", userId)
    .single();

  const { error } = await supabase
    .from("profiles")
    .update({ access_status: "bloqueado" })
    .eq("id", userId);

  if (error) return { error: error.message };

  await tryAuditLog(supabase, {
    user_id: user.id,
    action: "block_user",
    entity_type: "profiles",
    entity_id: userId,
    old_data: { access_status: target?.access_status },
    new_data: { access_status: "bloqueado" },
  });

  revalidatePath("/administracao");
  revalidatePath("/perfis");
  return { success: true };
}

export async function assignSchoolUnit(userId: string, schoolUnitId: string) {
  const { supabase, user, role } = await getSessionAndRole();
  if (!user) return { error: "Não autenticado" };
  if (role !== "admin_sme") return { error: "Sem permissão" };

  const { error } = await supabase
    .from("profiles")
    .update({ school_unit_id: schoolUnitId })
    .eq("id", userId);

  if (error) return { error: error.message };

  await tryAuditLog(supabase, {
    user_id: user.id,
    action: "assign_school_unit",
    entity_type: "profiles",
    entity_id: userId,
    new_data: { school_unit_id: schoolUnitId },
  });

  revalidatePath("/administracao");
  return { success: true };
}
