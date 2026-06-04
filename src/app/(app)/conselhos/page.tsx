import type { Metadata } from "next";
import { Plus, UsersRound } from "lucide-react";
import { CouncilRegularityPanel } from "@/components/council-regularity-panel";
import { CouncilForm } from "@/components/linked-record-forms";
import { ExportButtons } from "@/components/export-buttons";
import { ModuleHeader } from "@/components/module-header";
import { CouncilsExplorer } from "@/components/v4-filter-panels";
import { getCouncils } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Conselhos escolares",
  description: "Controle de mandatos, composição e regularidade dos conselhos escolares."
};

export const revalidate = 60;

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
      <CouncilsExplorer rows={councils} />
    </div>
  );
}
