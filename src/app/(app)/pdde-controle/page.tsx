import { redirect } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Banknote, Building2, ClipboardList, Landmark, TrendingDown, WalletCards } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSchoolUnits, getPddePrograms, getPddeBalancesByYear } from "@/lib/supabase/queries";
import { Badge, Card, CardContent, CardHeader, CardTitle, PageHeader } from "@/components/ui";
import { PddeGrid } from "@/components/pdde-grid";
import { SchoolYearSelector } from "@/components/school-year-selector";
import { formatCurrency } from "@/lib/utils";
import type { PddeBalance, PddeProgram, SchoolUnit } from "@/lib/types";

type FinanceTotals = {
  saldoAnteriorC: number;
  saldoAnteriorK: number;
  valorCreditadoC: number;
  valorCreditadoK: number;
  rendimentoC: number;
  rendimentoK: number;
  valorGastoC: number;
  valorGastoK: number;
  saldoFinalC: number;
  saldoFinalK: number;
  total: number;
};

type UnitFinanceSummary = {
  school: SchoolUnit;
  totals: FinanceTotals;
  filledPrograms: number;
  hasMovement: boolean;
};

const emptyTotals: FinanceTotals = {
  saldoAnteriorC: 0,
  saldoAnteriorK: 0,
  valorCreditadoC: 0,
  valorCreditadoK: 0,
  rendimentoC: 0,
  rendimentoK: 0,
  valorGastoC: 0,
  valorGastoK: 0,
  saldoFinalC: 0,
  saldoFinalK: 0,
  total: 0
};

function balanceTotals(balances: PddeBalance[]): FinanceTotals {
  return balances.reduce((acc, item) => {
    const saldoFinalC = item.saldoAnteriorC + item.valorCreditadoC + item.rendimentoC - item.valorGastoC;
    const saldoFinalK = item.saldoAnteriorK + item.valorCreditadoK + item.rendimentoK - item.valorGastoK;

    return {
      saldoAnteriorC: acc.saldoAnteriorC + item.saldoAnteriorC,
      saldoAnteriorK: acc.saldoAnteriorK + item.saldoAnteriorK,
      valorCreditadoC: acc.valorCreditadoC + item.valorCreditadoC,
      valorCreditadoK: acc.valorCreditadoK + item.valorCreditadoK,
      rendimentoC: acc.rendimentoC + item.rendimentoC,
      rendimentoK: acc.rendimentoK + item.rendimentoK,
      valorGastoC: acc.valorGastoC + item.valorGastoC,
      valorGastoK: acc.valorGastoK + item.valorGastoK,
      saldoFinalC: acc.saldoFinalC + saldoFinalC,
      saldoFinalK: acc.saldoFinalK + saldoFinalK,
      total: acc.total + saldoFinalC + saldoFinalK
    };
  }, { ...emptyTotals });
}

function hasBalanceMovement(item: PddeBalance) {
  return [
    item.saldoAnteriorC,
    item.saldoAnteriorK,
    item.valorCreditadoC,
    item.valorCreditadoK,
    item.rendimentoC,
    item.rendimentoK,
    item.valorGastoC,
    item.valorGastoK
  ].some((value) => value !== 0);
}

function unitSummaries(schools: SchoolUnit[], balances: PddeBalance[]): UnitFinanceSummary[] {
  return schools.map((school) => {
    const unitBalances = balances.filter((item) => item.schoolUnitId === school.id);
    return {
      school,
      totals: balanceTotals(unitBalances),
      filledPrograms: unitBalances.filter(hasBalanceMovement).length,
      hasMovement: unitBalances.some(hasBalanceMovement)
    };
  });
}

function groupSummaries(programs: PddeProgram[], balances: PddeBalance[]) {
  const groups = new Map<string, string[]>();
  for (const program of programs) {
    groups.set(program.groupName, [...(groups.get(program.groupName) ?? []), program.id]);
  }

  return Array.from(groups.entries()).map(([name, programIds]) => ({
    name,
    totals: balanceTotals(balances.filter((item) => programIds.includes(item.programId))),
    programs: programIds.length
  }));
}

