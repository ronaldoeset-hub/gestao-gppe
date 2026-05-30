import { accountabilities, alerts, councils, resources, schoolUnits } from "@/lib/data";
import type { Accountability, Alert, Council, DocumentRecord, EducationalResource, FinanceiroBalance, FndeLink, PddeBalance, PddeProgram, ProfileRecord, ResourceTransfer, SchoolUnit, SupportTicket } from "@/lib/types";
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
  school_unit_id?: string | null;
  phone: string | null;
  created_at: string;
  access_requested_at?: string | null;
  access_status?: ProfileRecord["accessStatus"] | null;
  school_units: { name: string } | { name: string }[] | null;
};

type FndeLinkRow = {
  id: string;
  title: string;
  url: string;
  category: string;
  description: string | null;
};

type SupportTicketRow = {
  id: string;
  title: string;
  description: string;
  priority: SupportTicket["priority"];
  status: SupportTicket["status"];
  created_at: string;
  school_units: { name: string } | { name: string }[] | null;
};

export const officialFndeLinks: FndeLink[] = [
  {
    id: "fnde",
    title: "FNDE",
    url: "https://www.gov.br/fnde",
    category: "portal",
    description: "Portal oficial do Fundo Nacional de Desenvolvimento da Educacao."
  },
  {
    id: "pdde-oficial",
    title: "PDDE - pagina oficial",
    url: "https://www.gov.br/fnde/pt-br/acesso-a-informacao/acoes-e-programas/programas/pdde",
    category: "pdde",
    description: "Pagina oficial do Programa Dinheiro Direto na Escola."
  },
  {
    id: "acoes-integradas",
    title: "Acoes Integradas do PDDE",
    url: "https://www.gov.br/fnde/pt-br/acesso-a-informacao/acoes-e-programas/programas/pdde/acoes-integradas",
    category: "pdde",
    description: "Orientacoes sobre acoes integradas do PDDE."
  },
  {
    id: "pddeweb",
    title: "PDDEWeb",
    url: "https://www.fnde.gov.br/pdde/brasilcidadao.do",
    category: "sistema",
    description: "Acesso ao sistema PDDEWeb."
  },
  {
    id: "sistema-pdde",
    title: "Sistema PDDE",
    url: "https://www.fnde.gov.br/pdde/manterexecutora.do",
    category: "sistema",
    description: "Sistema oficial do PDDE."
  },
  {
    id: "consulta-escola-pdde",
    title: "Consulta Escola PDDE",
    url: "https://www.fnde.gov.br/pddeinfo/pddeinfo/escola/consultar",
    category: "consulta",
    description: "Consulta de informacoes do PDDE por escola."
  },
  {
    id: "sigpc-contas-online",
    title: "SiGPC / Contas Online",
    url: "https://www.gov.br/fnde/pt-br/acesso-a-informacao/acoes-e-programas/acoes/prestacao-de-contas/como-acessar-o-sigpc",
    category: "prestacao",
    description: "Orientacoes oficiais para acesso ao SiGPC."
  },
  {
    id: "sigpc-sistema",
    title: "SiGPC sistema",
    url: "https://www.fnde.gov.br/sigpc",
    category: "sistema",
    description: "Sistema de Gestao de Prestacao de Contas."
  }
];

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

type EducationalResourceRow = {
  id: string;
  title: string;
  category: string;
  stage: string | null;
  modality: string | null;
  type: string;
  description: string | null;
  tags: string[];
  file_path: string | null;
  external_url: string | null;
  status: string;
  created_at: string;
};

