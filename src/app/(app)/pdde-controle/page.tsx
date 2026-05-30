import { redirect } from "next/navigation";
import { Building2, ClipboardList, WalletCards } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSchoolUnits, getPddePrograms, getPddeBalances } from "@/lib/supabase/queries";
import { Card, CardContent, CardHeader, CardTitle, PageHeader } from "@/components/ui";
import { PddeGrid } from "@/components/pdde-grid";
import { SchoolYearSelector } from "@/components/school-year-selector";
import type { PddeBalance } from "@/lib/types";

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
  try { balances = JSON.parse(raw); } catch { redirect(`/pdde-controle?escola=${schoolId}&ano=${year}&erro=1`); }

  for (const b of balances) {
    const { error } = await supabase.from("pdde_balances").upsert(
      {
        school_unit_id: b.schoolUnitId,
        program_id: b.programId,
        exercise_year: b.exerciseYear,
        saldo_anterior_c: b.saldoAnteriorC,
        saldo_anterior_k: b.saldoAnteriorK,
        valor_creditado_c: b.valorCreditadoC,
        valor_creditado_k: b.valorCreditadoK,
        rendimento_c: b.rendimentoC,
        rendimento_k: b.rendimentoK,
        valor_gasto_c: b.valorGastoC,
        valor_gasto_k: b.valorGastoK,
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
  const year = parseInt(searchParams.ano || "2026");
  const schoolId = searchParams.escola;

  const [schools, programs] = await Promise.all([getSchoolUnits(), getPddePrograms()]);
  const balances = schoolId ? await getPddeBalances(schoolId, year) : [];
  const selectedSchool = schools.find((s) => s.id === schoolId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Controle Financeiro PDDE"
        description="Acompanhamento de saldos por escola e programa: Custeio (C) e Capital (K)."
        breadcrumbs={[
          { label: "Inicio", href: "/dashboard" },
          { label: "Controle PDDE" }
        ]}
      />

      {searchParams.erro && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          Erro ao salvar. Tente novamente.
        </div>
      )}

      {/* Seletor de escola e ano */}
      <Card>
        <CardHeader>
          <CardTitle>Selecionar unidade escolar</CardTitle>
          <p className="text-sm text-neutral-600">Escolha a escola e o exercicio para visualizar e editar o controle financeiro.</p>
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
            <p className="mt-1 text-sm text-neutral-500">Selecione uma escola acima para ver o controle financeiro.</p>
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
          <div className="flex flex-wrap items-center gap-3 rounded-md border border-neutral-200 bg-white px-5 py-3 shadow-card">
            <WalletCards className="h-5 w-5 text-primary-700 shrink-0" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-black text-neutral-900">{selectedSchool?.name ?? "Escola selecionada"}</p>
              <p className="text-xs font-semibold text-neutral-500">Exercício {year} · C = Custeio · K = Capital</p>
            </div>
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
