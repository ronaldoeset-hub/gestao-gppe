import { AlertTriangle, CheckCircle2, ClipboardList, UsersRound } from "lucide-react";
import type { Council } from "@/lib/types";
import { formatDate } from "@/lib/utils";

function daysUntil(date: string) {
  const today = new Date();
  const target = new Date(`${date}T00:00:00`);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

function expectedMembers(council: Council) {
  if (council.expectedMembers) return council.expectedMembers;
  if (!council.studentCount) return council.members >= 13 ? 13 : 11;
  return council.studentCount > 600 ? 13 : 11;
}

function regularityItems(council: Council) {
  const expected = expectedMembers(council);
  return [
    {
      label: "Mandato informado",
      ok: Boolean(council.mandateEnd),
      detail: `Fim: ${formatDate(council.mandateEnd)}`
    },
    {
      label: "Composicao compativel",
      ok: council.members === expected,
      detail: `${council.members}/${expected} membros`
    },
    {
      label: "Eleicao registrada",
      ok: Boolean(council.electionDate),
      detail: council.electionDate ? formatDate(council.electionDate) : "Pendente"
    },
    {
      label: "Posse registrada",
      ok: Boolean(council.possessionDate),
      detail: council.possessionDate ? formatDate(council.possessionDate) : "Pendente"
    },
    {
      label: "Registro em cartorio",
      ok: Boolean(council.registryDate),
      detail: council.registryDate ? formatDate(council.registryDate) : "Pendente"
    }
  ];
}

export function CouncilRegularityPanel({ councils }: { councils: Council[] }) {
  const expiring = councils.filter((council) => daysUntil(council.mandateEnd) <= 90).length;
  const overdue = councils.filter((council) => daysUntil(council.mandateEnd) < 0).length;
  const incomplete = councils.filter((council) => regularityItems(council).some((item) => !item.ok)).length;
  const selected = councils.find((council) => regularityItems(council).some((item) => !item.ok)) ?? councils[0];
  const selectedItems = selected ? regularityItems(selected) : [];

  return (
    <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
        <SummaryCard label="Mandatos vencidos" value={overdue} tone="red" />
        <SummaryCard label="Vencem em ate 90 dias" value={expiring} tone="amber" />
        <SummaryCard label="Com pendencia documental" value={incomplete} tone="blue" />
      </div>
      <div className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Checklist da Resolucao 005-CME</p>
            <h2 className="mt-1 text-lg font-bold text-sme-ink">{selected?.school ?? "Nenhum conselho cadastrado"}</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-md bg-sky-50 px-3 py-2 text-sm font-semibold text-sme-blue ring-1 ring-sky-100">
            <UsersRound className="h-4 w-4" aria-hidden="true" />
            {selected ? `${selected.members} membros` : "Sem dados"}
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {selectedItems.map((item) => (
            <div key={item.label} className="rounded-md border border-slate-200 p-3">
              <div className="flex items-center gap-2">
                {item.ok ? <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" /> : <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden="true" />}
                <p className="text-sm font-bold text-sme-ink">{item.label}</p>
              </div>
              <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          <ClipboardList className="mr-2 inline h-4 w-4 text-sme-blue" aria-hidden="true" />
          Parametros: ate 600 alunos exigem 11 membros; acima de 600 alunos exigem 13 membros; mandato padrao de 3 anos; diretor e membro nato, mas nao deve ser presidente.
        </div>
      </div>
    </section>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: number; tone: "red" | "amber" | "blue" }) {
  const colors = {
    red: "bg-red-50 text-red-700 ring-red-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    blue: "bg-sky-50 text-sme-blue ring-sky-100"
  };

  return (
    <div className={`rounded-md p-5 ring-1 ${colors[tone]}`}>
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-3 text-3xl font-black">{value}</p>
    </div>
  );
}
