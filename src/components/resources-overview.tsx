import { BarChart3, Landmark, WalletCards, type LucideIcon } from "lucide-react";
import type { ResourceTransfer } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

export function ResourcesOverview({ resources }: { resources: ResourceTransfer[] }) {
  const total = sum(resources.map((resource) => resource.amount));
  const balance = sum(resources.map((resource) => resource.balance));
  const byCategory = ["Custeio", "Capital", "Outros"].map((category) => {
    const amount = sum(resources.filter((resource) => (resource.category ?? "Outros") === category).map((resource) => resource.amount));
    return { category, amount };
  });
  const max = Math.max(...byCategory.map((item) => item.amount), 1);
  const units = new Set(resources.map((resource) => resource.school)).size;

  return (
    <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
        <ResourceMetric label="Total monitorado" value={formatCurrency(total)} icon={Landmark} />
        <ResourceMetric label="Saldo disponivel" value={formatCurrency(balance)} icon={WalletCards} />
        <ResourceMetric label="Unidades com recurso" value={String(units)} icon={BarChart3} />
      </div>
      <div className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Visao dinamica</p>
            <h2 className="text-lg font-bold text-sme-ink">Recursos por tipo de aplicacao</h2>
          </div>
          <p className="text-sm font-semibold text-slate-500">Base preparada para Custeio, Capital e outros programas.</p>
        </div>
        <div className="mt-6 space-y-4">
          {byCategory.map((item) => {
            const width = `${Math.max((item.amount / max) * 100, item.amount ? 8 : 0)}%`;
            return (
              <div key={item.category}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="font-bold text-sme-ink">{item.category}</span>
                  <span className="font-semibold text-slate-600">{formatCurrency(item.amount)}</span>
                </div>
                <div className="h-9 overflow-hidden rounded-md bg-slate-100">
                  <div className="flex h-full items-center rounded-md bg-sme-blue px-3 text-xs font-bold text-white" style={{ width }}>
                    {item.amount > 0 ? item.category : ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {resources.slice(0, 4).map((resource) => (
            <div key={resource.id} className="rounded-md border border-slate-200 p-3">
              <p className="truncate text-sm font-bold text-sme-ink">{resource.school}</p>
              <p className="mt-1 text-sm text-slate-500">{resource.program}</p>
              <p className="mt-2 text-base font-black text-sme-blue">{formatCurrency(resource.amount)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResourceMetric({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-600">{label}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-sme-yellow text-sme-ink">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-4 text-2xl font-black text-sme-ink">{value}</p>
    </div>
  );
}
