"use client";

import { useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import { calcularFinanceiro } from "@/data/gestao-recursos";
import type { FinanceiroUnidade, GestaoPrograma } from "@/lib/types";

type Props = {
  registros: FinanceiroUnidade[];
  unidades: Array<{ id: string; name: string }>;
  programas: GestaoPrograma[];
};

function BarChart({ items, max }: { items: { label: string; value: number; color: string }[]; max: number }) {
  if (!items.length) return <p className="text-sm text-neutral-500">Sem dados para exibir.</p>;
  return (
    <div className="space-y-2">
      {items.map((item) => {
        const pct = max > 0 ? Math.max(0, Math.min(100, (item.value / max) * 100)) : 0;
        return (
          <div key={item.label}>
            <div className="flex items-center justify-between gap-3 text-xs font-semibold text-neutral-700 mb-1">
              <span className="truncate max-w-[55%]">{item.label}</span>
              <span className={item.value < 0 ? "text-red-600" : "text-neutral-700"}>{formatCurrency(item.value)}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-neutral-100">
              <div
                className={`h-2 rounded-full ${item.color}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function GestaoRecursosGraficos({ registros, unidades, programas }: Props) {
  const byUnit = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of registros) {
      const c = calcularFinanceiro(r);
      map.set(r.unidadeId, (map.get(r.unidadeId) ?? 0) + c.saldoGeral);
    }
    const items = unidades
      .filter((u) => map.has(u.id))
      .map((u) => ({ label: u.name, value: map.get(u.id) ?? 0, color: "bg-blue-500" }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
    return { items, max: Math.max(...items.map((i) => Math.abs(i.value)), 1) };
  }, [registros, unidades]);

  const byPrograma = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of registros) {
      const c = calcularFinanceiro(r);
      map.set(r.programaId, (map.get(r.programaId) ?? 0) + c.saldoGeral);
    }
    const items = programas
      .filter((p) => map.has(p.id))
      .map((p) => ({ label: p.nome, value: map.get(p.id) ?? 0, color: "bg-emerald-500" }))
      .sort((a, b) => b.value - a.value);
    return { items, max: Math.max(...items.map((i) => Math.abs(i.value)), 1) };
  }, [registros, programas]);

  const distribuicao = useMemo(() => {
    const totC = registros.reduce((a, r) => a + calcularFinanceiro(r).saldoFinalCusteio, 0);
    const totK = registros.reduce((a, r) => a + calcularFinanceiro(r).saldoFinalCapital, 0);
    const total = totC + totK;
    return { custeio: totC, capital: totK, total };
  }, [registros]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-md border border-neutral-200 bg-white p-5 shadow-card">
        <h3 className="mb-4 text-sm font-black text-neutral-800">Saldo por Unidade (Top 10)</h3>
        <BarChart items={byUnit.items} max={byUnit.max} />
      </div>

      <div className="rounded-md border border-neutral-200 bg-white p-5 shadow-card">
        <h3 className="mb-4 text-sm font-black text-neutral-800">Saldo por Programa</h3>
        <BarChart items={byPrograma.items} max={byPrograma.max} />
      </div>

      <div className="rounded-md border border-neutral-200 bg-white p-5 shadow-card">
        <h3 className="mb-4 text-sm font-black text-neutral-800">Distribuição Custeio × Capital</h3>
        {distribuicao.total === 0 ? (
          <p className="text-sm text-neutral-500">Sem saldo para distribuir.</p>
        ) : (
          <div className="space-y-4">
            {[
              { label: "Custeio", value: distribuicao.custeio, color: "bg-blue-500" },
              { label: "Capital", value: distribuicao.capital, color: "bg-purple-500" }
            ].map((item) => {
              const pct = distribuicao.total !== 0
                ? Math.round((Math.abs(item.value) / Math.abs(distribuicao.total)) * 100)
                : 0;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                    <span>{item.label}</span>
                    <span>{pct}% · {formatCurrency(item.value)}</span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-neutral-100">
                    <div className={`h-4 rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            <p className="pt-1 text-xs text-neutral-500">
              Total: {formatCurrency(distribuicao.total)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
