"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  ChevronDown,
  Info,
  LayoutGrid,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  X
} from "lucide-react";
import { useState } from "react";
import { menuGroups } from "@/data/educonecta";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

const ROLE_LABELS: Record<UserRole, string> = {
  admin_sme: "Administrador SME",
  tecnico_gppe: "Técnico GPPE",
  gestor_escolar: "Gestor Escolar",
  funcionario_escola: "Funcionário Escolar",
  conselho_escolar: "Conselho Escolar"
};

const LIMITED_ROLES: UserRole[] = ["gestor_escolar", "funcionario_escola", "conselho_escolar"];

const topLinks = [
  { href: "/dashboard", label: "Início", description: "Visão geral da gestão educacional da rede." },
  {
    href: "/secretaria",
    label: "A Secretaria",
    description: "Contexto institucional e acesso ao portal da SME.",
    externalHref: "https://smeaguaslindas.com/"
  },
  { href: "/servicos", label: "Serviços", description: "Controle de recursos, conselhos, prazos, documentos e relatórios." },
  { href: "/gestao-escolar", label: "Gestão Escolar", description: "Dados completos para acompanhamento de recursos e unidades." },
  { href: "/transparencia", label: "Transparência", description: "Relatórios, exportações e visão pública futura." }
];

type AppShellProps = {
  children: ReactNode;
  role: UserRole | null;
  fullName: string | null;
  pendingCount?: number;
  alertCount?: number;
};

