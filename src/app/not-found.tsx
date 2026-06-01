import Link from "next/link";
import { PageError } from "@/components/ui/page-state";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center px-4">
      <div className="w-full space-y-4">
        <PageError />
        <Link
          href="/dashboard"
          className="mx-auto inline-flex h-10 items-center justify-center rounded-md bg-sme-blue px-4 text-sm font-semibold text-white hover:bg-sme-navy focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2"
        >
          Voltar ao painel
        </Link>
      </div>
    </main>
  );
}