export async function getEducationalResources(onlyPublic = true): Promise<EducationalResource[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = createClient();
    let query = supabase
      .from("educational_resources")
      .select("id,title,category,stage,modality,type,description,tags,file_path,external_url,status,created_at")
      .order("created_at", { ascending: false });

    if (onlyPublic) {
      query = query.eq("status", "publico");
    }

    const { data, error } = await query;

    if (error || !data?.length) {
      return [];
    }

    return Promise.all(
      (data as EducationalResourceRow[]).map(async (item) => {
        let fileUrl: string | undefined;

        if (item.file_path) {
          const { data: signedFile } = await supabase.storage
            .from("documentos-gppe")
            .createSignedUrl(item.file_path, 60 * 60);
          fileUrl = signedFile?.signedUrl;
        }

        return {
          id: item.id,
          title: item.title,
          category: item.category,
          stage: item.stage ?? undefined,
          modality: item.modality ?? undefined,
          type: item.type,
          description: item.description ?? undefined,
          tags: item.tags ?? [],
          filePath: item.file_path ?? undefined,
          externalUrl: item.external_url ?? fileUrl,
          status: item.status as EducationalResource["status"],
          createdAt: item.created_at
        };
      })
    );
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
    let { data, error } = await supabase
      .from("profiles")
      .select("id,full_name,role,school_unit_id,phone,created_at,access_requested_at,access_status,school_units(name)")
      .order("created_at", { ascending: false });

    if (error?.message?.includes("access_status") || error?.message?.includes("access_requested_at") || error?.message?.includes("school_unit_id")) {
      const fallback = await supabase
        .from("profiles")
        .select("id,full_name,role,phone,created_at,school_units(name)")
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
      schoolUnitId: item.school_unit_id ?? null,
      phone: item.phone ?? "",
      createdAt: item.created_at,
      accessRequestedAt: item.access_requested_at ?? null,
      accessStatus: item.access_status ?? "aprovado"
    }));
  } catch {
    return [];
  }
}

export async function getPendingAccessCount(): Promise<number> {
  if (!isSupabaseConfigured()) {
    return 0;
  }

  try {
    const supabase = createClient();
    const { count, error } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("access_status", "pendente");

    if (error) {
      return 0;
    }

    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function getFndeLinks(): Promise<FndeLink[]> {
  if (!isSupabaseConfigured()) {
    return officialFndeLinks;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("fnde_links")
      .select("id,title,url,category,description")
      .eq("active", true)
      .order("category", { ascending: true })
      .order("title", { ascending: true });

    if (error || !data?.length) {
      return officialFndeLinks;
    }

    return (data as FndeLinkRow[]).map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      category: item.category,
      description: item.description ?? ""
    }));
  } catch {
    return officialFndeLinks;
  }
}

export async function getSupportTickets(): Promise<SupportTicket[]> {
  if (!isSupabaseConfigured()) {
    return [
      {
        id: "SUP-001",
        school: "Escola M. Joaquim Pedro Gomes da Cruz",
        title: "Orientacao sobre prestacao de contas",
        description: "Unidade solicitou apoio para organizar protocolo e documentos comprobatórios.",
        priority: "alta",
        status: "aberto",
        createdAt: new Date().toISOString()
      },
      {
        id: "SUP-002",
        school: "Creche Municipal Eliene Martins Braga",
        title: "Documento vencido",
        description: "Regularidade documental precisa de atualizacao.",
        priority: "media",
        status: "em_atendimento",
        createdAt: new Date().toISOString()
      }
    ];
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("support_tickets")
      .select("id,title,description,priority,status,created_at,school_units(name)")
      .order("created_at", { ascending: false });

    if (error || !data?.length) {
      return [];
    }

    return (data as SupportTicketRow[]).map((item) => ({
      id: item.id,
      school: relatedSchoolName(item.school_units),
      title: item.title,
      description: item.description,
      priority: item.priority,
      status: item.status,
      createdAt: item.created_at
    }));
  } catch {
    return [];
  }
}

export async function getPddePrograms(): Promise<PddeProgram[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pdde_programs")
      .select("id,group_name,program_name,sort_order")
      .eq("active", true)
      .order("sort_order");
    if (error || !data?.length) return [];
    return data.map((r) => ({
      id: r.id,
      groupName: r.group_name,
      programName: r.program_name,
      sortOrder: r.sort_order
    }));
  } catch {
    return [];
  }
}

