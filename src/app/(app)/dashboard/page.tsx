import Link from "next/link";
import { AlertTriangle, ArrowRight, Banknote, Bot, ClipboardCheck, FileUp, Landmark, School, ShieldAlert, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle, EmptyState, PageHeader } from "@/components/ui";
import { getAccountabilities, getAlerts, getCouncils, getDocuments, getResources, getSchoolUnits } from "@/lib/supabase/queries";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const [units, resources, accountabilities, councils, documents, alerts] = await Promise.all([
    getSchoolUnits(),
    getResources(),
    getAccountabilities(),
    getCouncils(),
    getDocuments(),
    getAlerts()
  ]);

  const pendingAccountabilities = accountabilities
    .filter((item) => item.status === "pendente" || item.status === "vencido" || !item.submittedAt)
    .sort((a, b) => a.school.localeCompare(b.school, "pt-BR"));
  const overdueCouncils = councils.filter((item) => item.status === "vencido" || item.status === "atencao");
  const criticalAlerts = alerts.filter((item) => item.severity === "alta");
  const totalReceived = resources.reduce((total, item) => total + item.amount, 0);
  const totalBalance = resources.reduce((total, item) => total + item.balance, 0);
  const totalSpent = Math.max(totalReceived - totalBalance, 0);

  const programSummary = resources.reduce<Record<string, { received: number; balance: number }>>((acc, item) => {
    const program = item.program || "Nao informado";
    acc[program] ??= { received: 0, balance: 0 };
    acc[program].received += item.amount;
    acc[program].balance += item.balance;
    return acc;
  }, {});

  const quickActions = [
    { label: "Alimentar dados", href: "/alimentar-dados", icon: Landmark },
    { label: "Registrar prestação", href: "/prestacao-contas", icon: ClipboardCheck },
    { label: "Enviar documento", href: "/arquivos", icon: FileUp },
    { label: "Gerar diagnóstico", href: "/ia-educacional", icon: Bot }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Painel operacional para acompanhar recursos, prestações, conselhos, documentos e alertas da rede municipal."
        breadcrumbs={[{ label: "Início" }, { label: "Dashboard" }]}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Unidades mapeadas" value={String(units.length)} detail="Escolas, creches, CEMEI e conveniadas" icon={School} tone="info" />
        <MetricCard label="Prestações pendentes" value={String(pendingAccountabilities.length)} detail="Não entregues ou vencidas" icon={ShieldAlert} tone="warning" />
        <MetricCard label="Saldo monitorado" value={formatCurrency(totalBalance)} detail={`${formatCurrency(totalSpent)} executados`} icon={Banknote} tone="success" />
        <MetricCard label="Alertas críticos" value={String(criticalAlerts.length)} detail={`${alerts.length} alertas ativos no total`} icon={AlertTriangle} tone="danger" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Unidades pendentes de prestação de contas</CardTitle>
              <p className="mt-1 text-sm text-neutral-600">Lista em ordem alfabética para priorizar cobranças e acompanhamento técnico.</p>
            </div>
            <Link href="/prestacao-contas" className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 hover:text-primary-900">
              Ver prestações
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </CardHeader>
          <CardContent>
            {pendingAccountabilities.length ? (
              <div className="grid gap-3 md:grid-cols-2">
                {pendingAccountabilities.slice(0, 12).map((item) => (
                  <div key={item.id} className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-neutral-900">{item.school}</p>
                        <p className="mt-1 text-xs font-semibold text-neutral-500">Referencia {item.reference}</p>
                      </div>
                      <Badge tone={item.status === "vencido" ? "danger" : "warning"}>{item.status === "vencido" ? "Vencida" : "Pendente"}</Badge>
                    </div>
                    <p className="mt-2 text-xs text-neutral-600">Prazo: {formatDate(item.dueDate)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Nenhuma pendência encontrada" description="Quando uma unidade ficar sem entrega registrada, ela aparecerá aqui automaticamente." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações rápidas</CardTitle>
            <p className="text-sm text-neutral-600">Atalhos para as rotinas mais usadas no sistema.</p>
          </CardHeader>
          <CardContent className="grid gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href} className="flex min-h-12 items-center gap-3 rounded-md border border-neutral-200 bg-white px-3 text-sm font-bold text-neutral-800 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-800">
                  <Icon className="h-4 w-4 text-primary-700" aria-hidden="true" />
                  {action.label}
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Saldo por programa</CardTitle>
            <p className="text-sm text-neutral-600">Resumo calculado a partir dos recursos carregados.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(programSummary).slice(0, 6).map(([program, values]) => {
              const percent = values.received > 0 ? Math.round((values.balance / values.received) * 100) : 0;
              return (
                <div key={program} className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-semibold text-neutral-800">{program}</span>
                    <span className="font-bold text-primary-700">{formatCurrency(values.balance)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-100">
                    <div className="h-2 rounded-full bg-secondary-500" style={{ width: `${Math.min(percent, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conselhos em atenção</CardTitle>
            <p className="text-sm text-neutral-600">Mandatos vencidos ou próximos do vencimento.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdueCouncils.slice(0, 6).map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-md bg-neutral-50 p-3">
                <UsersRound className="h-4 w-4 text-warning" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-neutral-900">{item.school}</p>
                  <p className="text-xs text-neutral-600">Mandato ate {formatDate(item.mandateEnd)}</p>
                </div>
                <Badge tone={item.status === "vencido" ? "danger" : "warning"}>{item.status}</Badge>
              </div>
            ))}
            {!overdueCouncils.length ? <EmptyState title="Conselhos regulares" description="Nenhum conselho vencido ou em atenção foi localizado." /> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentos e alertas</CardTitle>
            <p className="text-sm text-neutral-600">Sinais recentes para acompanhamento administrativo.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoLine label="Documentos cadastrados" value={String(documents.length)} />
            <InfoLine label="Alertas ativos" value={String(alerts.length)} />
            <InfoLine label="Recursos registrados" value={String(resources.length)} />
            <Link href="/central-prazos" className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-primary-700 hover:text-primary-900">
              Abrir central de prazos
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function MetricCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: LucideIcon; tone: "success" | "warning" | "danger" | "info" }) {
  const toneClass = {
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
    info: "bg-sky-50 text-sky-700"
  }[tone];

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-neutral-500">{label}</p>
          <p className="mt-3 text-3xl font-bold text-neutral-900">{value}</p>
          <p className="mt-1 text-sm leading-6 text-neutral-600">{detail}</p>
        </div>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${toneClass}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </Card>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
      <span className="text-sm font-semibold text-neutral-700">{label}</span>
      <span className="text-sm font-bold text-primary-700">{value}</span>
    </div>
  );
}
