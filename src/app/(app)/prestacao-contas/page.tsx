import { ClipboardCheck, Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { ExportButtons } from "@/components/export-buttons";
import { AccountabilityForm } from "@/components/linked-record-forms";
import { ModuleHeader } from "@/components/module-header";
import { StatusBadge } from "@/components/status-badge";
import { getAccountabilities } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils";

export default async function AccountabilityPage() {
  const accountabilities = await getAccountabilities();

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
