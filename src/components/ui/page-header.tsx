import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

type PageHeaderProps = {
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: ReactNode;
};

export function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <header className="border-b border-neutral-200 pb-5">
      {breadcrumbs?.length ? <Breadcrumb items={breadcrumbs} className="mb-3" /> : null}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-normal text-neutral-900 md:text-3xl">{title}</h1>
          {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
