"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  Bell,
  ChevronDown,
  LayoutGrid,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  X
} from "lucide-react";
import { useState } from "react";
import { eduMenuItems } from "@/data/educonecta";
import { cn } from "@/lib/utils";

const topLinks = [
  {
    href: "/dashboard",
    label: "Inicio",
    description: "Importancia da gestao inteligente de informacoes educacionais."
  },
  {
    href: "/secretaria",
    label: "A Secretaria",
    description: "Contexto institucional e acesso ao portal da SME.",
    externalHref: "https://smeaguaslindas.com/"
  },
  {
    href: "/servicos",
    label: "Servicos",
    description: "Controle de recursos, conselhos, prazos, documentos e relatórios."
  },
  {
    href: "/gestao-escolar",
    label: "Gestao Escolar",
    description: "Dados completos para acompanhamento de recursos e unidades."
  },
  {
    href: "/transparencia",
    label: "Transparencia",
    description: "Relatorios, exportacoes e visao publica futura."
  }
];

export function AppShell({ children, pendingAccessCount = 0 }: { children: ReactNode; pendingAccessCount?: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function signOut() {
    await fetch("/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="sticky top-0 z-40 border-b border-blue-950/20 bg-gradient-to-r from-blue-950 via-blue-800 to-emerald-700 text-white shadow-lg shadow-blue-950/20">
        <div className="flex min-h-20 items-center gap-4 px-4 lg:px-7">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          <Link href="/dashboard" className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-800 shadow-sm">
              <Sparkles className="h-7 w-7" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-2xl font-black tracking-tight">EDUCONECTA</p>
              <p className="truncate text-sm font-semibold text-blue-100">Gestao Educacional Inteligente</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 text-sm font-black uppercase lg:flex">
            {topLinks.map((item) => (
              <div key={item.label} className="group relative">
                <Link href={item.href} className="inline-flex items-center gap-1 hover:text-amber-300">
                  {item.label}
                  {item.label !== "Inicio" ? <ChevronDown className="h-3 w-3" aria-hidden="true" /> : null}
                </Link>
                <div className="invisible absolute left-0 top-full z-50 mt-4 w-80 rounded-2xl border border-slate-200 bg-white p-4 text-left normal-case text-slate-700 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                  <p className="text-sm font-black uppercase text-blue-800">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  {item.externalHref ? (
                    <Link href={item.externalHref} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-black text-blue-700 hover:underline">
                      Acessar site da SME
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </nav>

          <Link href="/analytics" className="hidden h-11 w-56 items-center gap-2 rounded-xl bg-white px-3 text-slate-500 transition hover:bg-blue-50 lg:flex">
            <Search className="h-4 w-4 text-blue-700" aria-hidden="true" />
            <span className="text-sm">Busca global...</span>
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="hidden h-11 items-center gap-2 rounded-xl bg-amber-300 px-4 text-sm font-black uppercase text-blue-950 transition hover:bg-amber-200 lg:inline-flex"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sair
          </button>
        </div>
      </header>

      <div className="flex">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-80 overflow-y-auto bg-white shadow-2xl transition-transform lg:sticky lg:top-20 lg:z-20 lg:h-[calc(100vh-5rem)] lg:translate-x-0 lg:border-r lg:border-slate-200 lg:shadow-none",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-slate-200 p-4 lg:hidden">
            <p className="font-black text-blue-950">Menu EduConecta</p>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-slate-200 p-2" aria-label="Fechar menu">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="m-4 rounded-2xl bg-gradient-to-br from-blue-950 via-blue-800 to-emerald-700 p-5 text-white shadow-soft">
            <p className="text-xs font-black uppercase tracking-wide text-amber-300">Plataforma SaaS</p>
            <p className="mt-2 text-2xl font-black leading-7">EduConecta</p>
            <p className="mt-3 text-sm font-semibold leading-6 text-blue-50">
              Transformando informacao educacional em gestao inteligente.
            </p>
            <p className="mt-4 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-blue-50">
              Prototipo independente, com dados mockados e preparado para backend futuro.
            </p>
          </div>

          <nav className="space-y-1 px-3 pb-5">
            {eduMenuItems.map((item) => {
              const active = pathname === item.href || (item.href === "/escolas" && pathname.startsWith("/unidades"));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-xl px-4 text-sm font-bold transition",
                    active ? "bg-blue-700 text-white shadow-sm" : "text-blue-950 hover:bg-blue-50 hover:text-blue-800"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 flex-1">{item.label}</span>
                  {item.href === "/perfis" && pendingAccessCount > 0 ? (
                    <span className={cn("ml-auto rounded-full px-2 py-0.5 text-xs font-black", active ? "bg-white text-blue-800" : "bg-amber-300 text-blue-950")}>
                      {pendingAccessCount}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </aside>

        {open ? <button className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" aria-label="Fechar menu" onClick={() => setOpen(false)} /> : null}

        <div className="min-w-0 flex-1">
          <div className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex min-h-14 max-w-[1540px] items-center justify-between gap-4 px-4 text-sm lg:px-7">
              <div className="min-w-0">
                <p className="truncate font-black text-blue-950">EDUCONECTA - Gestao Educacional Inteligente</p>
                <p className="truncate text-xs font-semibold text-slate-500">Sistema independente em desenvolvimento, sem credenciamento ou intermediacao publica.</p>
              </div>
              {pendingAccessCount > 0 ? (
                <Link href="/perfis" className="hidden items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-black text-blue-950 hover:bg-amber-100 sm:inline-flex">
                  <Bell className="h-4 w-4" aria-hidden="true" />
                  {pendingAccessCount} pendente{pendingAccessCount > 1 ? "s" : ""}
                </Link>
              ) : null}
              <Link href="/administracao" className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-black text-blue-800 hover:bg-blue-50 sm:inline-flex">
                <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                Administracao
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 hover:bg-slate-50 lg:hidden"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sair
              </button>
            </div>
          </div>

          <main className="mx-auto max-w-[1540px] px-4 py-5 lg:px-7">{children}</main>

          <footer className="mt-8 bg-blue-950 px-6 py-8 text-white">
            <div className="mx-auto grid max-w-[1540px] gap-6 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-800">
                    <ShieldCheck className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-2xl font-black">EDUCONECTA</p>
                    <p className="text-sm font-semibold text-blue-100">Gestao Educacional Inteligente</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-blue-100">
                  Plataforma independente, em fase de prototipo, voltada a organizacao de informacoes educacionais.
                </p>
              </div>
              <FooterColumn title="Modulos" items={["Escolas", "Conselhos", "Recursos", "FNDE/PDDE"]} />
              <FooterColumn title="Gestao" items={["Central de Prazos", "Analytics", "Relatorios", "Auditoria"]} />
              <div>
                <h2 className="text-sm font-black uppercase text-white">Contato e aviso</h2>
                <ul className="mt-3 space-y-2 text-sm text-blue-100">
                  <li>contato@educonecta.local</li>
                  <li>Uso demonstrativo com dados mockados</li>
                  <li>
                    <Link href="/aviso-institucional" className="font-black text-amber-300 hover:underline">
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
      <h2 className="text-sm font-black uppercase text-white">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm text-blue-100">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
