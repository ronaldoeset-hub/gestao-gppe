import type { LucideIcon } from "lucide-react";

type ModuleHeaderProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: React.ReactNode;
};

export function ModuleHeader({ title, description, icon: Icon, action }: ModuleHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-sme-line pb-6 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-4">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sme-navy text-white shadow-soft-sm">
          <Icon className="h-5 w-5" aria-hidden="true" />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-sme-yellow" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-sme-navy">{title}</h1>
          <div className="mt-1 h-0.5 w-10 rounded-full bg-sme-yellow" aria-hidden="true" />
          <p className="mt-2 max-w-3xl text-sm leading-6 text-sme-muted">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}
