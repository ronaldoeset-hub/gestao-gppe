import { AppShell } from "@/components/app-shell";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { getAlerts } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseEnabled()) {
    return (
      <AppShell role="admin_sme" fullName="Ambiente demonstrativo" pendingCount={0}>
        {children}
      </AppShell>
    );
  }

  const supabase = await createClient();

  let role: UserRole | null = null;
  let fullName: string | null = null;
  let pendingCount = 0;
  let alertCount = 0;

  try {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .maybeSingle();

      role = (profile?.role as UserRole) ?? null;
      fullName = (profile?.full_name as string) ?? null;

      if (role === "admin_sme") {
        const { count } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("access_status", "pendente");
        pendingCount = count ?? 0;
      }

      const alerts = await getAlerts();
      alertCount = alerts.length;
    }
  } catch {
    // fallback: role null → AppShell mostra todos os itens
  }

  return (
    <AppShell role={role} fullName={fullName} pendingCount={pendingCount} alertCount={alertCount}>
      {children}
    </AppShell>
  );
}
