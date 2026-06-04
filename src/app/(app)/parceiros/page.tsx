import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Building2, FileSearch, Network, ShieldCheck } from "lucide-react";
import { ModuleHeader } from "@/components/module-header";

export const metadata: Metadata = {
  title: "Compras publicas e parceiros",
  description: "Acesso orientado a licitacoes, compras publicas, transparencia e canais oficiais."
};

const links = [
  {
    title: "Licitacoes da Prefeitura",
    description: "Editais, avisos, modalidades, situacao dos certames e documentos publicados pelo municipio.",
    href: "https://aguaslindasdegoias.go.gov.br/portal/licitacoes-2/",
    icon: FileSearch
  },
  {
    title: "Portal de Compras Publicas",
    description: "Ambiente externo utilizado para acompanhar oportunidades, sessoes e registros de compras.",
    href: "https://www.portaldecompraspublicas.com.br/",
    icon: Building2
  },
  {
    title: "Portal da Transparencia",
    description: "Consulta publica de receitas, despesas, contratos, licitacoes e informacoes fiscais.",
    href: "https://acessoainformacao.aguaslindasdegoias.go.gov.br/",
    icon: ShieldCheck
  }
];

export default function ParceirosPage() {
  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Compras publicas e parceiros"
        description="Pagina institucional para orientar fornecedores, gestores e conselhos aos canais oficiais de compras, licitacoes e transparencia."
        icon={Network}
      />

      <section className="rounded-md border border-sme-line bg-white p-5 shadow-soft">
        <div className="max-w-4xl">
          <p className="text-sm font-black uppercase tracking-wide text-sme-blue">Orientacao institucional</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-sme-navy">O Portal EduConecta GPPE nao credencia fornecedores.</h2>
          <p className="mt-3 text-sm leading-6 text-sme-muted">
            Esta area substitui a vitrine publicitaria por referencias aos canais oficiais de compras publicas. Contratacoes, pagamentos,
            editais e habilitacoes seguem os sistemas institucionais e a legislacao aplicavel.
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="group flex min-h-56 flex-col justify-between rounded-md border border-sme-line bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-sme-blue hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2"
            >
              <span>
                <span className="flex h-12 w-12 items-center justify-center rounded-md bg-sme-blue text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="mt-5 block text-lg font-black text-sme-ink">{item.title}</span>
                <span className="mt-2 block text-sm leading-6 text-sme-muted">{item.description}</span>
              </span>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-sme-blue group-hover:text-sme-navy">
                Acessar canal oficial
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
