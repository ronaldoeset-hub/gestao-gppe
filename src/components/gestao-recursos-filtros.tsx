"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { GestaoPrograma } from "@/lib/types";
import { ANOS_DISPONIVEIS } from "@/data/gestao-recursos";

type Props = {
  programas: GestaoPrograma[];
};

export function GestaoRecursosFiltros({ programas }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const set = useCallback((key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    router.push(`/gestao-recursos?${next.toString()}`);
  }, [params, router]);

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-md border border-neutral-200 bg-white p-4 shadow-card">
      <div className="min-w-32">
        <label className="block text-xs font-bold uppercase text-neutral-500 mb-1.5">Exercício</label>
        <select
          value={params.get("exercicio") || ""}
          onChange={(e) => set("exercicio", e.target.value)}
          className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm font-semibold text-neutral-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          <option value="">Todos</option>
          {ANOS_DISPONIVEIS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div className="min-w-48 flex-1">
        <label className="block text-xs font-bold uppercase text-neutral-500 mb-1.5">Programa</label>
        <select
          value={params.get("programa") || ""}
          onChange={(e) => set("programa", e.target.value)}
          className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm font-semibold text-neutral-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          <option value="">Todos os programas</option>
          {programas.map((p) => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
      </div>

      <div className="min-w-32">
        <label className="block text-xs font-bold uppercase text-neutral-500 mb-1.5">Tipo de unidade</label>
        <select
          value={params.get("tipo") || ""}
          onChange={(e) => set("tipo", e.target.value)}
          className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm font-semibold text-neutral-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          <option value="">Todos os tipos</option>
          <option value="escola">Escola</option>
          <option value="creche">Creche</option>
          <option value="cemei">CEMEI</option>
          <option value="conveniada">Conveniada</option>
        </select>
      </div>

      <button
        type="button"
        onClick={() => router.push("/gestao-recursos")}
        className="h-10 rounded-md border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-600 hover:bg-neutral-50"
      >
        Limpar filtros
      </button>
    </div>
  );
}
