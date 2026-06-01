import { accountabilities, alerts, councils, financialControlMock, resources, schoolUnits } from "@/lib/data";
import type {
  Accountability,
  Alert,
  Council,
  DocumentRecord,
  FinancialControl,
  ProfileRecord,
  ResourceTransfer,
  SchoolUnit
} from "@/lib/types";
import { isMockMode, isSupabaseEnabled } from "@/lib/supabase/config";
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
  access_status?: ProfileRecord["accessStatus"] | null;
  school_unit_id?: string | null;
  school_units: { name: string } | { name: string }[] | null;
};

type FinancialAllocationRow = {
  id: string;
  resource_type: "custeio" | "capital" | "outros";
  planned_amount: number;
  received_amount: number;
  released_at: string | null;
  current_balance: number;
  status: ResourceTransfer["status"] | "encerrado";
  notes: string | null;
  school_units: { name: string } | { name: string }[] | null;
  financial_programs: { code: string; name: string } | { code: string; name: string }[] | null;
  financial_periods: { year: number; label: string } | { year: number; label: string }[] | null;
};

type FinancialPlanItemRow = {
  id: string;
  item_name: string;
  category: string | null;
  quantity: number;
  unit_label: string | null;
  unit_price: number;
  planned_total: number;
  priority: string | null;
  status: FinancialControl["planItems"][number]["status"];
  source_observation: string | null;
  financial_allocations: {
    school_units: { name: string } | { name: string }[] | null;
    financial_programs: { code: string; name: string } | { code: string; name: string }[] | null;
  } | Array<{
    school_units: { name: string } | { name: string }[] | null;
    financial_programs: { code: string; name: string } | { code: string; name: string }[] | null;
  }> | null;
};

type FinancialMovementRow = {
  id: string;
  movement_type: FinancialControl["movements"][number]["type"];
  document_number: string | null;
  issued_at: string | null;
  paid_at: string | null;
  amount: number;
  payment_method: string | null;
  status: string;
  description: string | null;
  financial_allocations: {
    school_units: { name: string } | { name: string }[] | null;
    financial_programs: { code: string; name: string } | { code: string; name: string }[] | null;
  } | Array<{
    school_units: { name: string } | { name: string }[] | null;
    financial_programs: { code: string; name: string } | { code: string; name: string }[] | null;
  }> | null;
  financial_suppliers: { name: string } | { name: string }[] | null;
};

type FinancialDocumentRow = {
  id: string;
  title: string;
  category: string;
  document_number: string | null;
  storage_path: string | null;
  document_date: string | null;
  competence: string | null;
  school_units: { name: string } | { name: string }[] | null;
};

type FinancialReportRow = {
  id: string;
  reference: string;
  due_date: string;
  submitted_at: string | null;
  status: FinancialControl["reports"][number]["status"];
  planned_amount: number;
  executed_amount: number;
  balance: number;
  school_units: { name: string } | { name: string }[] | null;
  financial_programs: { code: string; name: string } | { code: string; name: string }[] | null;
};

type FinancialAlertRow = {
  id: string;
  title: string;
  description: string;
  severity: Alert["severity"];
  due_date: string | null;
  status: string;
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
  return isSupabaseEnabled();
}

function shouldUseMockData() {
  return isMockMode();
}

function relatedOne<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export async function getSchoolUnits(): Promise<SchoolUnit[]> {
  if (shouldUseMockData()) {
    return schoolUnits;
  }
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("school_units")
      .select("id,name,inep,type,district,manager_name")
      .order("name", { ascending: true });

    if (error || !data?.length) {
      return [];
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
    return shouldUseMockData() ? schoolUnits : [];
  }
}

export async function getCouncils(): Promise<Council[]> {
  if (shouldUseMockData()) {
    return councils;
  }
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("school_councils")
      .select("id,president_name,vice_president_name,mandate_start,mandate_end,members_count,expected_members_count,student_count,election_date,possession_date,registry_date,status,school_units(name)")
      .order("mandate_end", { ascending: true });

    if (error || !data?.length) {
      return [];
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
    return shouldUseMockData() ? councils : [];
  }
}

export async function getResources(): Promise<ResourceTransfer[]> {
  if (shouldUseMockData()) {
    return resources;
  }
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("resource_transfers")
      .select("id,program,amount,released_at,balance,status,category,school_units(name)")
      .order("released_at", { ascending: false });

    if (error || !data?.length) {
      return [];
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
    return shouldUseMockData() ? resources : [];
  }
}

