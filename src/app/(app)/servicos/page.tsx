import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, ArrowRight, BarChart3, BookOpen, Bot, ClipboardCheck, FileArchive, FileText, FolderOpen, Landmark, MessageSquare, Radio, ShieldCheck, UsersRound } from "lucide-react";
import { ModuleHeader } from "@/components/module-header";

export const metadata: Metadata = {
  title: "Serviços",
  description: "Todos os serviços e módulos disponíveis no portal EduConecta GPPE."
};

export const revalidate = 3600;

const GRUPOS = [
  {
    titulo: "Gestão Financeira",
    cor: "border-sme-blue/20 bg-sme-blue-soft",
    icone: Landmark,
    itens: [
      { href: "/recursos", label: "Recursos PDDE", desc: "Transferências, saldos e execução por programa e unidade." },
      { href: "/prestacao-contas", label: "Prestação de Contas", desc: "Prazos, protocolos, análise e status por unidade." },
      { href: "/transparencia", label: "Transparência", desc: "Consolidação e exportação de dados financeiros." },
      { href: "/ranking-saldos", label: "Ranking de Saldos", desc: "Unidades com maiores saldos parados no exercício." }
    ]
  },
  {
    titulo: "Gestão de Conselhos",
    cor: "border-sme-green/20 bg-emerald-50",
    icone: UsersRound,
    itens: [
      { href: "/conselhos", label: "Conselhos Escolares", desc: "Mandatos, membros, documentação e regularidade." },
      { href: "/central-prazos", label: "Central de Prazos", desc: "Prazos críticos, vencimentos e ações necessárias." },
      { href: "/alertas", label: "Alertas", desc: "Avisos de vencimentos, pendências e prioridades." }
    ]
  },
  {
    titulo: "Unidades Escolares",
    cor: "border-sme-gold/20 bg-amber-50",
    icone: ClipboardCheck,
    itens: [
      { href: "/unidades", label: "Cadastro de Unidades", desc: "Ficha completa das 55 unidades municipais." },
      { href: "/gestao-escolar", label: "Gestão Escolar", desc: "Painel consolidado por unidade." },
      { href: "/diagnostico-dados", label: "Diagnóstico de Dados", desc: "Completude e qualidade dos dados cadastrados." }
    ]
  },
  {
    titulo: "Documentos e Arquivos",
    cor: "border-sme-muted/20 bg-sme-surface",
    icone: FileArchive,
    itens: [
      { href: "/documentos", label: "Documentos", desc: "Upload e consulta de documentos por unidade." },
      { href: "/arquivos", label: "Arquivos", desc: "Organização de arquivos administrativos." },
      { href: "/biblioteca-sei", label: "Biblioteca SEI", desc: "Modelos de ofícios, atas, planilhas e formulários." }
    ]
  },
  {
    titulo: "Ferramentas e Apoio",
    cor: "border-sme-navy/10 bg-sme-surface",
    icone: Bot,
    itens: [
      { href: "/ia-educacional", label: "IA Educacional", desc: "Respostas para dúvidas frequentes sobre PDDE e gestão." },
      { href: "/relatorios", label: "Relatórios", desc: "Geração e exportação de relatórios consolidados." },
      { href: "/analytics", label: "Indicadores", desc: "Painel de indicadores da rede municipal." },
      { href: "/alimentar-dados", label: "Alimentar Dados", desc: "Formulários para lançar dados no sistema." }
    ]
  },
  {
    titulo: "Comunicação e Informação",
    cor: "border-sme-blue/10 bg-sme-blue-soft/30",
    icone: MessageSquare,
    itens: [
      { href: "/mural", label: "Mural de Comunicados", desc: "Avisos, prazos e comunicados da GPPE." },
      { href: "/fnde-pdde", label: "FNDE e PDDE", desc: "Links e informações dos programas FNDE." },
      { href: "/redes-sociais", label: "Links Oficiais", desc: "Portais institucionais e órgãos parceiros." },
      { href: "/feedback", label: "Feedback", desc: "Envie sugestões, problemas ou elogios." }
    ]
  }
];

export default function ServicosPage() {
  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Serviços do Portal"
        description="Todos os módulos e funcionalidades disponíveis no EduConecta para gestores, técnicos e membros dos conselhos escolares."
        icon={ClipboardCheck}
      />

      <div className="space-y-5">
        {GRUPOS.map((grupo) => {
          const GIc = grupo.icone;
          return (
            <section key={grupo.titulo} className="rounded-2xl border border-sme-line bg-white p-5 shadow-soft-sm">
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${grupo.cor}`}>
                  <GIc className="h-4 w-4" aria-hidden="true" />
                </div>
                <h2 className="font-display font-bold text-sme-navy">{grupo.titulo}</h2>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {grupo.itens.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 rounded-xl border border-sme-line p-3 transition hover:border-sme-blue hover:bg-sme-blue-soft/30"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-sme-ink group-hover:text-sme-blue transition">{item.label}</p>
                      <p className="text-xs text-sme-muted">{item.desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-sme-muted transition group-hover:text-sme-blue" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
