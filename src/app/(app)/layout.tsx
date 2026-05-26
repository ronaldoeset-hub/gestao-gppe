import { AppShell } from "@/components/app-shell";
import { getPendingAccessCount } from "@/lib/supabase/queries";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pendingAccessCount = await getPendingAccessCount();

  return <AppShell pendingAccessCount={pendingAccessCount}>{children}</AppShell>;
}