export async function getPddeBalances(schoolUnitId: string, year: number): Promise<PddeBalance[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pdde_balances")
      .select("id,school_unit_id,program_id,exercise_year,saldo_anterior_c,saldo_anterior_k,valor_creditado_c,valor_creditado_k,rendimento_c,rendimento_k,valor_gasto_c,valor_gasto_k")
      .eq("school_unit_id", schoolUnitId)
      .eq("exercise_year", year);
    if (error || !data?.length) return [];
    return data.map((r) => ({
      id: r.id,
      schoolUnitId: r.school_unit_id,
      programId: r.program_id,
      exerciseYear: r.exercise_year,
      saldoAnteriorC: Number(r.saldo_anterior_c),
      saldoAnteriorK: Number(r.saldo_anterior_k),
      valorCreditadoC: Number(r.valor_creditado_c),
      valorCreditadoK: Number(r.valor_creditado_k),
      rendimentoC: Number(r.rendimento_c),
      rendimentoK: Number(r.rendimento_k),
      valorGastoC: Number(r.valor_gasto_c),
      valorGastoK: Number(r.valor_gasto_k)
    }));
  } catch {
    return [];
  }
}

export async function getPddeBalancesByYear(year: number): Promise<PddeBalance[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pdde_balances")
      .select("id,school_unit_id,program_id,exercise_year,saldo_anterior_c,saldo_anterior_k,valor_creditado_c,valor_creditado_k,rendimento_c,rendimento_k,valor_gasto_c,valor_gasto_k")
      .eq("exercise_year", year);

    if (error || !data?.length) return [];

    return data.map((r) => ({
      id: r.id,
      schoolUnitId: r.school_unit_id,
      programId: r.program_id,
      exerciseYear: r.exercise_year,
      saldoAnteriorC: Number(r.saldo_anterior_c),
      saldoAnteriorK: Number(r.saldo_anterior_k),
      valorCreditadoC: Number(r.valor_creditado_c),
      valorCreditadoK: Number(r.valor_creditado_k),
      rendimentoC: Number(r.rendimento_c),
      rendimentoK: Number(r.rendimento_k),
      valorGastoC: Number(r.valor_gasto_c),
      valorGastoK: Number(r.valor_gasto_k)
    }));
  } catch {
    return [];
  }
}



export async function getFinanceiroBalances(schoolUnitId: string, year: number): Promise<FinanceiroBalance[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("financeiro_balances")
      .select("id,school_unit_id,programa_codigo,exercise_year,saldo_anterior_c,saldo_anterior_k,valor_creditado_c,valor_creditado_k,rendimento_c,rendimento_k,valor_gasto_c,valor_gasto_k,updated_at")
      .eq("school_unit_id", schoolUnitId)
      .eq("exercise_year", year);
    if (error || !data) return [];
    return data.map((r) => ({
      id: r.id,
      schoolUnitId: r.school_unit_id,
      programaCodigo: r.programa_codigo,
      exerciseYear: r.exercise_year,
      saldoAnteriorC: Number(r.saldo_anterior_c),
      saldoAnteriorK: Number(r.saldo_anterior_k),
      valorCreditadoC: Number(r.valor_creditado_c),
      valorCreditadoK: Number(r.valor_creditado_k),
      rendimentoC: Number(r.rendimento_c),
      rendimentoK: Number(r.rendimento_k),
      valorGastoC: Number(r.valor_gasto_c),
      valorGastoK: Number(r.valor_gasto_k),
      updatedAt: r.updated_at
    }));
  } catch { return []; }
}

// ── Gestão de Recursos ────────────────────────────────────────────────────────

