import { cn } from "@/lib/utils";
import type { Status } from "@/lib/types";

const statusStyles: Record<Status, { pill: string; dot: string }> = {
  regular: { pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-sme-green" },
  atencao: { pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", dot: "bg-sme-yellow" },
  pendente: { pill: "bg-sme-blue-soft text-sme-blue ring-1 ring-sme-blue/20", dot: "bg-sme-blue" },
  vencido: { pill: "bg-red-50 text-sme-red ring-1 ring-red-200", dot: "bg-sme-red" }
};

const statusLabels: Record<Status, string> = {
  regular: "Regular",
  atencao: "Atenção",
  pendente: "Pendente",
  vencido: "Vencido"
};

export function StatusBadge({ status }: { status: Status }) {
  const { pill, dot } = statusStyles[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", pill)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} aria-hidden="true" />
      {statusLabels[status]}
    </span>
  );
}
