"use client";

import { useMemo, useState } from "react";
import { Save, TrendingDown, TrendingUp } from "lucide-react";
import type { PddeBalance, PddeProgram } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type RowState = {
  programId: string;
  saldoAnteriorC: number;
  saldoAnteriorK: number;
  valorCreditadoC: number;
  valorCreditadoK: number;
  rendimentoC: number;
  rendimentoK: number;
  valorGastoC: number;
  valorGastoK: number;
};

function emptyRow(programId: string, schoolUnitId: string, year: number): PddeBalance {
  return {
    schoolUnitId,
    programId,
    exerciseYear: year,
    saldoAnteriorC: 0, saldoAnteriorK: 0,
    valorCreditadoC: 0, valorCreditadoK: 0,
    rendimentoC: 0, rendimentoK: 0,
    valorGastoC: 0, valorGastoK: 0
  };
}

function saldoFinal(row: RowState) {
  const c = row.saldoAnteriorC + row.valorCreditadoC + row.rendimentoC - row.valorGastoC;
  const k = row.saldoAnteriorK + row.valorCreditadoK + row.rendimentoK - row.valorGastoK;
  return { c, k, total: c + k };
}

function groupTotal(rows: RowState[]) {
  return rows.reduce(
    (acc, r) => {
      const sf = saldoFinal(r);
      return {
        saldoAnteriorC: acc.saldoAnteriorC + r.saldoAnteriorC,
        saldoAnteriorK: acc.saldoAnteriorK + r.saldoAnteriorK,
        valorCreditadoC: acc.valorCreditadoC + r.valorCreditadoC,
        valorCreditadoK: acc.valorCreditadoK + r.valorCreditadoK,
        rendimentoC: acc.rendimentoC + r.rendimentoC,
        rendimentoK: acc.rendimentoK + r.rendimentoK,
        valorGastoC: acc.valorGastoC + r.valorGastoC,
        valorGastoK: acc.valorGastoK + r.valorGastoK,
        saldoFinalC: acc.saldoFinalC + sf.c,
        saldoFinalK: acc.saldoFinalK + sf.k,
        total: acc.total + sf.total
      };
    },
    { saldoAnteriorC: 0, saldoAnteriorK: 0, valorCreditadoC: 0, valorCreditadoK: 0, rendimentoC: 0, rendimentoK: 0, valorGastoC: 0, valorGastoK: 0, saldoFinalC: 0, saldoFinalK: 0, total: 0 }
  );
}

const fmt = (v: number) => formatCurrency(v);
const numCls = "w-full rounded border border-neutral-200 bg-white px-1.5 py-1 text-right text-xs font-semibold text-neutral-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-300";
const cellCls = "px-2 py-1.5 text-right text-xs font-semibold";
const groupColors: Record<string, string> = {
  "PDDE": "bg-blue-700",
  "QUALIDADE": "bg-emerald-700",
  "PDDE ESTRUTURA": "bg-amber-700",
  "PDDE-INTEGRAL": "bg-purple-700"
};

type Props = {
  programs: PddeProgram[];
  initialBalances: PddeBalance[];
  schoolUnitId: string;
  year: number;
  saveAction: (formData: FormData) => Promise<void>;
  saved?: boolean;
};

