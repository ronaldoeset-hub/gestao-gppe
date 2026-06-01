import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

type EmptyStateProps = {
  title?: string;
  description: string;
  icon?: LucideIcon;
};

export function EmptyState({ title = "Nenhum registro encontrado", description, icon: Icon = Inbox }: EmptyStateProps) {
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-white px-4 py-8 text-center">
      <Icon className="mx-auto h-8 w-8 text-slate-300" aria-hidden="true" />
      <h2 className="mt-3 text-sm font-bold text-sme-ink">{title}</h2>
      <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
