import { AlertTriangle, Banknote, Route, WalletCards } from "lucide-react";
import { FinancialMovementForm } from "@/components/linked-record-forms";
import { Badge, Card, CardContent, CardHeader, CardTitle, PageHeader } from "@/components/ui";
import { getAccountabilities, getResources } from "@/lib/supabase/queries";
import { formatCurrency } from "@/lib/utils";

export default async function FinancialOrganizationPage() {
  const [resources, accountabilities] = await Promise.all([getResources(), getAccountabilities()]);
  const riskyUnits = accountabilities.filter((item) => item.status === "pendente" || item.status === "vencido").map((item) => item.school);
  const timeline = resources.slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organizacao Financeira"
        description="Mapa financeiro da rede, radar de risco, linha do tempo de recursos e conciliacao rapida."
        breadcrumbs={[{ label: "Inicio", href: "/dashboard" }, { label: "Organizacao Financeira" }]}
      />

      <section id="nova-movimentacao">
        <FinancialMovementForm />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Mapa financeiro da rede</CardTitle>
            <p className="text-sm text-neutral-600">Leitura rapida de saldo por unidade e programa.</p>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {resources.slice(0, 10).map((item) => {
              const percent = item.amount > 0 ? Math.round((item.balance / item.amount) * 100) : 0;
              const tone = percent > 60 ? "success" : percent > 20 ? "warning" : "danger";
              return (
                <div key={item.id} className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-neutral-900">{item.school}</p>
                      <p className="mt-1 text-xs font-semibold text-neutral-500">{item.program}</p>
                    </div>
                    <Badge tone={tone}>{percent}% saldo</Badge>
                  </div>
                  <p className="mt-3 text-lg font-bold text-primary-700">{formatCurrency(item.balance)}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Radar de risco</CardTitle>
            <p className="text-sm text-neutral-600">Unidades com prestacao pendente, vencida ou sem atualizacao.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from(new Set(riskyUnits)).slice(0, 8).map((unit) => (
              <div key={unit} className="flex items-center gap-3 rounded-md border border-amber-200 bg-amber-50 p-3">
                <AlertTriangle className="h-4 w-4 text-amber-700" aria-hidden="true" />
                <p className="min-w-0 flex-1 truncate text-sm font-bold text-amber-950">{unit}</p>
                <Badge tone="warning">Priorizar</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Linha do tempo do recurso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {timeline.map((item) => (
              <div key={item.id} className="grid grid-cols-[auto_1fr] gap-3">
                <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                  <Route className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="rounded-md border border-neutral-200 bg-white p-3">
                  <p className="text-sm font-bold text-neutral-900">{item.program}</p>
                  <p className="mt-1 text-xs text-neutral-600">{item.school} recebeu {formatCurrency(item.amount)}.</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conciliacao rapida</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <MiniMetric icon={Banknote} label="Recebido" value={formatCurrency(resources.reduce((sum, item) => sum + item.amount, 0))} />
            <MiniMetric icon={WalletCards} label="Saldo" value={formatCurrency(resources.reduce((sum, item) => sum + item.balance, 0))} />
            <MiniMetric icon={AlertTriangle} label="Divergencias" value={String(riskyUnits.length)} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function MiniMetric({ icon: Icon, label, value }: { icon: typeof Banknote; label: string; value: string }) {
  return (
    <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
      <Icon className="h-5 w-5 text-primary-700" aria-hidden="true" />
      <p className="mt-3 text-xs font-bold uppercase text-neutral-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-neutral-900">{value}</p>
    </div>
  );
}
