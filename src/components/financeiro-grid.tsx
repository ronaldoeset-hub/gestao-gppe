"use client";

import { Fragment, useMemo, useState } from "react";
import { Save, TrendingDown, TrendingUp } from "lucide-react";
import type { FinanceiroBalance } from "@/lib/types";
import type { BlocoPrograma } from "@/data/financeiro";
import { BLOCO_COLORS } from "@/data/financeiro";
import { formatCurrency } from "@/lib/utils";

type RowState = {
  programaCodigo: string;
  saldoAnteriorC: number;
  saldoAnteriorK: number;
  valorCreditadoC: number;
  valorCreditadoK: number;
  rendimentoC: number;
  rendimentoK: number;
  valorGastoC: number;
  valorGastoK: number;
};

function saldoFinal(row: RowState) {
  const c = row.saldoAnteriorC + row.valorCreditadoC + row.rendimentoC - row.valorGastoC;
  const k = row.saldoAnteriorK + row.valorCreditadoK + row.rendimentoK - row.valorGastoK;
  return { c, k, total: c + k };
}

function blocoTotal(rows: RowState[]) {
  return rows.reduce(
    (acc, r) => {
      const sf = saldoFinal(r);
      return {
        saldoAnteriorC:  acc.saldoAnteriorC  + r.saldoAnteriorC,
        saldoAnteriorK:  acc.saldoAnteriorK  + r.saldoAnteriorK,
        valorCreditadoC: acc.valorCreditadoC + r.valorCreditadoC,
        valorCreditadoK: acc.valorCreditadoK + r.valorCreditadoK,
        rendimentoC:     acc.rendimentoC     + r.rendimentoC,
        rendimentoK:     acc.rendimentoK     + r.rendimentoK,
        valorGastoC:     acc.valorGastoC     + r.valorGastoC,
        valorGastoK:     acc.valorGastoK     + r.valorGastoK,
        saldoFinalC:     acc.saldoFinalC     + sf.c,
        saldoFinalK:     acc.saldoFinalK     + sf.k,
        total:           acc.total           + sf.total
      };
    },
    {
      saldoAnteriorC: 0, saldoAnteriorK: 0,
      valorCreditadoC: 0, valorCreditadoK: 0,
      rendimentoC: 0, rendimentoK: 0,
      valorGastoC: 0, valorGastoK: 0,
      saldoFinalC: 0, saldoFinalK: 0, total: 0
    }
  );
}

const numCls = "w-full rounded border border-neutral-200 bg-white px-1.5 py-1 text-right text-xs font-semibold text-neutral-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-300";
const cellCls = "px-2 py-1.5 text-right text-xs font-semibold";

type Props = {
  catalogo: BlocoPrograma[];
  initialBalances: FinanceiroBalance[];
  schoolUnitId: string;
  schoolName: string;
  year: number;
  updatedAt?: string;
  saveAction: (formData: FormData) => Promise<void>;
  saved?: boolean;
};

