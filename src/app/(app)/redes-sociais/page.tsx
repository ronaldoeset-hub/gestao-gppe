import type { Metadata } from "next";
import { ExternalLink, Globe, Radio } from "lucide-react";
import { ModuleHeader } from "@/components/module-header";

export const metadata: Metadata = {
  title: "Canais e Redes Sociais",
  description: "Links oficiais e canais de comunicação da Secretaria Municipal de Educação."
};

export const revalidate = 3600;

const CANAIS = [
  {
    nome: "Site oficial da SME",
    handle: "smeaguaslindas.com",
    descricao: "Portal oficial da Secretaria Municipal de Educação de Águas Lindas de Goiás com notícias, editais e documentos.",
    link: "https://smeaguaslindas.com/",
    categoria: "Portal Oficial",
    cor: "border-sme-blue/30 bg-sme-blue-soft"
  },
  {
    nome: "Portal da Prefeitura",
    handle: "aguaslindasdegoias.go.gov.br",
    descricao: "Portal da Prefeitura Municipal com atos oficiais, editais e transparência pública.",
    link: "https://aguaslindasdegoias.go.gov.br",
    categoria: "Portal Oficial",
    cor: "border-sme-navy/20 bg-sme-surface"
  },
  {
    nome: "FNDE — Fundo Nacional de Desenvolvimento da Educação",
    handle: "fnde.gov.br",
    descricao: "Portal do FNDE com legislação, programas, transferências e prestação de contas do PDDE.",
    link: "https://www.fnde.gov.br",
    categoria: "Órgãos Federais",
    cor: "border-sme-green/20 bg-emerald-50"
  },
  {
    nome: "MEC — Ministério da Educação",
    handle: "mec.gov.br",
    descricao: "Portal do Ministério da Educação com programas, dados e diretrizes nacionais.",
    link: "https://www.gov.br/mec",
    categoria: "Órgãos Federais",
    cor: "border-sme-green/20 bg-emerald-50"
  },
  {
    nome: "INEP — Censo Escolar",
    handle: "inep.gov.br",
    descricao: "Instituto Nacional de Estudos e Pesquisas Educacionais. Acesso ao Censo Escolar e dados de matrículas.",
    link: "https://www.gov.br/inep",
    categoria: "Órgãos Federais",
    cor: "border-sme-green/20 bg-emerald-50"
  },
  {
    nome: "SEDUC-GO — Secretaria Estadual de Educação",
    handle: "seduc.go.gov.br",
    descricao: "Secretaria de Estado da Educação de Goiás. Programas, legislação estadual e suporte pedagógico.",
    link: "https://seduc.go.gov.br",
    categoria: "Governo Estadual",
    cor: "border-sme-gold/20 bg-amber-50"
  },
  {
    nome: "TCE-GO — Tribunal de Contas do Estado",
    handle: "tce.go.gov.br",
    descricao: "Tribunal de Contas de Goiás. Controle externo das contas públicas municipais.",
    link: "https://www.tce.go.gov.br",
    categoria: "Controle Externo",
    cor: "border-sme-red/20 bg-red-50"
  }
];

const CATEGORIAS = Array.from(new Set(CANAIS.map((c) => c.categoria)));

export default function RedesSociaisPage() {
  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Canais e Links Oficiais"
        description="Links para portais institucionais, órgãos de controle e sistemas oficiais utilizados pela GPPE."
        icon={Radio}
      />

      <div className="space-y-5">
        {CATEGORIAS.map((categoria) => {
          const itens = CANAIS.filter((c) => c.categoria === categoria);
          return (
            <section key={categoria} className="rounded-2xl border border-sme-line bg-white p-5 shadow-soft-sm">
              <h2 className="font-display mb-4 font-bold text-sme-navy">{categoria}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {itens.map((canal) => (
                  <a
                    key={canal.nome}
                    href={canal.link}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-start gap-4 rounded-xl border-2 p-4 transition hover:-translate-y-0.5 hover:shadow-soft ${canal.cor}`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-soft-sm">
                      <Globe className="h-5 w-5 text-sme-blue" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sme-navy">{canal.nome}</p>
                      <p className="mt-0.5 text-xs font-medium text-sme-blue">{canal.handle}</p>
                      <p className="mt-1 text-sm text-sme-muted">{canal.descricao}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-sme-muted" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
