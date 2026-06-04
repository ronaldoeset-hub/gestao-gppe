import Link from "next/link";
import type { Metadata } from "next";
import { Building2, Clock, ExternalLink, FileCheck2, Landmark, Mail, MapPin, Phone } from "lucide-react";
import { InfoCard } from "@/components/info-card";
import { ModuleHeader } from "@/components/module-header";

export const metadata: Metadata = {
  title: "A Secretaria e a GPPE",
  description: "Informações institucionais da Secretaria Municipal de Educação e da GPPE."
};

export const revalidate = 3600;

export default function SecretariaPage() {
  return (
    <div className="space-y-6">
      <ModuleHeader
        title="A Secretaria e a GPPE"
        description="A Gerência de Programas, Projetos e Execução apoia a organização dos recursos financeiros das unidades escolares, fortalecendo a regularidade documental, o planejamento e a transparência."
        icon={Building2}
        action={
          <Link
            href="https://smeaguaslindas.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-sme-navy px-4 text-sm font-semibold text-white transition hover:bg-sme-blue"
          >
            Portal SME
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>
        }
      />

      {/* Identidade institucional */}
      <div className="overflow-hidden rounded-2xl border border-sme-line bg-white shadow-soft-sm">
        <div className="bg-gradient-to-r from-sme-navy via-sme-navy-700 to-sme-blue px-6 py-8 text-white">
          <div className="sme-tricolor mb-6 rounded-full" style={{ height: "3px", width: "48px" }} aria-hidden="true" />
          <h2 className="font-display text-2xl font-bold">Secretaria Municipal de Educação</h2>
          <p className="mt-1 text-blue-200">Prefeitura Municipal de Águas Lindas de Goiás</p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100">
            A SME é responsável pela gestão da rede pública municipal de ensino, abrangendo escolas, creches, CEMEI e unidades conveniadas. A GPPE atua como gerência técnica de suporte à execução dos programas FNDE/PDDE.
          </p>
        </div>

        <div className="grid gap-px bg-sme-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            { ic: MapPin, label: "Endereço", valor: "Rua das Araras, s/n — Centro, Águas Lindas de Goiás - GO" },
            { ic: Phone, label: "Telefone", valor: "(61) 3607-0000" },
            { ic: Mail, label: "E-mail", valor: "sme@aguaslindasdegoias.go.gov.br" },
            { ic: Clock, label: "Atendimento", valor: "Segunda a sexta, das 7h às 13h" }
          ].map(({ ic: Ic, label, valor }) => (
            <div key={label} className="flex items-start gap-3 bg-white p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sme-blue-soft text-sme-blue">
                <Ic className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-sme-muted">{label}</p>
                <p className="mt-0.5 text-sm font-medium text-sme-ink">{valor}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Atribuições da GPPE */}
      <section className="space-y-3">
        <h2 className="font-display font-bold text-sme-navy">Atribuições da GPPE</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <InfoCard
            icon={Landmark}
            title="Organização financeira"
            description="Centraliza o acompanhamento de repasses, saldos, execução, prestação de contas e pendências das escolas e creches municipais."
          />
          <InfoCard
            icon={FileCheck2}
            title="Regularidade documental"
            description="Apoia gestores e conselhos na guarda de atas, editais, pareceres, comprovantes e documentos obrigatórios."
          />
          <InfoCard
            icon={Building2}
            title="Suporte às unidades"
            description="Oferece visão integrada para orientar decisões, reduzir atrasos e priorizar unidades que precisam de acompanhamento técnico."
          />
        </div>
      </section>

      {/* Links institucionais */}
      <section className="rounded-2xl border border-sme-line bg-white p-5 shadow-soft-sm">
        <h2 className="font-display font-bold text-sme-navy">Links institucionais</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { href: "https://smeaguaslindas.com/", label: "Portal da SME", desc: "Site oficial com notícias, editais e documentos." },
            { href: "https://aguaslindasdegoias.go.gov.br", label: "Prefeitura Municipal", desc: "Portal da Prefeitura de Águas Lindas de Goiás." },
            { href: "https://www.fnde.gov.br", label: "FNDE", desc: "Fundo Nacional de Desenvolvimento da Educação." },
            { href: "https://www.gov.br/mec", label: "MEC", desc: "Ministério da Educação — programas e legislação." }
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl border border-sme-line p-4 transition hover:border-sme-blue hover:bg-sme-blue-soft/30"
            >
              <div>
                <p className="font-semibold text-sme-navy">{item.label}</p>
                <p className="mt-0.5 text-sm text-sme-muted">{item.desc}</p>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-sme-muted" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
