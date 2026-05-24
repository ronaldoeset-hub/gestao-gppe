import { AlertTriangle, ClipboardCheck, FileArchive, FileText, Landmark, UsersRound } from "lucide-react";
import { InfoCard } from "@/components/info-card";
import { ModuleHeader } from "@/components/module-header";

export default function ServicosPage() {
  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Servicos da GPPE"
        description="Atividades executadas pela gerencia para acompanhar recursos, conselhos, documentos e obrigacoes das unidades escolares."
        icon={ClipboardCheck}
      />

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <InfoCard icon={Landmark} title="Controle de recursos financeiros" description="Registro de programas, fontes, valores liberados, saldo disponivel, categoria de despesa e situacao de execucao." />
        <InfoCard icon={UsersRound} title="Conselhos Escolares" description="Acompanhamento de mandatos, membros, composicao, vencimentos, atas e regularidade conforme orientacoes do conselho." />
        <InfoCard icon={FileText} title="Prestacao de contas" description="Controle de prazos, protocolos, analise tecnica, pareceres e situacao das obrigacoes por unidade." />
        <InfoCard icon={FileArchive} title="Gestao de documentos" description="Upload, checklist, guarda e consulta de documentos obrigatorios relacionados a recursos e conselhos." />
        <InfoCard icon={AlertTriangle} title="Alertas e prazos" description="Avisos sobre vencimentos, pendencias criticas, prestacoes pendentes e prioridades de acompanhamento." />
        <InfoCard icon={ClipboardCheck} title="Geracao de documentos" description="Base para modelos padronizados de oficio, despacho, relatorio, ata, memorando e encaminhamentos." />
      </section>
    </div>
  );
}
