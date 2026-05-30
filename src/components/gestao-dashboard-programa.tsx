"use client";

import { useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import { calcularFinanceiro } from "@/data/gestao-recursos";
import type { FinanceiroUnidade, GestaoPrograma } from "@/lib/types";

type Props = {
  registros: FinanceiroUnidade[];
  programas: GestaoPrograma[];
};

export function GestaoDashboardPrograma({ registros, programas }: Props) {
  const rows = useMemo(() => {
    const byPrograma = new Map<string, {
      totalRecebido: number; totalExecutado: number; totalSaldo: number; unidades: Set<string>;
    }>();

    for (const r of registros) {
      const c = calcularFinanceiro(r);
      const prev = byPrograma.get(r.programaId) ?? {
        totalRecebido: 0, totalExecutado: 0, totalSaldo: 0, unidades: new Set<string>()
      };
      prev.totalRecebido  += c.totalCusteio + c.totalCapital;
      prev.totalExecutado += r.despesaCusteio + r.despesaCapital;
      prev.totalSaldo     += c.saldoGeral;
      prev.unidades.add(r.unidadeId);
      byPrograma.set(r.programaId, prev);
    }

    return programas
      .filter((p) => byPrograma.has(p.id))
      .map((p) => {
        const d = byPrograma.get(p.id)!;
        const pct = d.totalRecebido > 0
          ? Math.round((d.totalExecutado / d.totalRecebido) * 100)
          : 0;
        return { ...p, ...d, unidadesCount: d.unidades.size, pct };
      })
      .sort((a, b) => b.totalSaldo - a.totalSaldo);
  }, [registros, programas]);

  if (!rows.length) {
    return <p className="py-8 text-center text-sm text-neutral-500">Nenhum dado disponível.</p>;
  }

  return (
    <div className="space-y-4">
      {/* Cards por programa */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {rows.slice(0, 4).map((p) => (
          <div key={p.id} className="rounded-md border border-neutral-200 bg-white p-4 shadow-card">
            <p className="truncate text-sm font-black text-neutral-800">{p.nome}</p>
            <p className="mt-2 text-xs text-neutral-500">Saldo total</p>
            <p className={`text-xl font-black ${p.totalSaldo < 0 ? "text-red-700" : "text-emerald-700"}`}>
              {formatCurrency(p.totalSaldo)}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-neutral-500">
              <div><span className="block font-semibold text-neutral-700">{p.unidadesCount}</span>unidades</div>
              <div><span className="block font-semibold text-neutral-700">{p.pct}%</span>executado</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabela completa */}
      <div className="overflow-x-auto rounded-md border border-neutral-200 shadow-card">
        <table className="w-full border-collapse bg-white text-sm">
          <thead className="bg-neutral-900 text-white">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-bold uppercase">Programa</th>
              <th className="px-4 py-2.5 text-right text-xs font-bold uppercase">Total Recebido</th>
              <th className="px-4 py-2.5 text-right text-xs font-bold uppercase">Total Executado</th>
              <th className="px-4 py-2.5 text-right text-xs font-bold uppercase">Saldo</th>
              <th className="px-4 py-2.5 text-center text-xs font-bold uppercase">% Exec.</th>
              <th className="px-4 py-2.5 text-center text-xs font-bold uppercase">Unidades</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-2.5 font-semibold text-neutral-800">{p.nome}</td>
                <td className="px-4 py-2.5 text-right font-mono">{formatCurrency(p.totalRecebido)}</td>
                <td className="px-4 py-2.5 text-right font-mono">{formatCurrency(p.totalExecutado)}</td>
                <td className={`px-4 py-2.5 text-right font-mono font-bold ${p.totalSaldo < 0 ? "text-red-700" : "text-emerald-700"}`}>
                  {formatCurrency(p.totalSaldo)}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <div className="inline-flex items-center gap-2">
                    <div className="h-1.5 w-20 rounded-full bg-neutral-200">
                      <div
                        className={`h-1.5 rounded-full ${p.pct > 80 ? "bg-emerald-500" : p.pct >= 50 ? "bg-amber-400" : "bg-red-500"}`}
                        style={{ width: `${p.pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-neutral-700">{p.pct}%</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-center text-xs font-bold text-neutral-600">{p.unidadesCount}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-neutral-300 bg-neutral-50 font-bold">
            <tr>
              <td className="px-4 py-2.5 text-xs font-black uppercase text-neutral-700">Total</td>
              <td className="px-4 py-2.5 text-right font-mono">{formatCurrency(rows.reduce((a, r) => a + r.totalRecebido, 0))}</td>
              <td className="px-4 py-2.5 text-right font-mono">{formatCurrency(rows.reduce((a, r) => a + r.totalExecutado, 0))}</td>
              <td className="px-4 py-2.5 text-right font-mono font-black text-emerald-700">{formatCurrency(rows.reduce((a, r) => a + r.totalSaldo, 0))}</td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
