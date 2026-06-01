import { cn } from "@/lib/utils";

type FormMessageProps = {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "error";
};

const tones: Record<NonNullable<FormMessageProps["tone"]>, string> = {
  neutral: "text-slate-600",
  success: "text-emerald-700",
  error: "text-red-700"
};

export function FormMessage({ children, tone = "neutral" }: FormMessageProps) {
  return <p className={cn("text-sm", tone !== "neutral" && "font-semibold", tones[tone])}>{children}</p>;
}
