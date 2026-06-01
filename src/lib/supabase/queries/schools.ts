import type { SchoolUnit } from "@/lib/types";
import { schoolUnits as mockSchoolUnits } from "@/lib/data";
import { isMockMode, isSupabaseEnabled } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

type SchoolUnitRow = {
  id: string;
  name: string;
  inep: string | null;
  cnpj: string | null;
  type: "escola" | "creche" | "cemei" | "conveniada";
  district: string | null;
  manager_name: string | null;
  phone: string | null;
  email: string | null;
  active: boolean;
  school_councils: { status: string; mandate_end: string }[] | null;
};

const typeLabels: Record<SchoolUnitRow["type"], SchoolUnit["type"]> = {
  escola: "Escola",
  creche: "Creche",
  cemei: "CEMEI",
  conveniada: "Conveniada",
};

function councilStatusFromRows(
  rows: SchoolUnitRow["school_councils"]
): SchoolUnit["councilStatus"] {
  if (!rows || rows.length === 0) return "pendente";
  const latest = rows.sort(
    (a, b) => new Date(b.mandate_end).getTime() - new Date(a.mandate_end).getTime()
  )[0];
  if (!latest) return "pendente";
  const end = new Date(latest.mandate_end);
  const now = new Date();
  const diff = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return "vencido";
  if (diff <= 90) return "atencao";
  return "regular";
}

export async function getSchoolUnits(): Promise<SchoolUnit[]> {
  if (isMockMode()) return mockSchoolUnits;
  if (!isSupabaseEnabled()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("school_units")
      .select(
        "id,name,inep,cnpj,type,district,manager_name,phone,email,active,school_councils(status,mandate_end)"
      )
      .eq("active", true)
      .is("deleted_at", null)
      .order("name", { ascending: true });

    if (error || !data?.length) return [];

    return (data as SchoolUnitRow[]).map((unit) => ({
      id: unit.id,
      name: unit.name,
      inep: unit.inep ?? "",
      cnpj: unit.cnpj ?? "",
      type: typeLabels[unit.type],
      district: unit.district ?? "",
      manager: unit.manager_name ?? "",
      phone: unit.phone ?? "",
      email: unit.email ?? "",
      councilStatus: councilStatusFromRows(unit.school_councils),
    }));
  } catch {
    return isMockMode() ? mockSchoolUnits : [];
  }
}

export async function getDashboardSummary() {
  if (isMockMode()) {
    return {
      totalUnidades: 55,
      totalRecebido: 8245320,
      totalExecutado: 4312780,
      saldoDisponivel: 3932540,
      conselhosVencidos: 3,
      conselhosVencendo90d: 7,
      prestacoesPendentes: 12,
    };
  }
  if (!isSupabaseEnabled()) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("v_dashboard_sme")
      .select("*")
      .single();

    if (error || !data) return null;
    return {
      totalUnidades: Number(data.total_unidades ?? 0),
      totalRecebido: Number(data.total_recebido ?? 0),
      totalExecutado: Number(data.total_executado ?? 0),
      saldoDisponivel: Number(data.saldo_disponivel ?? 0),
      conselhosVencidos: Number(data.conselhos_vencidos ?? 0),
      conselhosVencendo90d: Number(data.conselhos_vencendo_90d ?? 0),
      prestacoesPendentes: Number(data.prestacoes_pendentes ?? 0),
    };
  } catch {
    return null;
  }
}

export async function getRankingSaldosParados() {
  if (!isSupabaseEnabled()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("v_ranking_saldos_parados")
      .select("*")
      .gt("saldo_total_parado", 0)
      .limit(55);

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}
