"use client";

import { useMemo, useState } from "react";
import { Clock, Medal, Search, ShieldAlert } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import type { Accountability, Council, ResourceTransfer, SchoolUnit } from "@/lib/types";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const STATUS_OPTIONS = ["todos", "regular", "atencao", "pendente", "vencido"] as const;

function daysUntil(value: string) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(value);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - start.getTime()) / 86400000);
}

function FieldShell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-sme-ink">
      {label}
      {children}
    </label>
  );
}

export function SchoolUnitsExplorer({ rows }: { rows: SchoolUnit[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("Todos");
  const [district, setDistrict] = useState("Todos");

  const districts = useMemo(() => ["Todos", ...Array.from(new Set(rows.map((row) => row.district).filter(Boolean))).sort()], [rows]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesQuery = !normalized || row.name.toLowerCase().includes(normalized);
      const matchesType = type === "Todos" || row.type === type;
      const matchesDistrict = district === "Todos" || row.district === district;
      return matchesQuery && matchesType && matchesDistrict;
    });
  }, [district, query, rows, type]);

  return (
    <section className="space-y-4">
      <div className="grid gap-3 rounded-2xl border border-sme-line bg-white p-4 shadow-soft-sm lg:grid-cols-[1fr_220px_260px]">
        <FieldShell label="Buscar por nome">
          <div className="mt-2 flex h-11 items-center gap-2 rounded-xl border border-sme-line px-3 focus-within:ring-2 focus-within:ring-sme-yellow">
            <Search className="h-4 w-4 text-sme-muted" aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full border-0 outline-none" placeholder="Nome da unidade" />
          </div>
        </FieldShell>
        <FieldShell label="Tipo">
          <select value={type} onChange={(event) => setType(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-sme-line px-3 outline-none focus:ring-2 focus:ring-sme-yellow">
            {["Todos", "Escola", "Creche", "CEMEI", "Conveniada"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </FieldShell>
        <FieldShell label="Bairro">
          <select value={district} onChange={(event) => setDistrict(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-sme-line px-3 outline-none focus:ring-2 focus:ring-sme-yellow">
            {districts.map((item) => <option key={item}>{item}</option>)}
          </select>
        </FieldShell>
      </div>
      <DataTable
        rows={filtered}
        emptyDescription="Nenhuma unidade encontrada com os filtros selecionados."
        columns={[
          { key: "name", header: "Unidade", render: (row) => <span className="font-semibold text-sme-ink">{row.name}</span> },
          { key: "inep", header: "INEP", render: (row) => row.inep || "-" },
          { key: "type", header: "Tipo", render: (row) => row.type },
          { key: "district", header: "Bairro", render: (row) => row.district },
          { key: "manager", header: "Gestor", render: (row) => row.manager },
          { key: "councilStatus", header: "Conselho", render: (row) => <StatusBadge status={row.councilStatus} /> }
        ]}
      />
    </section>
  );
}

export function CouncilsExplorer({ rows }: { rows: Council[] }) {
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>("todos");
  const filtered = useMemo(() => rows.filter((row) => status === "todos" || row.status === status), [rows, status]);
  const counts = STATUS_OPTIONS.filter((item) => item !== "todos").map((item) => ({
    status: item,
    count: rows.filter((row) => row.status === item).length
  }));

  return (
    <section className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        {counts.map((item) => (
          <article key={item.status} className="rounded-2xl border border-sme-line bg-white p-4 shadow-soft-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-sme-muted">{item.status}</p>
            <p className="mt-2 text-3xl font-black text-sme-navy">{item.count}</p>
          </article>
        ))}
      </div>
      <FieldShell label="Filtrar por status">
        <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="mt-2 h-11 w-full max-w-xs rounded-xl border border-sme-line px-3 outline-none focus:ring-2 focus:ring-sme-yellow">
          {STATUS_OPTIONS.map((item) => <option key={item} value={item}>{item === "todos" ? "Todos" : item}</option>)}
        </select>
      </FieldShell>
      <DataTable
        rows={filtered}
        emptyDescription="Nenhum conselho encontrado para o status selecionado."
        rowClassName={(row) => daysUntil(row.mandateEnd) < 0 ? "border-l-4 border-l-sme-red" : undefined}
        columns={[
          { key: "id", header: "Código", render: (row) => row.id },
          { key: "school", header: "Unidade", render: (row) => row.school },
          { key: "president", header: "Presidência", render: (row) => row.president },
          { key: "members", header: "Membros", render: (row) => row.members },
          { key: "mandateEnd", header: "Fim do mandato", render: (row) => <DeadlineBadge date={row.mandateEnd} /> },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> }
        ]}
      />
    </section>
  );
}

function DeadlineBadge({ date }: { date: string }) {
  const days = daysUntil(date);
  const urgent = days <= 30;
  const overdue = days < 0;
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-xl px-2.5 py-1 text-xs font-bold", overdue ? "bg-sme-red text-white" : urgent ? "bg-sme-yellow text-sme-navy" : "bg-sme-blue-soft text-sme-navy")}>
      {urgent ? <Clock className="h-3.5 w-3.5" aria-hidden="true" /> : null}
      {formatDate(date)} {overdue ? `(${Math.abs(days)}d vencido)` : urgent ? `(${days}d)` : ""}
    </span>
  );
}

export function ResourcesExplorer({ rows }: { rows: ResourceTransfer[] }) {
  const [program, setProgram] = useState("Todos");
  const programs = useMemo(() => ["Todos", ...Array.from(new Set(rows.map((row) => row.program))).sort()], [rows]);
  const filtered = useMemo(() => rows.filter((row) => program === "Todos" || row.program === program), [program, rows]);
  const targets = ["PDDE Básico", "QUALIDADE", "EQUIDADE", "INTEGRAL"];

  return (
    <section className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {targets.map((target) => {
          const group = rows.filter((row) => row.program.toLowerCase().includes(target.toLowerCase().replace(" básico", "")));
          return <ProgramCard key={target} title={target} amount={group.reduce((sum, row) => sum + row.amount, 0)} balance={group.reduce((sum, row) => sum + row.balance, 0)} />;
        })}
      </div>
      <div className="rounded-2xl border border-sme-line bg-white p-4 shadow-soft-sm">
        <p className="text-sm font-bold text-sme-muted">Total geral monitorado</p>
        <p className="mt-2 text-3xl font-black text-sme-navy">{formatCurrency(rows.reduce((sum, row) => sum + row.amount, 0))}</p>
      </div>
      <FieldShell label="Filtrar por programa">
        <select value={program} onChange={(event) => setProgram(event.target.value)} className="mt-2 h-11 w-full max-w-md rounded-xl border border-sme-line px-3 outline-none focus:ring-2 focus:ring-sme-yellow">
          {programs.map((item) => <option key={item}>{item}</option>)}
        </select>
      </FieldShell>
      <DataTable
        rows={filtered}
        emptyDescription="Nenhum recurso encontrado para o programa selecionado."
        columns={[
          { key: "program", header: "Programa", render: (row) => <span className="font-semibold text-sme-ink">{row.program}</span> },
          { key: "school", header: "Unidade", render: (row) => row.school },
          { key: "category", header: "Tipo", render: (row) => row.category ?? "Outros" },
          { key: "amount", header: "Valor", render: (row) => formatCurrency(row.amount) },
          { key: "balance", header: "Saldo", render: (row) => formatCurrency(row.balance) },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> }
        ]}
      />
    </section>
  );
}

function ProgramCard({ title, amount, balance }: { title: string; amount: number; balance: number }) {
  return (
    <article className="rounded-2xl border border-sme-line bg-white p-4 shadow-soft-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-sme-blue">{title}</p>
      <p className="mt-2 text-xl font-black text-sme-ink">{formatCurrency(amount)}</p>
      <p className="mt-1 text-sm font-semibold text-sme-muted">Saldo: {formatCurrency(balance)}</p>
    </article>
  );
}

export function AccountabilityExplorer({ rows }: { rows: Accountability[] }) {
  const [status, setStatus] = useState("todos");
  const filtered = useMemo(() => rows.filter((row) => status === "todos" || row.status === status), [rows, status]);
  const pending = rows.filter((row) => row.status === "pendente" || row.status === "vencido" || daysUntil(row.dueDate) < 0).length;

  return (
    <section className="space-y-4">
      <div className="flex items-start gap-3 rounded-2xl border border-sme-line bg-white p-5 shadow-soft-sm">
        <ShieldAlert className="mt-1 h-5 w-5 text-sme-red" aria-hidden="true" />
        <div>
          <p className="text-lg font-black text-sme-ink">{pending} prestação(ões) pendente(s) ou vencida(s)</p>
          <p className="mt-1 text-sm text-sme-muted">Priorize unidades com prazo expirado ou faltando menos de 30 dias.</p>
        </div>
      </div>
      <FieldShell label="Filtrar por status">
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-2 h-11 w-full max-w-xs rounded-xl border border-sme-line px-3 outline-none focus:ring-2 focus:ring-sme-yellow">
          {["todos", "regular", "atencao", "pendente", "vencido"].map((item) => <option key={item} value={item}>{item === "todos" ? "Todos" : item}</option>)}
        </select>
      </FieldShell>
      <DataTable
        rows={filtered}
        emptyDescription="Nenhuma prestação de contas encontrada para o status selecionado."
        columns={[
          { key: "id", header: "Protocolo", render: (row) => row.id },
          { key: "school", header: "Unidade", render: (row) => row.school },
          { key: "reference", header: "Referência", render: (row) => row.reference },
          { key: "dueDate", header: "Prazo", render: (row) => formatDate(row.dueDate) },
          { key: "days", header: "Dias restantes", render: (row) => <DeadlineText days={daysUntil(row.dueDate)} /> },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> }
        ]}
      />
    </section>
  );
}

function DeadlineText({ days }: { days: number }) {
  return (
    <span className={cn("font-bold", days < 30 ? "text-sme-red" : "text-sme-navy")}>
      {days < 0 ? `${Math.abs(days)} dias vencido` : `${days} dias`}
    </span>
  );
}

export function RankingVisualTable({ rows }: { rows: Array<{ school_unit_id: string; escola: string; tipo: string; saldo_total_parado: number; total_recebido: number; total_executado: number; percentual_execucao: number }> }) {
  const max = Math.max(...rows.map((row) => Number(row.saldo_total_parado)), 1);
  return (
    <div className="overflow-x-auto rounded-2xl border border-sme-line bg-white shadow-soft-sm">
      <table className="w-full text-sm">
        <thead className="bg-sme-surface text-left">
          <tr>
            {["Posição", "Unidade", "Tipo", "Saldo parado", "Proporção", "% executado"].map((head) => <th key={head} className="px-4 py-3 font-black text-sme-muted">{head}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-sme-line">
          {rows.map((row, index) => {
            const pct = Math.max((Number(row.saldo_total_parado) / max) * 100, 4);
            const medal = index === 0 ? "1º" : index === 1 ? "2º" : index === 2 ? "3º" : `${index + 1}º`;
            return (
              <tr key={row.school_unit_id} className="hover:bg-sme-surface">
                <td className="px-4 py-3"><span className={cn("rounded-xl px-2 py-1 text-xs font-black", index < 3 ? "bg-sme-yellow text-sme-navy" : "bg-sme-blue-soft text-sme-navy")}>{medal}</span></td>
                <td className="px-4 py-3 font-semibold text-sme-ink">{row.escola}</td>
                <td className="px-4 py-3 capitalize text-sme-muted">{row.tipo}</td>
                <td className="px-4 py-3 font-black text-sme-red">{formatCurrency(Number(row.saldo_total_parado))}</td>
                <td className="min-w-48 px-4 py-3">
                  <div className="h-3 rounded-full bg-sme-blue-soft"><div className="h-3 rounded-full bg-sme-blue" style={{ width: `${pct}%` }} /></div>
                </td>
                <td className="px-4 py-3"><Medal className="mr-2 inline h-4 w-4 text-sme-gold" aria-hidden="true" />{row.percentual_execucao}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