export async function getGestaoPrograms(): Promise<import("@/lib/types").GestaoPrograma[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gestao_programas")
      .select("id,nome,descricao,ativo,created_at")
      .eq("ativo", true)
      .order("nome");
    if (error || !data) return [];
    return data.map((r) => ({
      id: r.id,
      nome: r.nome,
      descricao: r.descricao ?? undefined,
      ativo: r.ativo,
      createdAt: r.created_at
    }));
  } catch { return []; }
}

export async function getFinanceiroUnidade(filters: {
  exercicio?: number;
  programaId?: string;
  unidadeId?: string;
} = {}): Promise<import("@/lib/types").FinanceiroUnidade[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = createClient();
    let query = supabase
      .from("financeiro_unidade")
      .select("id,unidade_id,programa_id,exercicio,saldo_anterior_custeio,saldo_anterior_capital,creditado_custeio,creditado_capital,rendimento_custeio,rendimento_capital,despesa_custeio,despesa_capital,fonte_recurso_id,situacao_programa,tipo_programa,observacao_tecnica,created_at,updated_at");
    if (filters.exercicio) query = query.eq("exercicio", filters.exercicio);
    if (filters.programaId) query = query.eq("programa_id", filters.programaId);
    if (filters.unidadeId) query = query.eq("unidade_id", filters.unidadeId);
    const { data, error } = await query;
    if (error || !data) return [];
    return data.map((r) => ({
      id: r.id,
      unidadeId: r.unidade_id,
      programaId: r.programa_id,
      exercicio: r.exercicio,
      saldoAnteriorCusteio: Number(r.saldo_anterior_custeio),
      saldoAnteriorCapital: Number(r.saldo_anterior_capital),
      creditadoCusteio:     Number(r.creditado_custeio),
      creditadoCapital:     Number(r.creditado_capital),
      rendimentoCusteio:    Number(r.rendimento_custeio),
      rendimentoCapital:    Number(r.rendimento_capital),
      despesaCusteio:       Number(r.despesa_custeio),
      despesaCapital:       Number(r.despesa_capital),
      fonteRecursoId:       r.fonte_recurso_id ?? undefined,
      situacaoPrograma:     r.situacao_programa ?? undefined,
      tipoPrograma:         r.tipo_programa ?? "Custeio e Capital",
      observacaoTecnica:    r.observacao_tecnica ?? undefined,
      createdAt:            r.created_at,
      updatedAt:            r.updated_at
    }));
  } catch { return []; }
}

export async function getExercicios(): Promise<import("@/lib/types").Exercicio[]> {
  if (!isSupabaseConfigured()) return [
    { id: "1", ano: 2024, status: "encerrado" },
    { id: "2", ano: 2025, status: "encerrado" },
    { id: "3", ano: 2026, status: "aberto" }
  ];
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("exercicios")
      .select("id,ano,status")
      .order("ano", { ascending: false });
    if (error || !data) return [];
    return data as import("@/lib/types").Exercicio[];
  } catch { return []; }
}

export async function getFontesRecurso(): Promise<import("@/lib/types").FonteRecurso[]> {
  if (!isSupabaseConfigured()) return [
    { id: "1", nome: "Federal",                      ativo: true },
    { id: "2", nome: "Estadual",                     ativo: true },
    { id: "3", nome: "Municipal",                    ativo: true },
    { id: "4", nome: "FNDE",                         ativo: true },
    { id: "5", nome: "Emenda Parlamentar Federal",   ativo: true },
    { id: "6", nome: "Emenda Parlamentar Estadual",  ativo: true },
    { id: "7", nome: "Recursos Próprios",            ativo: true },
    { id: "8", nome: "Outros",                       ativo: true }
  ];
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("fontes_recurso")
      .select("id,nome,ativo")
      .eq("ativo", true)
      .order("nome");
    if (error || !data) return [];
    return data as import("@/lib/types").FonteRecurso[];
  } catch { return []; }
}