export function AppShell({ children, role, fullName, pendingCount = 0, alertCount = 0 }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function signOut() {
    await fetch("/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const visibleGroups = menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => role === null || item.roles.includes(role))
    }))
    .filter((group) => group.items.length > 0);

  const isLimited = role !== null && LIMITED_ROLES.includes(role);

  return (
    <div className="min-h-screen bg-sme-surface text-sme-ink">
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-sme-navy focus:shadow-lg"
      >
        Pular para o conteudo principal
      </a>

      {/* Faixa tricolor SME */}
      <div className="sme-tricolor" aria-hidden="true" />

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-sme-navy/30 bg-gradient-to-r from-sme-navy via-sme-navy-700 to-sme-blue text-white shadow-soft">
        <div className="flex min-h-[4.5rem] items-center gap-4 px-4 lg:px-7">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          <Link href="/dashboard" className="flex min-w-0 flex-1 items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sme-navy shadow-soft-sm">
              <Sparkles className="h-7 w-7" aria-hidden="true" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-sme-yellow" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-display truncate text-2xl font-bold tracking-tight">EDUCONECTA</p>
              <p className="truncate text-xs font-medium text-blue-100">Secretaria Mun. de Educação — Águas Lindas</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 text-sm font-semibold uppercase lg:flex">
            {topLinks.map((item) => (
              <div key={item.label} className="group relative">
                <Link href={item.href} className="inline-flex items-center gap-1 opacity-90 hover:opacity-100 hover:text-sme-yellow transition-colors">
                  {item.label}
                  {item.label !== "Início" ? <ChevronDown className="h-3 w-3" aria-hidden="true" /> : null}
                </Link>
                <div className="invisible absolute left-0 top-full z-50 mt-4 w-80 rounded-2xl border border-sme-line bg-white p-4 text-left normal-case text-sme-ink opacity-0 shadow-soft transition group-hover:visible group-hover:opacity-100">
                  <p className="text-sm font-bold uppercase text-sme-navy">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-sme-muted">{item.description}</p>
                  {item.externalHref ? (
                    <Link href={item.externalHref} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-bold text-sme-blue hover:underline">
                      Acessar site da SME
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </nav>

          <Link
            href="/analytics"
            className="hidden h-10 w-52 items-center gap-2 rounded-xl bg-white/10 px-3 text-white/70 transition hover:bg-white/20 hover:text-white lg:flex"
          >
            <Search className="h-4 w-4 text-sme-yellow" aria-hidden="true" />
            <span className="text-sm">Busca global...</span>
          </Link>

          <button
            type="button"
            onClick={signOut}
            className="hidden h-10 items-center gap-2 rounded-xl bg-sme-yellow px-4 text-sm font-bold text-sme-navy transition hover:bg-sme-gold lg:inline-flex"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sair
          </button>
        </div>
      </header>

      <div className="flex">
        {/* ── Sidebar ── */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-white shadow-soft transition-transform lg:sticky lg:top-[calc(4.5rem+4px)] lg:z-20 lg:h-[calc(100vh-4.5rem-4px)] lg:translate-x-0 lg:border-r lg:border-sme-line lg:shadow-none",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* mobile close */}
          <div className="flex items-center justify-between border-b border-sme-line p-4 lg:hidden">
            <p className="font-display font-bold text-sme-navy">Menu EduConecta</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-sme-line p-2"
              aria-label="Fechar menu"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* banner */}
          <div className="m-4 rounded-2xl bg-gradient-to-br from-sme-navy via-sme-navy-700 to-sme-blue p-4 text-white shadow-soft-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-sme-yellow">EduConecta · GPPE</p>
            <p className="font-display mt-1 text-xl font-bold leading-6">Gestão Educacional</p>
            {fullName ? (
              <p className="mt-2 truncate text-sm font-medium text-blue-100">{fullName}</p>
            ) : null}
            {role ? (
              <span className="mt-2 inline-block rounded-lg bg-white/15 px-2 py-1 text-xs font-semibold text-white">
                {ROLE_LABELS[role]}
              </span>
            ) : null}
          </div>

          {/* aviso de acesso limitado */}
          {isLimited ? (
            <div className="mx-4 mb-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Acesso limitado à sua unidade escolar.</span>
            </div>
          ) : null}

          {/* menu agrupado */}
          <nav className="space-y-3 px-3 pb-6 pt-1">
            {visibleGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-sme-muted">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const active =
                      pathname === item.href ||
                      (item.href === "/escolas" && pathname.startsWith("/unidades"));
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "relative flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition",
                          active
                            ? "bg-sme-blue-soft text-sme-navy before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[3px] before:rounded-full before:bg-sme-yellow before:content-['']"
                            : "text-sme-ink hover:bg-sme-surface hover:text-sme-navy"
                        )}
                      >
                        <Icon
                          className={cn("h-4 w-4 shrink-0", active ? "text-sme-blue" : "text-sme-muted")}
                          aria-hidden="true"
                        />
                        <span className="flex-1">{item.label}</span>
                        {item.badge === "pendingAccess" && pendingCount > 0 ? (
                          <span className="rounded-full bg-sme-yellow px-2 py-0.5 text-xs font-bold text-sme-navy">
                            {pendingCount}
                          </span>
                        ) : null}
                        {item.badge === "activeAlerts" && alertCount > 0 ? (
                          <span className="rounded-full bg-sme-red px-2 py-0.5 text-xs font-bold text-white">
                            {alertCount}
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {open ? (
          <button
            className="fixed inset-0 z-40 bg-sme-navy/40 lg:hidden"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
          />
        ) : null}

        {/* ── Conteúdo principal ── */}
        <div className="min-w-0 flex-1">
          <div className="border-b border-sme-line bg-white">
            <div className="mx-auto flex min-h-14 max-w-[1540px] flex-wrap items-center justify-between gap-3 px-4 py-2 text-sm lg:px-7">
              <div className="min-w-0">
                <p className="font-display truncate font-bold text-sme-navy">EDUCONECTA — Gestão Educacional</p>
                <p className="truncate text-xs font-medium text-sme-muted">
                  Plataforma independente. Sem credenciamento ou intermediação de fornecedores.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-sme-line bg-white px-3 text-sm font-semibold text-sme-navy hover:bg-sme-blue-soft focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2 transition"
              >
                Voltar ao menu principal
              </Link>
              {role === "admin_sme" ? (
                <Link
                  href="/administracao"
                  className="hidden items-center gap-2 rounded-xl border border-sme-line px-3 py-2 text-sm font-semibold text-sme-navy hover:bg-sme-blue-soft transition sm:inline-flex"
                >
                  <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                  Administração
                </Link>
              ) : null}
              <button
                type="button"
                onClick={signOut}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-sme-line bg-white px-3 text-sm font-semibold text-sme-ink hover:bg-sme-surface lg:hidden transition"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sair
              </button>
            </div>
          </div>

          <main id="conteudo-principal" className="mx-auto max-w-[1540px] px-4 py-5 lg:px-7">
            {children}
          </main>

          <footer className="mt-8 bg-sme-navy px-6 py-10 text-white">
            <div className="mx-auto grid max-w-[1540px] gap-8 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
              <div>
                <div className="flex items-center gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sme-navy">
                    <ShieldCheck className="h-7 w-7" aria-hidden="true" />
                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-sme-yellow" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-display text-2xl font-bold">EDUCONECTA</p>
                    <p className="text-xs font-medium text-blue-200">Gestão Educacional Inteligente</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-blue-200">
                  Plataforma institucional para organizar dados, prazos, documentos e evidencias da gestao educacional.
                </p>
              </div>
              <FooterColumn title="Módulos" items={["Escolas", "Conselhos", "Recursos", "FNDE/PDDE"]} />
              <FooterColumn title="Gestão" items={["Central de Prazos", "Analytics", "Relatórios", "Auditoria"]} />
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wide text-white">Contato e aviso</h2>
                <ul className="mt-3 space-y-2 text-sm text-blue-200">
                  <li>Secretaria Municipal de Educacao de Aguas Lindas de Goias</li>
                  <li>Portal EduConecta GPPE</li>
                  <li>
                    <Link href="/aviso-institucional" className="font-bold text-sme-yellow hover:underline">
                      Ler aviso institucional
                    </Link>
                  </li>
                </ul>
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
      <h2 className="text-sm font-bold uppercase tracking-wide text-white">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm text-blue-200">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
