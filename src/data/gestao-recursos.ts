import type { FinanceiroUnidade, FinanceiroCalculado } from "@/lib/types";

export function calcularFinanceiro(r: Pick<
  FinanceiroUnidade,
  "saldoAnteriorCusteio" | "saldoAnteriorCapital" |
  "creditadoCusteio"     | "creditadoCapital"     |
  "rendimentoCusteio"    | "rendimentoCapital"     |
  "despesaCusteio"       | "despesaCapital"
>): FinanceiroCalculado {
  const totalCusteio      = r.saldoAnteriorCusteio + r.creditadoCusteio + r.rendimentoCusteio;
  const totalCapital      = r.saldoAnteriorCapital + r.creditadoCapital + r.rendimentoCapital;
  const saldoFinalCusteio = totalCusteio - r.despesaCusteio;
  const saldoFinalCapital = totalCapital - r.despesaCapital;
  const saldoGeral        = saldoFinalCusteio + saldoFinalCapital;
  return { totalCusteio, totalCapital, saldoFinalCusteio, saldoFinalCapital, saldoGeral };
}

export function agregarFinanceiro(registros: FinanceiroUnidade[]): FinanceiroCalculado {
  return registros.reduce<FinanceiroCalculado>(
    (acc, r) => {
      const c = calcularFinanceiro(r);
      return {
        totalCusteio:      acc.totalCusteio      + c.totalCusteio,
        totalCapital:      acc.totalCapital      + c.totalCapital,
        saldoFinalCusteio: acc.saldoFinalCusteio + c.saldoFinalCusteio,
        saldoFinalCapital: acc.saldoFinalCapital + c.saldoFinalCapital,
        saldoGeral:        acc.saldoGeral        + c.saldoGeral
      };
    },
    { totalCusteio: 0, totalCapital: 0, saldoFinalCusteio: 0, saldoFinalCapital: 0, saldoGeral: 0 }
  );
}

export const ANOS_DISPONIVEIS = [2024, 2025, 2026];
