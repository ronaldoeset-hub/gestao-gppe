import type { LucideIcon } from "lucide-react";

type InfoCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function InfoCard({ title, description, icon: Icon }: InfoCardProps) {
  return (
    <article className="rounded-2xl border border-sme-line bg-white p-5 shadow-soft-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start gap-4">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sme-navy text-white shadow-soft-sm">
          <Icon className="h-5 w-5" aria-hidden="true" />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-sme-yellow" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-display font-bold text-sme-navy">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-sme-muted">{description}</p>
        </div>
      </div>
    </article>
  );
}
