import type { Metadata } from "next";
import { Download, FileText, Landmark, ShieldCheck } from "lucide-react";
import { ExportButtons } from "@/components/export-buttons";
import { InfoCard } from "@/components/info-card";
import { ModuleHeader } from "@/components/module-header";
import { getAccountabilities, getResources, getSchoolUnits } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Transparência",
  description: "Consolidação de dados de recursos, saldos, prestações e unidades escolares."
};

export default async function TransparenciaPage() {
  const [units, resources, accountabilities] = await Promise.all([
    getSchoolUnits(),
    getResources(),
    getAccountabilities()
  ]);

  const totalResources = resources.reduce((sum, item) => sum + item.amount, 0);
  const totalBalance = resources.reduce((sum, item) => sum + item.balance, 0);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Transparencia"
        description="Area de consulta interna para consolidar informacoes de recursos, saldos, documentos e prestacoes acompanhadas pela GPPE."
        icon={ShieldCheck}
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <InfoCard icon={Landmark} title="Recursos monitorados" description={`Total registrado: ${totalResources.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}. Saldo acompanhado: ${totalBalance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}.`} />
        <InfoCard icon={FileText} title="Prestacoes de contas" description={`${accountabilities.length} registros de prestacao acompanhados no sistema.`} />
        <InfoCard icon={Download} title="Exportacao" description="Dados preparados para exportacao em Excel e PDF conforme necessidade do setor." />
      </section>

      <ExportButtons
        filename="transparencia-gppe"
        rows={units.map((unit) => ({
          Unidade: unit.name,
          INEP: unit.inep,
          Tipo: unit.type,
          Bairro: unit.district,
          Gestor: unit.manager,
          Conselho: unit.councilStatus
        }))}
      />
    </div>
  );
}
