import { FileBarChart } from "lucide-react";
import { ExportButtons } from "@/components/export-buttons";
import { ModuleHeader } from "@/components/module-header";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

type ExportRow = Record<string, string | number | undefined>;
type RelatedName = { name: string } | { name: string }[] | null;

function relatedName(value: RelatedName, fallback = "Nao informado") {
  if (Array.isArray(value)) {
    return value[0]?.name ?? fallback;
  }

  return value?.name ?? fallback;
}

async function getCouncilRows(): Promise<ExportRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("school_councils")
      .select("id,school_units(name),president_name,vice_president_name,mandate_start,mandate_end,members_count,status")
      .order("mandate_end", { ascending: true });

    if (error) return [];

    return ((data ?? []) as Array<{
      id: string;
      school_units: RelatedName;
      president_name: string | null;
      vice_president_name: string | null;
      mandate_start: string | null;
      mandate_end: string | null;
      members_count: number | null;
      status: string | null;
    }>).map((item) => ({
      Codigo: item.id,
      Unidade: relatedName(item.school_units, "Unidade nao informada"),
      Presidente: item.president_name ?? "",
      Vice: item.vice_president_name ?? "",
      Inicio: item.mandate_start ? formatDate(item.mandate_start) : "",
      Fim: item.mandate_end ? formatDate(item.mandate_end) : "",
      Membros: item.members_count ?? 0,
      Status: item.status ?? ""
    }));
  } catch {
    return [];
  }
}

async function getSchoolRows(): Promise<ExportRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("school_units")
      .select("id,name,inep,type,district,manager_name,cnpj,phone,email,zip_code")
      .order("name", { ascending: true });

    if (error) return [];

    return ((data ?? []) as Array<{
      id: string;
      name: string;
      inep: string | null;
      type: string | null;
      district: string | null;
      manager_name: string | null;
      cnpj: string | null;
      phone: string | null;
      email: string | null;
      zip_code: string | null;
    }>).map((item) => ({
      Codigo: item.id,
      Unidade: item.name,
      INEP: item.inep ?? "",
      Tipo: item.type ?? "",
      Bairro: item.district ?? "",
      Gestor: item.manager_name ?? "",
      CNPJ: item.cnpj ?? "",
      Telefone: item.phone ?? "",
      Email: item.email ?? "",
      CEP: item.zip_code ?? ""
    }));
  } catch {
    return [];
  }
}

async function getAlertRows(): Promise<ExportRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("alerts")
      .select("id,school_units(name),title,description,severity,due_date,created_at")
      .order("due_date", { ascending: true });

    if (error) return [];

    return ((data ?? []) as Array<{
      id: string;
      school_units: RelatedName;
      title: string;
      description: string;
      severity: string;
      due_date: string | null;
      created_at: string | null;
    }>).map((item) => ({
      Codigo: item.id,
      Unidade: relatedName(item.school_units, "Todas"),
      Titulo: item.title,
      Descricao: item.description,
      Prioridade: item.severity,
      Prazo: item.due_date ? formatDate(item.due_date) : "",
      CriadoEm: item.created_at ? formatDate(item.created_at) : ""
    }));
  } catch {
    return [];
  }
}

function ReportCard({ title, description, filename, rows }: { title: string; description: string; filename: string; rows: ExportRow[] }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-sme-ink">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">{rows.length} registros disponiveis</p>
        </div>
        <ExportButtons filename={filename} rows={rows} />
      </div>
    </section>
  );
}

export default async function RelatoriosPage() {
  const [councilRows, schoolRows, alertRows] = await Promise.all([
    getCouncilRows(),
    getSchoolRows(),
    getAlertRows()
  ]);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Relatorios"
        description="Exporte dados operacionais do GPPE em CSV para acompanhamento, auditoria e consolidacao interna."
        icon={FileBarChart}
      />

      <div className="grid gap-4">
        <ReportCard
          title="Relatorio de Conselhos Escolares"
          description="Composicao, presidencia, periodo de mandato, quantidade de membros e situacao de cada conselho."
          filename="relatorio-conselhos-escolares"
          rows={councilRows}
        />
        <ReportCard
          title="Relatorio de Unidades Escolares"
          description="Cadastro das unidades, identificadores, contato e dados administrativos principais."
          filename="relatorio-unidades-escolares"
          rows={schoolRows}
        />
        <ReportCard
          title="Relatorio de Alertas"
          description="Alertas ativos e historicos cadastrados para acompanhamento de prazos e pendencias."
          filename="relatorio-alertas"
          rows={alertRows}
        />
      </div>
    </div>
  );
}
