import { cn } from "@/lib/utils";
import type { Status } from "@/lib/types";

const statusStyles: Record<Status, string> = {
  regular: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  atencao: "bg-amber-50 text-amber-700 ring-amber-200",
  pendente: "bg-sky-50 text-sky-700 ring-sky-200",
  vencido: "bg-red-50 text-red-700 ring-red-200"
};

const statusLabels: Record<Status, string> = {
  regular: "Regular",
  atencao: "Atenção",
  pendente: "Pendente",
  vencido: "Vencido"
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1", statusStyles[status])}>
      {statusLabels[status]}
    </span>
  );
}
