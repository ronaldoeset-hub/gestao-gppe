import { cn } from "@/lib/utils";

type ToastProps = {
  message: string;
  tone?: "success" | "warning" | "danger" | "info";
  className?: string;
};

const tones = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  danger: "border-red-200 bg-red-50 text-red-800",
  info: "border-sky-200 bg-sky-50 text-sky-800"
};

export function Toast({ message, tone = "info", className }: ToastProps) {
  return (
    <div role="status" aria-live="polite" className={cn("rounded-md border px-4 py-3 text-sm font-semibold shadow-sm", tones[tone], className)}>
      {message}
    </div>
  );
}
