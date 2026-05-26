import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex flex-wrap items-center gap-1 text-xs font-semibold text-neutral-500", className)}>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
          {index > 0 ? <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /> : null}
          {item.href ? (
            <Link href={item.href} className="hover:text-primary-700">
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-neutral-700">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
