import type { Metadata } from "next";
import { Info } from "lucide-react";
import { EduConectaModulePage } from "@/components/educonecta-module-page";
import { modules } from "@/data/educonecta";

export const metadata: Metadata = {
  title: "Parceiros",
  description: "Área publicitária independente com avisos de responsabilidade e sem credenciamento oficial."
};

export default function ParceirosPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
        <p>
          <strong>Espaço publicitário.</strong> O EduConecta não realiza credenciamento,
          recomendação, intermediação, contratação, pagamento ou recebimento de comissão.
          As informações exibidas são de responsabilidade exclusiva de cada anunciante.
        </p>
      </div>
      <EduConectaModulePage module={modules.parceiros} />
    </div>
  );
}
