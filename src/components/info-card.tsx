import type { LucideIcon } from "lucide-react";

type InfoCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function InfoCard({ title, description, icon: Icon }: InfoCardProps) {
  return (
    <article className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-sme-blue text-white">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-black text-sme-ink">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>
    </article>
  );
}
