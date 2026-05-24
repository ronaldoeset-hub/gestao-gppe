"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import type { SchoolUnit } from "@/lib/types";

type SchoolUnitsTableProps = {
  rows: SchoolUnit[];
};

export function SchoolUnitsTable({ rows }: SchoolUnitsTableProps) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("todos");
  const [status, setStatus] = useState("todos");

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return rows.filter((unit) => {
      const matchesQuery =
        !normalizedQuery ||
        unit.name.toLowerCase().includes(normalizedQuery) ||
        unit.inep.toLowerCase().includes(normalizedQuery) ||
        unit.district.toLowerCase().includes(normalizedQuery);
      const matchesType = type === "todos" || unit.type === type;
      const matchesStatus = status === "todos" || unit.councilStatus === status;

      return matchesQuery && matchesType && matchesStatus;
    });
  }, [query, rows, status, type]);

  return (
    <section className="space-y-4">
      <div className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-soft md:grid-cols-[1fr_180px_180px]">
        <label className="block text-sm font-semibold text-slate-700">
          Buscar
          <div className="mt-2 flex h-11 items-center gap-2 rounded-md border border-slate-300 px-3 focus-within:ring-2 focus-within:ring-sme-yellow">
            <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full border-0 outline-none"
              placeholder="Nome, INEP ou bairro"
            />
          </div>
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Tipo
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
          >
            <option value="todos">Todos</option>
            <option value="Escola">Escolas</option>
            <option value="Creche">Creches</option>
            <option value="CEMEI">CEMEI</option>
            <option value="Conveniada">Conveniadas</option>
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Conselho
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
          >
            <option value="todos">Todos</option>
            <option value="regular">Regular</option>
            <option value="atencao">Atenção</option>
            <option value="pendente">Pendente</option>
          </select>
        </label>
      </div>
      <p className="text-sm font-semibold text-slate-600">
        {filteredRows.length} de {rows.length} unidades
      </p>
      <DataTable
        rows={filteredRows}
        columns={[
          { key: "id", header: "Código", render: (row) => row.id },
          {
            key: "name",
            header: "Unidade",
            render: (row) => (
              <div>
                <span className="font-semibold text-sme-ink">{row.name}</span>
                <Link
                  href={`/unidades/${encodeURIComponent(row.id)}`}
                  className="mt-1 block text-xs font-bold text-sme-blue hover:text-sme-navy"
                >
                  Ver detalhes
                </Link>
              </div>
            )
          },
          { key: "inep", header: "INEP", render: (row) => row.inep },
          { key: "type", header: "Tipo", render: (row) => row.type },
          { key: "district", header: "Bairro", render: (row) => row.district },
          { key: "manager", header: "Gestor", render: (row) => row.manager },
          { key: "status", header: "Conselho", render: (row) => <StatusBadge status={row.councilStatus} /> }
        ]}
      />
    </section>
  );
}
