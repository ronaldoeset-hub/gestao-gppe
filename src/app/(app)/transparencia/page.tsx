import { BarChart3, Download, Landmark, Percent } from "lucide-react";
import { ExportButtons } from "@/components/export-buttons";
import { Badge, Card, CardContent, CardHeader, CardTitle, PageHeader } from "@/components/ui";
import { getResources } from "@/lib/supabase/queries";
import { formatCurrency } from "@/lib/utils";

export default async function TransparenciaPage() {
  const resources = await getResources();
  const totalReceived = resources.reduce((sum, item) => sum + item.amount, 0);
  const totalBalance = resources.reduce((sum, item) => sum + item.balance, 0);
  const totalSpent = Math.max(totalReceived - totalBalance, 0);
  const executionPercent = totalReceived > 0 ? Math.round((totalSpent / totalReceived) * 100) : 0;

  const programRows = Object.entries(
    resources.reduce<Record<string, { received: number; spent: number; balance: number; units: Set<string> }>>((acc, item) => {
      acc[item.program] ??= { received: 0, spent: 0, balance: 0, units: new Set<string>() };
      acc[item.program].received += item.amount;
      acc[item.program].balance += item.balance;
      acc[item.program].spent += Math.max(item.amount - item.balance, 0);
      acc[item.program].units.add(item.school);
      return acc;
    }, {})
  ).map(([program, values]) => ({
    program,
    received: values.received,
    spent: values.spent,
    balance: values.balance,
    units: values.units.size,
    execution: values.received > 0 ? Math.round((values.spent / values.received) * 100) : 0
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transparencia"
        description="Consolidado de saldos por programa. Quando os recursos forem atualizados, esta area reflete automaticamente os novos valores."
        breadcrumbs={[{ label: "Inicio", href: "/dashboard" }, { label: "Transparencia" }]}
        actions={<ExportButtons filename="transparencia-programas-gppe" rows={programRows.map((row) => ({ Programa: row.program, Recebido: row.received, Gasto: row.spent, Saldo: row.balance, Unidades: row.units, Execucao: `${row.execution}%` }))} />}
      />

      <section className="grid gap-4 md:grid-cols-4">
        <TransparencyMetric icon={Landmark} label="Recebido" value={formatCurrency(totalReceived)} />
        <TransparencyMetric icon={Download} label="Gasto" value={formatCurrency(totalSpent)} />
        <TransparencyMetric icon={BarChart3} label="Saldo" value={formatCurrency(totalBalance)} />
        <TransparencyMetric icon={Percent} label="Execucao" value={`${executionPercent}%`} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Saldo separado por programa</CardTitle>
          <p className="text-sm leading-6 text-neutral-600">Use esta tabela para conferir rapidamente recebido, gasto, saldo e percentual executado.</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-neutral-500">Programa</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-neutral-500">Recebido</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-neutral-500">Gasto</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-neutral-500">Saldo</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-neutral-500">Execucao</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {programRows.map((row) => (
                  <tr key={row.program} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-bold text-neutral-900">{row.program}</td>
                    <td className="px-4 py-3 text-neutral-700">{formatCurrency(row.received)}</td>
                    <td className="px-4 py-3 text-neutral-700">{formatCurrency(row.spent)}</td>
                    <td className="px-4 py-3 text-neutral-700">{formatCurrency(row.balance)}</td>
                    <td className="px-4 py-3"><Badge tone={row.execution >= 80 ? "success" : row.execution >= 40 ? "warning" : "info"}>{row.execution}%</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TransparencyMetric({ icon: Icon, label, value }: { icon: typeof Landmark; label: string; value: string }) {
  return (
    <Card className="p-5">
      <Icon className="h-5 w-5 text-primary-700" aria-hidden="true" />
      <p className="mt-4 text-xs font-bold uppercase text-neutral-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-neutral-900">{value}</p>
    </Card>
  );
}
