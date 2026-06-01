import type { Metadata } from "next";
import { AlertTriangle, Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { AlertForm } from "@/components/linked-record-forms";
import { ModuleHeader } from "@/components/module-header";
import { getAlerts } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Alertas",
  description: "Central de alertas e pendências operacionais do GPPE."
};

export default async function AlertsPage() {
  const alerts = await getAlerts();

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Alertas"
        description="Central de avisos para prazos, mandatos, pendências documentais e acompanhamento das unidades escolares."
        icon={AlertTriangle}
        action={
          <a href="#novo-alerta" className="inline-flex h-10 items-center gap-2 rounded-md bg-sme-blue px-3 text-sm font-semibold text-white hover:bg-sme-navy">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Novo alerta
          </a>
        }
      />
      <section id="novo-alerta">
        <AlertForm />
      </section>
      <DataTable
        rows={alerts}
        columns={[
          { key: "id", header: "Código", render: (row) => row.id },
          { key: "title", header: "Alerta", render: (row) => <span className="font-semibold text-sme-ink">{row.title}</span> },
          { key: "description", header: "Descrição", render: (row) => row.description, className: "min-w-96 whitespace-normal" },
          { key: "severity", header: "Prioridade", render: (row) => row.severity.toUpperCase() },
          { key: "dueDate", header: "Prazo", render: (row) => formatDate(row.dueDate) }
        ]}
      />
    </div>
  );
}
