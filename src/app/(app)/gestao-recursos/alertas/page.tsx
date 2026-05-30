import { PageHeader, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { GestaoAlertasPainel } from "@/components/gestao-alertas-painel";
import { GestaoRankingSaldos } from "@/components/gestao-ranking-saldos";
import { getFinanceiroUnidade, getSchoolUnits } from "@/lib/supabase/queries";

export default async function GestaoAlertasPage({
  searchParams
}: {
  searchParams: { exercicio?: string };
}) {
  const exercicio = searchParams.exercicio ? parseInt(searchParams.exercicio) : undefined;
  const [todasUnidades, registros] = await Promise.all([
    getSchoolUnits(),
    getFinanceiroUnidade({ exercicio })
  ]);

  const unidades = todasUnidades.map((u) => ({ id: u.id, name: u.name, type: u.type }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alertas e Saldos Parados"
        description="Monitoramento inteligente de execução financeira — identifique unidades com saldos elevados ou sem atualização recente."
        breadcrumbs={[
          { label: "Início",            href: "/dashboard" },
          { label: "Gestão de Recursos", href: "/gestao-recursos" },
          { label: "Alertas" }
        ]}
      />

      <div className="flex gap-2">
        {[2024, 2025, 2026].map((ano) => (
          <a
            key={ano}
            href={`/gestao-recursos/alertas?exercicio=${ano}`}
            className={`rounded-md border px-4 py-2 text-sm font-bold ${
              String(ano) === (searchParams.exercicio ?? "")
                ? "border-primary-700 bg-primary-700 text-white"
                : "border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {ano}
          </a>
        ))}
        {searchParams.exercicio && (
          <a href="/gestao-recursos/alertas" className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-bold text-neutral-600 hover:bg-neutral-50">
            Todos
          </a>
        )}
      </div>

      <GestaoAlertasPainel registros={registros} unidades={unidades} />

      <Card>
        <CardHeader>
          <CardTitle>Ranking Completo — Saldos Parados</CardTitle>
          <p className="text-sm text-neutral-600">
            Ordenado do maior saldo ao menor. Unidades com saldo ≥ R$30.000 ou sem atualização há mais de 120 dias são marcadas como Crítico.
          </p>
        </CardHeader>
        <CardContent>
          <GestaoRankingSaldos registros={registros} unidades={unidades} limit={100} />
        </CardContent>
      </Card>
    </div>
  );
}
