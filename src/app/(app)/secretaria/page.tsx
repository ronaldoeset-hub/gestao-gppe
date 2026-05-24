import Link from "next/link";
import { Building2, ExternalLink, FileCheck2, Landmark } from "lucide-react";
import { InfoCard } from "@/components/info-card";
import { ModuleHeader } from "@/components/module-header";

export default function SecretariaPage() {
  return (
    <div className="space-y-6">
      <ModuleHeader
        title="A Secretaria e a GPPE"
        description="A Gerencia de Programas, Projetos e Execucao apoia a organizacao dos recursos financeiros das unidades escolares, fortalecendo a regularidade documental, o planejamento e a transparencia."
        icon={Building2}
        action={
          <Link
            href="https://smeaguaslindas.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-sme-blue px-3 text-sm font-semibold text-white hover:bg-sme-navy"
          >
            Portal SME
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>
        }
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <InfoCard
          icon={Landmark}
          title="Organizacao financeira"
          description="Centraliza o acompanhamento de repasses, saldos, execucao, prestacao de contas e pendencias das escolas e creches municipais."
        />
        <InfoCard
          icon={FileCheck2}
          title="Regularidade documental"
          description="Apoia gestores e conselhos na guarda de atas, editais, pareceres, comprovantes e documentos obrigatorios."
        />
        <InfoCard
          icon={Building2}
          title="Suporte as unidades"
          description="Oferece uma visao integrada para orientar decisoes, reduzir atrasos e priorizar unidades que precisam de acompanhamento tecnico."
        />
      </section>
    </div>
  );
}
