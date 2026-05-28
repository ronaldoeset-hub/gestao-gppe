import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  ClipboardCheck,
  FileArchive,
  GraduationCap,
  Landmark,
  ShieldCheck,
  UsersRound
} from "lucide-react";
import { ModuleHeader } from "@/components/module-header";

const dataActions = [
  {
    href: "/diagnostico-dados",
    title: "Ver diagnostico dos dados",
    description: "Confira automaticamente o que falta completar por unidade escolar.",
    icon: ClipboardCheck
  },
  {
    href: "/unidades#nova-unidade",
    title: "Cadastrar ou atualizar unidade escolar",
    description: "Inclua escola, creche ou CEMEI, com INEP, bairro e gestor responsavel.",
    icon: Building2
  },
  {
    href: "/conselhos#novo-conselho",
    title: "Alimentar dados do Conselho Escolar",
    description: "Registre presidente, membros, mandato, posse, cartorio e situacao.",
    icon: UsersRound
  },
  {
    href: "/recursos#novo-recurso",
    title: "Cadastrar recurso financeiro",
    description: "Informe programa, unidade, valor liberado, saldo, categoria e status.",
    icon: Landmark
  },
  {
    href: "/prestacao-contas#nova-prestacao",
    title: "Registrar prestacao de contas",
    description: "Controle referencia, prazo, envio, protocolo e status de analise.",
    icon: ClipboardCheck
  },
  {
    href: "/documentos",
    title: "Enviar documentos",
    description: "Anexe atas, editais, notas, pareceres, comprovantes e documentos obrigatorios.",
    icon: FileArchive
  },
  {
    href: "/recursos-educacionais-cadastro",
    title: "Cadastrar recurso educacional",
    description: "Publique materiais pedagogicos, orientacoes, modelos e links no portal publico.",
    icon: GraduationCap
  },
  {
    href: "/alertas#novo-alerta",
    title: "Criar alerta ou prazo",
    description: "Cadastre avisos de vencimento, pendencias e prioridades de acompanhamento.",
    icon: AlertTriangle
  },
  {
    href: "/perfis",
    title: "Alterar perfil de acesso",
    description: "Vincule usuario ao perfil correto: SME, GPPE, gestor ou conselho escolar.",
    icon: ShieldCheck
  }
];

export default function FeedDataPage() {
  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Alimentar e alterar informacoes"
        description="Central de acesso rapido para inserir, complementar e manter os dados do sistema GPPE atualizados."
        icon={ClipboardCheck}
      />

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {dataActions.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex min-h-36 items-start justify-between gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-sme-blue hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2"
            >
              <div className="flex gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-sme-blue text-white transition group-hover:scale-105">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-black text-sme-ink">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              </div>
              <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-sme-blue" aria-hidden="true" />
            </Link>
          );
        })}
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-black text-sme-ink">Fluxo recomendado</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {["Unidade", "Conselho", "Recurso", "Prestacao e documentos"].map((step, index) => (
            <div key={step} className="rounded-md bg-blue-50 p-4">
              <p className="text-xs font-black uppercase text-sme-blue">Etapa {index + 1}</p>
              <p className="mt-2 font-bold text-sme-ink">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
