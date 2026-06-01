import { Settings } from "lucide-react";
import { ModuleHeader } from "@/components/module-header";
import { UserManagementTable } from "@/components/user-management-table";
import { getProfiles } from "@/lib/supabase/queries";
import { isSupabaseEnabled } from "@/lib/supabase/config";

export const metadata = {
  title: "Administração — EduConecta GPPE",
};

export default async function AdministracaoPage() {
  const enabled = isSupabaseEnabled();
  const profiles = enabled ? await getProfiles() : [];

  const pending = profiles.filter((p) => p.accessStatus === "pendente");
  const approved = profiles.filter((p) => p.accessStatus === "aprovado" || !p.accessStatus);
  const blocked = profiles.filter((p) => p.accessStatus === "bloqueado");

  return (
    <div className="space-y-8">
      <ModuleHeader
        title="Administração de Usuários"
        description="Aprove, bloqueie e gerencie os perfis de acesso ao sistema. Somente administradores têm acesso a esta área."
        icon={Settings}
      />

      {!enabled && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>Modo demonstração</strong> — conecte o Supabase para gerenciar usuários reais.
        </div>
      )}

      {pending.length > 0 && (
        <section>
          <h2 className="mb-3 text-base font-black text-slate-950">
            Aguardando aprovação{" "}
            <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
              {pending.length}
            </span>
          </h2>
          <UserManagementTable profiles={pending} mode="pending" />
        </section>
      )}

      <section>
        <h2 className="mb-3 text-base font-black text-slate-950">
          Usuários aprovados{" "}
          <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
            {approved.length}
          </span>
        </h2>
        {approved.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhum usuário aprovado ainda.</p>
        ) : (
          <UserManagementTable profiles={approved} mode="approved" />
        )}
      </section>

      {blocked.length > 0 && (
        <section>
          <h2 className="mb-3 text-base font-black text-slate-950">
            Usuários bloqueados{" "}
            <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {blocked.length}
            </span>
          </h2>
          <UserManagementTable profiles={blocked} mode="blocked" />
        </section>
      )}
    </div>
  );
}