function resourceTypeLabel(value: FinancialAllocationRow["resource_type"]): FinancialControl["allocations"][number]["resourceType"] {
  if (value === "capital") return "Capital";
  if (value === "custeio") return "Custeio";
  return "Outros";
}

function allocationStatus(value: FinancialAllocationRow["status"]): FinancialControl["allocations"][number]["status"] {
  return value === "encerrado" ? "encerrado" : value;
}

function relatedProgramName(value: { code: string; name: string } | { code: string; name: string }[] | null) {
  const program = relatedOne(value);
  return program ? program.name : "Programa nao informado";
}

function relatedPeriodName(value: { year: number; label: string } | { year: number; label: string }[] | null) {
  const period = relatedOne(value);
  return period ? period.label : "Periodo nao informado";
}

function relatedAllocationContext(
  value: FinancialPlanItemRow["financial_allocations"] | FinancialMovementRow["financial_allocations"]
) {
  const allocation = relatedOne(value);

  return {
    school: relatedSchoolName(allocation?.school_units ?? null),
    program: relatedProgramName(allocation?.financial_programs ?? null)
  };
}

export async function getFinancialControl(): Promise<FinancialControl> {
  if (shouldUseMockData()) {
    return financialControlMock;
  }
  if (!isSupabaseConfigured()) {
    return { allocations: [], planItems: [], movements: [], documents: [], reports: [], alerts: [] };
  }

  try {
    const supabase = await createClient();
    const [allocationsResult, itemsResult, movementsResult, documentsResult, reportsResult, alertsResult] = await Promise.all([
      supabase
        .from("financial_allocations")
        .select("id,resource_type,planned_amount,received_amount,released_at,current_balance,status,notes,school_units(name),financial_programs(code,name),financial_periods(year,label)")
        .order("released_at", { ascending: false }),
      supabase
        .from("financial_plan_items")
        .select("id,item_name,category,quantity,unit_label,unit_price,planned_total,priority,status,source_observation,financial_allocations(school_units(name),financial_programs(code,name))")
        .order("created_at", { ascending: false }),
      supabase
        .from("financial_movements")
        .select("id,movement_type,document_number,issued_at,paid_at,amount,payment_method,status,description,financial_allocations(school_units(name),financial_programs(code,name)),financial_suppliers(name)")
        .order("paid_at", { ascending: false }),
      supabase
        .from("financial_documents")
        .select("id,title,category,document_number,storage_path,document_date,competence,school_units(name)")
        .order("created_at", { ascending: false }),
      supabase
        .from("financial_accountability_reports")
        .select("id,reference,due_date,submitted_at,status,planned_amount,executed_amount,balance,school_units(name),financial_programs(code,name)")
        .order("due_date", { ascending: true }),
      supabase
        .from("financial_alerts")
        .select("id,title,description,severity,due_date,status,school_units(name)")
        .is("resolved_at", null)
        .order("due_date", { ascending: true })
    ]);

    if (
      allocationsResult.error ||
      itemsResult.error ||
      movementsResult.error ||
      documentsResult.error ||
      reportsResult.error ||
      alertsResult.error
    ) {
      return { allocations: [], planItems: [], movements: [], documents: [], reports: [], alerts: [] };
    }

    const allocations = ((allocationsResult.data ?? []) as FinancialAllocationRow[]).map((item) => ({
      id: item.id,
      school: relatedSchoolName(item.school_units),
      program: relatedProgramName(item.financial_programs),
      period: relatedPeriodName(item.financial_periods),
      resourceType: resourceTypeLabel(item.resource_type),
      plannedAmount: Number(item.planned_amount),
      receivedAmount: Number(item.received_amount),
      releasedAt: item.released_at ?? undefined,
      currentBalance: Number(item.current_balance),
      status: allocationStatus(item.status),
      notes: item.notes ?? undefined
    }));

    const planItems = ((itemsResult.data ?? []) as FinancialPlanItemRow[]).map((item) => {
      const context = relatedAllocationContext(item.financial_allocations);

      return {
        id: item.id,
        school: context.school,
        program: context.program,
        itemName: item.item_name,
        category: item.category ?? undefined,
        quantity: Number(item.quantity),
        unitLabel: item.unit_label ?? undefined,
        unitPrice: Number(item.unit_price),
        plannedTotal: Number(item.planned_total),
        priority: item.priority ?? undefined,
        status: item.status,
        observation: item.source_observation ?? undefined
      };
    });

    const movements = ((movementsResult.data ?? []) as FinancialMovementRow[]).map((item) => {
      const context = relatedAllocationContext(item.financial_allocations);
      const supplier = relatedOne(item.financial_suppliers);

      return {
        id: item.id,
        school: context.school,
        program: context.program,
        supplier: supplier?.name,
        type: item.movement_type,
        documentNumber: item.document_number ?? undefined,
        issuedAt: item.issued_at ?? undefined,
        paidAt: item.paid_at ?? undefined,
        amount: Number(item.amount),
        paymentMethod: item.payment_method ?? undefined,
        status: item.status,
        description: item.description ?? undefined
      };
    });

    const documents = ((documentsResult.data ?? []) as FinancialDocumentRow[]).map((item) => ({
      id: item.id,
      school: relatedSchoolName(item.school_units),
      title: item.title,
      category: item.category,
      documentNumber: item.document_number ?? undefined,
      storagePath: item.storage_path ?? undefined,
      documentDate: item.document_date ?? undefined,
      competence: item.competence ?? undefined
    }));

    const reports = ((reportsResult.data ?? []) as FinancialReportRow[]).map((item) => ({
      id: item.id,
      school: relatedSchoolName(item.school_units),
      program: relatedProgramName(item.financial_programs),
      reference: item.reference,
      dueDate: item.due_date,
      submittedAt: item.submitted_at ?? undefined,
      status: item.status,
      plannedAmount: Number(item.planned_amount),
      executedAmount: Number(item.executed_amount),
      balance: Number(item.balance)
    }));

    const financialAlerts = ((alertsResult.data ?? []) as FinancialAlertRow[]).map((item) => ({
      id: item.id,
      school: relatedSchoolName(item.school_units),
      title: item.title,
      description: item.description,
      severity: item.severity,
      dueDate: item.due_date ?? undefined,
      status: item.status
    }));

    return { allocations, planItems, movements, documents, reports, alerts: financialAlerts };
  } catch {
    return shouldUseMockData() ? financialControlMock : { allocations: [], planItems: [], movements: [], documents: [], reports: [], alerts: [] };
  }
}

