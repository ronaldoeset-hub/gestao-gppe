import { LifeBuoy, MessageSquare, TimerReset } from "lucide-react";
import { SupportTicketForm } from "@/components/linked-record-forms";
import { Badge, Card, CardContent, CardHeader, CardTitle, EmptyState, PageHeader } from "@/components/ui";
import { getSupportTickets } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils";

const priorityTone = {
  baixa: "info",
  media: "warning",
  alta: "danger",
  critica: "danger"
} as const;

export default async function UnitSupportPage() {
  const tickets = await getSupportTickets();
  const openTickets = tickets.filter((ticket) => ticket.status !== "resolvido" && ticket.status !== "cancelado");
  const urgentTickets = tickets.filter((ticket) => ticket.priority === "alta" || ticket.priority === "critica");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suporte as Unidades"
        description="Acompanhamento de chamados, orientacoes e pendencias de atendimento das escolas e creches."
        breadcrumbs={[{ label: "Inicio", href: "/dashboard" }, { label: "Suporte as Unidades" }]}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Metric icon={LifeBuoy} label="Chamados abertos" value={String(openTickets.length)} />
        <Metric icon={TimerReset} label="Urgentes" value={String(urgentTickets.length)} />
        <Metric icon={MessageSquare} label="Total registrado" value={String(tickets.length)} />
      </section>

      <SupportTicketForm />

      <Card>
        <CardHeader>
          <CardTitle>Fila de atendimento</CardTitle>
          <p className="text-sm text-neutral-600">Chamados vinculados a unidade para orientar o trabalho do GPPE.</p>
        </CardHeader>
        <CardContent>
          {tickets.length ? (
            <div className="grid gap-3">
              {tickets.map((ticket) => (
                <article key={ticket.id} className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="font-bold text-neutral-900">{ticket.title}</h2>
                      <p className="mt-1 text-sm font-semibold text-neutral-600">{ticket.school}</p>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">{ticket.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <Badge tone={priorityTone[ticket.priority]}>{ticket.priority}</Badge>
                      <Badge tone={ticket.status === "resolvido" ? "success" : "info"}>{ticket.status}</Badge>
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-semibold text-neutral-500">Aberto em {formatDate(ticket.createdAt)}</p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="Nenhum chamado aberto" description="Quando uma unidade precisar de apoio, registre o chamado no formulario acima." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof LifeBuoy; label: string; value: string }) {
  return (
    <Card className="p-5">
      <Icon className="h-5 w-5 text-primary-700" aria-hidden="true" />
      <p className="mt-4 text-xs font-bold uppercase text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-neutral-900">{value}</p>
    </Card>
  );
}
