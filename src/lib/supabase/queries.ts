import { accountabilities, alerts, councils, resources, schoolUnits } from "@/lib/data";
import type { Accountability, Alert, Council, DocumentRecord, ProfileRecord, ResourceTransfer, SchoolUnit } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

type SchoolUnitRow = {
  id: string;
  name: string;
  inep: string | null;
  type: "escola" | "creche" | "cemei" | "conveniada";
  district: string | null;
  manager_name: string | null;
};

type CouncilRow = {
  id: string;
  president_name: string;
  vice_president_name: string | null;
  mandate_start: string | null;
  mandate_end: string;
  members_count: number;
  expected_members_count?: number | null;
  student_count?: number | null;
  election_date?: string | null;
  possession_date?: string | null;
  registry_date?: string | null;
  status: Council["status"];
  school_units: { name: string } | { name: string }[] | null;
};

type ResourceRow = {
  id: string;
  program: string;
  amount: number;
  released_at: string;
  balance: number;
  status: ResourceTransfer["status"];
  category?: string | null;
  school_units: { name: string } | { name: string }[] | null;
};

type AccountabilityRow = {
  id: string;
  reference_period: string;
  due_date: string;
  submitted_at: string | null;
  status: Accountability["status"];
  school_units: { name: string } | { name: string }[] | null;
};

type AlertRow = {
  id: string;
  title: string;
  description: string;
  severity: Alert["severity"];
  due_date: string | null;
};

type DocumentRow = {
  id: string;
  title: string;
  category: string;
  storage_path: string;
  created_at: string;
  school_units: { name: string } | { name: string }[] | null;
};

type ProfileRow = {
  id: string;
  full_name: string;
  role: ProfileRecord["role"];
  phone: string | null;
  created_at: string;
  school_units: { name: string } | { name: string }[] | null;
};

const typeLabels: Record<SchoolUnitRow["type"], SchoolUnit["type"]> = {
  escola: "Escola",
  creche: "Creche",
  cemei: "CEMEI",
  conveniada: "Conveniada"
};

function relatedSchoolName(value: { name: string } | { name: string }[] | null) {
  if (Array.isArray(value)) {
    return value[0]?.name ?? "Unidade não informada";
  }

  return value?.name ?? "Unidade não informada";
}

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getSchoolUnits(): Promise<SchoolUnit[]> {
  if (!isSupabaseConfigured()) {
    return schoolUnits;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("school_units")
      .select("id,name,inep,type,district,manager_name")
      .order("name", { ascending: true });

    if (error || !data?.length) {
      return schoolUnits;
    }

    return (data as SchoolUnitRow[]).map((unit, index) => ({
      id: unit.id,
      name: unit.name,
      inep: unit.inep ?? "",
      type: typeLabels[unit.type],
      district: unit.district ?? "",
      manager: unit.manager_name ?? `Gestor(a) da Unidade ${String(index + 1).padStart(2, "0")}`,
      councilStatus: index % 8 === 0 ? "pendente" : index % 6 === 0 ? "atencao" : "regular"
    }));
  } catch {
    return schoolUnits;
  }
}

export async function getCouncils(): Promise<Council[]> {
  if (!isSupabaseConfigured()) {
    return councils;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("school_councils")
      .select("id,president_name,vice_president_name,mandate_start,mandate_end,members_count,expected_members_count,student_count,election_date,possession_date,registry_date,status,school_units(name)")
      .order("mandate_end", { ascending: true });

    if (error || !data?.length) {
      return councils;
    }

    return (data as CouncilRow[]).map((item) => ({
      id: item.id,
      school: relatedSchoolName(item.school_units),
      president: item.president_name,
      vicePresident: item.vice_president_name ?? undefined,
      mandateStart: item.mandate_start ?? undefined,
      mandateEnd: item.mandate_end,
      members: item.members_count,
      expectedMembers: item.expected_members_count ?? undefined,
      studentCount: item.student_count ?? undefined,
      electionDate: item.election_date ?? undefined,
      possessionDate: item.possession_date ?? undefined,
      registryDate: item.registry_date ?? undefined,
      status: item.status
    }));
  } catch {
    return councils;
  }
}

export async function getResources(): Promise<ResourceTransfer[]> {
  if (!isSupabaseConfigured()) {
    return resources;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("resource_transfers")
      .select("id,program,amount,released_at,balance,status,category,school_units(name)")
      .order("released_at", { ascending: false });

    if (error || !data?.length) {
      return resources;
    }

    return (data as ResourceRow[]).map((item) => ({
      id: item.id,
      program: item.program,
      school: relatedSchoolName(item.school_units),
      amount: Number(item.amount),
      releasedAt: item.released_at,
      balance: Number(item.balance),
      status: item.status,
      category: item.category === "capital" ? "Capital" : item.category === "custeio" ? "Custeio" : "Outros"
    }));
  } catch {
    return resources;
  }
}

export async function getAccountabilities(): Promise<Accountability[]> {
  if (!isSupabaseConfigured()) {
    return accountabilities;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("accountabilities")
      .select("id,reference_period,due_date,submitted_at,status,school_units(name)")
      .order("due_date", { ascending: true });

    if (error || !data?.length) {
      return accountabilities;
    }

    return (data as AccountabilityRow[]).map((item) => ({
      id: item.id,
      school: relatedSchoolName(item.school_units),
      reference: item.reference_period,
      dueDate: item.due_date,
      submittedAt: item.submitted_at ?? undefined,
      status: item.status
    }));
  } catch {
    return accountabilities;
  }
}

export async function getAlerts(): Promise<Alert[]> {
  if (!isSupabaseConfigured()) {
    return alerts;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("alerts")
      .select("id,title,description,severity,due_date")
      .is("resolved_at", null)
      .order("due_date", { ascending: true });

    if (error || !data?.length) {
      return alerts;
    }

    return (data as AlertRow[]).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      severity: item.severity,
      dueDate: item.due_date ?? new Date().toISOString()
    }));
  } catch {
    return alerts;
  }
}

export async function getDocuments(): Promise<DocumentRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("documents")
      .select("id,title,category,storage_path,created_at,school_units(name)")
      .order("created_at", { ascending: false });

    if (error || !data?.length) {
      return [];
    }

    return (data as DocumentRow[]).map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      school: relatedSchoolName(item.school_units),
      storagePath: item.storage_path,
      createdAt: item.created_at
    }));
  } catch {
    return [];
  }
}

export async function getProfiles(): Promise<ProfileRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id,full_name,role,phone,created_at,school_units(name)")
      .order("created_at", { ascending: false });

    if (error || !data?.length) {
      return [];
    }

    return (data as ProfileRow[]).map((item) => ({
      id: item.id,
      fullName: item.full_name,
      role: item.role,
      school: relatedSchoolName(item.school_units),
      phone: item.phone ?? "",
      createdAt: item.created_at
    }));
  } catch {
    return [];
  }
}
