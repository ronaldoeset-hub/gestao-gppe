import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BarChart3, Building2, ClipboardCheck, Landmark, UsersRound } from "lucide-react";
import { InfoCard } from "@/components/info-card";
import { ModuleHeader } from "@/components/module-header";

export const metadata: Metadata = {
  title: "Gestão escolar",
  description: "Visão operacional de dados escolares, unidades e acompanhamento administrativo."
};

const links = [
  { href: "/dashboard", label: "Painel geral", description: "Resumo municipal de unidades, conselhos, recursos e pendencias." },
  { href: "/unidades", label: "Unidades escolares", description: "Cadastro e ficha de cada escola, creche ou CEMEI." },
  { href: "/recursos", label: "Recursos financeiros", description: "Valores recebidos, saldos, programas e situacao de execucao." },
  { href: "/prestacao-contas", label: "Prestacao de contas", description: "Prazos, protocolos, status e acompanhamento por unidade." }
];

export default function GestaoEscolarPage() {
  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Gestao Escolar"
        description="Visao completa para acompanhar os recursos municipais, a execucao financeira e a regularidade das unidades de ensino."
        icon={BarChart3}
      />

      <section className="grid gap-4 lg:grid-cols-4">
        <InfoCard icon={Building2} title="Unidades" description="Base das escolas, creches e CEMEI com gestor, bairro, INEP e ficha individual." />
        <InfoCard icon={Landmark} title="Recursos" description="Consulta por programa, unidade, categoria, valor recebido, saldo e situacao." />
        <InfoCard icon={ClipboardCheck} title="Obrigacoes" description="Prestacoes de contas, prazos, pendencias e encaminhamentos necessarios." />
        <InfoCard icon={UsersRound} title="Conselhos" description="Mandatos, membros, documentacao e situacao de regularidade do conselho escolar." />
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-black text-sme-ink">Acessos da gestao escolar</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center justify-between gap-4 rounded-md border border-slate-200 p-4 hover:border-sme-blue hover:bg-blue-50">
              <div>
                <p className="font-black text-[#003b7a]">{item.label}</p>
                <p className="mt-1 text-sm text-slate-600">{item.description}</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-sme-blue" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
