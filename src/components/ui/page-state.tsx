import { AlertTriangle, Loader2 } from "lucide-react";

export function PageLoading() {
  return (
    <div className="flex min-h-72 items-center justify-center rounded-md border border-slate-200 bg-white p-8 shadow-soft">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-sme-blue" aria-hidden="true" />
        <p className="mt-3 text-sm font-semibold text-slate-600">Carregando dados...</p>
      </div>
    </div>
  );
}

export function PageError({ reset }: { reset?: () => void }) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-6 text-center">
      <AlertTriangle className="mx-auto h-8 w-8 text-red-600" aria-hidden="true" />
      <h2 className="mt-3 text-base font-bold text-red-900">Nao foi possivel carregar esta tela</h2>
      <p className="mt-1 text-sm leading-6 text-red-700">Tente novamente. Se o erro persistir, acione o suporte tecnico.</p>
      {reset ? (
        <button
          type="button"
          onClick={reset}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-red-700 px-4 text-sm font-semibold text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        >
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}
