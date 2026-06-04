import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import { ModuleHeader } from "@/components/module-header";
import { CentralDeadlinesPanel } from "@/components/v4-operational-panels";
import { markDeadlineCompleted } from "@/lib/actions/deadlines";
import { getCouncils, getFinancialControl } from "@/lib/supabase/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Central de prazos",
  description: "Acompanhamento de mandatos vencidos, vencimentos próximos e prestações pendentes."
};

export default async function CentralPrazosPage() {
  const [councils, financialControl] = await Promise.all([getCouncils(), getFinancialControl()]);
  const reports = financialControl.reports.filter((item) => ["pendente", "vencido", "em_analise"].includes(item.status));

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Central de Prazos"
        description="Filtre por urgência e registre cumprimento de mandatos, prestações de contas e obrigações operacionais."
        icon={CalendarClock}
      />
      <CentralDeadlinesPanel councils={councils} reports={reports} action={markDeadlineCompleted} />
    </div>
  );
}
