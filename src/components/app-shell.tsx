"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  ChevronDown,
  ClipboardCheck,
  Download,
  FileArchive,
  FileCheck2,
  FileText,
  HelpCircle,
  Home,
  Landmark,
  LayoutGrid,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  UsersRound
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Painel Geral", icon: Home },
  { href: "/alimentar-dados", label: "Alimentar Dados", icon: FileCheck2 },
  { href: "/diagnostico-dados", label: "Diagnostico dos Dados", icon: BarChart3 },
  { href: "/unidades", label: "Unidades Escolares", icon: Building2 },
  { href: "/conselhos", label: "Conselhos Escolares", icon: UsersRound },
  { href: "/recursos", label: "Recursos Financeiros", icon: Landmark },
  { href: "/prestacao-contas", label: "Prestacao de Contas", icon: ClipboardCheck },
  { href: "/documentos", label: "Documentos", icon: FileArchive },
  { href: "/alertas", label: "Alertas e Prazos", icon: AlertTriangle },
  { href: "/perfis", label: "Configuracoes", icon: Settings }
];

const quickItems = [
  { href: "/conselhos", label: "Controle de Vencimentos", icon: ClipboardCheck },
  { href: "/alertas", label: "Pendencias Criticas", icon: AlertTriangle, badge: "12" },
  { href: "/prestacao-contas#nova-prestacao", label: "Prestacoes Pendentes", icon: FileText, badge: "28" },
  { href: "/documentos", label: "Documentos Recentes", icon: FileArchive },
  { href: "/transparencia", label: "Exportar Dados (Excel)", icon: Download }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function signOut() {
    await fetch("/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f3f7fb] text-sme-ink">
      <header className="sticky top-0 z-40 border-b border-white/20 bg-gradient-to-r from-[#003b7a] via-[#004a93] to-[#00326d] text-white shadow-lg shadow-sky-950/15">
        <div className="flex min-h-20 items-center gap-4 px-4 lg:px-8">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/20 text-white lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/20">
              <ShieldCheck className="h-9 w-9 text-sme-yellow" aria-hidden="true" />
            </div>
            <Link href="https://smeaguaslindas.com/" target="_blank" rel="noreferrer" className="min-w-0 hover:text-sme-yellow">
              <p className="text-xs font-black uppercase tracking-wide text-sme-yellow">Prefeitura de Aguas Lindas de Goias</p>
              <p className="truncate text-lg font-black leading-5 sm:text-2xl">Secretaria Municipal de Educacao</p>
            </Link>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-black uppercase lg:flex">
            <Link href="/dashboard" className="hover:text-sme-yellow">Inicio</Link>
            <div className="group relative">
              <Link href="/secretaria" className="inline-flex items-center gap-1 hover:text-sme-yellow">
                A Secretaria <ChevronDown className="h-3 w-3" />
              </Link>
              <div className="invisible absolute left-0 top-full z-50 mt-4 w-80 rounded-md border border-slate-200 bg-white p-3 text-left text-sm normal-case text-slate-700 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                <ServiceLink href="/secretaria" title="Sobre a GPPE" description="Importancia da gerencia na organizacao financeira das unidades." />
                <ServiceLink href="https://smeaguaslindas.com/" title="Portal oficial da SME" description="Acesso ao site institucional da Secretaria Municipal de Educacao." external />
                <ServiceLink href="/documentos" title="Documentos institucionais" description="Modelos, checklists, arquivos e orientacoes do setor." />
              </div>
            </div>
            <div className="group relative">
              <Link href="/servicos" className="inline-flex items-center gap-1 hover:text-sme-yellow">
                Servicos <ChevronDown className="h-3 w-3" />
              </Link>
              <div className="invisible absolute left-0 top-full z-50 mt-4 w-80 rounded-md border border-slate-200 bg-white p-3 text-left text-sm normal-case text-slate-700 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                <ServiceLink href="/servicos" title="Todos os servicos da GPPE" description="Visao geral das atividades realizadas pelo setor." />
                <ServiceLink href="/recursos" title="Controle de recursos financeiros" description="Acompanhamento de repasses, saldos, custeio e capital." />
                <ServiceLink href="/conselhos" title="Acompanhamento dos Conselhos Escolares" description="Mandatos, membros, vencimentos e regularidade documental." />
                <ServiceLink href="/prestacao-contas" title="Prestacao de contas" description="Prazos, analise tecnica, pareceres e situacao por unidade." />
                <ServiceLink href="/documentos" title="Gestao de documentos" description="Upload, checklist e guarda dos documentos obrigatorios." />
                <ServiceLink href="/alertas" title="Alertas e prazos" description="Avisos sobre vencimentos, pendencias e prioridades da GPPE." />
                <ServiceLink href="/documentos" title="Geracao de documentos SEI" description="Modelos de oficio, despacho, relatorio, ata e memorando." />
              </div>
            </div>
            <div className="group relative">
              <Link href="/gestao-escolar" className="inline-flex items-center gap-1 hover:text-sme-yellow">
                Gestao Escolar <ChevronDown className="h-3 w-3" />
              </Link>
              <div className="invisible absolute left-1/2 top-full z-50 mt-4 w-[520px] -translate-x-1/2 rounded-md border border-slate-200 bg-white p-4 text-left text-sm normal-case text-slate-700 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                <div className="border-b border-slate-100 pb-3">
                  <p className="text-sm font-black uppercase text-[#003b7a]">Dados completos dos recursos municipais</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Uma visao integrada para acompanhar quanto o municipio recebeu, executou, tem em saldo e quais unidades precisam de atencao.
                  </p>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <ServiceLink href="/dashboard" title="Panorama municipal" description="Resumo geral de unidades, recursos, conselhos e pendencias." />
                  <ServiceLink href="/recursos" title="Recursos por programa" description="PDDE, Educacao Conectada, LEIA, emendas, FNDE e outros." />
                  <ServiceLink href="/recursos" title="Recursos por unidade" description="Consulta por escola ou creche, com valor recebido, executado e saldo." />
                  <ServiceLink href="/prestacao-contas" title="Prestacao por recurso" description="Controle de prazos, protocolos, analise e parecer tecnico." />
                  <ServiceLink href="/conselhos" title="Conselhos e regularidade" description="Mandatos, documentacao, composicao e vencimentos." />
                  <ServiceLink href="/documentos" title="Documentos comprobatórios" description="Atas, editais, notas fiscais, extratos, pareceres e relatorios." />
                </div>
              </div>
            </div>
            <Link href="/transparencia" className="hover:text-sme-yellow">Transparencia</Link>
          </nav>
          <Link href="/alimentar-dados" className="hidden h-11 w-56 items-center gap-2 rounded-md bg-white px-3 text-slate-500 transition hover:bg-blue-50 lg:flex">
            <span className="text-sm">Pesquisar...</span>
            <Search className="ml-auto h-4 w-4 text-[#003b7a]" aria-hidden="true" />
          </Link>
          <Link href="/dashboard" className="hidden h-11 items-center gap-2 rounded-md bg-sme-yellow px-4 text-sm font-black uppercase text-[#003b7a] lg:inline-flex">
            <LayoutGrid className="h-4 w-4" aria-hidden="true" />
            Sistemas
          </Link>
        </div>
      </header>

      <div className="border-b border-slate-200 bg-white">
        <div className="flex min-h-12 items-center justify-between gap-3 px-4 text-xs font-semibold text-[#003b7a] lg:px-8">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="hover:underline">Inicio</Link>
            <span className="text-slate-300">/</span>
            <span>Sistemas</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600">Gestao de Recursos e Conselhos</span>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0054a6] text-sm font-black text-white">GP</div>
            <div className="text-right leading-4">
              <p className="font-black text-[#003b7a]">GPPE - Tecnico</p>
              <p className="text-slate-500">Setor responsavel</p>
            </div>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-80 overflow-y-auto bg-white pt-0 shadow-2xl transition-transform lg:sticky lg:top-20 lg:z-20 lg:h-[calc(100vh-5rem)] lg:translate-x-0 lg:border-r lg:border-slate-200 lg:shadow-none",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="m-4 rounded-md bg-gradient-to-br from-[#003b7a] to-[#0054a6] p-5 text-white shadow-soft">
            <p className="text-xl font-black uppercase leading-6 text-sme-yellow">Gestao de Recursos</p>
            <p className="text-xl font-black uppercase leading-6">e Conselhos</p>
            <p className="mt-3 text-sm font-semibold text-blue-50">Setor responsavel: GPPE</p>
            <p className="text-sm font-semibold text-blue-50">Nivel: MASTER</p>
          </div>
          <nav className="px-4">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex min-h-11 items-center gap-3 border-l-4 px-4 text-sm font-bold transition",
                    active
                      ? "border-[#0054a6] bg-blue-50 text-[#003b7a]"
                      : "border-transparent text-[#003b7a] hover:border-sme-yellow hover:bg-slate-50"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="m-4 rounded-md border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-black uppercase text-amber-500">Acesso rapido</h2>
            <div className="mt-3 divide-y divide-slate-100">
              {quickItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.label} href={item.href} className="flex min-h-9 items-center gap-3 text-sm font-semibold text-[#003b7a] hover:text-sme-navy">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge ? <span className="rounded-full bg-sme-yellow px-2 py-0.5 text-xs font-black text-[#003b7a]">{item.badge}</span> : null}
                  </Link>
                );
              })}
            </div>
          </div>
          <Link href="/servicos" className="m-4 flex items-center gap-3 rounded-md bg-blue-50 p-4 text-[#003b7a] hover:bg-blue-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0054a6] text-white">
              <HelpCircle className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="text-sm">
              <p className="font-black">Precisa de ajuda?</p>
              <p>Manual do Sistema</p>
            </div>
          </Link>
        </aside>
        {open ? <button className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" aria-label="Fechar menu" onClick={() => setOpen(false)} /> : null}

        <div className="min-w-0 flex-1">
          <main className="mx-auto max-w-[1500px] px-4 py-5 lg:px-6">{children}</main>
          <footer className="mt-6 bg-gradient-to-r from-[#003b7a] via-[#004a93] to-[#00326d] px-6 py-8 text-white">
            <div className="mx-auto grid max-w-[1500px] gap-6 md:grid-cols-5">
              <div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-10 w-10 text-sme-yellow" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold uppercase">Secretaria Municipal</p>
                    <p className="text-lg font-black uppercase">de Educacao</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-blue-100">Aguas Lindas de Goias - GO</p>
              </div>
              <FooterColumn title="Links rapidos" items={["Portal da SME", "Transparencia", "Legislacao", "Fale Conosco"]} />
              <FooterColumn title="Documentos" items={["Regimentos", "Portarias", "Manuais", "Formularios"]} />
              <FooterColumn
                title="Contato GPPE"
                items={[
                  "(61) 3618-7997",
                  "gppe@smeaguaslindas.go.gov.br",
                  "Quadra 46, Conjunto A, Lote 01",
                  "CEP 72910-004 - Parque da Barragem Setor 08"
                ]}
              />
              <div className="text-right md:text-left xl:text-right">
                <p className="text-4xl font-black">GPPE</p>
                <p className="font-bold uppercase text-blue-100">Setor Responsavel</p>
                <span className="mt-3 inline-flex rounded-md bg-sme-yellow px-4 py-2 text-sm font-black uppercase text-[#003b7a]">Master</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="text-sm font-black uppercase text-white">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm text-blue-100">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ServiceLink({ href, title, description, external = false }: { href: string; title: string; description: string; external?: boolean }) {
  return (
    <Link href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="block rounded-md px-3 py-2 hover:bg-blue-50">
      <p className="font-black text-[#003b7a]">{title}</p>
      <p className="mt-0.5 text-xs leading-5 text-slate-500">{description}</p>
    </Link>
  );
}
