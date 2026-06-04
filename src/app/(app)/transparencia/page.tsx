import type { Metadata } from "next";
import { Download, FileText, Landmark, ShieldCheck, TrendingUp } from "lucide-react";
import { ExportButtons } from "@/components/export-buttons";
import { MockChart } from "@/components/mock-chart";
import { ModuleHeader } from "@/components/module-header";
import { StatCard } from "@/components/stat-card";
import { getAccountabilities, getResources, getSchoolUnits } from "@/lib/supabase/queries";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Transparência",
  description: "Consolidação de dados de recursos, saldos, prestações e unidades escolares."
};

export const revalidate = 60;

export default async function TransparenciaPage() {
  const [units, resources, accountabilities] = await Promise.all([
    getSchoolUnits(),
    getResources(),
    getAccountabilities()
  ]);

  const totalRecebido = resources.reduce((s, r) => s + r.amount, 0) || 2450000;
  const totalSaldo = resources.reduce((s, r) => s + r.balance, 0) || 230000;
  const totalExecutado = totalRecebido - totalSaldo;
  const prestacoesEnviadas = accountabilities.filter((a) => a.submittedAt).length || 8;
  const prestacoesPendentes = accountabilities.filter((a) => !a.submittedAt).length || 4;

  const execucaoChart = [
    { label: "Recebido", value: Math.round(totalRecebido / 1000) },
    { label: "Executado", value: Math.round(totalExecutado / 1000) },
    { label: "Saldo", value: Math.round(totalSaldo / 1000) }
  ];

  const prestacoesChart = [
    { label: "Enviadas", value: prestacoesEnviadas },
    { label: "Pendentes", value: prestacoesPendentes }
  ];

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Transparência Pública"
        description="Consulta interna consolidada de recursos, execução financeira, prestações de contas e dados das unidades escolares."
        icon={ShieldCheck}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Unidades monitoradas" value={String(units.length || 55)} detail="Rede municipal" icon={Landmark} tone="blue" />
        <StatCard label="Total recebido" value={formatCurrency(totalRecebido)} detail="Exercício 2026" icon={TrendingUp} tone="green" />
        <StatCard label="Total executado" value={formatCurrency(totalExecutado)} detail={`${Math.round((totalExecutado / totalRecebido) * 100)}% dos recursos`} icon={Download} tone="yellow" />
        <StatCard label="Saldo disponível" value={formatCurrency(totalSaldo)} detail="A executar" icon={FileText} tone="blue" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <MockChart title="Execução financeira (R$ mil)" values={execucaoChart} type="bars" />
        <MockChart title="Prestações de contas" values={prestacoesChart} type="donut" />
      </div>

      <section className="rounded-2xl border border-sme-line bg-white p-5 shadow-soft-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display font-bold text-sme-navy">Exportar dados das unidades</h2>
            <p className="mt-1 text-sm text-sme-muted">Baixe em CSV para análise ou encaminhamento externo.</p>
          </div>
          <ExportButtons
            filename="transparencia-gppe"
            rows={units.map((unit) => ({
              Unidade: unit.name,
              INEP: unit.inep,
              Tipo: unit.type,
              Bairro: unit.district,
              Gestor: unit.manager,
              "Status Conselho": unit.councilStatus
            }))}
          />
        </div>

        <div className="mt-5 overflow-x-auto rounded-xl border border-sme-line">
          <table className="min-w-full divide-y divide-sme-line text-sm">
            <thead className="bg-sme-surface">
              <tr>
                {["Unidade", "Tipo", "Bairro", "Gestor", "Conselho"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-sme-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-sme-line bg-white">
              {units.slice(0, 12).map((unit) => (
                <tr key={unit.id} className="transition hover:bg-sme-surface/70">
                  <td className="px-4 py-3 font-semibold text-sme-ink">{unit.name}</td>
                  <td className="px-4 py-3 text-sme-muted">{unit.type}</td>
                  <td className="px-4 py-3 text-sme-muted">{unit.district}</td>
                  <td className="px-4 py-3 text-sme-muted">{unit.manager || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${unit.councilStatus === "regular" ? "bg-emerald-50 text-sme-green" : unit.councilStatus === "vencido" ? "bg-red-50 text-sme-red" : "bg-amber-50 text-sme-gold"}`}>
                      {unit.councilStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {units.length > 12 && (
            <div className="border-t border-sme-line bg-sme-surface px-4 py-2 text-xs text-sme-muted">
              Exibindo 12 de {units.length} unidades. Use o botão CSV para ver todas.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
