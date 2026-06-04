import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "blue" | "green" | "yellow" | "red";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: Tone;
};

const toneAccent: Record<Tone, string> = {
  blue: "bg-sme-blue",
  green: "bg-sme-green",
  yellow: "bg-sme-yellow",
  red: "bg-sme-red"
};

const toneIcon: Record<Tone, string> = {
  blue: "bg-sme-blue-soft text-sme-blue",
  green: "bg-emerald-50 text-sme-green",
  yellow: "bg-amber-50 text-sme-gold",
  red: "bg-red-50 text-sme-red"
};

export function StatCard({ label, value, detail, icon: Icon, tone = "blue" }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-sme-line bg-white p-5 shadow-soft-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className={cn("absolute inset-y-0 left-0 w-1 rounded-l-2xl", toneAccent[tone])} aria-hidden="true" />
      <div className="flex items-center justify-between gap-3 pl-3">
        <p className="text-sm font-semibold text-sme-muted">{label}</p>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", toneIcon[tone])}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <p className="font-display mt-4 pl-3 text-3xl font-bold text-sme-ink">{value}</p>
      <p className="mt-1 pl-3 text-sm text-sme-muted">{detail}</p>
    </div>
  );
}
