import {
  AlertTriangle,
  Banknote,
  ClipboardCheck,
  FileText,
  ListChecks,
  ReceiptText,
  WalletCards
} from "lucide-react";
import { DataTable } from "@/components/data-table";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import type { FinancialControl } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function safeDate(value?: string) {
  return value ? formatDate(value) : "Nao informado";
}

export function FinancialControlPanel({ control }: { control: FinancialControl }) {
  const received = sum(control.allocations.map((item) => item.receivedAmount));
  const planned = sum(control.allocations.map((item) => item.plannedAmount));
  const balance = sum(control.allocations.map((item) => item.currentBalance));
  const executed = sum(control.movements.map((item) => item.amount));
  const pendingReports = control.reports.filter((item) => ["pendente", "vencido"].includes(item.status)).length;
  const openAlerts = control.alerts.filter((item) => item.status !== "resolvido").length;

  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Planejado" value={formatCurrency(planned)} detail="Plano de aplicacao" icon={ListChecks} />
        <StatCard label="Recebido" value={formatCurrency(received)} detail="Repasses por unidade" icon={Banknote} />
        <StatCard label="Executado" value={formatCurrency(executed)} detail="Movimentacoes pagas" icon={ReceiptText} />
        <StatCard label="Saldo" value={formatCurrency(balance)} detail={`${pendingReports} prestacoes pendentes`} icon={WalletCards} />
      </div>

      <FinancialSection
        id="repasses"
        title="Repasses por unidade"
        description="Valores planejados, recebidos e saldo por programa, periodo e tipo de recurso."
      >
        <DataTable
          rows={control.allocations}
          columns={[
            { key: "school", header: "Unidade", render: (row) => row.school },
            { key: "program", header: "Programa", render: (row) => row.program },
            { key: "period", header: "Periodo", render: (row) => row.period },
            { key: "type", header: "Tipo", render: (row) => row.resourceType },
            { key: "received", header: "Recebido", render: (row) => formatCurrency(row.receivedAmount) },
            { key: "balance", header: "Saldo", render: (row) => formatCurrency(row.currentBalance) },
            { key: "status", header: "Status", render: (row) => row.status === "encerrado" ? "Encerrado" : <StatusBadge status={row.status} /> }
          ]}
        />
      </FinancialSection>

      <FinancialSection
        id="planejamento"
        title="Planejamento de recursos"
        description="Itens de custeio e capital com quantidade, unidade, valor unitario e valor total."
      >
        <DataTable
          rows={control.planItems}
          columns={[
            { key: "school", header: "Unidade", render: (row) => row.school },
            { key: "item", header: "Item", render: (row) => <span className="font-semibold text-sme-ink">{row.itemName}</span> },
            { key: "category", header: "Categoria", render: (row) => row.category ?? "Nao informada" },
            { key: "quantity", header: "Qtd.", render: (row) => `${row.quantity} ${row.unitLabel ?? ""}` },
            { key: "unitPrice", header: "Valor unit.", render: (row) => formatCurrency(row.unitPrice) },
            { key: "total", header: "Valor total", render: (row) => formatCurrency(row.plannedTotal) },
            { key: "status", header: "Situacao", render: (row) => row.status }
          ]}
        />
      </FinancialSection>

      <FinancialSection
        id="movimentacoes"
        title="Movimentacoes e pagamentos"
        description="Compras, pagamentos, devolucoes e ajustes vinculados ao planejamento financeiro."
      >
        <DataTable
          rows={control.movements}
          columns={[
            { key: "school", header: "Unidade", render: (row) => row.school },
            { key: "type", header: "Tipo", render: (row) => row.type },
            { key: "supplier", header: "Fornecedor", render: (row) => row.supplier ?? "Nao informado" },
            { key: "document", header: "Documento", render: (row) => row.documentNumber ?? "Sem numero" },
            { key: "paidAt", header: "Pagamento", render: (row) => safeDate(row.paidAt) },
            { key: "amount", header: "Valor", render: (row) => formatCurrency(row.amount) },
            { key: "status", header: "Status", render: (row) => row.status }
          ]}
        />
      </FinancialSection>

      <div className="grid gap-5 xl:grid-cols-2">
        <FinancialSection
          id="documentos-comprobatorios"
          title="Documentos comprobatorios"
          description="Notas fiscais, extratos, comprovantes e anexos financeiros vinculados ao Storage."
        >
          <DataTable
            rows={control.documents}
            columns={[
              { key: "school", header: "Unidade", render: (row) => row.school },
              { key: "title", header: "Documento", render: (row) => row.title },
              { key: "category", header: "Categoria", render: (row) => row.category },
              { key: "date", header: "Data", render: (row) => safeDate(row.documentDate) }
            ]}
          />
        </FinancialSection>

        <FinancialSection
          id="prestacao-contas"
          title="Prestacao de contas"
          description="Prazos, envio, parecer e saldo para encerramento da aplicacao dos recursos."
        >
          <DataTable
            rows={control.reports}
            columns={[
              { key: "school", header: "Unidade", render: (row) => row.school },
              { key: "reference", header: "Referencia", render: (row) => row.reference },
              { key: "due", header: "Prazo", render: (row) => formatDate(row.dueDate) },
              { key: "executed", header: "Executado", render: (row) => formatCurrency(row.executedAmount) },
              { key: "status", header: "Status", render: (row) => row.status }
            ]}
          />
        </FinancialSection>
      </div>

      <FinancialSection
        id="alertas-vencimentos"
        title="Alertas e vencimentos"
        description={`${openAlerts} alerta(s) aberto(s) para prazos, documentos, saldos e prestacoes.`}
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {control.alerts.map((alert) => (
            <div key={alert.id} className="rounded-md border border-slate-200 bg-white p-4 shadow-soft">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-700">
                  <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sme-ink">{alert.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{alert.description}</p>
                  <p className="mt-2 text-xs font-bold uppercase text-slate-500">{alert.school} - {safeDate(alert.dueDate)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </FinancialSection>
    </section>
  );
}

function FinancialSection({
  id,
  title,
  description,
  children
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-sme-blue">
          {id.includes("documentos") ? (
            <FileText className="h-5 w-5" aria-hidden="true" />
          ) : id.includes("prestacao") ? (
            <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
          ) : (
            <ListChecks className="h-5 w-5" aria-hidden="true" />
          )}
        </div>
        <div>
          <h2 className="text-lg font-bold text-sme-ink">{title}</h2>
          <p className="text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
