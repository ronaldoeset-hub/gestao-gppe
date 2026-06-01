import Link from "next/link";
import { ShieldOff } from "lucide-react";

export const metadata = {
  title: "Acesso Bloqueado — EduConecta GPPE",
};

export default function AcessoBloqueadoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-md border border-red-100 bg-white p-8 text-center shadow-soft">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-red-100">
          <ShieldOff className="h-7 w-7 text-red-600" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-black text-slate-950">
          Acesso bloqueado
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Sua conta foi bloqueada pelo administrador do sistema.
          Para mais informações, entre em contato com a GPPE.
        </p>
        <Link
          href="/login"
          className="mt-6 block w-full rounded-md bg-slate-900 px-4 py-3 text-sm font-black text-white hover:bg-slate-800"
        >
          Voltar ao login
        </Link>
      </div>
    </div>
  );
}
