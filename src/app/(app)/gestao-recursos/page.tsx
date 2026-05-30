import { Suspense } from "react";
import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { GestaoRecursosCards }   from "@/components/gestao-recursos-cards";
import { GestaoRecursosFiltros } from "@/components/gestao-recursos-filtros";
import { GestaoRecursosTabela }  from "@/components/gestao-recursos-tabela";
import { GestaoRecursosGraficos } from "@/components/gestao-recursos-graficos";
import { getGestaoPrograms, getFinanceiroUnidade, getSchoolUnits } from "@/lib/supabase/queries";
import { agregarFinanceiro } from "@/data/gestao-recursos";

type SearchParams = {
  exercicio?: string;
  programa?: string;
  tipo?: string;
};

export default async function GestaoRecursosPage({ searchParams }: { searchParams: SearchParams }) {
  const exercicio  = searchParams.exercicio ? parseInt(searchParams.exercicio) : undefined;
  const programaId = searchParams.programa || undefined;

  const [programas, todasUnidades, registros] = await Promise.all([
    getGestaoPrograms(),
    getSchoolUnits(),
    getFinanceiroUnidade({ exercicio, programaId })
  ]);

  const unidades = todasUnidades.filter((u) =>
    !searchParams.tipo || u.type.toLowerCase() === searchParams.tipo
  );

  const unidadeIds = new Set(unidades.map((u) => u.id));
  const registrosFiltrados = registros.filter((r) => unidadeIds.has(r.unidadeId));

  const agg = agregarFinanceiro(registrosFiltrados);
  const unidadesComRecursos = new Set(registrosFiltrados.map((r) => r.unidadeId)).size;

  const executadoCusteio = registrosFiltrados.reduce((a, r) => a + r.despesaCusteio, 0);
  const executadoCapital = registrosFiltrados.reduce((a, r) => a + r.despesaCapital, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestão de Recursos"
        description="Controle financeiro consolidado por unidade, programa e exercício — custeio e capital."
        breadcrumbs={[{ label: "Início", href: "/dashboard" }, { label: "Gestão de Recursos" }]}
        actions={
          <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-600">
            <BarChart3 className="h-4 w-4" />
            {registrosFiltrados.length} registros · {unidadesComRecursos} unidades
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
        totalUnidades={unidadesComRecursos}
      />

      <GestaoRecursosTabela
        registros={registrosFiltrados}
        unidades={unidades.map((u) => ({ id: u.id, name: u.name, type: u.type }))}
      />

      {registrosFiltrados.length > 0 && (
        <GestaoRecursosGraficos
          registros={registrosFiltrados}
          unidades={unidades.map((u) => ({ id: u.id, name: u.name }))}
          programas={programas}
        />
      )}
    </div>
  );
}
