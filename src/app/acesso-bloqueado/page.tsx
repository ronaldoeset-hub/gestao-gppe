import Link from "next/link";
import { LogOut, ShieldX } from "lucide-react";
import { InstitutionalNotice } from "@/components/institutional-notice";

export const metadata = {
  title: "Acesso bloqueado - EduConecta",
  description: "Sua conta foi bloqueada pelo administrador."
};

export default function AccessBlockedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5 py-8">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-7 text-slate-950 shadow-soft">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-700">
            <ShieldX className="h-8 w-8" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-red-600">Acesso restrito</p>
            <h1 className="mt-2 text-3xl font-black">Conta bloqueada</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Sua conta foi bloqueada pelo administrador da plataforma. Para mais informações,
              entre em contato com o responsável pela gestão de acessos da sua instituição.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <InstitutionalNotice compact />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-black text-blue-800 hover:bg-blue-50"
          >
            Voltar ao login
          </Link>
          <form action="/auth/logout" method="post">
            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-black text-white hover:bg-red-700"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sair da conta
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
