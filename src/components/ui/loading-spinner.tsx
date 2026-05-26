import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingSpinner({ className, label = "Carregando" }: { className?: string; label?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm font-semibold text-neutral-600", className)} role="status" aria-live="polite">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      {label}
    </span>
  );
}
