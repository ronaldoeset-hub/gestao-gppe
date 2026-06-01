import type { Metadata } from "next";
import { Landmark, Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { ExportButtons } from "@/components/export-buttons";
import { FinancialControlPanel } from "@/components/financial-control-panel";
import { ResourceForm } from "@/components/linked-record-forms";
import { ModuleHeader } from "@/components/module-header";
import { ResourcesOverview } from "@/components/resources-overview";
import { StatusBadge } from "@/components/status-badge";
import { getFinancialControl, getResources } from "@/lib/supabase/queries";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Recursos",
  description: "Acompanhamento de repasses, saldos, planejamento e controle financeiro."
};

export default async function ResourcesPage() {
  const [resources, financialControl] = await Promise.all([getResources(), getFinancialControl()]);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Controle de Recursos"
        description="Registre programas, fontes, valores liberados, saldo disponivel e situacao de execucao por unidade escolar."
        icon={Landmark}
        action={
          <a href="#novo-recurso" className="inline-flex h-10 items-center gap-2 rounded-md bg-sme-blue px-3 text-sm font-semibold text-white hover:bg-sme-navy">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Novo recurso
          </a>
        }
      />
      <nav className="flex gap-2 overflow-x-auto rounded-md border border-slate-200 bg-white p-2 shadow-soft">
        {[
          ["#planejamento", "Planejamento"],
          ["#repasses", "Repasses"],
          ["#movimentacoes", "Movimentacoes"],
          ["#documentos-comprobatorios", "Documentos"],
          ["#prestacao-contas", "Prestacao"],
          ["#alertas-vencimentos", "Alertas"]
        ].map(([href, label]) => (
          <a key={href} href={href} className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-sme-blue">
            {label}
          </a>
        ))}
      </nav>
      <section id="novo-recurso">
        <ResourceForm />
      </section>
      <FinancialControlPanel control={financialControl} />
      <ResourcesOverview resources={resources} />
      <ExportButtons
        filename="recursos-gppe"
        rows={resources.map((item) => ({
          Codigo: item.id,
          Programa: item.program,
          Unidade: item.school,
          Tipo: item.category ?? "",
          Valor: item.amount,
          Liberado: formatDate(item.releasedAt),
          Saldo: item.balance,
          Status: item.status
        }))}
      />
      <DataTable
        rows={resources}
        columns={[
          { key: "id", header: "Codigo", render: (row) => row.id },
          { key: "program", header: "Programa", render: (row) => <span className="font-semibold text-sme-ink">{row.program}</span> },
          { key: "school", header: "Unidade", render: (row) => row.school },
          { key: "category", header: "Tipo", render: (row) => row.category ?? "Outros" },
          { key: "amount", header: "Valor", render: (row) => formatCurrency(row.amount) },
          { key: "releasedAt", header: "Liberacao", render: (row) => formatDate(row.releasedAt) },
          { key: "balance", header: "Saldo", render: (row) => formatCurrency(row.balance) },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> }
        ]}
      />
    </div>
  );
}
