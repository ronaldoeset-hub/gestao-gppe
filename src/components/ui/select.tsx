import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "min-h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 shadow-sm disabled:cursor-not-allowed disabled:bg-neutral-100",
      className
    )}
    {...props}
  />
));

Select.displayName = "Select";
