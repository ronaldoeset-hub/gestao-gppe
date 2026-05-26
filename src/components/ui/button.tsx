import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

const variants = {
  primary: "bg-primary-600 text-white hover:bg-primary-700",
  secondary: "bg-secondary-500 text-white hover:bg-secondary-700",
  outline: "border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50",
  ghost: "text-neutral-700 hover:bg-neutral-100",
  destructive: "bg-danger text-white hover:bg-red-700"
};

const sizes = {
  sm: "min-h-10 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-base"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "primary", size = "md", loading = false, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  )
);

Button.displayName = "Button";
