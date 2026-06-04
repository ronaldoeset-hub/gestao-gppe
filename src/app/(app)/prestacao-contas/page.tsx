import type { Metadata } from "next";
import { ClipboardCheck, Plus } from "lucide-react";
import { ExportButtons } from "@/components/export-buttons";
import { AccountabilityForm } from "@/components/linked-record-forms";
import { ModuleHeader } from "@/components/module-header";
import { AccountabilityExplorer } from "@/components/v4-filter-panels";
import { getAccountabilities, getFinancialControl } from "@/lib/supabase/queries";
import { formatCurrency, formatDate } from "@/lib/utils";

export const revalidate = 60;

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
      <section className="rounded-md border border-sme-line bg-white p-5 shadow-soft-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-sme-muted">Controle financeiro</p>
            <h2 className="text-lg font-bold text-sme-ink">Prestações vinculadas aos repasses</h2>
          </div>
          <a href="/recursos#prestacao-contas" className="text-sm font-bold text-sme-blue hover:text-sme-navy">
            Ver painel financeiro
          </a>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {financialControl.reports.slice(0, 3).map((report) => (
            <div key={report.id} className="rounded-md border border-sme-line p-4">
              <p className="truncate text-sm font-bold text-sme-ink">{report.school}</p>
              <p className="mt-1 text-sm text-sme-muted">{report.reference}</p>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-sme-muted">Executado</span>
                <span className="font-black text-sme-blue">{formatCurrency(report.executedAmount)}</span>
              </div>
              <p className="mt-2 text-xs font-bold uppercase text-sme-muted">Prazo: {formatDate(report.dueDate)}</p>
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
      <AccountabilityExplorer rows={accountabilities} />
    </div>
  );
}
