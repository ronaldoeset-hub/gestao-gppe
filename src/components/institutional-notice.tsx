import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export const institutionalNoticeText =
  "O EduConecta encontra-se em fase de prototipo e validacao, com dados simulados e finalidade demonstrativa. A plataforma e independente de orgaos publicos e nao realiza indicacao de fornecedores, comissao, credenciamento, exclusividade, intermediacao de contratacao publica ou favorecimento.";

type InstitutionalNoticeProps = {
  compact?: boolean;
};

export function InstitutionalNotice({ compact = false }: InstitutionalNoticeProps) {
  return (
    <section className="rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-950">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-sme-yellow text-sme-ink">
          <ShieldAlert className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-black">{compact ? "Sistema em validacao interna" : "Aviso institucional"}</h2>
          <p className="mt-1 text-sm leading-6">{institutionalNoticeText}</p>
          {!compact ? (
            <Link href="/aviso-institucional" className="mt-3 inline-flex text-sm font-black text-[#003b7a] hover:underline">
              Ler aviso completo
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
