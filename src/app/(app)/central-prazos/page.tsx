import { CalendarClock } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { ModuleHeader } from "@/components/module-header";
import { StatusBadge } from "@/components/status-badge";
import { createClient } from "@/lib/supabase/server";
import type { Status } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

type RelatedName = { name: string } | { name: string }[] | null;

type CouncilDeadline = {
  id: string;
  school: string;
  president: string;
  mandateEnd: string;
  status: Status;
};

type PendingAccountability = {
  id: string;
  school: string;
  program: string;
  reference: string;
  dueDate: string;
  status: "pendente" | "vencido";
  balance: number;
};

function relatedName(value: RelatedName, fallback = "Nao informado") {
  if (Array.isArray(value)) {
    return value[0]?.name ?? fallback;
  }

  return value?.name ?? fallback;
}

function statusValue(value: string | null | undefined): Status {
  if (value === "regular" || value === "atencao" || value === "pendente" || value === "vencido") {
    return value;
  }

  return "regular";
}

async function getCouncilDeadlines(today: string, until: string) {
  try {
    const supabase = await createClient();
    const [expiredResult, expiringResult] = await Promise.all([
      supabase
        .from("school_councils")
        .select("id,school_units(name),president_name,mandate_end,status")
        .lt("mandate_end", today)
        .order("mandate_end", { ascending: true }),
      supabase
        .from("school_councils")
        .select("id,school_units(name),president_name,mandate_end,status")
        .gte("mandate_end", today)
        .lte("mandate_end", until)
        .order("mandate_end", { ascending: true })
    ]);

    if (expiredResult.error || expiringResult.error) {
      return { expired: [], expiring: [] };
    }

    const mapCouncil = (item: {
      id: string;
      school_units: RelatedName;
      president_name: string | null;
      mandate_end: string;
      status: string | null;
    }): CouncilDeadline => ({
      id: item.id,
      school: relatedName(item.school_units, "Unidade nao informada"),
      president: item.president_name ?? "Nao informado",
      mandateEnd: item.mandate_end,
      status: statusValue(item.status)
    });

    return {
      expired: ((expiredResult.data ?? []) as Parameters<typeof mapCouncil>[0][]).map(mapCouncil),
      expiring: ((expiringResult.data ?? []) as Parameters<typeof mapCouncil>[0][]).map(mapCouncil)
    };
  } catch {
    return { expired: [], expiring: [] };
  }
}

async function getPendingAccountabilities() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("financial_accountability_reports")
      .select("id,school_units(name),financial_programs(name),reference,due_date,status,balance")
      .in("status", ["pendente", "vencido"])
      .order("due_date", { ascending: true });

    if (error) {
      return [];
    }

    return ((data ?? []) as Array<{
      id: string;
      school_units: RelatedName;
      financial_programs: RelatedName;
      reference: string;
      due_date: string;
      status: "pendente" | "vencido";
      balance: number | string | null;
    }>).map((item): PendingAccountability => ({
      id: item.id,
      school: relatedName(item.school_units, "Unidade nao informada"),
      program: relatedName(item.financial_programs, "Programa nao informado"),
      reference: item.reference,
      dueDate: item.due_date,
      status: item.status,
      balance: Number(item.balance ?? 0)
    }));
  } catch {
    return [];
  }
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm font-medium text-slate-500">
      {label}
    </div>
  );
}

function CouncilTable({ rows }: { rows: CouncilDeadline[] }) {
  if (!rows.length) {
    return <EmptyState label="Nenhum conselho encontrado para este filtro." />;
  }

  return (
    <DataTable
      rows={rows}
      columns={[
        { key: "school", header: "Unidade", render: (row) => row.school },
        { key: "president", header: "Presidencia", render: (row) => row.president },
        { key: "mandateEnd", header: "Fim do mandato", render: (row) => formatDate(row.mandateEnd) },
        { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> }
      ]}
    />
  );
}

export default async function CentralPrazosPage() {
  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);
  const limit = new Date(today);
  limit.setDate(limit.getDate() + 90);
  const limitIso = limit.toISOString().slice(0, 10);
  const [{ expired, expiring }, pendingAccountabilities] = await Promise.all([
    getCouncilDeadlines(todayIso, limitIso),
    getPendingAccountabilities()
  ]);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Central de Prazos"
        description="Acompanhe mandatos de conselhos e prestacoes de contas que exigem atencao da equipe GPPE."
        icon={CalendarClock}
      />

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-sme-ink">Conselhos vencidos</h2>
        <CouncilTable rows={expired} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-sme-ink">Conselhos vencendo em 90 dias</h2>
        <CouncilTable rows={expiring} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-sme-ink">Prestacoes de contas pendentes</h2>
        {pendingAccountabilities.length ? (
          <DataTable
            rows={pendingAccountabilities}
            columns={[
              { key: "school", header: "Unidade", render: (row) => row.school },
              { key: "program", header: "Programa", render: (row) => row.program },
              { key: "reference", header: "Referencia", render: (row) => row.reference },
              { key: "dueDate", header: "Prazo", render: (row) => formatDate(row.dueDate) },
              { key: "balance", header: "Saldo", render: (row) => formatCurrency(row.balance) },
              { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> }
            ]}
          />
        ) : (
          <EmptyState label="Nenhuma prestacao de contas pendente ou vencida." />
        )}
      </section>
    </div>
  );
}
