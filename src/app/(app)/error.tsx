"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <Card>
      <CardContent className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center">
        <span className="rounded-md bg-danger/10 p-3 text-danger">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Não foi possível carregar esta área</h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-600">
            Tente novamente. Se o problema continuar, registre um chamado para o suporte do GPPE.
          </p>
        </div>
        <Button type="button" onClick={reset}>
          Tentar novamente
        </Button>
      </CardContent>
    </Card>
  );
}
