import type { Metadata } from "next";
import { Plus, UsersRound } from "lucide-react";
import { CouncilRegularityPanel } from "@/components/council-regularity-panel";
import { DataTable } from "@/components/data-table";
import { CouncilForm } from "@/components/linked-record-forms";
import { ExportButtons } from "@/components/export-buttons";
import { ModuleHeader } from "@/components/module-header";
import { StatusBadge } from "@/components/status-badge";
import { getCouncils } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Conselhos escolares",
  description: "Controle de mandatos, composição e regularidade dos conselhos escolares."
};

export default async function CouncilsPage() {
  const councils = await getCouncils();

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Controle de Conselhos Escolares"
        description="Acompanhe composicao, presidencia, mandato, atas, cartorio e regularidade documental dos conselhos de cada unidade."
        icon={UsersRound}
        action={
          <a href="#novo-conselho" className="inline-flex h-10 items-center gap-2 rounded-md bg-sme-blue px-3 text-sm font-semibold text-white hover:bg-sme-navy">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Novo conselho
          </a>
        }
      />
      <section id="novo-conselho">
        <CouncilForm />
      </section>
      <CouncilRegularityPanel councils={councils} />
      <ExportButtons
        filename="conselhos-escolares-gppe"
        rows={councils.map((item) => ({
          Codigo: item.id,
          Unidade: item.school,
          Presidente: item.president,
          Vice: item.vicePresident ?? "",
          Membros: item.members,
          Previsto: item.expectedMembers ?? "",
          Alunos: item.studentCount ?? "",
          Mandato: formatDate(item.mandateEnd),
          Status: item.status
        }))}
      />
      <DataTable
        rows={councils}
        columns={[
          { key: "id", header: "Codigo", render: (row) => row.id },
          { key: "school", header: "Unidade", render: (row) => row.school },
          { key: "president", header: "Presidencia", render: (row) => row.president },
          { key: "members", header: "Membros", render: (row) => row.members },
          { key: "expectedMembers", header: "Previsto", render: (row) => row.expectedMembers ?? (row.studentCount && row.studentCount > 600 ? 13 : 11) },
          { key: "mandateEnd", header: "Fim do mandato", render: (row) => formatDate(row.mandateEnd) },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> }
        ]}
      />
    </div>
  );
}
