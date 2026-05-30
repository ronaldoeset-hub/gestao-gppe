"use client";

import { useCallback, useState, useTransition } from "react";
import { Save } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { calcularFinanceiro } from "@/data/gestao-recursos";
import type { FinanceiroUnidade, GestaoPrograma } from "@/lib/types";

type FormState = {
  saldoAnteriorCusteio: number;
  saldoAnteriorCapital: number;
  creditadoCusteio: number;
  creditadoCapital: number;
  rendimentoCusteio: number;
  rendimentoCapital: number;
  despesaCusteio: number;
  despesaCapital: number;
  observacao: string;
};

type Props = {
  unidadeId: string;
  programa: GestaoPrograma;
  exercicio: number;
  initial?: FinanceiroUnidade;
  saveAction: (programaId: string, exercicio: number, data: FormData) => Promise<{ ok: boolean; message: string }>;
};

const numCls = "h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-right text-sm font-semibold text-neutral-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300";
const labelCls = "block text-xs font-bold uppercase text-neutral-500 mb-1";

export function GestaoRecursosForm({ programa, exercicio, initial, saveAction }: Props) {
  const [form, setForm] = useState<FormState>({
    saldoAnteriorCusteio: initial?.saldoAnteriorCusteio ?? 0,
    saldoAnteriorCapital: initial?.saldoAnteriorCapital ?? 0,
    creditadoCusteio:     initial?.creditadoCusteio     ?? 0,
    creditadoCapital:     initial?.creditadoCapital     ?? 0,
    rendimentoCusteio:    initial?.rendimentoCusteio    ?? 0,
    rendimentoCapital:    initial?.rendimentoCapital    ?? 0,
    despesaCusteio:       initial?.despesaCusteio       ?? 0,
    despesaCapital:       initial?.despesaCapital       ?? 0,
    observacao:           initial?.observacao            ?? ""
  });

  const [status, setStatus]     = useState("");
  const [pending, startTransition] = useTransition();

  const set = useCallback((field: keyof FormState, raw: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: typeof prev[field] === "number" ? (parseFloat(raw) || 0) : raw
    }));
  }, []);

  const calc = calcularFinanceiro(form);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    for (const [k, v] of Object.entries(form)) fd.append(k, String(v));
    startTransition(async () => {
      const result = await saveAction(programa.id, exercicio, fd);
      setStatus(result.message);
    });
  }

  function NumField({ field, label }: { field: keyof FormState; label: string }) {
    return (
      <div>
        <label className={labelCls}>{label}</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={(form[field] as number) || ""}
          placeholder="0,00"
          onChange={(e) => set(field, e.target.value)}
          className={numCls}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-md border border-neutral-200 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-black text-neutral-900">{programa.nome}</p>
          <p className="text-xs text-neutral-500">Exercício {exercicio}</p>
        </div>
        <span className={`rounded-md px-3 py-1 text-sm font-black ${calc.saldoGeral >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {formatCurrency(calc.saldoGeral)}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Custeio */}
        <div className="space-y-3 rounded-md border border-blue-100 bg-blue-50/40 p-4">
          <p className="text-xs font-black uppercase text-blue-700">Custeio</p>
          <NumField field="saldoAnteriorCusteio" label="Saldo Anterior" />
          <NumField field="creditadoCusteio"     label="Creditado"      />
          <NumField field="rendimentoCusteio"    label="Rendimento"     />
          <NumField field="despesaCusteio"       label="Despesa"        />
          <div className="rounded border border-blue-200 bg-white px-3 py-2 text-xs">
            <span className="font-bold text-neutral-600">Saldo Final Custeio: </span>
            <span className={`font-black ${calc.saldoFinalCusteio < 0 ? "text-red-600" : "text-emerald-700"}`}>
              {formatCurrency(calc.saldoFinalCusteio)}
            </span>
          </div>
        </div>

        {/* Capital */}
        <div className="space-y-3 rounded-md border border-purple-100 bg-purple-50/40 p-4">
          <p className="text-xs font-black uppercase text-purple-700">Capital</p>
          <NumField field="saldoAnteriorCapital" label="Saldo Anterior" />
          <NumField field="creditadoCapital"     label="Creditado"      />
          <NumField field="rendimentoCapital"    label="Rendimento"     />
          <NumField field="despesaCapital"       label="Despesa"        />
          <div className="rounded border border-purple-200 bg-white px-3 py-2 text-xs">
            <span className="font-bold text-neutral-600">Saldo Final Capital: </span>
            <span className={`font-black ${calc.saldoFinalCapital < 0 ? "text-red-600" : "text-emerald-700"}`}>
              {formatCurrency(calc.saldoFinalCapital)}
            </span>
          </div>
        </div>
      </div>

      {/* Resumo calculado */}
      <div className="grid grid-cols-3 gap-3 rounded-md border border-neutral-200 bg-neutral-50 p-3 text-xs">
        <div><p className="text-neutral-500">Total Custeio</p><p className="font-black text-neutral-800">{formatCurrency(calc.totalCusteio)}</p></div>
        <div><p className="text-neutral-500">Total Capital</p><p className="font-black text-neutral-800">{formatCurrency(calc.totalCapital)}</p></div>
        <div><p className="text-neutral-500">Saldo Geral</p>
          <p className={`font-black ${calc.saldoGeral < 0 ? "text-red-700" : "text-emerald-700"}`}>{formatCurrency(calc.saldoGeral)}</p>
        </div>
      </div>

      <div>
        <label className={labelCls}>Observação</label>
        <textarea
          rows={2}
          value={form.observacao}
          onChange={(e) => set("observacao", e.target.value)}
          placeholder="Observações sobre este registro..."
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
      </div>

      <div className="flex items-center justify-between">
        {status ? <p className="text-sm font-semibold text-emerald-700">{status}</p> : <span />}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary-700 px-5 text-sm font-black text-white hover:bg-primary-800 disabled:opacity-60"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {pending ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
