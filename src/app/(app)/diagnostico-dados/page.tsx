import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, ArrowRight, BarChart3, CheckCircle2, FileWarning, ShieldAlert } from "lucide-react";
import { ModuleHeader } from "@/components/module-header";
import { getAccountabilities, getCouncils, getDocuments, getResources, getSchoolUnits } from "@/lib/supabase/queries";
import type { SchoolUnit } from "@/lib/types";

export const metadata: Metadata = {
  title: "Diagnóstico de dados",
  description: "Leitura automática de pendências, inconsistências e prioridades de preenchimento."
};

type DataIssue = {
  unit: SchoolUnit;
  severity: "alta" | "media" | "baixa";
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
};

const severityStyles = {
  alta: "border-red-200 bg-red-50 text-red-700",
  media: "border-amber-200 bg-amber-50 text-amber-700",
  baixa: "border-blue-200 bg-blue-50 text-blue-700"
};

function isGenericManager(value: string) {
  return !value || value.toLowerCase().includes("gestor(a) da unidade");
}

function daysUntil(value?: string) {
  if (!value) {
    return null;
  }

  const today = new Date();
  const date = new Date(value);

  return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default async function DataDiagnosisPage() {
  const [units, councils, resources, accountabilities, documents] = await Promise.all([
    getSchoolUnits(),
    getCouncils(),
    getResources(),
    getAccountabilities(),
    getDocuments()
  ]);

  const issues: DataIssue[] = [];

  for (const unit of units) {
    const unitCouncils = councils.filter((item) => item.school === unit.name);
    const unitResources = resources.filter((item) => item.school === unit.name);
    const unitAccountabilities = accountabilities.filter((item) => item.school === unit.name);
    const unitDocuments = documents.filter((item) => item.school === unit.name);
    const currentCouncil = unitCouncils[0];
    const councilDays = daysUntil(currentCouncil?.mandateEnd);

    if (!unit.inep) {
      issues.push({
        unit,
        severity: "media",
        title: "INEP nao informado",
        description: "Complete o codigo INEP para melhorar relatorios, filtros e exportacoes.",
        actionHref: "/unidades#nova-unidade",
        actionLabel: "Atualizar unidade"
      });
    }

    if (isGenericManager(unit.manager)) {
      issues.push({
        unit,
        severity: "media",
        title: "Gestor ainda generico",
        description: "Substitua o texto padrao pelo nome real do gestor da unidade.",
        actionHref: "/unidades#nova-unidade",
        actionLabel: "Informar gestor"
      });
    }

    if (!unitCouncils.length) {
      issues.push({
        unit,
        severity: "alta",
        title: "Sem conselho vinculado",
        description: "Cadastre o conselho escolar para acompanhar mandato, composicao e regularidade.",
        actionHref: "/conselhos#novo-conselho",
        actionLabel: "Cadastrar conselho"
      });
    } else if (councilDays !== null && councilDays <= 90) {
      issues.push({
        unit,
        severity: councilDays < 0 ? "alta" : "media",
        title: councilDays < 0 ? "Mandato vencido" : "Mandato vence em ate 90 dias",
        description: councilDays < 0 ? `Mandato vencido ha ${Math.abs(councilDays)} dias.` : `Faltam ${councilDays} dias para o fim do mandato.`,
        actionHref: "/conselhos",
        actionLabel: "Ver conselho"
      });
    }

    if (!unitResources.length) {
      issues.push({
        unit,
        severity: "baixa",
        title: "Sem recurso cadastrado",
        description: "Nenhum repasse ou planejamento financeiro foi vinculado a esta unidade.",
        actionHref: "/recursos#novo-recurso",
        actionLabel: "Cadastrar recurso"
      });
    }

    if (!unitAccountabilities.length) {
      issues.push({
        unit,
        severity: "media",
        title: "Sem prestacao de contas",
        description: "Cadastre prazos e referencias para controlar obrigacoes da unidade.",
        actionHref: "/prestacao-contas#nova-prestacao",
        actionLabel: "Cadastrar prestacao"
      });
    }

    if (!unitDocuments.length) {
      issues.push({
        unit,
        severity: "baixa",
        title: "Sem documentos enviados",
        description: "Nenhum documento foi anexado para esta unidade no Storage.",
        actionHref: "/documentos",
        actionLabel: "Enviar documento"
      });
    }
  }

  const high = issues.filter((item) => item.severity === "alta").length;
  const medium = issues.filter((item) => item.severity === "media").length;
  const low = issues.filter((item) => item.severity === "baixa").length;
  const completeUnits = units.filter((unit) => {
    const unitIssues = issues.filter((issue) => issue.unit.id === unit.id && issue.severity !== "baixa");
    return unitIssues.length === 0;
  }).length;

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Diagnostico dos Dados"
        description="Leitura automatica para identificar o que falta alimentar, corrigir ou priorizar em cada unidade escolar."
        icon={BarChart3}
      />

      <section className="grid gap-4 md:grid-cols-4">
        <SummaryCard title="Criticas" value={high} description="Exigem prioridade" icon={ShieldAlert} tone="red" />
        <SummaryCard title="Atencao" value={medium} description="Precisam de correcao" icon={AlertTriangle} tone="yellow" />
        <SummaryCard title="Baixas" value={low} description="Complementos desejaveis" icon={FileWarning} tone="blue" />
        <SummaryCard title="Unidades ok" value={completeUnits} description="Sem pendencia media/alta" icon={CheckCircle2} tone="green" />
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-black text-sme-ink">Fila de trabalho da GPPE</h2>
            <p className="mt-1 text-sm text-slate-600">Use esta lista para decidir o que alimentar primeiro no sistema.</p>
          </div>
          <Link href="/alimentar-dados" className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-sme-blue px-3 text-sm font-bold text-white hover:bg-sme-navy">
            Alimentar dados
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-5 space-y-3">
          {issues.slice(0, 80).map((issue, index) => (
            <article key={`${issue.unit.id}-${issue.title}-${index}`} className="rounded-md border border-slate-200 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-black uppercase ${severityStyles[issue.severity]}`}>
                      {issue.severity}
                    </span>
                    <p className="font-black text-sme-ink">{issue.title}</p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-[#003b7a]">{issue.unit.name}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{issue.description}</p>
                </div>
                <Link href={issue.actionHref} className="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-slate-300 px-3 text-sm font-bold text-sme-blue hover:border-sme-blue hover:bg-blue-50">
                  {issue.actionLabel}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  tone
}: {
  title: string;
  value: number;
  description: string;
  icon: typeof BarChart3;
  tone: "red" | "yellow" | "blue" | "green";
}) {
  const colors = {
    red: "bg-red-500 text-white",
    yellow: "bg-sme-yellow text-sme-ink",
    blue: "bg-sme-blue text-white",
    green: "bg-emerald-500 text-white"
  };

  return (
    <article className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-black text-sme-ink">{value}</p>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${colors[tone]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}
