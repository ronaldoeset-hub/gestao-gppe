"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Download, FileArchive, Search } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import type { Accountability, Council, DocumentRecord, FinancialAccountabilityReport, FinancialAllocation, FinancialControl, SchoolUnit } from "@/lib/types";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

function daysUntil(value: string) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(value);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

function urgencyOf(days: number) {
  if (days < 0) return "vencido";
  if (days <= 7) return "7";
  if (days <= 30) return "30";
  if (days <= 90) return "90";
  return "normal";
}

export function CentralDeadlinesPanel({
  councils,
  reports,
  action
}: {
  councils: Council[];
  reports: Array<FinancialAccountabilityReport | Accountability>;
  action: (formData: FormData) => void;
}) {
  const [filter, setFilter] = useState("todos");
  const items = useMemo(() => {
    const councilItems = councils.map((item) => ({
      id: item.id,
      kind: "conselho",
      title: item.school,
      description: `Mandato do conselho - ${item.president}`,
      dueDate: item.mandateEnd,
      status: item.status
    }));
    const reportItems = reports.map((item) => ({
      id: item.id,
      kind: "prestacao",
      title: item.school,
      description: "program" in item ? `Prestação ${item.reference} - ${item.program}` : `Prestação ${item.reference}`,
      dueDate: item.dueDate,
      status: item.status
    }));
    return [...councilItems, ...reportItems].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [councils, reports]);

  const filtered = items.filter((item) => {
    const urgency = urgencyOf(daysUntil(item.dueDate));
    if (filter === "todos") return true;
    if (filter === "vencidos") return urgency === "vencido";
    return urgency === filter;
  });

  return (
    <section className="space-y-4">
      <select value={filter} onChange={(event) => setFilter(event.target.value)} className="h-11 rounded-xl border border-sme-line px-3 outline-none focus:ring-2 focus:ring-sme-yellow">
        <option value="todos">Todos</option>
        <option value="vencidos">Vencidos</option>
        <option value="7">Até 7 dias</option>
        <option value="30">Até 30 dias</option>
        <option value="90">Até 90 dias</option>
      </select>
      <div className="grid gap-3">
        {filtered.map((item) => {
          const days = daysUntil(item.dueDate);
          return (
            <article key={`${item.kind}-${item.id}`} className={cn("rounded-2xl border bg-white p-4 shadow-soft-sm", days < 0 ? "border-sme-red" : days <= 30 ? "border-sme-yellow" : "border-sme-line")}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-black text-sme-ink">{item.title}</p>
                  <p className="mt-1 text-sm text-sme-muted">{item.description}</p>
                  <p className={cn("mt-2 text-sm font-bold", days < 0 ? "text-sme-red" : days <= 30 ? "text-sme-gold" : "text-sme-blue")}>
                    {formatDate(item.dueDate)} - {days < 0 ? `${Math.abs(days)} dias vencido` : `${days} dias restantes`}
                  </p>
                </div>
                <form action={action}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="kind" value={item.kind} />
                  <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-xl bg-sme-blue px-3 text-sm font-bold text-white hover:bg-sme-navy">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Marcar como cumprido
                  </button>
                </form>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function DocumentsExplorer({ rows }: { rows: DocumentRecord[] }) {
  const [category, setCategory] = useState("Todos");
  const [school, setSchool] = useState("Todos");
  const categories = useMemo(() => ["Todos", ...Array.from(new Set(rows.map((row) => row.category))).sort()], [rows]);
  const schools = useMemo(() => ["Todos", ...Array.from(new Set(rows.map((row) => row.school))).sort()], [rows]);
  const filtered = rows.filter((row) => (category === "Todos" || row.category === category) && (school === "Todos" || row.school === school));

  return (
    <section className="space-y-4">
      <div className="grid gap-3 rounded-2xl border border-sme-line bg-white p-4 shadow-soft-sm md:grid-cols-2">
        <label className="text-sm font-semibold text-sme-ink">
          Categoria
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-sme-line px-3 outline-none focus:ring-2 focus:ring-sme-yellow">
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold text-sme-ink">
          Unidade
          <select value={school} onChange={(event) => setSchool(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-sme-line px-3 outline-none focus:ring-2 focus:ring-sme-yellow">
            {schools.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <DataTable
        rows={filtered}
        emptyDescription="Nenhum documento encontrado com os filtros selecionados."
        columns={[
          { key: "title", header: "Título", render: (row) => <span className="font-semibold text-sme-ink">{row.title}</span> },
          { key: "category", header: "Categoria", render: (row) => row.category },
          { key: "school", header: "Unidade", render: (row) => row.school },
          { key: "createdAt", header: "Envio", render: (row) => formatDate(row.createdAt) },
          {
            key: "path",
            header: "Download",
            render: (row) => (
              <a
                href={row.downloadUrl ?? row.storagePath}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 font-bold text-sme-blue hover:text-sme-navy"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Abrir
              </a>
            )
          }
        ]}
      />
    </section>
  );
}

export function CompletenessPanel({
  units,
  councils,
  accountabilities,
  documents
}: {
  units: SchoolUnit[];
  councils: Council[];
  accountabilities: Accountability[];
  documents: DocumentRecord[];
}) {
  const rows = units.map((unit) => {
    const checks = [
      Boolean(unit.inep),
      Boolean(unit.manager && !unit.manager.toLowerCase().includes("gestor(a) da unidade")),
      councils.some((item) => item.school === unit.name && item.status === "regular"),
      accountabilities.some((item) => item.school === unit.name),
      documents.some((item) => item.school === unit.name)
    ];
    const percent = Math.round((checks.filter(Boolean).length / checks.length) * 100);
    return { unit, percent };
  }).sort((a, b) => a.percent - b.percent);

  return (
    <section className="space-y-3">
      {rows.map(({ unit, percent }) => (
        <article key={unit.id} className={cn("rounded-2xl border bg-white p-4 shadow-soft-sm", percent < 50 ? "border-sme-red" : "border-sme-line")}>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-black text-sme-ink">{unit.name}</p>
              <p className="text-sm text-sme-muted">{unit.type} - {unit.district}</p>
            </div>
            <p className={cn("text-xl font-black", percent < 50 ? "text-sme-red" : "text-sme-navy")}>{percent}%</p>
          </div>
          <div className="mt-3 h-3 rounded-full bg-sme-blue-soft">
            <div className={cn("h-3 rounded-full", percent < 50 ? "bg-sme-red" : "bg-sme-blue")} style={{ width: `${percent}%` }} />
          </div>
        </article>
      ))}
    </section>
  );
}

export function FndeCategoryCards() {
  const groups = [
    { title: "Legislação", items: ["Resoluções FNDE", "Normas do PDDE", "Regras de execução"] },
    { title: "Sistemas", items: ["PDDE Interativo", "SIGEF", "SIMEC"] },
    { title: "Prestação de Contas", items: ["Guias", "Prazos", "Formulários"] },
    { title: "Manuais e Orientações", items: ["Execução", "Perguntas frequentes", "Boas práticas"] }
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {groups.map((group) => (
        <article key={group.title} className="rounded-2xl border border-sme-line bg-white p-5 shadow-soft-sm">
          <FileArchive className="h-6 w-6 text-sme-blue" aria-hidden="true" />
          <h2 className="mt-4 font-display text-xl font-bold text-sme-navy">{group.title}</h2>
          <ul className="mt-3 space-y-2 text-sm text-sme-muted">
            {group.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>
      ))}
    </section>
  );
}

export function ReportSearchHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-sme-line bg-white p-4 shadow-soft-sm">
      <Search className="h-5 w-5 text-sme-blue" aria-hidden="true" />
      <p className="font-bold text-sme-ink">{title}</p>
    </div>
  );
}
