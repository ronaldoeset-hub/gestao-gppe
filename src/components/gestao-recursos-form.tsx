"use client";

import { useCallback, useState, useTransition } from "react";
import { CheckCircle, Save, User } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  calcularFinanceiro,
  SITUACAO_PROGRAMA,
  TIPO_PROGRAMA
} from "@/data/gestao-recursos";
import type { FinanceiroUnidade, FonteRecurso, GestaoPrograma } from "@/lib/types";

type FormState = {
  tipoPrograma: string;
  fonteRecursoId: string;
  situacaoPrograma: string;
  saldoAnteriorCusteio: number;
  saldoAnteriorCapital: number;
  creditadoCusteio: number;
  creditadoCapital: number;
  rendimentoCusteio: number;
  rendimentoCapital: number;
  despesaCusteio: number;
  despesaCapital: number;
  observacaoTecnica: string;
};

type Props = {
  unidadeId: string;
  programa: GestaoPrograma;
  exercicio: number;
  directorName?: string;
  fontes: FonteRecurso[];
  initial?: FinanceiroUnidade;
  saveAction: (programaId: string, exercicio: number, data: FormData) => Promise<{ ok: boolean; message: string }>;
};

const inputCls = "h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm font-semibold text-neutral-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300";
const numCls   = `${inputCls} text-right`;
const lblCls   = "block text-xs font-bold uppercase text-neutral-500 mb-1.5";

