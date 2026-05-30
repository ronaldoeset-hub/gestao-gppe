import { notFound, redirect } from "next/navigation";
import { Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getGestaoPrograms, getFinanceiroUnidade, getSchoolUnits } from "@/lib/supabase/queries";
import { PageHeader, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { GestaoRecursosForm } from "@/components/gestao-recursos-form";
import { calcularFinanceiro, agregarFinanceiro, ANOS_DISPONIVEIS } from "@/data/gestao-recursos";
import { formatCurrency } from "@/lib/utils";
import type { FinanceiroUnidade } from "@/lib/types";

async function salvarRegistro(
  unidadeId: string,
  programaId: string,
  exercicio: number,
  _formData: FormData
): Promise<{ ok: boolean; message: string }> {
  "use server";

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const get = (k: string) => parseFloat((_formData.get(k) as string) || "0") || 0;

  const payload = {
    unidade_id:              unidadeId,
    programa_id:             programaId,
    exercicio,
    saldo_anterior_custeio:  get("saldoAnteriorCusteio"),
    saldo_anterior_capital:  get("saldoAnteriorCapital"),
    creditado_custeio:       get("creditadoCusteio"),
    creditado_capital:       get("creditadoCapital"),
    rendimento_custeio:      get("rendimentoCusteio"),
    rendimento_capital:      get("rendimentoCapital"),
    despesa_custeio:         get("despesaCusteio"),
    despesa_capital:         get("despesaCapital"),
    observacao:              (_formData.get("observacao") as string)?.trim() || null,
    atualizado_por:          user.id,
    data_atualizacao:        new Date().toISOString()
  };

  const { error } = await supabase
    .from("financeiro_unidade")
    .upsert(payload, { onConflict: "unidade_id,programa_id,exercicio" });

  if (error) return { ok: false, message: `Erro: ${error.message}` };
  return { ok: true, message: "Salvo com sucesso!" };
}

export default async function UnidadeDetalhe({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { exercicio?: string };
}) {
  const exercicio = parseInt(searchParams.exercicio || "2026");
  const [unidades, programas, registros] = await Promise.all([
    getSchoolUnits(),
    getGestaoPrograms(),
    getFinanceiroUnidade({ unidadeId: params.id, exercicio })
  ]);

  const unidade = unidades.find((u) => u.id === params.id);
  if (!unidade) notFound();

  const agg = agregarFinanceiro(registros);

  const regMap = new Map<string, FinanceiroUnidade>();
  for (const r of registros) regMap.set(r.programaId, r);

  function makeAction(programaId: string, ano: number) {
    return async (_: string, __: number, fd: FormData) =>
      salvarRegistro(params.id, programaId, ano, fd);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={unidade.name}
        description="Controle financeiro por programa e exercício."
        breadcrumbs={[
          { label: "Início",            href: "/dashboard" },
          { label: "Gestão de Recursos", href: "/gestao-recursos" },
          { label: unidade.name }
        ]}
      />

      {/* Resumo da unidade */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Dados da Unidade</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <InfoRow label="Tipo"     value={unidade.type}    />
            <InfoRow label="Bairro"   value={unidade.district} />
            <InfoRow label="Gestor"   value={unidade.manager}  />
            <InfoRow label="INEP"     value={unidade.inep}     />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Resumo Financeiro — {exercicio}</CardTitle>
              <div className="flex gap-1">
                {ANOS_DISPONIVEIS.map((a) => (
                  <a
                    key={a}
                    href={`/gestao-recursos/unidade/${params.id}?exercicio=${a}`}
                    className={`rounded px-2 py-1 text-xs font-black ${a === exercicio ? "bg-primary-700 text-white" : "border border-neutral-300 text-neutral-600 hover:bg-neutral-50"}`}
                  >
                    {a}
                  </a>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <SaldoCard label="Custeio" value={agg.saldoFinalCusteio} />
              <SaldoCard label="Capital" value={agg.saldoFinalCapital} />
              <SaldoCard label="Geral"   value={agg.saldoGeral} highlight />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de programas */}
      {registros.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Programas com registro</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="py-2 px-3 text-left text-xs font-bold uppercase text-neutral-500">Programa</th>
                    <th className="py-2 px-3 text-right text-xs font-bold uppercase text-neutral-500">Exercício</th>
                    <th className="py-2 px-3 text-right text-xs font-bold uppercase text-neutral-500">Saldo Custeio</th>
                    <th className="py-2 px-3 text-right text-xs font-bold uppercase text-neutral-500">Saldo Capital</th>
                    <th className="py-2 px-3 text-right text-xs font-bold uppercase text-neutral-500">Saldo Geral</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.map((r) => {
                    const programa = programas.find((p) => p.id === r.programaId);
                    const c = calcularFinanceiro(r);
                    return (
                      <tr key={r.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-2 px-3 font-semibold text-neutral-800">{programa?.nome ?? "—"}</td>
                        <td className="py-2 px-3 text-right text-neutral-600">{r.exercicio}</td>
                        <td className="py-2 px-3 text-right font-mono">{formatCurrency(c.saldoFinalCusteio)}</td>
                        <td className="py-2 px-3 text-right font-mono">{formatCurrency(c.saldoFinalCapital)}</td>
                        <td className={`py-2 px-3 text-right font-mono font-bold ${c.saldoGeral < 0 ? "text-red-600" : "text-emerald-700"}`}>
                          {formatCurrency(c.saldoGeral)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulários por programa */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-neutral-400" aria-hidden="true" />
          <h2 className="text-lg font-black text-neutral-900">
            Lançamentos por programa — {exercicio}
          </h2>
        </div>

        {programas.map((programa) => {
          const action = makeAction(programa.id, exercicio);
          const boundAction = async (_pid: string, _ano: number, fd: FormData) =>
            salvarRegistro(params.id, programa.id, exercicio, fd);
          return (
            <GestaoRecursosForm
              key={programa.id}
              unidadeId={params.id}
              programa={programa}
              exercicio={exercicio}
              initial={regMap.get(programa.id)}
              saveAction={boundAction}
            />
          );
        })}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-neutral-500">{label}</span>
      <span className="font-semibold text-neutral-800 text-right">{value || "—"}</span>
    </div>
  );
}

function SaldoCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`rounded-md p-3 text-center ${highlight ? "bg-neutral-900 text-white" : "bg-neutral-50"}`}>
      <p className={`text-xs font-bold uppercase ${highlight ? "text-neutral-400" : "text-neutral-500"}`}>{label}</p>
      <p className={`mt-1 text-sm font-black ${highlight ? (value < 0 ? "text-red-400" : "text-amber-300") : (value < 0 ? "text-red-600" : "text-emerald-700")}`}>
        {formatCurrency(value)}
      </p>
    </div>
  );
}
