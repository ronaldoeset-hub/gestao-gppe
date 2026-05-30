import { PageHeader, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { GestaoDashboardPrograma } from "@/components/gestao-dashboard-programa";
import { GestaoRankingExecucao }  from "@/components/gestao-ranking-execucao";
import { getGestaoPrograms, getFinanceiroUnidade, getSchoolUnits } from "@/lib/supabase/queries";

export default async function GestaoProgramasPage({
  searchParams
}: {
  searchParams: { exercicio?: string };
}) {
  const exercicio = searchParams.exercicio ? parseInt(searchParams.exercicio) : undefined;
  const [programas, unidades, registros] = await Promise.all([
    getGestaoPrograms(),
    getSchoolUnits(),
    getFinanceiroUnidade({ exercicio })
  ]);

  const unidadesSimples = unidades.map((u) => ({ id: u.id, name: u.name, type: u.type }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard por Programa"
        description="Visão consolidada de cada programa financeiro — recebido, executado, saldo e unidades atendidas."
        breadcrumbs={[
          { label: "Início",             href: "/dashboard" },
          { label: "Gestão de Recursos", href: "/gestao-recursos" },
          { label: "Por Programa" }
        ]}
      />

      <div className="flex gap-2">
        {[2024, 2025, 2026].map((ano) => (
          <a
            key={ano}
            href={`/gestao-recursos/programas?exercicio=${ano}`}
            className={`rounded-md border px-4 py-2 text-sm font-bold ${
              String(ano) === (searchParams.exercicio ?? "")
                ? "border-primary-700 bg-primary-700 text-white"
                : "border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {ano}
          </a>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Consolidado por Programa</CardTitle></CardHeader>
        <CardContent>
          <GestaoDashboardPrograma registros={registros} programas={programas} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ranking de Execução — Todas as Unidades</CardTitle>
          <p className="text-sm text-neutral-600">Percentual de execução por unidade no período selecionado.</p>
        </CardHeader>
        <CardContent>
          <GestaoRankingExecucao registros={registros} unidades={unidadesSimples} />
        </CardContent>
      </Card>
    </div>
  );
}
