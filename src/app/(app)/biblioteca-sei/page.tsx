import type { Metadata } from "next";
import { BookOpen, Download, ExternalLink, FileText } from "lucide-react";
import { ModuleHeader } from "@/components/module-header";

export const metadata: Metadata = {
  title: "Biblioteca SEI",
  description: "Modelos administrativos, formulários e documentos de referência para a gestão escolar."
};

export const revalidate = 60;

type Modelo = {
  id: string;
  nome: string;
  descricao: string;
  tipo: string;
  categoria: string;
  link?: string;
};

const MODELOS: Modelo[] = [
  { id: "m1", nome: "Modelo de Ofício — GPPE", descricao: "Ofício padrão para comunicações entre escola e Secretaria de Educação.", tipo: "DOCX", categoria: "Ofícios e Comunicados" },
  { id: "m2", nome: "Modelo de Despacho Interno", descricao: "Despacho para encaminhamento interno de processos administrativos.", tipo: "DOCX", categoria: "Ofícios e Comunicados" },
  { id: "m3", nome: "Modelo de Memorando", descricao: "Memorando para comunicação formal entre setores da SME.", tipo: "DOCX", categoria: "Ofícios e Comunicados" },
  { id: "m4", nome: "Ata de Eleição do Conselho Escolar", descricao: "Modelo padronizado de ata para registro da eleição dos membros do conselho.", tipo: "DOCX", categoria: "Conselhos Escolares" },
  { id: "m5", nome: "Ata de Posse do Conselho Escolar", descricao: "Modelo de ata para a cerimônia de posse dos membros eleitos.", tipo: "DOCX", categoria: "Conselhos Escolares" },
  { id: "m6", nome: "Ata de Reunião do Conselho", descricao: "Modelo para registro das reuniões ordinárias e extraordinárias do conselho.", tipo: "DOCX", categoria: "Conselhos Escolares" },
  { id: "m7", nome: "Lista de Membros do Conselho", descricao: "Planilha para registrar nome, segmento, função e assinatura dos membros.", tipo: "XLSX", categoria: "Conselhos Escolares" },
  { id: "m8", nome: "Plano de Aplicação PDDE", descricao: "Planilha de planejamento de gastos por categoria (custeio e capital).", tipo: "XLSX", categoria: "PDDE e Financeiro" },
  { id: "m9", nome: "Planilha de Execução Financeira", descricao: "Controle mensal de receitas, despesas e saldo por programa PDDE.", tipo: "XLSX", categoria: "PDDE e Financeiro" },
  { id: "m10", nome: "Formulário de Prestação de Contas", descricao: "Relatório padrão para prestação de contas ao FNDE.", tipo: "PDF", categoria: "PDDE e Financeiro" },
  { id: "m11", nome: "Declaração de Regularidade", descricao: "Declaração para atestar a regularidade da unidade escolar junto à SME.", tipo: "DOCX", categoria: "Formulários" },
  { id: "m12", nome: "Requerimento de Aprovação de Despesa", descricao: "Formulário para solicitar aprovação de gastos pelo Conselho Escolar.", tipo: "DOCX", categoria: "Formulários" },
  {
    id: "m13",
    nome: "Portal PDDE Interativo — FNDE",
    descricao: "Sistema oficial do FNDE para prestação de contas e consulta de transferências.",
    tipo: "Link",
    categoria: "Links Oficiais",
    link: "https://www.fnde.gov.br/index.php/programas/pdde"
  },
  {
    id: "m14",
    nome: "SIGEF — Sistema de Gestão Financeira",
    descricao: "Sistema do FNDE para acompanhamento financeiro e prestação de contas.",
    tipo: "Link",
    categoria: "Links Oficiais",
    link: "https://www.fnde.gov.br/sigefweb"
  }
];

const CATEGORIAS = Array.from(new Set(MODELOS.map((m) => m.categoria)));

const tipoColor: Record<string, string> = {
  DOCX: "bg-sme-blue-soft text-sme-blue",
  XLSX: "bg-emerald-50 text-sme-green",
  PDF: "bg-red-50 text-sme-red",
  Link: "bg-amber-50 text-sme-gold"
};

export default function BibliotecaSeiPage() {
  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Biblioteca SEI"
        description="Modelos de ofícios, atas, planilhas e documentos de referência para a gestão administrativa das unidades escolares."
        icon={BookOpen}
      />

      <div className="space-y-6">
        {CATEGORIAS.map((categoria) => {
          const itens = MODELOS.filter((m) => m.categoria === categoria);
          return (
            <section key={categoria} className="rounded-2xl border border-sme-line bg-white p-5 shadow-soft-sm">
              <h2 className="font-display font-bold text-sme-navy">{categoria}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {itens.map((modelo) => (
                  <div key={modelo.id} className="flex items-start gap-3 rounded-xl border border-sme-line bg-sme-surface p-4 transition hover:border-sme-blue hover:bg-sme-blue-soft/30">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-soft-sm">
                      {modelo.tipo === "Link" ? (
                        <ExternalLink className="h-4 w-4 text-sme-blue" aria-hidden="true" />
                      ) : (
                        <FileText className="h-4 w-4 text-sme-blue" aria-hidden="true" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-sme-ink">{modelo.nome}</p>
                      <p className="mt-0.5 text-xs text-sme-muted">{modelo.descricao}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${tipoColor[modelo.tipo] ?? "bg-sme-surface text-sme-muted"}`}>
                          {modelo.tipo}
                        </span>
                        {modelo.link ? (
                          <a
                            href={modelo.link}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-xs font-semibold text-sme-blue hover:underline"
                          >
                            Acessar
                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
                          </a>
                        ) : (
                          <button type="button" className="flex items-center gap-1 text-xs font-semibold text-sme-blue hover:underline">
                            <Download className="h-3 w-3" aria-hidden="true" />
                            Baixar modelo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
