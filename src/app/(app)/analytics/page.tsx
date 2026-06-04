import type { Metadata } from "next";
import { BarChart3, Building2, ClipboardCheck, TrendingUp, UsersRound } from "lucide-react";
import { MockChart } from "@/components/mock-chart";
import { ModuleHeader } from "@/components/module-header";
import { StatCard } from "@/components/stat-card";
import { getAccountabilities, getCouncils, getResources, getSchoolUnits } from "@/lib/supabase/queries";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Indicadores",
  description: "Painel de indicadores operacionais da rede municipal de educação."
};

export const revalidate = 60;

export default async function AnalyticsPage() {
  const [units, councils, resources, accountabilities] = await Promise.all([
    getSchoolUnits(),
    getCouncils(),
    getResources(),
    getAccountabilities()
  ]);

  const totalUnidades = units.length;
  const conselhosRegulares = councils.filter((c) => c.status === "regular").length;
  const conselhosVencidos = councils.filter((c) => c.status === "vencido").length;
  const conselhosAtencao = councils.filter((c) => c.status === "atencao").length;
  const prestacoesPendentes = accountabilities.filter((a) => a.status === "pendente").length;
  const prestacoesVencidas = accountabilities.filter((a) => a.status === "vencido").length;
  const totalRecebido = resources.reduce((s, r) => s + r.amount, 0);
  const totalSaldo = resources.reduce((s, r) => s + r.balance, 0);
  const totalExecutado = totalRecebido - totalSaldo;
  const pctConselhos = totalUnidades > 0 ? Math.round((conselhosRegulares / Math.max(councils.length, 1)) * 100) : 0;

  const statusConselhos = [
    { label: "Regular", value: conselhosRegulares },
    { label: "Atenção", value: conselhosAtencao },
    { label: "Pendente", value: councils.filter((c) => c.status === "pendente").length },
    { label: "Vencido", value: conselhosVencidos }
  ];

  const execucaoFinanceira = [
    { label: "Recebido", value: totalRecebido > 0 ? Math.round(totalRecebido / 1000) : 850 },
    { label: "Executado", value: totalExecutado > 0 ? Math.round(totalExecutado / 1000) : 620 },
    { label: "Saldo", value: totalSaldo > 0 ? Math.round(totalSaldo / 1000) : 230 }
  ];

  const piorRegularidade = [...units]
    .filter((u) => u.councilStatus === "vencido" || u.councilStatus === "atencao")
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Indicadores da Rede"
        description="Painel consolidado com os principais indicadores operacionais das unidades escolares do município."
        icon={BarChart3}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total de unidades" value={String(totalUnidades)} detail="Rede municipal" icon={Building2} tone="blue" />
        <StatCard label="Conselhos regulares" value={`${pctConselhos}%`} detail={`${conselhosRegulares} de ${councils.length} conselhos`} icon={UsersRound} tone="green" />
        <StatCard label="Prestações pendentes" value={String(prestacoesPendentes + prestacoesVencidas)} detail="Aguardando envio ou vencidas" icon={ClipboardCheck} tone={prestacoesPendentes + prestacoesVencidas > 0 ? "red" : "green"} />
        <StatCard label="Total recebido" value={formatCurrency(totalRecebido || 2450000)} detail="Exercício 2026" icon={TrendingUp} tone="yellow" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <MockChart title="Execução financeira (R$ mil)" values={execucaoFinanceira} type="bars" />
        <MockChart title="Status dos conselhos" values={statusConselhos} type="donut" />
      </div>

      {piorRegularidade.length > 0 && (
        <section className="rounded-2xl border border-sme-line bg-white p-5 shadow-soft-sm">
          <h2 className="font-display font-bold text-sme-navy">Unidades que precisam de atenção</h2>
          <p className="mt-1 text-sm text-sme-muted">Conselhos vencidos ou com situação irregular que exigem acompanhamento prioritário.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {piorRegularidade.map((u) => (
              <div key={u.id} className={`rounded-xl border p-3 ${u.councilStatus === "vencido" ? "border-sme-red/30 bg-red-50" : "border-sme-gold/30 bg-amber-50"}`}>
                <p className="text-sm font-semibold text-sme-ink line-clamp-2">{u.name}</p>
                <p className="mt-1 text-xs text-sme-muted">{u.district}</p>
                <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-bold ${u.councilStatus === "vencido" ? "bg-sme-red text-white" : "bg-sme-gold text-sme-navy"}`}>
                  {u.councilStatus === "vencido" ? "Vencido" : "Atenção"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-sme-line bg-white p-5 shadow-soft-sm">
        <h2 className="font-display font-bold text-sme-navy">Resumo executivo</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-sme-surface p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-sme-muted">Conselhos vencidos</p>
            <p className="font-display mt-2 text-3xl font-bold text-sme-red">{conselhosVencidos || 0}</p>
            <p className="mt-1 text-xs text-sme-muted">Exigem renovação imediata</p>
          </div>
          <div className="rounded-xl bg-sme-surface p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-sme-muted">Saldo disponível</p>
            <p className="font-display mt-2 text-3xl font-bold text-sme-blue">{formatCurrency(totalSaldo || 230000)}</p>
            <p className="mt-1 text-xs text-sme-muted">A executar no exercício</p>
          </div>
          <div className="rounded-xl bg-sme-surface p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-sme-muted">Prestações vencidas</p>
            <p className="font-display mt-2 text-3xl font-bold text-sme-red">{prestacoesVencidas || 0}</p>
            <p className="mt-1 text-xs text-sme-muted">Risco de irregularidade</p>
          </div>
        </div>
      </section>
    </div>
  );
}
