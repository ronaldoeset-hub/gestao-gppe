import { AlertTriangle, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { EduConectaCards } from "@/components/educonecta-cards";
import { MockChart } from "@/components/mock-chart";
import type { EduModule } from "@/data/educonecta";

const demoModuleKeys = new Set(["analytics", "arquivos", "biblioteca-sei", "feedback", "ia-educacional", "mural", "parceiros", "redes-sociais"]);

export function EduConectaModulePage({ module }: { module: EduModule }) {
  const Icon = module.icon;
  const isDemoModule = demoModuleKeys.has(module.key);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-sme-blue text-white">
              <Icon className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-emerald-600">EduConecta</p>
              <h1 className="mt-1 text-3xl font-black text-slate-950">{module.title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{module.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {module.actions.slice(0, 4).map((action) => (
              <Button key={action} variant="secondary" className="px-3">
                {action}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {isDemoModule ? (
        <section className="flex gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-bold">Modulo demonstrativo</p>
            <p>Esta tela ainda usa registros ilustrativos ate a integracao final com tabelas, policies e dados reais do Supabase.</p>
          </div>
        </section>
      ) : null}

      {module.key === "parceiros" ? (
        <section className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-950">
          A presenca da empresa possui finalidade exclusivamente publicitaria e nao representa recomendacao oficial, credenciamento, preferencia ou garantia de contratacao.
        </section>
      ) : null}

      <EduConectaCards cards={module.cards} />

      <section className="grid gap-4 xl:grid-cols-[1fr_0.85fr]">
        <MockChart
          title={`Indicadores - ${module.title}`}
          values={module.cards.map((card, index) => ({ label: card.label, value: Number(String(card.value).replace(/\D/g, "")) || (index + 1) * 10 }))}
        />
        <MockChart
          title="Distribuicao"
          type="donut"
          values={module.cards.map((card, index) => ({ label: card.label, value: Number(String(card.value).replace(/\D/g, "")) || (index + 1) * 5 }))}
        />
      </section>

      <Card>
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px]">
          <label className="flex h-11 items-center gap-2 rounded-md border border-slate-300 px-3 focus-within:ring-2 focus-within:ring-sme-yellow">
            <span className="sr-only">Buscar</span>
            <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <input className="w-full border-0 outline-none" placeholder={`Buscar em ${module.title.toLowerCase()}`} />
          </label>
          <select aria-label="Filtrar por status" className="h-11 rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700">
            <option>Todos os status</option>
            <option>Vigente</option>
            <option>Pendente</option>
            <option>Vencido</option>
          </select>
        </div>

        <DataTable
          rows={module.rows}
          emptyDescription={`Nenhum registro encontrado em ${module.title.toLowerCase()}.`}
          columns={[
            ...module.columns.map((column) => ({
              key: column.key,
              header: column.header,
              render: (row: Record<string, string | number>) => row[column.key] ?? "-"
            })),
            {
              key: "actions",
              header: "Acoes",
              render: () => <Button variant="ghost" className="h-8 px-3 text-xs">Detalhes</Button>
            }
          ]}
        />
      </Card>
    </div>
  );
}
