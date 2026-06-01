import { DataTable } from "@/components/data-table";
import { EduConectaModulePage } from "@/components/educonecta-module-page";
import { modules } from "@/data/educonecta";
import { getFinancialControl } from "@/lib/supabase/queries";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function FndePddePage() {
  const financialControl = await getFinancialControl();
  const pddeRows = financialControl.allocations.filter((item) => item.program.toLowerCase().includes("pdde"));

  return (
    <div className="space-y-6">
      <EduConectaModulePage module={modules["fnde-pdde"]} />
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-sme-ink">Repasses PDDE no controle financeiro</h2>
          <p className="text-sm leading-6 text-slate-600">
            Visao operacional alimentada pelas alocacoes, itens planejados e prestacoes vinculadas.
          </p>
        </div>
        <DataTable
          rows={pddeRows}
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
