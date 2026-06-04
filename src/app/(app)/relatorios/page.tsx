import type { Metadata } from "next";
import { FileBarChart } from "lucide-react";
import { ExportButtons } from "@/components/export-buttons";
import { ModuleHeader } from "@/components/module-header";
import { getAccountabilities, getCouncils, getFinancialControl, getResources, getSchoolUnits } from "@/lib/supabase/queries";
import { formatCurrency, formatDate } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Relatórios",
  description: "Exportação de relatórios reais de conselhos, recursos, prestações e regularidade."
};

type ExportRow = Record<string, string | number | undefined>;

function ReportCard({ title, description, filename, rows }: { title: string; description: string; filename: string; rows: ExportRow[] }) {
  return (
    <section className="rounded-2xl border border-sme-line bg-white p-5 shadow-soft-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-sme-navy">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-sme-muted">{description}</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-sme-muted">{rows.length} registros disponíveis</p>
        </div>
        <ExportButtons filename={filename} rows={rows} />
      </div>
    </section>
  );
}

export default async function RelatoriosPage() {
  const [units, councils, resources, accountabilities, financialControl] = await Promise.all([
    getSchoolUnits(),
    getCouncils(),
    getResources(),
    getAccountabilities(),
    getFinancialControl()
  ]);

  const councilRows = councils.map((item) => ({
    Codigo: item.id,
    Unidade: item.school,
    Presidente: item.president,
    Vice: item.vicePresident ?? "",
    MandatoInicio: item.mandateStart ? formatDate(item.mandateStart) : "",
    MandatoFim: formatDate(item.mandateEnd),
    Membros: item.members,
    Status: item.status
  }));

  const resourceRows = [
    ...resources.map((item) => ({
      Codigo: item.id,
      Programa: item.program,
      Unidade: item.school,
      Valor: formatCurrency(item.amount),
      Saldo: formatCurrency(item.balance),
      Status: item.status
    })),
    ...financialControl.allocations.map((item) => ({
      Codigo: item.id,
      Programa: item.program,
      Unidade: item.school,
      Valor: formatCurrency(item.receivedAmount),
      Saldo: formatCurrency(item.currentBalance),
      Status: item.status
    }))
  ];

  const accountabilityRows = [
    ...accountabilities.map((item) => ({
      Unidade: item.school,
      Referencia: item.reference,
      Prazo: formatDate(item.dueDate),
      Status: item.status
    })),
    ...financialControl.reports.map((item) => ({
      Unidade: item.school,
      Referencia: item.reference,
      Prazo: formatDate(item.dueDate),
      Status: item.status
    }))
  ];

  const regularityRows = units.map((unit) => {
    const council = councils.find((item) => item.school === unit.name);
    const pending = accountabilities.filter((item) => item.school === unit.name && ["pendente", "vencido"].includes(item.status)).length;
    return {
      Unidade: unit.name,
      Tipo: unit.type,
      Conselho: council?.status ?? "sem_conselho",
      Pendencias: pending
    };
  });

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Relatórios"
        description="Exporte dados operacionais do GPPE em CSV para acompanhamento, auditoria e consolidação interna."
        icon={FileBarChart}
      />

      <div className="grid gap-4">
        <ReportCard title="Conselhos" description="Status, presidência, mandato e unidade vinculada." filename="relatorio-conselhos" rows={councilRows} />
        <ReportCard title="Recursos financeiros" description="Programa, unidade, valores recebidos, saldos e situação." filename="relatorio-recursos-financeiros" rows={resourceRows} />
        <ReportCard title="Prestação de contas" description="Unidade, referência, prazo e status da prestação." filename="relatorio-prestacao-contas" rows={accountabilityRows} />
        <ReportCard title="Regularidade" description="Visão consolidada por unidade, tipo, conselho e pendências." filename="relatorio-regularidade" rows={regularityRows} />
      </div>
    </div>
  );
}
