import { Suspense } from "react";
import { BarChart3 } from "lucide-react";
import { PageHeader, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { GestaoRecursosCards }    from "@/components/gestao-recursos-cards";
import { GestaoRecursosFiltros }  from "@/components/gestao-recursos-filtros";
import { GestaoRecursosTabela }   from "@/components/gestao-recursos-tabela";
import { GestaoRecursosGraficos } from "@/components/gestao-recursos-graficos";
import { GestaoAlertasPainel }    from "@/components/gestao-alertas-painel";
import { GestaoRankingSaldos }    from "@/components/gestao-ranking-saldos";
import { GestaoRankingExecucao }  from "@/components/gestao-ranking-execucao";
import { GestaoDashboardPrograma } from "@/components/gestao-dashboard-programa";
import { GestaoExportar }         from "@/components/gestao-exportar";
import { getGestaoPrograms, getFinanceiroUnidade, getSchoolUnits, getExercicios } from "@/lib/supabase/queries";
import { agregarFinanceiro } from "@/data/gestao-recursos";

type SP = { exercicio?: string; programa?: string; tipo?: string; aba?: string };

export default async function GestaoRecursosPage({ searchParams }: { searchParams: SP }) {
  const exercicio  = searchParams.exercicio ? parseInt(searchParams.exercicio) : undefined;
  const programaId = searchParams.programa  || undefined;
  const aba        = searchParams.aba ?? "consolidado";

  const [programas, todasUnidades, exercicios, registros] = await Promise.all([
    getGestaoPrograms(),
    getSchoolUnits(),
    getExercicios(),
    getFinanceiroUnidade({ exercicio, programaId })
  ]);

  const unidades = todasUnidades.filter((u) =>
    !searchParams.tipo || u.type.toLowerCase() === searchParams.tipo
  );
  const unidadeIds = new Set(unidades.map((u) => u.id));
  const regs = registros.filter((r) => unidadeIds.has(r.unidadeId));

  const agg              = agregarFinanceiro(regs);
  const unidadesComRegs  = new Set(regs.map((r) => r.unidadeId)).size;
  const executadoCusteio = regs.reduce((a, r) => a + r.despesaCusteio, 0);
  const executadoCapital = regs.reduce((a, r) => a + r.despesaCapital, 0);

  const unidadesSimples = unidades.map((u) => ({ id: u.id, name: u.name, type: u.type }));

  const tabs = [
    { id: "consolidado", label: "Consolidado"    },
    { id: "alertas",     label: "Alertas"        },
    { id: "execucao",    label: "% Execução"     },
    { id: "programas",   label: "Por Programa"   },
    { id: "graficos",    label: "Gráficos"       }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestão de Recursos"
        description="Controle financeiro consolidado da rede municipal — custeio e capital por unidade, programa e exercício."
        breadcrumbs={[{ label: "Início", href: "/dashboard" }, { label: "Gestão de Recursos" }]}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-600">
              <BarChart3 className="h-4 w-4" />
              {regs.length} registros · {unidadesComRegs} unidades
            </div>
            <GestaoExportar
              registros={regs}
              unidades={unidadesSimples}
              programas={programas}
              exercicio={exercicio}
            />
          </div>
        }
      />

      <Suspense>
        <GestaoRecursosFiltros programas={programas} />
      </Suspense>

      <GestaoRecursosCards
        saldoCusteio={agg.saldoFinalCusteio}
        saldoCapital={agg.saldoFinalCapital}
        saldoGeral={agg.saldoGeral}
        executadoCusteio={executadoCusteio}
        executadoCapital={executadoCapital}
        totalUnidades={unidadesComRegs}
      />

      {/* Tabs de navegação */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-0">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            href={`/gestao-recursos?${new URLSearchParams({ ...searchParams, aba: tab.id }).toString()}`}
            className={`-mb-px rounded-t-md border border-b-white px-4 py-2 text-sm font-bold transition ${
              aba === tab.id
                ? "border-neutral-200 bg-white text-primary-700"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Conteúdo por aba */}
      {aba === "consolidado" && (
        <GestaoRecursosTabela
          registros={regs}
          unidades={unidadesSimples}
        />
      )}

      {aba === "alertas" && (
        <div className="space-y-6">
          <GestaoAlertasPainel registros={regs} unidades={unidadesSimples} />
          <Card>
            <CardHeader><CardTitle>Ranking — Saldos Parados</CardTitle></CardHeader>
            <CardContent>
              <GestaoRankingSaldos registros={regs} unidades={unidadesSimples} />
            </CardContent>
          </Card>
        </div>
      )}

      {aba === "execucao" && (
        <Card>
          <CardHeader><CardTitle>Ranking de Execução Financeira</CardTitle></CardHeader>
          <CardContent>
            <GestaoRankingExecucao registros={regs} unidades={unidadesSimples} />
          </CardContent>
        </Card>
      )}

      {aba === "programas" && (
        <Card>
          <CardHeader><CardTitle>Dashboard por Programa</CardTitle></CardHeader>
          <CardContent>
            <GestaoDashboardPrograma registros={regs} programas={programas} />
          </CardContent>
        </Card>
      )}

      {aba === "graficos" && regs.length > 0 && (
        <GestaoRecursosGraficos
          registros={regs}
          unidades={unidadesSimples}
          programas={programas}
        />
      )}
    </div>
  );
}
