import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  ClipboardCheck,
  Coins,
  FileText,
  Landmark,
  RefreshCw,
  Wallet,
  WalletCards
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { getAccountabilities, getAlerts, getCouncils, getResources, getSchoolUnits } from "@/lib/supabase/queries";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const schoolUnits = await getSchoolUnits();
  const resources = await getResources();
  const councils = await getCouncils();
  const accountabilities = await getAccountabilities();
  const alerts = await getAlerts();
  const totalResources = resources.reduce((sum, item) => sum + item.amount, 0);
  const totalBalance = resources.reduce((sum, item) => sum + item.balance, 0);
  const executed = Math.max(totalResources - totalBalance, 0);
  const pendingCouncils = councils.filter((council) => council.status !== "regular").length;
  const overdueAccountabilities = accountabilities.filter((item) => item.status !== "regular").length;

  const councilSituation = [
    { label: "Vigentes", value: Math.max(councils.length - pendingCouncils, 0), color: "bg-emerald-500" },
    { label: "Vencendo em ate 90 dias", value: pendingCouncils, color: "bg-amber-400" },
    { label: "Vencidos", value: councils.filter((council) => council.status === "vencido").length, color: "bg-red-500" },
    { label: "Em regularizacao", value: councils.filter((council) => council.status === "pendente").length, color: "bg-slate-300" }
  ];

  const programs = resources.slice(0, 6).map((resource) => ({
    label: resource.program.replace("Planejamento ", ""),
    received: resource.amount,
    executed: Math.max(resource.amount - resource.balance, 0)
  }));

  return (
    <div className="space-y-5">
      <section className="rounded-md border border-slate-200 bg-white px-5 py-4 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-black text-sme-ink lg:text-3xl">Bem-vindo(a) ao Painel da GPPE</h1>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Acompanhe a situacao dos recursos, conselhos e prestacoes de contas das unidades escolares.
            </p>
            <p className="mt-3 max-w-4xl rounded-md border-l-4 border-sme-yellow bg-blue-50 px-4 py-3 text-sm font-semibold leading-6 text-[#003b7a]">
              A Gerencia de Programas, Projetos e Execucao atua como suporte essencial para organizar, acompanhar e fortalecer a gestao financeira das unidades escolares, garantindo mais controle dos recursos, transparencia nas aplicacoes e seguranca na prestacao de contas.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-[#003b7a]">
              <option>Todos os Programas</option>
            </select>
            <select className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-[#003b7a]">
              <option>Exercicio: 2026</option>
            </select>
            <Link href="/dashboard" className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-black text-[#003b7a] hover:bg-blue-50">
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Atualizar
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <DashboardCard href="/unidades" icon={Building2} label="Total de Unidades" value={String(schoolUnits.length)} detail="Ativas: 54 | Inativas: 1" tone="blue" />
        <DashboardCard href="/recursos" icon={Coins} label="Recursos Recebidos" value={formatCurrency(totalResources)} detail="Acumulado 2026" tone="green" />
        <DashboardCard href="/recursos" icon={Wallet} label="Recursos Executados" value={formatCurrency(executed)} detail={`${totalResources ? ((executed / totalResources) * 100).toFixed(2) : "0,00"}% do total`} tone="blue" />
        <DashboardCard href="/recursos" icon={WalletCards} label="Saldo Disponivel" value={formatCurrency(totalBalance)} detail={`${totalResources ? ((totalBalance / totalResources) * 100).toFixed(2) : "0,00"}% do total`} tone="yellow" />
        <DashboardCard href="/alertas" icon={AlertTriangle} label="Pendencias Criticas" value={String(overdueAccountabilities + pendingCouncils)} detail="Ver detalhes" tone="red" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1.5fr]">
        <Panel title="Situacao dos Conselhos Escolares">
          <div className="grid gap-5 md:grid-cols-[220px_1fr]">
            <DonutTotal total={councils.length || 55} />
            <div className="space-y-4">
              {councilSituation.map((item) => (
                <LegendRow key={item.label} {...item} total={councils.length || 55} />
              ))}
              <Link className="inline-flex text-sm font-black text-[#0054a6] hover:text-sme-navy" href="/conselhos">Ver todas as unidades &rarr;</Link>
            </div>
          </div>
        </Panel>
        <Panel title="Controle de Vencimentos (proximos 90 dias)">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-black uppercase text-[#003b7a]">
                  <th className="py-3">Unidade</th>
                  <th>Conselho</th>
                  <th>Vencimento</th>
                  <th>Dias restantes</th>
                  <th>Situacao</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {councils.slice(0, 5).map((council, index) => (
                  <tr key={council.id}>
                    <td className="py-3 font-semibold text-slate-700">{council.school}</td>
                    <td>Conselho Escolar</td>
                    <td>{formatDate(council.mandateEnd)}</td>
                    <td>{index * 13 + 12}</td>
                    <td><StatusBadge status={council.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.9fr_0.95fr]">
        <Panel title="Recursos por Programa">
          <div className="space-y-3">
            <div className="flex gap-4 text-xs font-bold text-slate-600">
              <span className="inline-flex items-center gap-2"><span className="h-3 w-5 rounded-sm bg-[#0054a6]" />Recebido</span>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-5 rounded-sm bg-emerald-500" />Executado</span>
            </div>
            <div className="grid h-56 grid-cols-6 items-end gap-3 border-b border-l border-slate-200 px-3">
              {programs.map((program) => {
                const max = Math.max(...programs.map((item) => item.received), 1);
                return (
                  <div key={program.label} className="flex h-full flex-col justify-end gap-2">
                    <div className="flex items-end justify-center gap-1">
                      <div className="w-5 rounded-t bg-[#0054a6]" style={{ height: `${Math.max((program.received / max) * 190, 10)}px` }} />
                      <div className="w-5 rounded-t bg-emerald-500" style={{ height: `${Math.max((program.executed / max) * 190, 8)}px` }} />
                    </div>
                    <p className="h-8 truncate text-center text-xs font-semibold text-slate-600">{program.label}</p>
                  </div>
                );
              })}
            </div>
            <Link className="inline-flex text-sm font-black text-[#0054a6] hover:text-sme-navy" href="/recursos">Ver relatorio completo &rarr;</Link>
          </div>
        </Panel>
        <Panel title="Prestacao de Contas">
          <div className="grid gap-5 md:grid-cols-[160px_1fr] xl:grid-cols-1 2xl:grid-cols-[160px_1fr]">
            <DonutTotal total={accountabilities.length || 55} yellow />
            <div className="space-y-3">
              <LegendRow label="Em dia" value={accountabilities.filter((item) => item.status === "regular").length} total={accountabilities.length || 55} color="bg-emerald-500" />
              <LegendRow label="Pendente" value={accountabilities.filter((item) => item.status === "pendente").length} total={accountabilities.length || 55} color="bg-amber-400" />
              <LegendRow label="Atrasada" value={accountabilities.filter((item) => item.status === "atencao" || item.status === "vencido").length} total={accountabilities.length || 55} color="bg-red-500" />
            </div>
          </div>
          <Link className="mt-4 inline-flex text-sm font-black text-[#0054a6] hover:text-sme-navy" href="/prestacao-contas">Ver todas as prestacoes &rarr;</Link>
        </Panel>
        <Panel title="Alertas Recentes">
          <div className="space-y-3">
            {alerts.slice(0, 4).map((alert) => (
              <div key={alert.id} className="flex gap-3 border-b border-slate-100 pb-3 last:border-0">
                <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-sme-red" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="font-black leading-5 text-sme-ink">{alert.title}</p>
                  <p className="text-sm text-slate-500">{alert.description}</p>
                </div>
                <p className="text-xs text-slate-500">Hoje</p>
              </div>
            ))}
          </div>
          <Link className="mt-4 inline-flex text-sm font-black text-[#0054a6] hover:text-sme-navy" href="/alertas">Ver todos os alertas &rarr;</Link>
        </Panel>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-4 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md border border-slate-200 text-[#0054a6]">
              <FileText className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-black uppercase text-[#003b7a]">Gerar Documentos (SEI)</h2>
              <p className="text-sm text-slate-600">Gere documentos padronizados para o SEI de forma rapida e pratica.</p>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-5 lg:w-[720px]">
            {["Oficio", "Despacho", "Relatorio", "Ata", "Memorando"].map((label) => (
              <Link key={label} href="/documentos" className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm font-black text-[#003b7a] hover:bg-blue-50">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function DashboardCard({ href, icon: Icon, label, value, detail, tone }: { href: string; icon: LucideIcon; label: string; value: string; detail: string; tone: "blue" | "green" | "yellow" | "red" }) {
  const tones = {
    blue: "bg-[#0054a6] text-white",
    green: "bg-emerald-600 text-white",
    yellow: "bg-amber-400 text-[#003b7a]",
    red: "bg-red-500 text-white"
  };

  return (
    <Link href={href} className="group block rounded-md border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-sme-blue hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2">
      <div className="flex items-center gap-4">
        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full transition group-hover:scale-105 ${tones[tone]}`}>
          <Icon className="h-8 w-8" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase text-sme-ink">{label}</p>
          <p className={`mt-2 truncate text-2xl font-black ${tone === "green" ? "text-emerald-600" : tone === "yellow" ? "text-amber-500" : "text-sme-ink"}`}>{value}</p>
          <p className="mt-1 text-sm font-semibold text-slate-500">{detail}</p>
        </div>
      </div>
    </Link>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="mb-4 text-base font-black uppercase text-[#003b7a]">{title}</h2>
      {children}
    </section>
  );
}

function DonutTotal({ total, yellow = false }: { total: number; yellow?: boolean }) {
  return (
    <div className={`mx-auto flex h-44 w-44 items-center justify-center rounded-full ${yellow ? "bg-[conic-gradient(#22c55e_0_36%,#f7c600_36%_86%,#ef4444_86%_100%)]" : "bg-[conic-gradient(#22c55e_0_58%,#f7c600_58%_85%,#ef4444_85%_96%,#cbd5e1_96%_100%)]"}`}>
      <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white text-center shadow-inner">
        <p className="text-2xl font-black text-[#003b7a]">{total}</p>
        <p className="text-sm font-bold text-slate-500">Total</p>
      </div>
    </div>
  );
}

function LegendRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const percent = total ? (value / total) * 100 : 0;

  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 text-sm">
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-sm ${color}`} />
        <span className="font-semibold text-slate-700">{label}</span>
      </div>
      <span className="font-black text-sme-ink">{value}</span>
      <span className="w-16 text-right font-semibold text-slate-600">{percent.toFixed(2)}%</span>
    </div>
  );
}
