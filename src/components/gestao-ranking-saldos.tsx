"use client";

import Link from "next/link";
import { useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  calcularFinanceiro, calcularAlerta, calcularPercentualExecucao,
  heatMapClasses, ALERTA_CONFIG
} from "@/data/gestao-recursos";
import { AlertaBadge } from "@/components/gestao-alertas-painel";
import type { FinanceiroUnidade } from "@/lib/types";

type Props = {
  registros: FinanceiroUnidade[];
  unidades: Array<{ id: string; name: string; type: string }>;
  limit?: number;
};

export function GestaoRankingSaldos({ registros, unidades, limit = 50 }: Props) {
  const nomeMap = new Map(unidades.map((u) => [u.id, { nome: u.name, tipo: u.type }]));

  const rows = useMemo(() => {
    const byUnit = new Map<string, {
      saldoCusteio: number; saldoCapital: number; saldoGeral: number;
      executado: number; totalDisp: number; updatedAt?: string;
    }>();

    for (const r of registros) {
      const c = calcularFinanceiro(r);
      const prev = byUnit.get(r.unidadeId) ?? {
        saldoCusteio: 0, saldoCapital: 0, saldoGeral: 0,
        executado: 0, totalDisp: 0, updatedAt: undefined
      };
      byUnit.set(r.unidadeId, {
        saldoCusteio: prev.saldoCusteio + c.saldoFinalCusteio,
        saldoCapital: prev.saldoCapital + c.saldoFinalCapital,
        saldoGeral:   prev.saldoGeral   + c.saldoGeral,
        executado:    prev.executado    + r.despesaCusteio + r.despesaCapital,
        totalDisp:    prev.totalDisp    + c.totalCusteio + c.totalCapital,
        updatedAt: !prev.updatedAt || (r.updatedAt && r.updatedAt > prev.updatedAt)
          ? r.updatedAt : prev.updatedAt
      });
    }

    return Array.from(byUnit.entries())
      .map(([id, d]) => ({
        id,
        ...nomeMap.get(id),
        ...d,
        pct: d.totalDisp > 0 ? Math.round((d.executado / d.totalDisp) * 100) : 0,
        alerta: calcularAlerta(d.saldoGeral, d.updatedAt)
      }))
      .sort((a, b) => b.saldoGeral - a.saldoGeral)
      .slice(0, limit);
  }, [registros, nomeMap, limit]);

  if (!rows.length) {
    return <p className="py-8 text-center text-sm text-neutral-500">Nenhum dado disponível para o período selecionado.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-md border border-neutral-200 shadow-card">
      <table className="w-full border-collapse bg-white text-sm">
        <thead className="bg-neutral-900 text-white">
          <tr>
            <th className="px-3 py-2.5 text-left text-xs font-bold uppercase w-10">#</th>
            <th className="px-3 py-2.5 text-left text-xs font-bold uppercase">Unidade</th>
            <th className="px-3 py-2.5 text-left text-xs font-bold uppercase">Tipo</th>
            <th className="px-3 py-2.5 text-right text-xs font-bold uppercase">Saldo Custeio</th>
            <th className="px-3 py-2.5 text-right text-xs font-bold uppercase">Saldo Capital</th>
            <th className="px-3 py-2.5 text-right text-xs font-bold uppercase">Saldo Geral</th>
            <th className="px-3 py-2.5 text-right text-xs font-bold uppercase">% Execução</th>
            <th className="px-3 py-2.5 text-center text-xs font-bold uppercase">Alerta</th>
            <th className="px-3 py-2.5 text-xs font-bold uppercase w-8"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const heatCls = heatMapClasses(row.saldoGeral ?? 0);
            return (
              <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-3 py-2.5 text-xs font-black text-neutral-400">{i + 1}</td>
                <td className="px-3 py-2.5 font-semibold text-neutral-900 max-w-xs">
                  <span className="truncate block">{row.nome ?? "—"}</span>
                </td>
                <td className="px-3 py-2.5 text-neutral-600">{row.tipo ?? "—"}</td>
                <td className="px-3 py-2.5 text-right font-mono text-sm">{formatCurrency(row.saldoCusteio)}</td>
                <td className="px-3 py-2.5 text-right font-mono text-sm">{formatCurrency(row.saldoCapital)}</td>
                <td className={`px-3 py-2.5 text-right font-mono font-black text-sm rounded ${heatCls}`}>
                  {formatCurrency(row.saldoGeral ?? 0)}
                </td>
                <td className="px-3 py-2.5 text-right">
                  <div className="inline-flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-neutral-200">
                      <div
                        className={`h-1.5 rounded-full ${
                          (row.pct ?? 0) > 80 ? "bg-emerald-500" :
                          (row.pct ?? 0) >= 50 ? "bg-amber-400" : "bg-red-500"
                        }`}
                        style={{ width: `${row.pct ?? 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-neutral-700">{row.pct}%</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-center">
                  <AlertaBadge nivel={row.alerta as "regular" | "atencao" | "critico"} />
                </td>
                <td className="px-2 py-2.5 text-right">
                  <Link
                    href={`/gestao-recursos/unidade/${row.id}`}
                    className="text-xs font-bold text-primary-700 hover:underline"
                  >
                    →
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
