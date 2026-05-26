import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
};

const tones = {
  neutral: "bg-neutral-100 text-neutral-700 ring-neutral-200",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-800 ring-amber-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
  info: "bg-sky-50 text-sky-700 ring-sky-200"
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return <span className={cn("inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-semibold ring-1", tones[tone], className)} {...props} />;
}
