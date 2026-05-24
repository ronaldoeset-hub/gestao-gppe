import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bell, Building2, ClipboardCheck, FileText, Landmark, Users } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import {
  getAccountabilities,
  getAlerts,
  getCouncils,
  getDocuments,
  getResources,
  getSchoolUnits
} from "@/lib/supabase/queries";
import type { Accountability, Council, DocumentRecord, ResourceTransfer, Status } from "@/lib/types";

type SchoolUnitDetailPageProps = {
  params: {
    id: string;
  };
};

const statusText: Record<Status, string> = {
  regular: "Regular",
  atencao: "Atencao",
  pendente: "Pendente",
  vencido: "Vencido"
};

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function formatMoney(value: number) {
  return moneyFormatter.format(value);
}

function formatDate(value?: string) {
  if (!value) {
    return "Nao informado";
  }

  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(value));
}

function daysUntil(value?: string) {
  if (!value) {
    return null;
  }

  const today = new Date();
  const dueDate = new Date(value);
  const diff = dueDate.getTime() - today.getTime();

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function DetailCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "blue"
}: {
  title: string;
  value: string;
  description: string;
  icon: typeof Building2;
  tone?: "blue" | "green" | "yellow" | "red";
}) {
  const colors = {
    blue: "bg-sme-blue text-white",
    green: "bg-emerald-500 text-white",
    yellow: "bg-sme-yellow text-sme-ink",
    red: "bg-red-500 text-white"
  };

  return (
    <article className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-3 text-2xl font-black text-sme-ink">{value}</p>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${colors[tone]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="rounded-md border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">{text}</p>;
}

function ResourceRows({ rows }: { rows: ResourceTransfer[] }) {
  if (!rows.length) {
    return <EmptyState text="Nenhum recurso vinculado a esta unidade ate o momento." />;
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Programa</th>
            <th className="px-4 py-3">Categoria</th>
            <th className="px-4 py-3">Liberado</th>
            <th className="px-4 py-3">Saldo</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((resource) => (
            <tr key={resource.id}>
              <td className="px-4 py-3 font-semibold text-sme-ink">{resource.program}</td>
              <td className="px-4 py-3 text-slate-600">{resource.category ?? "Outros"}</td>
              <td className="px-4 py-3 text-slate-600">{formatMoney(resource.amount)}</td>
              <td className="px-4 py-3 text-slate-600">{formatMoney(resource.balance)}</td>
              <td className="px-4 py-3"><StatusBadge status={resource.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AccountabilityRows({ rows }: { rows: Accountability[] }) {
  if (!rows.length) {
    return <EmptyState text="Nenhuma prestacao de contas cadastrada para esta unidade." />;
  }

  return (
    <div className="space-y-3">
      {rows.map((item) => {
        const remainingDays = daysUntil(item.dueDate);

        return (
          <article key={item.id} className="rounded-md border border-slate-200 bg-white p-4 shadow-soft">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-bold text-sme-ink">{item.reference}</p>
                <p className="mt-1 text-sm text-slate-600">
                  Prazo: {formatDate(item.dueDate)} | Envio: {item.submittedAt ? formatDate(item.submittedAt) : "pendente"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-600">
                  {remainingDays === null ? "Sem prazo" : remainingDays >= 0 ? `${remainingDays} dias` : `${Math.abs(remainingDays)} dias em atraso`}
                </span>
                <StatusBadge status={item.status} />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function DocumentRows({ rows }: { rows: DocumentRecord[] }) {
  if (!rows.length) {
    return <EmptyState text="Nenhum documento enviado para esta unidade." />;
  }

  return (
    <div className="space-y-3">
      {rows.slice(0, 6).map((document) => (
        <article key={document.id} className="rounded-md border border-slate-200 bg-white p-4 shadow-soft">
          <p className="font-bold text-sme-ink">{document.title}</p>
          <p className="mt-1 text-sm text-slate-600">
            {document.category} | Enviado em {formatDate(document.createdAt)}
          </p>
        </article>
      ))}
    </div>
  );
}

function CouncilSummary({ council }: { council?: Council }) {
  if (!council) {
    return (
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-black text-sme-ink">Conselho Escolar</h2>
        <EmptyState text="Nenhum conselho vinculado a esta unidade. Cadastre ou importe os dados do conselho para completar a ficha." />
      </section>
    );
  }

  const remainingDays = daysUntil(council.mandateEnd);

  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-black text-sme-ink">Conselho Escolar</h2>
          <p className="mt-1 text-sm text-slate-600">Presidente: {council.president}</p>
          <p className="text-sm text-slate-600">Vice-presidente: {council.vicePresident ?? "Nao informado"}</p>
        </div>
        <StatusBadge status={council.status} />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-md bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase text-slate-500">Mandato</p>
          <p className="mt-1 font-semibold text-sme-ink">{formatDate(council.mandateStart)} a {formatDate(council.mandateEnd)}</p>
        </div>
        <div className="rounded-md bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase text-slate-500">Dias restantes</p>
          <p className="mt-1 font-semibold text-sme-ink">{remainingDays === null ? "Sem prazo" : remainingDays >= 0 ? remainingDays : "Vencido"}</p>
        </div>
        <div className="rounded-md bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase text-slate-500">Membros</p>
          <p className="mt-1 font-semibold text-sme-ink">{council.members} de {council.expectedMembers ?? council.members}</p>
        </div>
        <div className="rounded-md bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase text-slate-500">Registro</p>
          <p className="mt-1 font-semibold text-sme-ink">{formatDate(council.registryDate)}</p>
        </div>
      </div>
    </section>
  );
}

export default async function SchoolUnitDetailPage({ params }: SchoolUnitDetailPageProps) {
  const decodedId = decodeURIComponent(params.id);
  const [units, councils, resources, accountabilities, documents, alerts] = await Promise.all([
    getSchoolUnits(),
    getCouncils(),
    getResources(),
    getAccountabilities(),
    getDocuments(),
    getAlerts()
  ]);
  const unit = units.find((item) => item.id === decodedId);

  if (!unit) {
    notFound();
  }

  const unitCouncils = councils.filter((item) => item.school === unit.name);
  const currentCouncil = unitCouncils[0];
  const unitResources = resources.filter((item) => item.school === unit.name);
  const unitAccountabilities = accountabilities.filter((item) => item.school === unit.name);
  const unitDocuments = documents.filter((item) => item.school === unit.name);
  const totalResources = unitResources.reduce((sum, item) => sum + item.amount, 0);
  const totalBalance = unitResources.reduce((sum, item) => sum + item.balance, 0);
  const pendingAccountabilities = unitAccountabilities.filter((item) => item.status !== "regular").length;
  const activeAlerts = alerts.filter((item) => item.severity !== "baixa").slice(0, 3);

  return (
    <div className="space-y-6">
      <Link href="/unidades" className="inline-flex items-center gap-2 text-sm font-bold text-sme-blue hover:text-sme-navy">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Voltar para unidades
      </Link>

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-sme-blue text-white">
              <Building2 className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Ficha da unidade escolar</p>
              <h1 className="mt-1 text-2xl font-black text-sme-ink">{unit.name}</h1>
              <p className="mt-2 text-sm text-slate-600">
                {unit.type} | INEP {unit.inep || "nao informado"} | {unit.district || "bairro nao informado"}
              </p>
            </div>
          </div>
          <StatusBadge status={unit.councilStatus} />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DetailCard title="Gestor responsavel" value={unit.manager || "Nao informado"} description="Responsavel principal pela unidade." icon={Users} />
        <DetailCard title="Recursos recebidos" value={formatMoney(totalResources)} description={`${unitResources.length} registros financeiros vinculados.`} icon={Landmark} tone="green" />
        <DetailCard title="Saldo disponivel" value={formatMoney(totalBalance)} description="Valor ainda em acompanhamento." icon={ClipboardCheck} tone="yellow" />
        <DetailCard title="Prestacoes pendentes" value={String(pendingAccountabilities)} description="Obrigacoes que exigem acompanhamento." icon={Bell} tone={pendingAccountabilities > 0 ? "red" : "blue"} />
      </section>

      <CouncilSummary council={currentCouncil} />

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-sme-blue" aria-hidden="true" />
            <h2 className="text-lg font-black text-sme-ink">Recursos da unidade</h2>
          </div>
          <ResourceRows rows={unitResources} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-sme-blue" aria-hidden="true" />
            <h2 className="text-lg font-black text-sme-ink">Prestacao de contas</h2>
          </div>
          <AccountabilityRows rows={unitAccountabilities} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-sme-blue" aria-hidden="true" />
            <h2 className="text-lg font-black text-sme-ink">Documentos enviados</h2>
          </div>
          <DocumentRows rows={unitDocuments} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-sme-blue" aria-hidden="true" />
            <h2 className="text-lg font-black text-sme-ink">Alertas relacionados</h2>
          </div>
          {activeAlerts.length ? (
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <article key={alert.id} className="rounded-md border border-slate-200 bg-white p-4 shadow-soft">
                  <p className="font-bold text-sme-ink">{alert.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{alert.description}</p>
                  <p className="mt-2 text-xs font-bold uppercase text-slate-500">Prazo: {formatDate(alert.dueDate)}</p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState text="Nenhum alerta prioritario relacionado no momento." />
          )}
        </div>
      </section>
    </div>
  );
}