async function savePddeBalances(formData: FormData) {
  "use server";

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const raw = formData.get("data") as string;
  const schoolId = String(formData.get("schoolId") ?? "");
  const year = parseInt(String(formData.get("year") ?? ""), 10);

  if (!raw || !schoolId || Number.isNaN(year)) {
    redirect("/pdde-controle?erro=1");
  }

  let balances: PddeBalance[] = [];
  try {
    balances = JSON.parse(raw);
  } catch {
    redirect(`/pdde-controle?escola=${schoolId}&ano=${year}&erro=1`);
  }

  for (const balance of balances) {
    const { error } = await supabase.from("pdde_balances").upsert(
      {
        school_unit_id: balance.schoolUnitId,
        program_id: balance.programId,
        exercise_year: balance.exerciseYear,
        saldo_anterior_c: balance.saldoAnteriorC,
        saldo_anterior_k: balance.saldoAnteriorK,
        valor_creditado_c: balance.valorCreditadoC,
        valor_creditado_k: balance.valorCreditadoK,
        rendimento_c: balance.rendimentoC,
        rendimento_k: balance.rendimentoK,
        valor_gasto_c: balance.valorGastoC,
        valor_gasto_k: balance.valorGastoK,
        updated_by: user.id
      },
      { onConflict: "school_unit_id,program_id,exercise_year" }
    );

    if (error) {
      redirect(`/pdde-controle?escola=${schoolId}&ano=${year}&erro=1`);
    }
  }

  redirect(`/pdde-controle?escola=${schoolId}&ano=${year}&salvo=1`);
}

