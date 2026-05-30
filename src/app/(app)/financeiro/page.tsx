import { redirect } from "next/navigation";
import { Building2, ClipboardList, DollarSign } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getFinanceiroBalances, getSchoolUnits } from "@/lib/supabase/queries";
import { Card, CardContent, CardHeader, CardTitle, PageHeader } from "@/components/ui";
import { FinanceiroGrid } from "@/components/financeiro-grid";
import { SchoolYearSelector } from "@/components/school-year-selector";
import { catalogoFinanceiro } from "@/data/financeiro";
import type { FinanceiroBalance } from "@/lib/types";

async function saveFinanceiroBalances(formData: FormData) {
  "use server";

  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const raw = formData.get("data") as string;
  const schoolId = formData.get("schoolId") as string;
  const year = parseInt(formData.get("year") as string);

  let balances: FinanceiroBalance[] = [];
  try {
    balances = JSON.parse(raw);
  } catch {
    redirect(`/financeiro?escola=${schoolId}&ano=${year}&erro=1`);
  }

  for (const b of balances) {
    const { error } = await supabase.from("financeiro_balances").upsert(
      {
        school_unit_id:   b.schoolUnitId,
        programa_codigo:  b.programaCodigo,
        exercise_year:    b.exerciseYear,
        saldo_anterior_c: b.saldoAnteriorC,
        saldo_anterior_k: b.saldoAnteriorK,
        valor_creditado_c: b.valorCreditadoC,
        valor_creditado_k: b.valorCreditadoK,
        rendimento_c:     b.rendimentoC,
        rendimento_k:     b.rendimentoK,
        valor_gasto_c:    b.valorGastoC,
        valor_gasto_k:    b.valorGastoK,
        updated_by:       user.id
      },
      { onConflict: "school_unit_id,programa_codigo,exercise_year" }
    );
    if (error) {
      redirect(`/financeiro?escola=${schoolId}&ano=${year}&erro=1`);
    }
  }

  redirect(`/financeiro?escola=${schoolId}&ano=${year}&salvo=1`);
}

export default async function FinanceiroPage({
  searchParams
}: {
  searchParams: { escola?: string; ano?: string; salvo?: string; erro?: string };
}) {
  const year = parseInt(searchParams.ano || "2026");
  const schoolId = searchParams.escola;

  const [schools, balances] = await Promise.all([
    getSchoolUnits(),
    schoolId ? getFinanceiroBalances(schoolId, year) : Promise.resolve([])
  ]);

  const selectedSchool = schools.find((s) => s.id === schoolId);
  const lastUpdated = balances.reduce<string | undefined>((latest, b) => {
    if (!b.updatedAt) return latest;
    return !latest || b.updatedAt > latest ? b.updatedAt : latest;
  }, undefined);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Controle Financeiro"
        description="Acompanhamento de saldos por escola e programa: Custeio (C) e Capital (K). Dados salvos diretamente no banco."
        breadcrumbs={[
          { label: "Início", href: "/dashboard" },
          { label: "Controle Financeiro" }
        ]}
      />

      {searchParams.erro && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          Erro ao salvar. Verifique sua conexão e tente novamente.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Selecionar unidade escolar</CardTitle>
          <p className="text-sm text-neutral-600">
            Escolha a escola e o exercício para visualizar e editar o controle financeiro.
          </p>
        </CardHeader>
        <CardContent>
          <SchoolYearSelector
            schools={schools}
            selectedSchoolId={schoolId}
            year={year}
            basePath="/financeiro"
          />
        </CardContent>
      </Card>

      {!schoolId && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-dashed border-neutral-300 bg-white py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <Building2 className="h-8 w-8 text-neutral-400" aria-hidden="true" />
          </div>
          <div>
            <p className="font-bold text-neutral-700">Nenhuma escola selecionada</p>
            <p className="mt-1 text-sm text-neutral-500">
              Selecione uma escola acima para editar o controle financeiro.
            </p>
          </div>
        </div>
      )}

      {schoolId && catalogoFinanceiro.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-dashed border-amber-300 bg-amber-50 py-12 text-center">
          <ClipboardList className="h-8 w-8 text-amber-500" aria-hidden="true" />
          <p className="font-bold text-amber-800">Catálogo de programas não encontrado.</p>
        </div>
      )}

      {schoolId && catalogoFinanceiro.length > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-3 rounded-md border border-neutral-200 bg-white px-5 py-3 shadow-card">
            <DollarSign className="h-5 w-5 text-primary-700 shrink-0" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-black text-neutral-900">
                {selectedSchool?.name ?? "Escola selecionada"}
              </p>
              <p className="text-xs font-semibold text-neutral-500">
                Exercício {year} · C = Custeio · K = Capital
              </p>
            </div>
          </div>

          <FinanceiroGrid
            catalogo={catalogoFinanceiro}
            initialBalances={balances}
            schoolUnitId={schoolId}
            schoolName={selectedSchool?.name ?? ""}
            year={year}
            updatedAt={lastUpdated}
            saveAction={saveFinanceiroBalances}
            saved={searchParams.salvo === "1"}
          />
        </>
      )}
    </div>
  );
}
