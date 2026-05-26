import { ArrowRight, Search } from "lucide-react";
import { EduConectaCards } from "@/components/educonecta-cards";
import { MockChart } from "@/components/mock-chart";
import type { EduModule } from "@/data/educonecta";

export function EduConectaModulePage({ module }: { module: EduModule }) {
  const Icon = module.icon;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
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
              <button key={action} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-blue-700 hover:bg-blue-50">
                {action}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {module.key === "parceiros" ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-950">
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px]">
          <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-300 px-3">
            <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <input className="w-full border-0 outline-none" placeholder={`Buscar em ${module.title.toLowerCase()}`} />
          </div>
          <select className="h-11 rounded-xl border border-slate-300 px-3 text-sm font-semibold text-slate-700">
            <option>Todos os status</option>
            <option>Vigente</option>
            <option>Pendente</option>
            <option>Vencido</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {module.columns.map((column) => (
                  <th key={column.key} className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase text-slate-500">
                    {column.header}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-black uppercase text-slate-500">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {module.rows.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  {module.columns.map((column) => (
                    <td key={column.key} className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {row[column.key] ?? "-"}
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-4 py-3">
                    <button className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700">Detalhes</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