export function PddeGrid({ programs, initialBalances, schoolUnitId, year, saveAction, saved }: Props) {
  const [rows, setRows] = useState<Record<string, RowState>>(() => {
    const map: Record<string, RowState> = {};
    for (const p of programs) {
      const bal = initialBalances.find((b) => b.programId === p.id) ?? emptyRow(p.id, schoolUnitId, year);
      map[p.id] = {
        programId: p.id,
        saldoAnteriorC: bal.saldoAnteriorC,
        saldoAnteriorK: bal.saldoAnteriorK,
        valorCreditadoC: bal.valorCreditadoC,
        valorCreditadoK: bal.valorCreditadoK,
        rendimentoC: bal.rendimentoC,
        rendimentoK: bal.rendimentoK,
        valorGastoC: bal.valorGastoC,
        valorGastoK: bal.valorGastoK
      };
    }
    return map;
  });

  const [saving, setSaving] = useState(false);

  const groups = useMemo(() => {
    const map = new Map<string, PddeProgram[]>();
    for (const p of programs) {
      const list = map.get(p.groupName) ?? [];
      list.push(p);
      map.set(p.groupName, list);
    }
    return map;
  }, [programs]);

  function update(programId: string, field: keyof RowState, value: number) {
    setRows((prev) => ({ ...prev, [programId]: { ...prev[programId], [field]: isNaN(value) ? 0 : value } }));
  }

  const grandTotal = useMemo(() => {
    const allRows = Object.values(rows);
    return groupTotal(allRows);
  }, [rows]);

  const serialized = JSON.stringify(
    Object.values(rows).map((r) => ({
      schoolUnitId,
      programId: r.programId,
      exerciseYear: year,
      saldoAnteriorC: r.saldoAnteriorC,
      saldoAnteriorK: r.saldoAnteriorK,
      valorCreditadoC: r.valorCreditadoC,
      valorCreditadoK: r.valorCreditadoK,
      rendimentoC: r.rendimentoC,
      rendimentoK: r.rendimentoK,
      valorGastoC: r.valorGastoC,
      valorGastoK: r.valorGastoK
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
      <input type="hidden" name="data" value={serialized} />
      <input type="hidden" name="schoolId" value={schoolUnitId} />
      <input type="hidden" name="year" value={year} />

      {saved && (
        <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <TrendingUp className="h-4 w-4" aria-hidden="true" />
          Dados salvos com sucesso!
        </div>
      )}

      <div className="overflow-x-auto rounded-md border border-neutral-200 shadow-card">
        <table className="min-w-[1100px] w-full border-collapse bg-white text-sm">
          <thead>
            <tr className="bg-neutral-900 text-white">
              <th className="px-3 py-2.5 text-left text-xs font-bold uppercase w-52">Programa</th>
              <th colSpan={2} className="px-2 py-2.5 text-center text-xs font-bold uppercase border-l border-neutral-700">Saldo Anterior</th>
              <th colSpan={2} className="px-2 py-2.5 text-center text-xs font-bold uppercase border-l border-neutral-700">Creditado 2026</th>
              <th colSpan={2} className="px-2 py-2.5 text-center text-xs font-bold uppercase border-l border-neutral-700">Rendimento</th>
              <th colSpan={2} className="px-2 py-2.5 text-center text-xs font-bold uppercase border-l border-neutral-700">Valor Gasto</th>
              <th colSpan={2} className="px-2 py-2.5 text-center text-xs font-bold uppercase border-l border-neutral-700 bg-slate-700">Saldo Final</th>
              <th className="px-2 py-2.5 text-center text-xs font-bold uppercase border-l border-neutral-700 bg-slate-700">Total C+K</th>
            </tr>
            <tr className="bg-neutral-800 text-neutral-300">
              <th className="px-3 py-1.5 text-left text-xs"></th>
              {["Saldo Ant.", "Creditado", "Rendimento", "Gasto"].map((g) => (
                <>
                  <th key={`${g}-c`} className="px-2 py-1.5 text-center text-xs border-l border-neutral-700 w-24">C</th>
                  <th key={`${g}-k`} className="px-2 py-1.5 text-center text-xs w-24">K</th>
                </>
              ))}
              <th className="px-2 py-1.5 text-center text-xs border-l border-neutral-700 w-24 bg-slate-700">C</th>
              <th className="px-2 py-1.5 text-center text-xs w-24 bg-slate-700">K</th>
              <th className="px-2 py-1.5 text-center text-xs border-l border-neutral-700 w-24 bg-slate-700"></th>
            </tr>
          </thead>
          <tbody>
            {Array.from(groups.entries()).map(([groupName, groupPrograms]) => {
              const groupRows = groupPrograms.map((p) => rows[p.id]).filter(Boolean);
              const gt = groupTotal(groupRows);
              const color = groupColors[groupName] ?? "bg-slate-700";

              return (
                <>
                  <tr key={`group-${groupName}`} className={`${color} text-white`}>
                    <td colSpan={12} className="px-3 py-1.5 text-xs font-black uppercase tracking-wide">
                      {groupName}
                    </td>
                  </tr>
                  {groupPrograms.map((program) => {
                    const row = rows[program.id];
                    if (!row) return null;
                    const sf = saldoFinal(row);
                    const saldoNegativo = sf.c < 0 || sf.k < 0;

                    return (
                      <tr key={program.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="px-3 py-1.5 text-xs font-semibold text-neutral-700 w-52">{program.programName}</td>
                        <td className="px-2 py-1 border-l border-neutral-100">
                          <input type="number" step="0.01" min="0" value={row.saldoAnteriorC || ""} placeholder="0,00"
                            onChange={(e) => update(program.id, "saldoAnteriorC", parseFloat(e.target.value))}
                            className={numCls} />
                        </td>
                        <td className="px-2 py-1">
                          <input type="number" step="0.01" min="0" value={row.saldoAnteriorK || ""} placeholder="0,00"
                            onChange={(e) => update(program.id, "saldoAnteriorK", parseFloat(e.target.value))}
                            className={numCls} />
                        </td>
                        <td className="px-2 py-1 border-l border-neutral-100">
                          <input type="number" step="0.01" min="0" value={row.valorCreditadoC || ""} placeholder="0,00"
                            onChange={(e) => update(program.id, "valorCreditadoC", parseFloat(e.target.value))}
                            className={numCls} />
                        </td>
                        <td className="px-2 py-1">
                          <input type="number" step="0.01" min="0" value={row.valorCreditadoK || ""} placeholder="0,00"
                            onChange={(e) => update(program.id, "valorCreditadoK", parseFloat(e.target.value))}
                            className={numCls} />
                        </td>
                        <td className="px-2 py-1 border-l border-neutral-100">
                          <input type="number" step="0.01" min="0" value={row.rendimentoC || ""} placeholder="0,00"
                            onChange={(e) => update(program.id, "rendimentoC", parseFloat(e.target.value))}
                            className={numCls} />
                        </td>
                        <td className="px-2 py-1">
                          <input type="number" step="0.01" min="0" value={row.rendimentoK || ""} placeholder="0,00"
                            onChange={(e) => update(program.id, "rendimentoK", parseFloat(e.target.value))}
                            className={numCls} />
                        </td>
                        <td className="px-2 py-1 border-l border-neutral-100">
                          <input type="number" step="0.01" min="0" value={row.valorGastoC || ""} placeholder="0,00"
                            onChange={(e) => update(program.id, "valorGastoC", parseFloat(e.target.value))}
                            className={numCls} />
                        </td>
                        <td className="px-2 py-1">
                          <input type="number" step="0.01" min="0" value={row.valorGastoK || ""} placeholder="0,00"
                            onChange={(e) => update(program.id, "valorGastoK", parseFloat(e.target.value))}
                            className={numCls} />
                        </td>
                        <td className={`${cellCls} border-l border-neutral-100 ${sf.c < 0 ? "text-red-600" : "text-emerald-700"}`}>
                          {fmt(sf.c)}
                        </td>
                        <td className={`${cellCls} ${sf.k < 0 ? "text-red-600" : "text-emerald-700"}`}>
                          {fmt(sf.k)}
                        </td>
                        <td className={`${cellCls} border-l border-neutral-100 font-bold ${saldoNegativo ? "text-red-700" : "text-emerald-800"}`}>
                          {fmt(sf.total)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr key={`total-${groupName}`} className="border-b-2 border-neutral-300 bg-neutral-50 font-bold">
                    <td className="px-3 py-1.5 text-xs font-black text-neutral-700 uppercase">Total {groupName}</td>
                    <td className={`${cellCls} border-l border-neutral-100 text-neutral-700`}>{fmt(gt.saldoAnteriorC)}</td>
                    <td className={`${cellCls} text-neutral-700`}>{fmt(gt.saldoAnteriorK)}</td>
                    <td className={`${cellCls} border-l border-neutral-100 text-neutral-700`}>{fmt(gt.valorCreditadoC)}</td>
                    <td className={`${cellCls} text-neutral-700`}>{fmt(gt.valorCreditadoK)}</td>
                    <td className={`${cellCls} border-l border-neutral-100 text-neutral-700`}>{fmt(gt.rendimentoC)}</td>
                    <td className={`${cellCls} text-neutral-700`}>{fmt(gt.rendimentoK)}</td>
                    <td className={`${cellCls} border-l border-neutral-100 text-neutral-700`}>{fmt(gt.valorGastoC)}</td>
                    <td className={`${cellCls} text-neutral-700`}>{fmt(gt.valorGastoK)}</td>
                    <td className={`${cellCls} border-l border-neutral-100 ${gt.saldoFinalC < 0 ? "text-red-700" : "text-emerald-700"}`}>{fmt(gt.saldoFinalC)}</td>
                    <td className={`${cellCls} ${gt.saldoFinalK < 0 ? "text-red-700" : "text-emerald-700"}`}>{fmt(gt.saldoFinalK)}</td>
                    <td className={`${cellCls} border-l border-neutral-100 font-black ${gt.total < 0 ? "text-red-800" : "text-emerald-800"}`}>{fmt(gt.total)}</td>
                  </tr>
                </>
              );
            })}

            {/* Grand total */}
            <tr className="bg-neutral-900 text-white font-black">
              <td className="px-3 py-2 text-xs uppercase">Total Geral</td>
              <td className={`${cellCls} border-l border-neutral-700`}>{fmt(grandTotal.saldoAnteriorC)}</td>
              <td className={cellCls}>{fmt(grandTotal.saldoAnteriorK)}</td>
              <td className={`${cellCls} border-l border-neutral-700`}>{fmt(grandTotal.valorCreditadoC)}</td>
              <td className={cellCls}>{fmt(grandTotal.valorCreditadoK)}</td>
              <td className={`${cellCls} border-l border-neutral-700`}>{fmt(grandTotal.rendimentoC)}</td>
              <td className={cellCls}>{fmt(grandTotal.rendimentoK)}</td>
              <td className={`${cellCls} border-l border-neutral-700`}>{fmt(grandTotal.valorGastoC)}</td>
              <td className={cellCls}>{fmt(grandTotal.valorGastoK)}</td>
              <td className={`${cellCls} border-l border-neutral-700`}>{fmt(grandTotal.saldoFinalC)}</td>
              <td className={cellCls}>{fmt(grandTotal.saldoFinalK)}</td>
              <td className={`${cellCls} border-l border-neutral-700 text-amber-300`}>{fmt(grandTotal.total)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between rounded-md border border-neutral-200 bg-white p-4 shadow-card">
        <div className="flex items-center gap-3">
          {grandTotal.total >= 0 ? (
            <TrendingUp className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-600" aria-hidden="true" />
          )}
          <div>
            <p className="text-xs font-bold uppercase text-neutral-500">Saldo final consolidado</p>
            <p className={`text-lg font-black ${grandTotal.total < 0 ? "text-red-700" : "text-emerald-700"}`}>
              {fmt(grandTotal.total)}
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