export async function getAccountabilities(): Promise<Accountability[]> {
  if (shouldUseMockData()) {
    return accountabilities;
  }
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("accountabilities")
      .select("id,reference_period,due_date,submitted_at,status,school_units(name)")
      .order("due_date", { ascending: true });

    if (error || !data?.length) {
      return [];
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
    return shouldUseMockData() ? accountabilities : [];
  }
}

export async function getAlerts(): Promise<Alert[]> {
  if (shouldUseMockData()) {
    return alerts;
  }
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("alerts")
      .select("id,title,description,severity,due_date")
      .is("resolved_at", null)
      .order("due_date", { ascending: true });

    if (error || !data?.length) {
      return [];
    }

    return (data as AlertRow[]).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      severity: item.severity,
      dueDate: item.due_date ?? new Date().toISOString()
    }));
  } catch {
    return shouldUseMockData() ? alerts : [];
  }
}

export async function getDocuments(): Promise<DocumentRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = await createClient();
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
    const supabase = await createClient();
    let { data, error } = await supabase
      .from("profiles")
      .select("id,full_name,role,phone,created_at,access_status,school_unit_id,school_units(name)")
      .order("created_at", { ascending: false });

    if (error?.message?.includes("access_status")) {
      const fallback = await supabase
        .from("profiles")
        .select("id,full_name,role,phone,created_at,school_unit_id,school_units(name)")
        .order("created_at", { ascending: false });
      data = fallback.data as typeof data;
      error = fallback.error;
    }

    if (error || !data?.length) {
      return [];
    }

    return (data as ProfileRow[]).map((item) => ({
      id: item.id,
      fullName: item.full_name,
      role: item.role,
      school: relatedSchoolName(item.school_units),
      schoolUnitId: item.school_unit_id ?? undefined,
      phone: item.phone ?? "",
      createdAt: item.created_at,
      accessStatus: item.access_status ?? "aprovado"
    }));
  } catch {
    return [];
  }
}
