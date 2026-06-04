import type { Metadata } from "next";
import { ClipboardCheck } from "lucide-react";
import { FeedDataTabs } from "@/components/feed-data-tabs";
import { ModuleHeader } from "@/components/module-header";

export const metadata: Metadata = {
  title: "Alimentar dados",
  description: "Fluxo operacional para manter conselhos, recursos, prestacoes, alertas e documentos atualizados."
};

export const revalidate = 60;

export default function FeedDataPage() {
  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Alimentar dados"
        description="Atualize as principais bases do Portal EduConecta GPPE em um fluxo unico, com gravacao por Server Actions e vinculo direto as unidades escolares."
        icon={ClipboardCheck}
      />

      <FeedDataTabs />
    </div>
  );
}
