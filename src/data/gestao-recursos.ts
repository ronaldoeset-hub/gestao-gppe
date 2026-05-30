import type { FinanceiroUnidade, FinanceiroCalculado } from "@/lib/types";

// ── Cálculos financeiros ──────────────────────────────────────────────────────

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

// ── Percentual de execução ────────────────────────────────────────────────────

export function calcularPercentualExecucao(r: FinanceiroUnidade): number {
  const c = calcularFinanceiro(r);
  const totalDisponivel = c.totalCusteio + c.totalCapital;
  const executado = r.despesaCusteio + r.despesaCapital;
  if (totalDisponivel <= 0) return 0;
  return Math.min(100, Math.round((executado / totalDisponivel) * 100));
}

export type NivelExecucao = "excelente" | "atencao" | "critico";

export function classificarExecucao(pct: number): NivelExecucao {
  if (pct > 80) return "excelente";
  if (pct >= 50) return "atencao";
  return "critico";
}

export const EXECUCAO_CONFIG: Record<NivelExecucao, { label: string; icon: string; bg: string; text: string }> = {
  excelente: { label: "Excelente", icon: "🟢", bg: "bg-emerald-50", text: "text-emerald-700" },
  atencao:   { label: "Atenção",   icon: "🟡", bg: "bg-amber-50",   text: "text-amber-700"  },
  critico:   { label: "Crítico",   icon: "🔴", bg: "bg-red-50",     text: "text-red-700"    }
};

// ── Alertas inteligentes ──────────────────────────────────────────────────────

export type NivelAlerta = "regular" | "atencao" | "critico";

export function calcularAlerta(saldoGeral: number, updatedAt?: string): NivelAlerta {
  const dias = updatedAt
    ? Math.floor((Date.now() - new Date(updatedAt).getTime()) / 86_400_000)
    : 9999;

  if (saldoGeral >= 30_000 || dias > 120) return "critico";
  if (saldoGeral >= 10_000 || dias > 60)  return "atencao";
  return "regular";
}

export const ALERTA_CONFIG: Record<NivelAlerta, {
  label: string; icon: string;
  bg: string; border: string; text: string; badge: string;
  mensagem?: string;
}> = {
  regular: {
    label: "Regular", icon: "🟢",
    bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-800"
  },
  atencao: {
    label: "Atenção", icon: "🟡",
    bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700",
    badge: "bg-amber-100 text-amber-800",
    mensagem: "Atenção: esta unidade possui saldo financeiro elevado. Recomenda-se acompanhamento técnico para melhor execução dos recursos durante o exercício vigente."
  },
  critico: {
    label: "Crítico", icon: "🔴",
    bg: "bg-red-50", border: "border-red-200", text: "text-red-700",
    badge: "bg-red-100 text-red-800",
    mensagem: "Alerta Crítico: esta unidade apresenta recursos com baixa execução e saldo elevado. Recomenda-se análise imediata para evitar acúmulo excessivo de recursos e dificuldades na execução financeira dentro do exercício vigente."
  }
};

// ── Mapa de calor ─────────────────────────────────────────────────────────────

export function heatMapClasses(saldoGeral: number): string {
  if (saldoGeral >= 30_000) return "bg-red-50 text-red-700";
  if (saldoGeral >= 10_000) return "bg-amber-50 text-amber-700";
  return "bg-emerald-50 text-emerald-700";
}

// ── Constantes ────────────────────────────────────────────────────────────────

export const ANOS_DISPONIVEIS = [2024, 2025, 2026];

export const SITUACAO_PROGRAMA = [
  "Em Execução",
  "Encerrado",
  "Reprogramado",
  "Aguardando Utilização"
] as const;

export const TIPO_PROGRAMA = [
  "Custeio e Capital",
  "Custeio",
  "Capital"
] as const;

export type SituacaoPrograma = typeof SITUACAO_PROGRAMA[number];
export type TipoPrograma     = typeof TIPO_PROGRAMA[number];
