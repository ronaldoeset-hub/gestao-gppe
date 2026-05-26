import { Landmark, Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { ExportButtons } from "@/components/export-buttons";
import { FinancialMovementForm, ResourceForm } from "@/components/linked-record-forms";
import { ModuleHeader } from "@/components/module-header";
import { ResourcesOverview } from "@/components/resources-overview";
import { StatusBadge } from "@/components/status-badge";
import { getResources } from "@/lib/supabase/queries";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ResourcesPage() {
  const resources = await getResources();

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
      <section id="novo-recurso">
        <ResourceForm />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-sme-ink">Movimentacao financeira por programa</h2>
        <FinancialMovementForm />
      </section>
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
