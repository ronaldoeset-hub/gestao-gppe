import Link from "next/link";
import { ArrowRight, BookOpen, ExternalLink, FileText, GraduationCap, ShieldCheck } from "lucide-react";
import { EducationalResourcesBrowser } from "@/components/educational-resources-browser";
import { InstitutionalNotice } from "@/components/institutional-notice";
import { getEducationalResources } from "@/lib/supabase/queries";

export const metadata = {
  title: "Portal Recursos Educacionais - SME Aguas Lindas",
  description: "Portal publico para organizacao de materiais pedagogicos, documentos, formacoes e recursos educacionais."
};

export default async function EducationalResourcesPortalPage() {
  const resources = await getEducationalResources();

  return (
    <main className="min-h-screen bg-[#f3f7fb] text-sme-ink">
      <header className="border-b border-white/20 bg-gradient-to-r from-[#003b7a] via-[#004a93] to-[#00326d] text-white shadow-lg shadow-sky-950/15">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link href="/recursos-educacionais" className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-md bg-sme-yellow text-[#003b7a]">
              <BookOpen className="h-8 w-8" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-sme-yellow">Secretaria Municipal de Educacao</p>
              <h1 className="text-2xl font-black leading-6">Portal Recursos Educacionais</h1>
            </div>
          </Link>
          <nav className="flex flex-wrap items-center gap-3 text-sm font-bold">
            <a href="#materiais" className="rounded-md px-3 py-2 hover:bg-white/10">Materiais</a>
            <a href="#orientacoes" className="rounded-md px-3 py-2 hover:bg-white/10">Orientacoes</a>
            <Link href="/login" className="inline-flex items-center gap-2 rounded-md bg-sme-yellow px-4 py-2 font-black text-[#003b7a]">
              Area administrativa
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </header>

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-10 lg:grid-cols-[1fr_420px] lg:px-8 lg:py-14">
          <div>
            <p className="inline-flex rounded-md bg-blue-50 px-3 py-1 text-sm font-black uppercase text-[#003b7a]">
              Recursos para apoiar a rede municipal
            </p>
            <h2 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-sme-ink lg:text-5xl">
              Materiais pedagogicos, orientacoes e documentos em um unico portal.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
              Um espaco publico para organizar materiais de apoio, trilhas de formacao, modelos de documentos, atividades e referencias para professores, gestores e equipes pedagogicas.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#materiais" className="inline-flex h-11 items-center gap-2 rounded-md bg-sme-blue px-4 text-sm font-black text-white hover:bg-sme-navy">
                Ver materiais
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link href="/dashboard" className="inline-flex h-11 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-black text-[#003b7a] hover:bg-blue-50">
                Sistema GPPE
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-[#f8fbff] p-5 shadow-soft">
            <div className="grid gap-3">
              <PortalMetric icon={FileText} title="Documentos" value="Modelos e orientacoes" />
              <PortalMetric icon={GraduationCap} title="Formacao" value="Trilhas para professores" />
              <PortalMetric icon={BookOpen} title="Praticas pedagogicas" value="Atividades por etapa" />
            </div>
          </div>
        </div>
      </section>

      <section id="materiais" className="mx-auto max-w-[1500px] px-5 py-8 lg:px-8">
        <div className="mb-6">
          <InstitutionalNotice />
        </div>
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-amber-500">Biblioteca inicial</p>
            <h2 className="text-2xl font-black text-sme-ink">Materiais disponiveis</h2>
          </div>
          <Link href="/alimentar-dados" className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-bold text-[#003b7a] hover:bg-blue-50">
            Alimentar conteudo
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <EducationalResourcesBrowser resources={resources} />
      </section>

      <section id="orientacoes" className="mx-auto max-w-[1500px] px-5 pb-10 lg:px-8">
        <div className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-soft lg:grid-cols-3">
          <InfoBlock title="Como usar" text="Pesquise por tema, etapa ou tipo de material. Depois, substituiremos os modelos iniciais pelos arquivos oficiais da SME." />
          <InfoBlock title="Como alimentar" text="A equipe responsavel pode cadastrar arquivos, links e categorias na area administrativa do sistema." />
          <InfoBlock title="Portal SME" text="Mantenha o portal alinhado ao site oficial da Secretaria e aos documentos institucionais publicados." />
        </div>
      </section>

      <footer className="bg-gradient-to-r from-[#003b7a] via-[#004a93] to-[#00326d] px-5 py-8 text-white lg:px-8">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-black">Secretaria Municipal de Educacao</p>
            <p className="text-sm text-blue-100">Aguas Lindas de Goias - GO</p>
          </div>
          <Link href="https://smeaguaslindas.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-sme-yellow">
            Portal oficial da SME
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </footer>
    </main>
  );
}

function PortalMetric({ icon: Icon, title, value }: { icon: typeof BookOpen; title: string; value: string }) {
  return (
    <article className="rounded-md border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-sme-blue text-white">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="font-black text-sme-ink">{title}</p>
          <p className="text-sm text-slate-600">{value}</p>
        </div>
      </div>
    </article>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <article>
      <h3 className="font-black text-sme-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </article>
  );
}
