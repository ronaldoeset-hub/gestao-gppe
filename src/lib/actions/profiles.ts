"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type FormActionState = {
  ok: boolean;
  message: string;
};

const allowedRoles = new Set(["admin_sme", "tecnico_gppe", "gestor_escolar", "funcionario_escola", "conselho_escolar"]);
const allowedAccessStatuses = new Set(["pendente", "aprovado", "bloqueado"]);

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

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

export async function updateProfileFromForm(_state: FormActionState, formData: FormData): Promise<FormActionState> {
  const { supabase, user, role: currentRole } = await getSessionAndRole();
  if (!user) return { ok: false, message: "Nao autenticado." };
  if (currentRole !== "admin_sme") return { ok: false, message: "Sem permissao para atualizar perfis." };

  const userId = text(formData, "user_id");
  const fullName = text(formData, "full_name");
  const role = text(formData, "role");
  const accessStatus = text(formData, "access_status") || "aprovado";
  const schoolUnitId = text(formData, "school_unit_id");
  const phone = text(formData, "phone");

  if (!userId) return { ok: false, message: "Selecione um usuario para atualizar." };
  if (fullName.length < 3) return { ok: false, message: "Informe um nome com pelo menos 3 caracteres." };
  if (!allowedRoles.has(role)) return { ok: false, message: "Perfil informado nao e valido." };
  if (!allowedAccessStatuses.has(accessStatus)) return { ok: false, message: "Status de acesso informado nao e valido." };

  const { data: target } = await supabase
    .from("profiles")
    .select("full_name,role,access_status,school_unit_id,phone")
    .eq("id", userId)
    .single();

  const payload = {
    full_name: fullName,
    role,
    access_status: accessStatus,
    school_unit_id: schoolUnitId || null,
    phone: phone || null
  };

  const { error } = await supabase.from("profiles").update(payload).eq("id", userId);
  if (error) return { ok: false, message: `Erro ao atualizar: ${error.message}` };

  await tryAuditLog(supabase, {
    user_id: user.id,
    action: "update_profile",
    entity_type: "profiles",
    entity_id: userId,
    old_data: target ?? undefined,
    new_data: payload
  });

  revalidatePath("/administracao");
  revalidatePath("/perfis");

  return { ok: true, message: "Perfil atualizado com sucesso." };
}
