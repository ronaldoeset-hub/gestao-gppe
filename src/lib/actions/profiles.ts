"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function approveUser(userId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin_sme") return { error: "Sem permissão" };

  const admin = createAdminClient();

  const { error } = await admin
    .from("profiles")
    .update({
      access_status: "aprovado",
      approved_at: new Date().toISOString(),
      approved_by: user.id,
    })
    .eq("id", userId);

  if (error) return { error: error.message };

  await admin.from("audit_logs").insert({
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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin_sme") return { error: "Sem permissão" };

  const admin = createAdminClient();

  const { data: target } = await admin
    .from("profiles")
    .select("access_status")
    .eq("id", userId)
    .single();

  const { error } = await admin
    .from("profiles")
    .update({ access_status: "bloqueado" })
    .eq("id", userId);

  if (error) return { error: error.message };

  await admin.from("audit_logs").insert({
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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin_sme") return { error: "Sem permissão" };

  const admin = createAdminClient();

  const { error } = await admin
    .from("profiles")
    .update({ school_unit_id: schoolUnitId })
    .eq("id", userId);

  if (error) return { error: error.message };

  await admin.from("audit_logs").insert({
    user_id: user.id,
    action: "assign_school_unit",
    entity_type: "profiles",
    entity_id: userId,
    new_data: { school_unit_id: schoolUnitId },
  });

  revalidatePath("/administracao");
  return { success: true };
}
