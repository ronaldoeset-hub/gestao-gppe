"use client";

import { Download, FileSpreadsheet } from "lucide-react";
import { calcularFinanceiro, calcularAlerta, calcularPercentualExecucao } from "@/data/gestao-recursos";
import type { FinanceiroUnidade, GestaoPrograma } from "@/lib/types";

type Props = {
  registros: FinanceiroUnidade[];
  unidades: Array<{ id: string; name: string; type: string }>;
  programas: GestaoPrograma[];
  exercicio?: number;
};

export function GestaoExportar({ registros, unidades, programas, exercicio }: Props) {
  const nomeMap  = new Map(unidades.map((u) => [u.id, u.name]));
  const tipoMap  = new Map(unidades.map((u) => [u.id, u.type]));
  const progMap  = new Map(programas.map((p) => [p.id, p.nome]));

  function exportExcel() {
    import("xlsx").then(({ utils, writeFile }) => {
      const rows = registros.map((r) => {
        const c   = calcularFinanceiro(r);
        const pct = calcularPercentualExecucao(r);
        const alerta = calcularAlerta(c.saldoGeral, r.updatedAt);
        return {
          Unidade:                nomeMap.get(r.unidadeId) ?? r.unidadeId,
          Tipo:                   tipoMap.get(r.unidadeId) ?? "",
          Programa:               progMap.get(r.programaId) ?? r.programaId,
          Exercício:              r.exercicio,
          "Saldo Ant. Custeio":   r.saldoAnteriorCusteio,
          "Saldo Ant. Capital":   r.saldoAnteriorCapital,
          "Creditado Custeio":    r.creditadoCusteio,
          "Creditado Capital":    r.creditadoCapital,
          "Rendimento Custeio":   r.rendimentoCusteio,
          "Rendimento Capital":   r.rendimentoCapital,
          "Despesa Custeio":      r.despesaCusteio,
          "Despesa Capital":      r.despesaCapital,
          "Total Custeio":        c.totalCusteio,
          "Total Capital":        c.totalCapital,
          "Saldo Final Custeio":  c.saldoFinalCusteio,
          "Saldo Final Capital":  c.saldoFinalCapital,
          "Saldo Geral":          c.saldoGeral,
          "% Execução":           pct,
          Alerta:                 alerta,
          "Última Atualização":   r.updatedAt
            ? new Date(r.updatedAt).toLocaleDateString("pt-BR")
            : ""
        };
      });

      const ws = utils.json_to_sheet(rows);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Gestão de Recursos");

      const sumRow = {
        Unidade: "TOTAL GERAL",
        Tipo: "", Programa: "", Exercício: "",
        "Saldo Ant. Custeio":  registros.reduce((a, r) => a + r.saldoAnteriorCusteio, 0),
        "Saldo Ant. Capital":  registros.reduce((a, r) => a + r.saldoAnteriorCapital, 0),
        "Creditado Custeio":   registros.reduce((a, r) => a + r.creditadoCusteio, 0),
        "Creditado Capital":   registros.reduce((a, r) => a + r.creditadoCapital, 0),
        "Rendimento Custeio":  registros.reduce((a, r) => a + r.rendimentoCusteio, 0),
        "Rendimento Capital":  registros.reduce((a, r) => a + r.rendimentoCapital, 0),
        "Despesa Custeio":     registros.reduce((a, r) => a + r.despesaCusteio, 0),
        "Despesa Capital":     registros.reduce((a, r) => a + r.despesaCapital, 0),
        "Total Custeio":       registros.reduce((a, r) => a + calcularFinanceiro(r).totalCusteio, 0),
        "Total Capital":       registros.reduce((a, r) => a + calcularFinanceiro(r).totalCapital, 0),
        "Saldo Final Custeio": registros.reduce((a, r) => a + calcularFinanceiro(r).saldoFinalCusteio, 0),
        "Saldo Final Capital": registros.reduce((a, r) => a + calcularFinanceiro(r).saldoFinalCapital, 0),
        "Saldo Geral":         registros.reduce((a, r) => a + calcularFinanceiro(r).saldoGeral, 0),
        "% Execução": "", Alerta: "", "Última Atualização": `Emitido em ${new Date().toLocaleDateString("pt-BR")}`
      };
      utils.sheet_add_json(ws, [sumRow], { skipHeader: true, origin: -1 });

      const filename = `gestao-recursos${exercicio ? `-${exercicio}` : ""}-${new Date().toISOString().slice(0, 10)}.xlsx`;
      writeFile(wb, filename);
    });
  }

  function exportCSV() {
    const header = Object.keys({
      Unidade: "", Tipo: "", Programa: "", Exercício: "",
      "Saldo Geral": "", "% Execução": "", Alerta: ""
    }).join(",");
    const body = registros.map((r) => {
      const c = calcularFinanceiro(r);
      const pct = calcularPercentualExecucao(r);
      return [
        `"${nomeMap.get(r.unidadeId) ?? r.unidadeId}"`,
        `"${tipoMap.get(r.unidadeId) ?? ""}"`,
        `"${progMap.get(r.programaId) ?? ""}"`,
        r.exercicio, c.saldoGeral, pct,
        calcularAlerta(c.saldoGeral, r.updatedAt)
      ].join(",");
    }).join("\n");
    const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `gestao-recursos${exercicio ? `-${exercicio}` : ""}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={exportExcel}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-50 px-3 text-xs font-black text-emerald-700 hover:bg-emerald-100"
      >
        <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden="true" />
        Excel
      </button>
      <button
        type="button"
        onClick={exportCSV}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 text-xs font-black text-neutral-700 hover:bg-neutral-50"
      >
        <Download className="h-3.5 w-3.5" aria-hidden="true" />
        CSV
      </button>
    </div>
  );
}
