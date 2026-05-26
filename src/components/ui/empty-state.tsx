import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("rounded-md border border-dashed border-neutral-300 bg-white p-8 text-center", className)}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
        <Inbox className="h-7 w-7" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-bold text-neutral-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
