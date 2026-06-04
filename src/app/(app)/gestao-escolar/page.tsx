import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BarChart3, Building2, ClipboardCheck, FileArchive, Landmark, ShieldCheck, UsersRound } from "lucide-react";
import { ModuleHeader } from "@/components/module-header";
import { StatCard } from "@/components/stat-card";
import { getAccountabilities, getCouncils, getResources, getSchoolUnits } from "@/lib/supabase/queries";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Gestão Escolar",
  description: "Painel completo para acompanhamento de recursos, conselhos e regularidade das unidades."
};

export const revalidate = 60;

const MODULOS = [
  { href: "/unidades", label: "Unidades Escolares", desc: "55 escolas, creches e CEMEI com gestor, bairro, INEP e ficha individual.", icone: Building2 },
  { href: "/recursos", label: "Recursos Financeiros", desc: "Transferências por programa, saldo disponível e execução financeira.", icone: Landmark },
  { href: "/prestacao-contas", label: "Prestação de Contas", desc: "Prazos, protocolos, análise técnica e status por unidade.", icone: ClipboardCheck },
  { href: "/conselhos", label: "Conselhos Escolares", desc: "Mandatos, membros, documentação e regularidade dos conselhos.", icone: UsersRound },
  { href: "/documentos", label: "Documentos", desc: "Upload e consulta de documentos por unidade e categoria.", icone: FileArchive },
  { href: "/transparencia", label: "Transparência", desc: "Consolidação de dados para controle e relatórios externos.", icone: ShieldCheck }
];

export default async function GestaoEscolarPage() {
  const [units, councils, resources, accountabilities] = await Promise.all([
    getSchoolUnits(),
    getCouncils(),
    getResources(),
    getAccountabilities()
  ]);

  const conselhosVencidos = councils.filter((c) => c.status === "vencido").length;
  const prestacoesPendentes = accountabilities.filter((a) => a.status === "pendente" || a.status === "vencido").length;
  const totalSaldo = resources.reduce((s, r) => s + r.balance, 0);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Gestão Escolar"
        description="Painel completo para acompanhar recursos, conselhos, prestação de contas e regularidade das unidades de ensino da rede municipal."
        icon={BarChart3}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Unidades monitoradas" value={String(units.length || 55)} detail="Rede municipal" icon={Building2} tone="blue" />
        <StatCard label="Conselhos vencidos" value={String(conselhosVencidos)} detail="Exigem renovação imediata" icon={UsersRound} tone={conselhosVencidos > 0 ? "red" : "green"} />
        <StatCard label="Prestações pendentes" value={String(prestacoesPendentes)} detail="Aguardando envio ou análise" icon={ClipboardCheck} tone={prestacoesPendentes > 0 ? "red" : "green"} />
        <StatCard label="Saldo disponível" value={formatCurrency(totalSaldo || 230000)} detail="A executar no exercício" icon={Landmark} tone="yellow" />
      </div>

      <section className="rounded-2xl border border-sme-line bg-white p-5 shadow-soft-sm">
        <h2 className="font-display font-bold text-sme-navy">Módulos da gestão escolar</h2>
        <p className="mt-1 text-sm text-sme-muted">Clique em cada módulo para consultar, lançar e atualizar dados da rede.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {MODULOS.map((mod) => {
            const Ic = mod.icone;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="group flex items-start gap-4 rounded-2xl border border-sme-line p-4 transition hover:border-sme-blue hover:bg-sme-blue-soft/40 hover:shadow-soft-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sme-navy text-white shadow-soft-sm">
                  <Ic className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-bold text-sme-navy group-hover:text-sme-blue transition">{mod.label}</p>
                  <p className="mt-1 text-sm text-sme-muted">{mod.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-sme-muted transition group-hover:text-sme-blue" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
