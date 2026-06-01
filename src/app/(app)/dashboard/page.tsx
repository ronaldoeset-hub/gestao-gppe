import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Bot, CalendarClock, Download, RefreshCw } from "lucide-react";
import { EduConectaCards } from "@/components/educonecta-cards";
import { InstitutionalNotice } from "@/components/institutional-notice";
import { MockChart } from "@/components/mock-chart";
import { dashboardCards, modules } from "@/data/educonecta";

const financialSummary = [
  { label: "Recursos recebidos", value: 8245320, color: "bg-emerald-500" },
  { label: "Recursos executados", value: 4312780, color: "bg-blue-600" },
  { label: "Saldo disponivel", value: 3932539, color: "bg-amber-400" }
];

const fndeSummary = [
  { label: "PDDE regular", value: 42 },
  { label: "SIGPC pendente", value: 7 },
  { label: "PDDEWeb atencao", value: 6 },
  { label: "VAAR monitorado", value: 12 }
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-emerald-600">EDUCONECTA</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 lg:text-4xl">
              Gestao Educacional Inteligente
            </h1>
            <p className="mt-3 max-w-4xl text-base leading-7 text-slate-600">
              Transformando informacao educacional em gestao inteligente para organizar escolas, conselhos,
              recursos, documentos, prazos e relatorios em uma plataforma SaaS moderna e independente.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/ia-educacional" className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-black text-white hover:bg-blue-800">
              <Bot className="h-4 w-4" aria-hidden="true" />
              IA Educacional
            </Link>
            <Link href="/relatorios" className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-blue-800 hover:bg-blue-50">
              <Download className="h-4 w-4" aria-hidden="true" />
              Relatorios
            </Link>
            <Link href="/dashboard" className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-blue-800 hover:bg-blue-50">
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Atualizar
            </Link>
          </div>
        </div>
      </section>

      <InstitutionalNotice />

      <EduConectaCards cards={dashboardCards} />

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <MockChart title="Resumo financeiro" values={financialSummary} />
        <MockChart title="Resumo FNDE/PDDE" type="donut" values={fndeSummary} />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Panel title="Conselhos escolares" href="/conselhos">
          {modules.conselhos.rows.map((row) => (
            <Line key={String(row.Escola)} label={String(row.Escola)} value={String(row.Status)} />
          ))}
        </Panel>
        <Panel title="Central de prazos" href="/central-prazos">
          {modules["central-prazos"].rows.map((row) => (
            <Line key={String(row.Objeto)} label={String(row.Objeto)} value={String(row.Status)} icon={<CalendarClock className="h-4 w-4 text-amber-500" />} />
          ))}
        </Panel>
        <Panel title="Mural e comunicados" href="/mural">
          {modules.mural.rows.map((row) => (
            <Line key={String(row.Titulo)} label={String(row.Titulo)} value={String(row.Tipo)} />
          ))}
        </Panel>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-950">Acoes rapidas</h2>
            <p className="mt-1 text-sm text-slate-600">Atalhos mockados para alimentar informacoes e testar fluxos futuros.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {["Nova escola", "Novo conselho", "Novo recurso", "Gerar parecer"].map((action) => (
              <Link key={action} href="/administracao" className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-100 px-4 text-sm font-black text-blue-800 hover:bg-blue-50">
                {action}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Panel({ title, href, children }: { title: string; href: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-black text-slate-950">{title}</h2>
        <Link href={href} className="inline-flex items-center gap-1 text-sm font-black text-blue-700 hover:underline">
          Ver
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Line({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
      {icon}
      <p className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700">{label}</p>
      <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-blue-800">{value}</span>
    </div>
  );
}
