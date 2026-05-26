"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DialogProps = {
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
};

export function Dialog({ open, title, description, children, onClose, className }: DialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 p-4" role="presentation">
      <div role="dialog" aria-modal="true" aria-labelledby="dialog-title" className={cn("w-full max-w-lg rounded-lg bg-white shadow-card-hover", className)}>
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 p-5">
          <div>
            <h2 id="dialog-title" className="text-lg font-bold text-neutral-900">
              {title}
            </h2>
            {description ? <p className="mt-1 text-sm leading-6 text-neutral-600">{description}</p> : null}
          </div>
          <Button ref={closeRef} type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Fechar janela">
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