export function GestaoRecursosForm({
  programa, exercicio, directorName, fontes, initial, saveAction
}: Props) {
  const [form, setForm] = useState<FormState>({
    tipoPrograma:         initial?.tipoPrograma         ?? "Custeio e Capital",
    fonteRecursoId:       initial?.fonteRecursoId        ?? "",
    situacaoPrograma:     initial?.situacaoPrograma       ?? "Em Execução",
    saldoAnteriorCusteio: initial?.saldoAnteriorCusteio  ?? 0,
    saldoAnteriorCapital: initial?.saldoAnteriorCapital  ?? 0,
    creditadoCusteio:     initial?.creditadoCusteio       ?? 0,
    creditadoCapital:     initial?.creditadoCapital       ?? 0,
    rendimentoCusteio:    initial?.rendimentoCusteio      ?? 0,
    rendimentoCapital:    initial?.rendimentoCapital      ?? 0,
    despesaCusteio:       initial?.despesaCusteio         ?? 0,
    despesaCapital:       initial?.despesaCapital         ?? 0,
    observacaoTecnica:    initial?.observacaoTecnica       ?? ""
  });

  const [status, setStatus]       = useState<{ ok: boolean; msg: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const setStr = useCallback((field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setStatus(null);
  }, []);

  const setNum = useCallback((field: keyof FormState, raw: string) => {
    setForm((prev) => ({ ...prev, [field]: parseFloat(raw) || 0 }));
    setStatus(null);
  }, []);

  // Ao mudar tipo, zera os campos irrelevantes
  function handleTipoChange(tipo: string) {
    setForm((prev) => ({
      ...prev,
      tipoPrograma: tipo,
      ...(tipo === "Custeio"
        ? { saldoAnteriorCapital: 0, creditadoCapital: 0, rendimentoCapital: 0, despesaCapital: 0 }
        : tipo === "Capital"
        ? { saldoAnteriorCusteio: 0, creditadoCusteio: 0, rendimentoCusteio: 0, despesaCusteio: 0 }
        : {})
    }));
    setStatus(null);
  }

  const showCusteio = form.tipoPrograma !== "Capital";
  const showCapital = form.tipoPrograma !== "Custeio";

  const calc = calcularFinanceiro({
    saldoAnteriorCusteio: showCusteio ? form.saldoAnteriorCusteio : 0,
    saldoAnteriorCapital: showCapital ? form.saldoAnteriorCapital : 0,
    creditadoCusteio:     showCusteio ? form.creditadoCusteio     : 0,
    creditadoCapital:     showCapital ? form.creditadoCapital     : 0,
    rendimentoCusteio:    showCusteio ? form.rendimentoCusteio    : 0,
    rendimentoCapital:    showCapital ? form.rendimentoCapital    : 0,
    despesaCusteio:       showCusteio ? form.despesaCusteio       : 0,
    despesaCapital:       showCapital ? form.despesaCapital       : 0
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    for (const [k, v] of Object.entries(form)) fd.append(k, String(v));
    startTransition(async () => {
      const result = await saveAction(programa.id, exercicio, fd);
      setStatus({ ok: result.ok, msg: result.message });
    });
  }

  function NumField({ field, label }: { field: keyof FormState; label: string }) {
    return (
      <label className="block">
        <span className={lblCls}>{label}</span>
        <input
          type="number" step="0.01" min="0"
          value={(form[field] as number) || ""}
          placeholder="0,00"
          onChange={(e) => setNum(field, e.target.value)}
          className={numCls}
        />
      </label>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-neutral-200 bg-white p-5 shadow-card space-y-5">

      {/* Cabeçalho do programa */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-base font-black text-neutral-900">{programa.nome}</p>
          <p className="text-xs text-neutral-500">Exercício {exercicio}</p>
        </div>
        <span className={`rounded-md px-3 py-1.5 text-sm font-black ${
          calc.saldoGeral >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
        }`}>
          Saldo Geral: {formatCurrency(calc.saldoGeral)}
        </span>
      </div>

      {/* Diretor auto-preenchido */}
      {directorName && (
        <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-4 py-2.5">
          <User className="h-4 w-4 text-neutral-400 shrink-0" aria-hidden="true" />
          <div className="text-xs">
            <span className="font-bold uppercase text-neutral-500">Diretor(a): </span>
            <span className="font-semibold text-neutral-800">{directorName}</span>
          </div>
        </div>
      )}

      {/* Configuração do lançamento */}
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className={lblCls}>Tipo de programa <span className="text-red-500">*</span></span>
          <select
            value={form.tipoPrograma}
            onChange={(e) => handleTipoChange(e.target.value)}
            className={inputCls}
          >
            {TIPO_PROGRAMA.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={lblCls}>Fonte do recurso</span>
          <select
            value={form.fonteRecursoId}
            onChange={(e) => setStr("fonteRecursoId", e.target.value)}
            className={inputCls}
          >
            <option value="">Selecione...</option>
            {fontes.map((f) => (
              <option key={f.id} value={f.id}>{f.nome}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={lblCls}>Situação do programa</span>
          <select
            value={form.situacaoPrograma}
            onChange={(e) => setStr("situacaoPrograma", e.target.value)}
            className={inputCls}
          >
            {SITUACAO_PROGRAMA.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Campos financeiros — Custeio */}
      {showCusteio && (
        <div className="rounded-md border border-blue-100 bg-blue-50/40 p-4 space-y-3">
          <p className="text-xs font-black uppercase text-blue-700">Custeio (C)</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <NumField field="saldoAnteriorCusteio" label="Saldo Anterior"    />
            <NumField field="creditadoCusteio"     label="Creditado"         />
            <NumField field="rendimentoCusteio"    label="Rendimento"        />
            <NumField field="despesaCusteio"       label="Despesa"           />
          </div>
          <div className="rounded border border-blue-200 bg-white px-3 py-2 text-xs">
            <span className="font-bold text-neutral-600">Total Custeio: </span>
            <span className="font-black text-blue-700">{formatCurrency(calc.totalCusteio)}</span>
            <span className="mx-3 text-neutral-300">|</span>
            <span className="font-bold text-neutral-600">Saldo Final Custeio: </span>
            <span className={`font-black ${calc.saldoFinalCusteio < 0 ? "text-red-600" : "text-emerald-700"}`}>
              {formatCurrency(calc.saldoFinalCusteio)}
            </span>
          </div>
        </div>
      )}

      {/* Campos financeiros — Capital */}
      {showCapital && (
        <div className="rounded-md border border-purple-100 bg-purple-50/40 p-4 space-y-3">
          <p className="text-xs font-black uppercase text-purple-700">Capital (K)</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <NumField field="saldoAnteriorCapital" label="Saldo Anterior"    />
            <NumField field="creditadoCapital"     label="Creditado"         />
            <NumField field="rendimentoCapital"    label="Rendimento"        />
            <NumField field="despesaCapital"       label="Despesa"           />
          </div>
          <div className="rounded border border-purple-200 bg-white px-3 py-2 text-xs">
            <span className="font-bold text-neutral-600">Total Capital: </span>
            <span className="font-black text-purple-700">{formatCurrency(calc.totalCapital)}</span>
            <span className="mx-3 text-neutral-300">|</span>
            <span className="font-bold text-neutral-600">Saldo Final Capital: </span>
            <span className={`font-black ${calc.saldoFinalCapital < 0 ? "text-red-600" : "text-emerald-700"}`}>
              {formatCurrency(calc.saldoFinalCapital)}
            </span>
          </div>
        </div>
      )}

      {/* Resumo geral */}
      <div className="grid grid-cols-3 gap-3 rounded-md border border-neutral-200 bg-neutral-50 p-3 text-xs">
        <div>
          <p className="text-neutral-500">Total Custeio</p>
          <p className="font-black text-neutral-800">{formatCurrency(calc.totalCusteio)}</p>
        </div>
        <div>
          <p className="text-neutral-500">Total Capital</p>
          <p className="font-black text-neutral-800">{formatCurrency(calc.totalCapital)}</p>
        </div>
        <div>
          <p className="text-neutral-500">Saldo Geral</p>
          <p className={`font-black ${calc.saldoGeral < 0 ? "text-red-700" : "text-emerald-700"}`}>
            {formatCurrency(calc.saldoGeral)}
          </p>
        </div>
      </div>

      {/* Observação técnica */}
      <label className="block">
        <span className={lblCls}>Observação técnica</span>
        <textarea
          rows={2}
          value={form.observacaoTecnica}
          onChange={(e) => setStr("observacaoTecnica", e.target.value)}
          placeholder="Registre observações relevantes sobre este lançamento..."
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
      </label>

      {/* Rodapé */}
      <div className="flex items-center justify-between gap-3">
        {status ? (
          <span className={`flex items-center gap-1.5 text-sm font-semibold ${status.ok ? "text-emerald-700" : "text-red-600"}`}>
            {status.ok && <CheckCircle className="h-4 w-4" aria-hidden="true" />}
            {status.msg}
          </span>
        ) : (
          <span className="text-xs text-neutral-400">
            {initial ? "Registro existente — salvar atualiza o lançamento." : "Novo lançamento para este programa e exercício."}
          </span>
        )}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary-700 px-5 text-sm font-black text-white hover:bg-primary-800 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {pending ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
