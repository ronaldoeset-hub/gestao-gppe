"use client";

import { PageError } from "@/components/ui/page-state";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <PageError reset={reset} />;
}