export function FinanceiroGrid({
  catalogo,
  initialBalances,
  schoolUnitId,
  schoolName,
  year,
  updatedAt,
  saveAction,
  saved
}: Props) {
  const [rows, setRows] = useState<Record<string, RowState>>(() => {
    const map: Record<string, RowState> = {};
    for (const bloco of catalogo) {
      for (const p of bloco.programas) {
        const bal = initialBalances.find((b) => b.programaCodigo === p.codigo);
        map[p.codigo] = {
          programaCodigo:  p.codigo,
          saldoAnteriorC:  bal?.saldoAnteriorC  ?? 0,
          saldoAnteriorK:  bal?.saldoAnteriorK  ?? 0,
          valorCreditadoC: bal?.valorCreditadoC ?? 0,
          valorCreditadoK: bal?.valorCreditadoK ?? 0,
          rendimentoC:     bal?.rendimentoC     ?? 0,
          rendimentoK:     bal?.rendimentoK     ?? 0,
          valorGastoC:     bal?.valorGastoC     ?? 0,
          valorGastoK:     bal?.valorGastoK     ?? 0
        };
      }
    }
    return map;
  });

  const [saving, setSaving] = useState(false);

  function update(codigo: string, field: keyof RowState, raw: string) {
    const value = parseFloat(raw);
    setRows((prev) => ({
      ...prev,
      [codigo]: { ...prev[codigo], [field]: isNaN(value) ? 0 : value }
    }));
  }

  const grandTotal = useMemo(() => {
    return blocoTotal(Object.values(rows));
  }, [rows]);

  const serialized = JSON.stringify(
    Object.values(rows).map((r) => ({
      schoolUnitId,
      programaCodigo:  r.programaCodigo,
      exerciseYear:    year,
      saldoAnteriorC:  r.saldoAnteriorC,
      saldoAnteriorK:  r.saldoAnteriorK,
      valorCreditadoC: r.valorCreditadoC,
      valorCreditadoK: r.valorCreditadoK,
      rendimentoC:     r.rendimentoC,
      rendimentoK:     r.rendimentoK,
      valorGastoC:     r.valorGastoC,
      valorGastoK:     r.valorGastoK
    }))
  );

  return (
    <form
      action={async (fd) => {
        setSaving(true);
        await saveAction(fd);
        setSaving(false);
      }}
      className="space-y-4"
    >
      <input type="hidden" name="data"     value={serialized} />
      <input type="hidden" name="schoolId" value={schoolUnitId} />
      <input type="hidden" name="year"     value={year} />

      {/* cabeçalho estilo planilha */}
      <div className="rounded-md border border-neutral-200 bg-white px-5 py-4 shadow-card">
        <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Controle Financeiro das Escolas</p>
        <p className="mt-1 text-lg font-black text-neutral-900">{schoolName}</p>
        <div className="mt-1 flex flex-wrap gap-4 text-xs text-neutral-500 font-semibold">
          <span>Exercício {year}</span>
          {updatedAt && <span>Atualizado em {new Date(updatedAt).toLocaleDateString("pt-BR")}</span>}
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <TrendingUp className="h-4 w-4" aria-hidden="true" />
          Dados salvos com sucesso!
        </div>
      )}

      <div className="overflow-x-auto rounded-md border border-neutral-200 shadow-card">
        <table className="min-w-[1120px] w-full border-collapse bg-white text-sm">
          <thead>
            <tr className="bg-neutral-900 text-white">
              <th className="px-3 py-2.5 text-left text-xs font-bold uppercase w-52">Programa / Ação</th>
              <th colSpan={2} className="px-2 py-2.5 text-center text-xs font-bold uppercase border-l border-neutral-700">Saldo Anterior</th>
              <th colSpan={2} className="px-2 py-2.5 text-center text-xs font-bold uppercase border-l border-neutral-700">Creditado {year}</th>
              <th colSpan={2} className="px-2 py-2.5 text-center text-xs font-bold uppercase border-l border-neutral-700">Rendimento</th>
              <th colSpan={2} className="px-2 py-2.5 text-center text-xs font-bold uppercase border-l border-neutral-700">Valor Gasto</th>
              <th colSpan={2} className="px-2 py-2.5 text-center text-xs font-bold uppercase border-l border-neutral-700 bg-slate-700">Saldo Final</th>
              <th className="px-2 py-2.5 text-center text-xs font-bold uppercase border-l border-neutral-700 bg-slate-700">Total C+K</th>
            </tr>
            <tr className="bg-neutral-800 text-neutral-300 text-xs">
              <th className="px-3 py-1.5 text-left"></th>
              {["Saldo Ant.", "Creditado", "Rendimento", "Gasto"].map((g) => (
                <Fragment key={g}>
                  <th className="px-2 py-1.5 text-center border-l border-neutral-700 w-24">C</th>
                  <th className="px-2 py-1.5 text-center w-24">K</th>
                </Fragment>
              ))}
              <th className="px-2 py-1.5 text-center border-l border-neutral-700 w-24 bg-slate-700">C</th>
              <th className="px-2 py-1.5 text-center w-24 bg-slate-700">K</th>
              <th className="px-2 py-1.5 text-center border-l border-neutral-700 w-28 bg-slate-700"></th>
            </tr>
          </thead>
          <tbody>
            {catalogo.map((bloco) => {
              const blocoRows = bloco.programas.map((p) => rows[p.codigo]).filter(Boolean);
              const bt = blocoTotal(blocoRows);
              const color = BLOCO_COLORS[bloco.bloco] ?? "bg-slate-700";

              return (
                <Fragment key={bloco.bloco}>
                  <tr className={`${color} text-white`}>
                    <td colSpan={12} className="px-3 py-1.5 text-xs font-black uppercase tracking-wide">
                      {bloco.bloco}
                    </td>
                  </tr>

                  {bloco.programas.map((p) => {
                    const row = rows[p.codigo];
                    if (!row) return null;
                    const sf = saldoFinal(row);

                    return (
                      <tr key={p.codigo} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="px-3 py-1.5 text-xs font-semibold text-neutral-700 w-52">{p.label}</td>

                        <td className="px-2 py-1 border-l border-neutral-100">
                          <input type="number" step="0.01" min="0" value={row.saldoAnteriorC || ""}  placeholder="0,00"
                            onChange={(e) => update(p.codigo, "saldoAnteriorC",  e.target.value)} className={numCls} />
                        </td>
                        <td className="px-2 py-1">
                          <input type="number" step="0.01" min="0" value={row.saldoAnteriorK || ""}  placeholder="0,00"
                            onChange={(e) => update(p.codigo, "saldoAnteriorK",  e.target.value)} className={numCls} />
                        </td>
                        <td className="px-2 py-1 border-l border-neutral-100">
                          <input type="number" step="0.01" min="0" value={row.valorCreditadoC || ""} placeholder="0,00"
                            onChange={(e) => update(p.codigo, "valorCreditadoC", e.target.value)} className={numCls} />
                        </td>
                        <td className="px-2 py-1">
                          <input type="number" step="0.01" min="0" value={row.valorCreditadoK || ""} placeholder="0,00"
                            onChange={(e) => update(p.codigo, "valorCreditadoK", e.target.value)} className={numCls} />
                        </td>
                        <td className="px-2 py-1 border-l border-neutral-100">
                          <input type="number" step="0.01" min="0" value={row.rendimentoC || ""}     placeholder="0,00"
                            onChange={(e) => update(p.codigo, "rendimentoC",     e.target.value)} className={numCls} />
                        </td>
                        <td className="px-2 py-1">
                          <input type="number" step="0.01" min="0" value={row.rendimentoK || ""}     placeholder="0,00"
                            onChange={(e) => update(p.codigo, "rendimentoK",     e.target.value)} className={numCls} />
                        </td>
                        <td className="px-2 py-1 border-l border-neutral-100">
                          <input type="number" step="0.01" min="0" value={row.valorGastoC || ""}     placeholder="0,00"
                            onChange={(e) => update(p.codigo, "valorGastoC",     e.target.value)} className={numCls} />
                        </td>
                        <td className="px-2 py-1">
                          <input type="number" step="0.01" min="0" value={row.valorGastoK || ""}     placeholder="0,00"
                            onChange={(e) => update(p.codigo, "valorGastoK",     e.target.value)} className={numCls} />
                        </td>
                        <td className={`${cellCls} border-l border-neutral-100 ${sf.c < 0 ? "text-red-600" : "text-emerald-700"}`}>
                          {formatCurrency(sf.c)}
                        </td>
                        <td className={`${cellCls} ${sf.k < 0 ? "text-red-600" : "text-emerald-700"}`}>
                          {formatCurrency(sf.k)}
                        </td>
                        <td className={`${cellCls} border-l border-neutral-100 font-bold ${sf.total < 0 ? "text-red-700" : "text-emerald-800"}`}>
                          {formatCurrency(sf.total)}
                        </td>
                      </tr>
                    );
                  })}

                  {/* subtotal do bloco */}
                  <tr className="border-b-2 border-neutral-300 bg-neutral-50 font-bold">
                    <td className="px-3 py-1.5 text-xs font-black text-neutral-700 uppercase">Total {bloco.bloco}</td>
                    <td className={`${cellCls} border-l border-neutral-100 text-neutral-700`}>{formatCurrency(bt.saldoAnteriorC)}</td>
                    <td className={`${cellCls} text-neutral-700`}>{formatCurrency(bt.saldoAnteriorK)}</td>
                    <td className={`${cellCls} border-l border-neutral-100 text-neutral-700`}>{formatCurrency(bt.valorCreditadoC)}</td>
                    <td className={`${cellCls} text-neutral-700`}>{formatCurrency(bt.valorCreditadoK)}</td>
                    <td className={`${cellCls} border-l border-neutral-100 text-neutral-700`}>{formatCurrency(bt.rendimentoC)}</td>
                    <td className={`${cellCls} text-neutral-700`}>{formatCurrency(bt.rendimentoK)}</td>
                    <td className={`${cellCls} border-l border-neutral-100 text-neutral-700`}>{formatCurrency(bt.valorGastoC)}</td>
                    <td className={`${cellCls} text-neutral-700`}>{formatCurrency(bt.valorGastoK)}</td>
                    <td className={`${cellCls} border-l border-neutral-100 ${bt.saldoFinalC < 0 ? "text-red-700" : "text-emerald-700"}`}>{formatCurrency(bt.saldoFinalC)}</td>
                    <td className={`${cellCls} ${bt.saldoFinalK < 0 ? "text-red-700" : "text-emerald-700"}`}>{formatCurrency(bt.saldoFinalK)}</td>
                    <td className={`${cellCls} border-l border-neutral-100 font-black ${bt.total < 0 ? "text-red-800" : "text-emerald-800"}`}>{formatCurrency(bt.total)}</td>
                  </tr>
                </Fragment>
              );
            })}

            {/* total geral */}
            <tr className="bg-neutral-900 text-white font-black">
              <td className="px-3 py-2 text-xs uppercase">Total Geral</td>
              <td className={`${cellCls} border-l border-neutral-700`}>{formatCurrency(grandTotal.saldoAnteriorC)}</td>
              <td className={cellCls}>{formatCurrency(grandTotal.saldoAnteriorK)}</td>
              <td className={`${cellCls} border-l border-neutral-700`}>{formatCurrency(grandTotal.valorCreditadoC)}</td>
              <td className={cellCls}>{formatCurrency(grandTotal.valorCreditadoK)}</td>
              <td className={`${cellCls} border-l border-neutral-700`}>{formatCurrency(grandTotal.rendimentoC)}</td>
              <td className={cellCls}>{formatCurrency(grandTotal.rendimentoK)}</td>
              <td className={`${cellCls} border-l border-neutral-700`}>{formatCurrency(grandTotal.valorGastoC)}</td>
              <td className={cellCls}>{formatCurrency(grandTotal.valorGastoK)}</td>
              <td className={`${cellCls} border-l border-neutral-700`}>{formatCurrency(grandTotal.saldoFinalC)}</td>
              <td className={cellCls}>{formatCurrency(grandTotal.saldoFinalK)}</td>
              <td className={`${cellCls} border-l border-neutral-700 text-amber-300`}>{formatCurrency(grandTotal.total)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* rodapé com saldo consolidado + botão salvar */}
      <div className="flex items-center justify-between rounded-md border border-neutral-200 bg-white p-4 shadow-card">
        <div className="flex items-center gap-3">
          {grandTotal.total >= 0 ? (
            <TrendingUp  className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-600"    aria-hidden="true" />
          )}
          <div>
            <p className="text-xs font-bold uppercase text-neutral-500">Saldo final consolidado</p>
            <p className={`text-lg font-black ${grandTotal.total < 0 ? "text-red-700" : "text-emerald-700"}`}>
              {formatCurrency(grandTotal.total)}
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary-700 px-5 text-sm font-black text-white hover:bg-primary-800 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {saving ? "Salvando..." : "Salvar dados"}
        </button>
      </div>
    </form>
  );
}
