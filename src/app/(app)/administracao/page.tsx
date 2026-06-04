import type { Metadata } from "next";
import { Settings, ShieldCheck, UserCheck, UserMinus, UserX } from "lucide-react";
import { ModuleHeader } from "@/components/module-header";
import { StatCard } from "@/components/stat-card";
import { UserManagementTable } from "@/components/user-management-table";
import { getProfiles } from "@/lib/supabase/queries";
import { isSupabaseEnabled } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Administração — EduConecta GPPE"
};

export const revalidate = 30;

export default async function AdministracaoPage() {
  const enabled = isSupabaseEnabled();
  const profiles = enabled ? await getProfiles() : [];

  const pending = profiles.filter((p) => p.accessStatus === "pendente");
  const approved = profiles.filter((p) => p.accessStatus === "aprovado" || !p.accessStatus);
  const blocked = profiles.filter((p) => p.accessStatus === "bloqueado");

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Administração de Usuários"
        description="Aprove, bloqueie e gerencie os perfis de acesso. Somente administradores têm acesso a esta área."
        icon={Settings}
      />

      {!enabled && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>Modo demonstração</strong> — conecte o Supabase para gerenciar usuários reais.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Aguardando aprovação" value={String(pending.length)} detail="Precisam de revisão" icon={UserCheck} tone={pending.length > 0 ? "red" : "green"} />
        <StatCard label="Usuários aprovados" value={String(approved.length)} detail="Acesso ativo" icon={ShieldCheck} tone="green" />
        <StatCard label="Usuários bloqueados" value={String(blocked.length)} detail="Acesso suspenso" icon={UserX} tone={blocked.length > 0 ? "yellow" : "blue"} />
      </div>

      {pending.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-sme-red" aria-hidden="true" />
            <h2 className="font-display font-bold text-sme-navy">Aguardando aprovação</h2>
            <span className="rounded-full bg-sme-red px-2 py-0.5 text-xs font-bold text-white">{pending.length}</span>
          </div>
          <UserManagementTable profiles={pending} mode="pending" />
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-sme-green" aria-hidden="true" />
          <h2 className="font-display font-bold text-sme-navy">Usuários aprovados</h2>
          <span className="rounded-full bg-sme-green px-2 py-0.5 text-xs font-bold text-white">{approved.length}</span>
        </div>
        {approved.length === 0 ? (
          <p className="rounded-2xl border border-sme-line bg-sme-surface px-4 py-6 text-center text-sm text-sme-muted">Nenhum usuário aprovado ainda.</p>
        ) : (
          <UserManagementTable profiles={approved} mode="approved" />
        )}
      </section>

      {blocked.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <UserMinus className="h-4 w-4 text-sme-muted" aria-hidden="true" />
            <h2 className="font-display font-bold text-sme-navy">Usuários bloqueados</h2>
            <span className="rounded-full bg-sme-muted px-2 py-0.5 text-xs font-bold text-white">{blocked.length}</span>
          </div>
          <UserManagementTable profiles={blocked} mode="blocked" />
        </section>
      )}
    </div>
  );
}
