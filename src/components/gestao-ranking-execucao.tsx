"use client";

import Link from "next/link";
import { useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import { calcularFinanceiro, classificarExecucao, EXECUCAO_CONFIG } from "@/data/gestao-recursos";
import type { FinanceiroUnidade } from "@/lib/types";

type Props = {
  registros: FinanceiroUnidade[];
  unidades: Array<{ id: string; name: string }>;
};

export function GestaoRankingExecucao({ registros, unidades }: Props) {
  const nomeMap = new Map(unidades.map((u) => [u.id, u.name]));

  const rows = useMemo(() => {
    const byUnit = new Map<string, { executado: number; totalDisp: number; saldoGeral: number }>();
    for (const r of registros) {
      const c = calcularFinanceiro(r);
      const prev = byUnit.get(r.unidadeId) ?? { executado: 0, totalDisp: 0, saldoGeral: 0 };
      byUnit.set(r.unidadeId, {
        executado: prev.executado + r.despesaCusteio + r.despesaCapital,
        totalDisp: prev.totalDisp + c.totalCusteio + c.totalCapital,
        saldoGeral: prev.saldoGeral + c.saldoGeral
      });
    }

    return Array.from(byUnit.entries())
      .filter(([, d]) => d.totalDisp > 0)
      .map(([id, d]) => ({
        id,
        nome: nomeMap.get(id) ?? id,
        executado: d.executado,
        totalDisp: d.totalDisp,
        pct: Math.min(100, Math.round((d.executado / d.totalDisp) * 100)),
        saldoGeral: d.saldoGeral
      }))
      .sort((a, b) => b.pct - a.pct);
  }, [registros, nomeMap]);

  const stats = useMemo(() => ({
    excelente: rows.filter((r) => r.pct > 80).length,
    atencao:   rows.filter((r) => r.pct >= 50 && r.pct <= 80).length,
    critico:   rows.filter((r) => r.pct < 50).length
  }), [rows]);

  return (
    <div className="space-y-4">
      {/* Summary badges */}
      <div className="flex flex-wrap gap-3">
        {(["excelente", "atencao", "critico"] as const).map((nivel) => {
          const cfg = EXECUCAO_CONFIG[nivel];
          return (
            <div key={nivel} className={`rounded-md px-4 py-2 ${cfg.bg}`}>
              <p className={`text-xs font-bold uppercase ${cfg.text}`}>{cfg.icon} {cfg.label}</p>
              <p className={`text-2xl font-black ${cfg.text}`}>{stats[nivel]}</p>
            </div>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-md border border-neutral-200 shadow-card">
        <table className="w-full border-collapse bg-white text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50">
            <tr>
              <th className="px-3 py-2.5 text-left text-xs font-bold uppercase text-neutral-500">#</th>
              <th className="px-3 py-2.5 text-left text-xs font-bold uppercase text-neutral-500">Unidade</th>
              <th className="px-3 py-2.5 text-right text-xs font-bold uppercase text-neutral-500">Total Disponível</th>
              <th className="px-3 py-2.5 text-right text-xs font-bold uppercase text-neutral-500">Executado</th>
              <th className="px-3 py-2.5 text-right text-xs font-bold uppercase text-neutral-500">Saldo</th>
              <th className="px-3 py-2.5 text-center text-xs font-bold uppercase text-neutral-500">% Execução</th>
              <th className="px-3 py-2.5 text-xs font-bold uppercase text-neutral-500"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const nivel = classificarExecucao(row.pct);
              const cfg = EXECUCAO_CONFIG[nivel];
              return (
                <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-3 py-2.5 text-xs font-black text-neutral-400">{i + 1}</td>
                  <td className="px-3 py-2.5 font-semibold text-neutral-900">{row.nome}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-sm text-neutral-700">{formatCurrency(row.totalDisp)}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-sm text-neutral-700">{formatCurrency(row.executado)}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-sm font-bold text-neutral-800">{formatCurrency(row.saldoGeral)}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-2 w-24 rounded-full bg-neutral-200">
                        <div
                          className={`h-2 rounded-full ${nivel === "excelente" ? "bg-emerald-500" : nivel === "atencao" ? "bg-amber-400" : "bg-red-500"}`}
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                      <span className={`w-10 text-right text-xs font-black ${cfg.text}`}>{row.pct}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`rounded-md px-2 py-0.5 text-xs font-black ${cfg.bg} ${cfg.text}`}>
                      {cfg.icon} {cfg.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
