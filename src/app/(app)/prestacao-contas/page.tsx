import type { Metadata } from "next";
import { ClipboardCheck, Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { ExportButtons } from "@/components/export-buttons";
import { AccountabilityForm } from "@/components/linked-record-forms";
import { ModuleHeader } from "@/components/module-header";
import { StatusBadge } from "@/components/status-badge";
import { getAccountabilities, getFinancialControl } from "@/lib/supabase/queries";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Prestação de contas",
  description: "Controle de prazos, envios e status de prestação de contas."
};

export default async function AccountabilityPage() {
  const [accountabilities, financialControl] = await Promise.all([getAccountabilities(), getFinancialControl()]);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Prestação de Contas"
        description="Controle protocolos, prazos, envio documental, análise técnica, parecer e aprovação dos recursos aplicados."
        icon={ClipboardCheck}
        action={
          <a href="#nova-prestacao" className="inline-flex h-10 items-center gap-2 rounded-md bg-sme-blue px-3 text-sm font-semibold text-white hover:bg-sme-navy">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Nova prestação
          </a>
        }
      />
      <section id="nova-prestacao">
        <AccountabilityForm />
      </section>
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Controle financeiro</p>
            <h2 className="text-lg font-bold text-sme-ink">Prestacoes vinculadas aos repasses</h2>
          </div>
          <a href="/recursos#prestacao-contas" className="text-sm font-bold text-sme-blue hover:text-sme-navy">
            Ver painel financeiro
          </a>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {financialControl.reports.slice(0, 3).map((report) => (
            <div key={report.id} className="rounded-md border border-slate-200 p-4">
              <p className="truncate text-sm font-bold text-sme-ink">{report.school}</p>
              <p className="mt-1 text-sm text-slate-600">{report.reference}</p>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-slate-500">Executado</span>
                <span className="font-black text-sme-blue">{formatCurrency(report.executedAmount)}</span>
              </div>
              <p className="mt-2 text-xs font-bold uppercase text-slate-500">Prazo: {formatDate(report.dueDate)}</p>
            </div>
          ))}
        </div>
      </section>
      <ExportButtons
        filename="prestacao-contas-gppe"
        rows={accountabilities.map((item) => ({
          Protocolo: item.id,
          Unidade: item.school,
          Referencia: item.reference,
          Prazo: formatDate(item.dueDate),
          Envio: item.submittedAt ? formatDate(item.submittedAt) : "Aguardando",
          Status: item.status
        }))}
      />
      <DataTable
        rows={accountabilities}
        emptyDescription="Nenhuma prestação de contas cadastrada foi encontrada."
        columns={[
          { key: "id", header: "Protocolo", render: (row) => row.id },
          { key: "school", header: "Unidade", render: (row) => row.school },
          { key: "reference", header: "Referência", render: (row) => row.reference },
          { key: "dueDate", header: "Prazo", render: (row) => formatDate(row.dueDate) },
          { key: "submittedAt", header: "Envio", render: (row) => (row.submittedAt ? formatDate(row.submittedAt) : "Aguardando") },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> }
        ]}
      />
    </div>
  );
}