export default async function PddeControlePage({
  searchParams
}: {
  searchParams: { escola?: string; ano?: string; salvo?: string; erro?: string };
}) {
  const year = parseInt(searchParams.ano || "2026", 10);
  const schoolId = searchParams.escola;

  const [schools, programs, yearBalances] = await Promise.all([
    getSchoolUnits(),
    getPddePrograms(),
    getPddeBalancesByYear(year)
  ]);

  const balances = schoolId ? yearBalances.filter((item) => item.schoolUnitId === schoolId) : [];
  const selectedSchool = schools.find((school) => school.id === schoolId);
  const networkTotals = balanceTotals(yearBalances);
  const schoolSummaries = unitSummaries(schools, yearBalances);
  const activeSchoolSummaries = schoolSummaries.filter((item) => item.hasMovement);
  const negativeSchoolSummaries = activeSchoolSummaries.filter((item) => item.totals.total < 0);
  const selectedSchoolSummary = schoolSummaries.find((item) => item.school.id === schoolId);
  const groupedSummaries = groupSummaries(programs, yearBalances);
  const topSchoolSummaries = [...schoolSummaries]
    .sort((a, b) => {
      if (a.hasMovement !== b.hasMovement) return a.hasMovement ? -1 : 1;
      return b.totals.total - a.totals.total;
    })
    .slice(0, 12);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Controle financeiro das unidades"
        description="Painel principal para acompanhar o valor real por escola, creche, programa, custeio e capital."
        breadcrumbs={[
          { label: "Inicio", href: "/dashboard" },
          { label: "Controle financeiro" }
        ]}
      />

      {searchParams.erro && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          Erro ao salvar. Tente novamente.
        </div>
      )}

      <section className="grid gap-4 lg:grid-cols-4">
        <FinanceMetric
          icon={WalletCards}
          label="Saldo final da rede"
          value={formatCurrency(networkTotals.total)}
          detail={`C ${formatCurrency(networkTotals.saldoFinalC)} · K ${formatCurrency(networkTotals.saldoFinalK)}`}
          tone={networkTotals.total < 0 ? "danger" : "success"}
        />
        <FinanceMetric
          icon={Banknote}
          label={`Creditado em ${year}`}
          value={formatCurrency(networkTotals.valorCreditadoC + networkTotals.valorCreditadoK)}
          detail={`C ${formatCurrency(networkTotals.valorCreditadoC)} · K ${formatCurrency(networkTotals.valorCreditadoK)}`}
        />
        <FinanceMetric
          icon={TrendingDown}
          label="Valor gasto"
          value={formatCurrency(networkTotals.valorGastoC + networkTotals.valorGastoK)}
          detail={`Rendimento ${formatCurrency(networkTotals.rendimentoC + networkTotals.rendimentoK)}`}
        />
        <FinanceMetric
          icon={Building2}
          label="Unidades com dados"
          value={`${activeSchoolSummaries.length}/${schools.length}`}
          detail={negativeSchoolSummaries.length ? `${negativeSchoolSummaries.length} unidade(s) com saldo negativo` : "Sem saldo negativo registrado"}
          tone={negativeSchoolSummaries.length ? "warning" : "neutral"}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Mapa financeiro por unidade</CardTitle>
            <p className="text-sm text-neutral-600">Leitura rapida do valor disponivel em cada unidade no exercicio selecionado.</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 text-left text-xs font-bold uppercase text-neutral-500">
                    <th className="px-3 py-2">Unidade</th>
                    <th className="px-3 py-2">Creditado</th>
                    <th className="px-3 py-2">Gasto</th>
                    <th className="px-3 py-2">Saldo final</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2 text-right">Acao</th>
                  </tr>
                </thead>
                <tbody>
                  {topSchoolSummaries.map((item) => {
                    const creditado = item.totals.valorCreditadoC + item.totals.valorCreditadoK;
                    const gasto = item.totals.valorGastoC + item.totals.valorGastoK;
                    const tone = !item.hasMovement ? "neutral" : item.totals.total < 0 ? "danger" : "success";
                    const label = !item.hasMovement ? "Sem dados" : item.totals.total < 0 ? "Atencao" : "Regular";

                    return (
                      <tr key={item.school.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="px-3 py-3">
                          <p className="font-bold text-neutral-900">{item.school.name}</p>
                          <p className="mt-0.5 text-xs font-semibold text-neutral-500">{item.school.type} · {item.filledPrograms} programa(s)</p>
                        </td>
                        <td className="px-3 py-3 font-semibold text-neutral-700">{formatCurrency(creditado)}</td>
                        <td className="px-3 py-3 font-semibold text-neutral-700">{formatCurrency(gasto)}</td>
                        <td className={`px-3 py-3 font-black ${item.totals.total < 0 ? "text-red-700" : "text-emerald-700"}`}>
                          {formatCurrency(item.totals.total)}
                        </td>
                        <td className="px-3 py-3"><Badge tone={tone}>{label}</Badge></td>
                        <td className="px-3 py-3 text-right">
                          <Link
                            href={`/pdde-controle?escola=${item.school.id}&ano=${year}`}
                            className="inline-flex h-9 items-center rounded-md border border-neutral-300 px-3 text-xs font-black text-primary-700 hover:bg-primary-50"
                          >
                            Abrir
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo por bloco da planilha</CardTitle>
            <p className="text-sm text-neutral-600">Mesma leitura do modelo GPPE, somando todos os programas do grupo.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {groupedSummaries.map((item) => (
              <div key={item.name} className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-neutral-900">{item.name}</p>
                    <p className="mt-0.5 text-xs font-semibold text-neutral-500">{item.programs} programa(s)</p>
                  </div>
                  <Badge tone={item.totals.total < 0 ? "danger" : item.totals.total > 0 ? "success" : "neutral"}>
                    {item.totals.total < 0 ? "Negativo" : item.totals.total > 0 ? "Com saldo" : "Zerado"}
                  </Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold text-neutral-600">
                  <span>Creditado: {formatCurrency(item.totals.valorCreditadoC + item.totals.valorCreditadoK)}</span>
                  <span>Gasto: {formatCurrency(item.totals.valorGastoC + item.totals.valorGastoK)}</span>
                  <span className="col-span-2 text-sm font-black text-primary-700">Saldo: {formatCurrency(item.totals.total)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Selecionar unidade escolar</CardTitle>
          <p className="text-sm text-neutral-600">Escolha a escola e o exercicio para visualizar e editar a grade completa no formato do controle financeiro GPPE.</p>
        </CardHeader>
        <CardContent>
          <SchoolYearSelector schools={schools} selectedSchoolId={schoolId} year={year} />
        </CardContent>
      </Card>

      {!schoolId && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-dashed border-neutral-300 bg-white py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <Building2 className="h-8 w-8 text-neutral-400" aria-hidden="true" />
          </div>
          <div>
            <p className="font-bold text-neutral-700">Nenhuma escola selecionada</p>
            <p className="mt-1 text-sm text-neutral-500">Selecione uma escola acima para abrir a grade detalhada de Custeio e Capital.</p>
          </div>
        </div>
      )}

      {schoolId && programs.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-dashed border-amber-300 bg-amber-50 py-12 text-center">
          <ClipboardList className="h-8 w-8 text-amber-500" aria-hidden="true" />
          <div>
            <p className="font-bold text-amber-800">Programas PDDE nao encontrados</p>
            <p className="mt-1 text-sm text-amber-700">Execute o SQL de migracao no Supabase para cadastrar os programas.</p>
          </div>
        </div>
      )}

      {schoolId && programs.length > 0 && (
        <>
          {selectedSchoolSummary && (
            <section className="grid gap-4 lg:grid-cols-4">
              <FinanceMetric
                icon={Landmark}
                label="Saldo anterior"
                value={formatCurrency(selectedSchoolSummary.totals.saldoAnteriorC + selectedSchoolSummary.totals.saldoAnteriorK)}
                detail={`C ${formatCurrency(selectedSchoolSummary.totals.saldoAnteriorC)} · K ${formatCurrency(selectedSchoolSummary.totals.saldoAnteriorK)}`}
              />
              <FinanceMetric
                icon={Banknote}
                label="Creditado"
                value={formatCurrency(selectedSchoolSummary.totals.valorCreditadoC + selectedSchoolSummary.totals.valorCreditadoK)}
                detail={`C ${formatCurrency(selectedSchoolSummary.totals.valorCreditadoC)} · K ${formatCurrency(selectedSchoolSummary.totals.valorCreditadoK)}`}
              />
              <FinanceMetric
                icon={TrendingDown}
                label="Gasto"
                value={formatCurrency(selectedSchoolSummary.totals.valorGastoC + selectedSchoolSummary.totals.valorGastoK)}
                detail={`Rendimento ${formatCurrency(selectedSchoolSummary.totals.rendimentoC + selectedSchoolSummary.totals.rendimentoK)}`}
              />
              <FinanceMetric
                icon={WalletCards}
                label="Saldo final"
                value={formatCurrency(selectedSchoolSummary.totals.total)}
                detail={`C ${formatCurrency(selectedSchoolSummary.totals.saldoFinalC)} · K ${formatCurrency(selectedSchoolSummary.totals.saldoFinalK)}`}
                tone={selectedSchoolSummary.totals.total < 0 ? "danger" : "success"}
              />
            </section>
          )}

          <div className="flex flex-wrap items-center gap-3 rounded-md border border-neutral-200 bg-white px-5 py-3 shadow-card">
            <WalletCards className="h-5 w-5 shrink-0 text-primary-700" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-black text-neutral-900">{selectedSchool?.name ?? "Escola selecionada"}</p>
              <p className="text-xs font-semibold text-neutral-500">Exercicio {year} · C = Custeio · K = Capital</p>
            </div>
            {selectedSchoolSummary?.totals.total !== undefined && selectedSchoolSummary.totals.total < 0 && (
              <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                Saldo final negativo
              </div>
            )}
          </div>

          <PddeGrid
            programs={programs}
            initialBalances={balances}
            schoolUnitId={schoolId}
            year={year}
            saveAction={savePddeBalances}
            saved={searchParams.salvo === "1"}
          />
        </>
      )}
    </div>
  );
}

function FinanceMetric({
  icon: Icon,
  label,
  value,
  detail,
  tone = "neutral"
}: {
  icon: typeof WalletCards;
  label: string;
  value: string;
  detail: string;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  const toneClasses = {
    neutral: "border-neutral-200 bg-white text-primary-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    danger: "border-red-200 bg-red-50 text-red-700"
  };

  return (
    <div className={`rounded-md border p-4 shadow-card ${toneClasses[tone]}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase text-neutral-500">{label}</p>
        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      </div>
      <p className="mt-3 text-xl font-black text-neutral-950">{value}</p>
      <p className="mt-1 text-xs font-semibold text-neutral-600">{detail}</p>
    </div>
  );
}
