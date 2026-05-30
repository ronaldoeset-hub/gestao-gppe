"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { ArrowRight, ArrowUpDown, Download, Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { calcularFinanceiro } from "@/data/gestao-recursos";
import type { FinanceiroUnidade } from "@/lib/types";

type UnidadeRow = {
  id: string;
  nome: string;
  tipo: string;
  saldoCusteio: number;
  saldoCapital: number;
  saldoGeral: number;
};

type Props = {
  registros: FinanceiroUnidade[];
  unidades: Array<{ id: string; name: string; type: string }>;
};

const PAGE_SIZE = 20;

export function GestaoRecursosTabela({ registros, unidades }: Props) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"saldoGeral" | "saldoCusteio" | "saldoCapital">("saldoGeral");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);

  const rows = useMemo<UnidadeRow[]>(() => {
    const byUnit = new Map<string, FinanceiroUnidade[]>();
    for (const r of registros) {
      const list = byUnit.get(r.unidadeId) ?? [];
      list.push(r);
      byUnit.set(r.unidadeId, list);
    }

    const result: UnidadeRow[] = [];
    for (const u of unidades) {
      const regs = byUnit.get(u.id) ?? [];
      if (!regs.length) continue;
      const agg = regs.reduce(
        (acc, r) => {
          const c = calcularFinanceiro(r);
          return {
            saldoCusteio: acc.saldoCusteio + c.saldoFinalCusteio,
            saldoCapital: acc.saldoCapital + c.saldoFinalCapital,
            saldoGeral:   acc.saldoGeral   + c.saldoGeral
          };
        },
        { saldoCusteio: 0, saldoCapital: 0, saldoGeral: 0 }
      );
      result.push({ id: u.id, nome: u.name, tipo: u.type, ...agg });
    }
    return result;
  }, [registros, unidades]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows
      .filter((r) => !q || r.nome.toLowerCase().includes(q))
      .sort((a, b) => {
        const diff = a[sortField] - b[sortField];
        return sortAsc ? diff : -diff;
      });
  }, [rows, search, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(field: typeof sortField) {
    if (sortField === field) setSortAsc((v) => !v);
    else { setSortField(field); setSortAsc(false); }
  }

  function exportCSV() {
    const header = "Unidade,Tipo,Saldo Custeio,Saldo Capital,Saldo Geral";
    const body = filtered
      .map((r) => `"${r.nome}","${r.tipo}",${r.saldoCusteio},${r.saldoCapital},${r.saldoGeral}`)
      .join("\n");
    const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "gestao-recursos.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const thCls = "px-4 py-3 text-left text-xs font-bold uppercase text-neutral-500";
  const tdCls = "px-4 py-3 text-sm text-neutral-700";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            placeholder="Buscar unidade..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="h-10 w-full rounded-md border border-neutral-300 bg-white pl-9 pr-3 text-sm font-semibold text-neutral-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Exportar CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-md border border-neutral-200 shadow-card">
        <table className="w-full border-collapse bg-white text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className={thCls}>Unidade</th>
              <th className={thCls}>Tipo</th>
              {(["saldoCusteio", "saldoCapital", "saldoGeral"] as const).map((f) => (
                <th key={f} className={thCls}>
                  <button
                    type="button"
                    onClick={() => toggleSort(f)}
                    className="inline-flex items-center gap-1 hover:text-neutral-800"
                  >
                    {f === "saldoCusteio" ? "Saldo Custeio" : f === "saldoCapital" ? "Saldo Capital" : "Saldo Geral"}
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
              ))}
              <th className={thCls}></th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-neutral-500">
                  Nenhuma unidade com registros financeiros para os filtros selecionados.
                </td>
              </tr>
            ) : paginated.map((row) => (
              <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className={`${tdCls} font-semibold text-neutral-900`}>{row.nome}</td>
                <td className={tdCls}>{row.tipo}</td>
                <td className={`${tdCls} text-right font-mono`}>{formatCurrency(row.saldoCusteio)}</td>
                <td className={`${tdCls} text-right font-mono`}>{formatCurrency(row.saldoCapital)}</td>
                <td className={`${tdCls} text-right font-mono font-bold ${row.saldoGeral < 0 ? "text-red-700" : "text-emerald-700"}`}>
                  {formatCurrency(row.saldoGeral)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/gestao-recursos/unidade/${row.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary-700 hover:text-primary-900"
                  >
                    Detalhar <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-neutral-600">
          <span>{filtered.length} unidades · página {page} de {totalPages}</span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-md border border-neutral-300 px-3 py-1.5 font-semibold hover:bg-neutral-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border border-neutral-300 px-3 py-1.5 font-semibold hover:bg-neutral-50 disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
