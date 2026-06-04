import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ArrowRight, Bot, CalendarClock, Download, RefreshCw } from "lucide-react";
import { EduConectaCards } from "@/components/educonecta-cards";
import { InstitutionalNotice } from "@/components/institutional-notice";
import { MockChart } from "@/components/mock-chart";
import { modules } from "@/data/educonecta";
import { getAccountabilities, getCouncils, getDocuments, getSchoolUnits } from "@/lib/supabase/queries";
import { getDashboardSummary } from "@/lib/supabase/queries/schools";
import { isSupabaseEnabled } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Resumo executivo de unidades, conselhos, recursos e prazos do GPPE."
};

export const revalidate = 60;

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

function daysUntil(value?: string) {
  if (!value) return null;
  const today = new Date();
  const target = new Date(value);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

export default async function DashboardPage() {
  const [summary, units, councils, accountabilities, documents] = await Promise.all([
    getDashboardSummary(),
    getSchoolUnits(),
    getCouncils(),
    getAccountabilities(),
    getDocuments()
  ]);
  const isMock = !isSupabaseEnabled();

  const financialSummary = [
    { label: "Recursos recebidos", value: summary?.totalRecebido ?? 0 },
    { label: "Recursos executados", value: summary?.totalExecutado ?? 0 },
    { label: "Saldo disponivel", value: summary?.saldoDisponivel ?? 0 }
  ];

  const fndeSummary = [
    { label: "Total unidades", value: summary?.totalUnidades ?? 0 },
    { label: "Conselhos vencidos", value: summary?.conselhosVencidos ?? 0 },
    { label: "Vencendo 90 dias", value: summary?.conselhosVencendo90d ?? 0 },
    { label: "Prest. pendentes", value: summary?.prestacoesPendentes ?? 0 }
  ];

  const dashboardCards = [
    { label: "Total unidades", value: String(summary?.totalUnidades ?? 55), detail: "Rede municipal", tone: "blue" as const },
    { label: "Conselhos vencidos", value: String(summary?.conselhosVencidos ?? 0), detail: "Exigem ação imediata", tone: "red" as const },
    { label: "Vencendo em 90 dias", value: String(summary?.conselhosVencendo90d ?? 0), detail: "Próximos 90 dias", tone: "yellow" as const },
    { label: "Prestações pendentes", value: String(summary?.prestacoesPendentes ?? 0), detail: "Aguardando envio", tone: "red" as const },
    { label: "Total recebido", value: formatBRL(summary?.totalRecebido ?? 0), detail: "Exercício 2026", tone: "green" as const },
    { label: "Saldo disponível", value: formatBRL(summary?.saldoDisponivel ?? 0), detail: "A executar", tone: "yellow" as const }
  ];

  const criticalUnits = units
    .map((unit) => {
      const unitCouncils = councils.filter((item) => item.school === unit.name);
      const currentCouncil = unitCouncils[0];
      const councilDays = daysUntil(currentCouncil?.mandateEnd);
      const hasAccountability = accountabilities.some((item) => item.school === unit.name);
      const hasDocument = documents.some((item) => item.school === unit.name);
      const score =
        (!unit.inep ? 2 : 0) +
        (!unitCouncils.length ? 5 : 0) +
        (councilDays !== null && councilDays < 0 ? 4 : councilDays !== null && councilDays <= 30 ? 3 : 0) +
        (!hasAccountability ? 3 : 0) +
        (!hasDocument ? 1 : 0);
      const reasons = [
        !unit.inep ? "INEP pendente" : null,
        !unitCouncils.length ? "Sem conselho" : null,
        councilDays !== null && councilDays < 0 ? "Mandato vencido" : null,
        councilDays !== null && councilDays >= 0 && councilDays <= 30 ? "Mandato vence em 30 dias" : null,
        !hasAccountability ? "Sem prestacao" : null,
        !hasDocument ? "Sem documentos" : null
      ].filter((reason): reason is string => Boolean(reason));

      return { unit, score, reasons };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* ── Bloco herói ── */}
      <section className="relative overflow-hidden rounded-2xl border border-sme-line bg-white shadow-soft-sm">
        <div className="sme-tricolor" aria-hidden="true" />
        <div className="flex flex-col gap-5 p-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <span className="inline-block rounded-full bg-sme-blue-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-sme-blue">
              GPPE · Gestão Educacional
            </span>
            <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-sme-navy lg:text-4xl">
              Painel de Controle
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-sme-muted">
              Escolas, conselhos, recursos, documentos, prazos e relatórios em uma plataforma moderna e independente.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/ia-educacional"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-sme-navy px-4 text-sm font-semibold text-white transition hover:bg-sme-blue"
            >
              <Bot className="h-4 w-4" aria-hidden="true" />
              IA Educacional
            </Link>
            <Link
              href="/relatorios"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-sme-line bg-white px-4 text-sm font-semibold text-sme-navy transition hover:bg-sme-blue-soft"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Relatórios
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-sme-line bg-white px-4 text-sm font-semibold text-sme-ink transition hover:bg-sme-surface"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Atualizar
            </Link>
          </div>
        </div>
      </section>

      <InstitutionalNotice />

      {isMock && (
        <div className="rounded-2xl border border-sme-yellow bg-sme-yellow/20 px-4 py-3 text-sm text-sme-navy">
          <strong>Modo demonstração</strong> — os dados financeiros abaixo são ilustrativos.
          Configure o Supabase para exibir dados reais.
        </div>
      )}

      <EduConectaCards cards={dashboardCards} />

      <section className="rounded-2xl border border-sme-line bg-white p-5 shadow-soft-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display font-bold text-sme-navy">Requer atencao agora</h2>
            <p className="mt-1 text-sm text-sme-muted">Tres unidades com maior prioridade operacional a partir de dados, prazos e documentos.</p>
          </div>
          <Link href="/diagnostico-dados" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-sme-blue px-4 text-sm font-semibold text-white hover:bg-sme-navy">
            Ver diagnostico
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {criticalUnits.length ? (
            criticalUnits.map(({ unit, score, reasons }) => (
              <article key={unit.id} className="rounded-xl border border-sme-line bg-sme-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-sme-ink">{unit.name}</p>
                    <p className="mt-1 text-sm text-sme-muted">{unit.type} - {unit.district || "Bairro nao informado"}</p>
                  </div>
                  <span className="rounded-full bg-sme-red px-2 py-1 text-xs font-black text-white">{score}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {reasons.map((reason) => (
                    <span key={reason} className="rounded-full border border-sme-yellow bg-sme-yellow/20 px-2 py-1 text-xs font-bold text-sme-navy">
                      {reason}
                    </span>
                  ))}
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-xl border border-sme-line bg-sme-surface p-4 text-sm text-sme-muted lg:col-span-3">
              Nenhuma prioridade critica encontrada com os dados atuais.
            </div>
          )}
        </div>
      </section>

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
            <Line
              key={String(row.Objeto)}
              label={String(row.Objeto)}
              value={String(row.Status)}
              icon={<CalendarClock className="h-4 w-4 text-sme-gold" />}
            />
          ))}
        </Panel>
        <Panel title="Mural e comunicados" href="/mural">
          {modules.mural.rows.map((row) => (
            <Line key={String(row.Titulo)} label={String(row.Titulo)} value={String(row.Tipo)} />
          ))}
        </Panel>
      </section>

      <section className="rounded-2xl border border-sme-line bg-white p-5 shadow-soft-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display font-bold text-sme-navy">Ações rápidas</h2>
            <p className="mt-1 text-sm text-sme-muted">Atalhos para alimentar informações e testar fluxos.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {["Nova escola", "Novo conselho", "Novo recurso", "Gerar parecer"].map((action) => (
              <Link
                key={action}
                href="/administracao"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-sme-line bg-sme-surface px-4 text-sm font-semibold text-sme-navy transition hover:bg-sme-blue-soft"
              >
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
    <section className="rounded-2xl border border-sme-line bg-white p-5 shadow-soft-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display font-bold text-sme-navy">{title}</h2>
        <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-sme-blue hover:underline">
          Ver
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Line({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-sme-line bg-sme-surface px-3 py-2">
      {icon}
      <p className="min-w-0 flex-1 truncate text-sm font-medium text-sme-ink">{label}</p>
      <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-sme-navy ring-1 ring-sme-line">{value}</span>
    </div>
  );
}
