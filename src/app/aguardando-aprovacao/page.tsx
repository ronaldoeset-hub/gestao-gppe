import Link from "next/link";
import { Clock3, LogOut, ShieldCheck } from "lucide-react";
import { InstitutionalNotice } from "@/components/institutional-notice";

export const metadata = {
  title: "Aguardando aprovacao - EduConecta",
  description: "Cadastro recebido e aguardando aprovacao administrativa."
};

export default function WaitingApprovalPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5 py-8">
      <section className="w-full max-w-2xl rounded-md border border-slate-200 bg-white p-7 text-slate-950 shadow-soft">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-amber-300 text-blue-950">
            <Clock3 className="h-8 w-8" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-emerald-600">Cadastro recebido</p>
            <h1 className="mt-2 text-3xl font-black">Aguardando aprovacao</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Seu cadastro foi criado, mas ainda precisa ser aprovado pelo administrador. Depois da aprovacao,
              o acesso sera liberado conforme o perfil e a unidade vinculada.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <InstitutionalNotice compact />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="/login" className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-black text-blue-800 hover:bg-blue-50">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Voltar ao login
          </Link>
          <form action="/auth/logout" method="post">
            <button type="submit" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-black text-white hover:bg-blue-800">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sair
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
