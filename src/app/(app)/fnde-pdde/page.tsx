import type { Metadata } from "next";
import { DataTable } from "@/components/data-table";
import { ModuleHeader } from "@/components/module-header";
import { FndeCategoryCards } from "@/components/v4-operational-panels";
import { getFinancialControl } from "@/lib/supabase/queries";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Landmark } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "FNDE e PDDE",
  description: "Consulta operacional de repasses PDDE e controle financeiro vinculado."
};

export default async function FndePddePage() {
  const financialControl = await getFinancialControl();
  const pddeRows = financialControl.allocations.filter((item) => item.program.toLowerCase().includes("pdde"));

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="FNDE e PDDE"
        description="Materiais de referência, sistemas de apoio e acompanhamento dos repasses vinculados ao PDDE."
        icon={Landmark}
      />
      <FndeCategoryCards />
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-sme-ink">Repasses PDDE no controle financeiro</h2>
          <p className="text-sm leading-6 text-slate-600">
            Visao operacional alimentada pelas alocacoes, itens planejados e prestacoes vinculadas.
          </p>
        </div>
        <DataTable
          rows={pddeRows}
          emptyDescription="Nenhum repasse PDDE foi encontrado no controle financeiro."
          columns={[
            { key: "school", header: "Unidade", render: (row) => row.school },
            { key: "period", header: "Periodo", render: (row) => row.period },
            { key: "type", header: "Tipo", render: (row) => row.resourceType },
            { key: "received", header: "Recebido", render: (row) => formatCurrency(row.receivedAmount) },
            { key: "balance", header: "Saldo", render: (row) => formatCurrency(row.currentBalance) },
            { key: "released", header: "Liberacao", render: (row) => row.releasedAt ? formatDate(row.releasedAt) : "Nao informada" }
          ]}
        />
      </section>
    </div>
  );
}
