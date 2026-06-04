import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { ModuleHeader } from "@/components/module-header";
import { ProfileManager } from "@/components/profile-manager";
import { SelfProfileForm } from "@/components/self-profile-form";
import { roleLabels, rolePermissions } from "@/lib/data";
import { getProfiles } from "@/lib/supabase/queries";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Perfis de acesso",
  description: "Consulta e gestao dos perfis de acesso do Portal EduConecta GPPE."
};

export const revalidate = 60;

export default async function RolesPage() {
  const profiles = await getProfiles();
  const user = isSupabaseEnabled()
    ? (await (await createClient()).auth.getUser()).data.user
    : null;
  const currentProfile = profiles.find((profile) => profile.id === user?.id);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Perfis de acesso"
        description="Gestao de dados pessoais, senhas, vinculos institucionais e matriz de permissoes da plataforma."
        icon={ShieldCheck}
      />

      <SelfProfileForm
        fullName={currentProfile?.fullName ?? user?.email ?? ""}
        phone={currentProfile?.phone ?? ""}
        email={user?.email}
      />

      <ProfileManager profiles={profiles} />

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-sme-ink">Usuarios cadastrados</h2>
        <DataTable
          rows={profiles}
          emptyDescription="Nenhum perfil cadastrado foi encontrado."
          columns={[
            { key: "name", header: "Nome", render: (row) => <span className="font-semibold text-sme-ink">{row.fullName}</span> },
            { key: "role", header: "Perfil", render: (row) => roleLabels[row.role] },
            { key: "school", header: "Unidade", render: (row) => row.school },
            { key: "access", header: "Acesso", render: (row) => row.accessStatus ?? "aprovado" },
            { key: "phone", header: "Telefone", render: (row) => row.phone || "-" },
            { key: "createdAt", header: "Criado em", render: (row) => formatDate(row.createdAt) }
          ]}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {rolePermissions.map((role) => (
          <article key={role.role} className="rounded-md border border-sme-line bg-white p-5 shadow-soft">
            <h2 className="text-lg font-bold text-sme-ink">{role.role}</h2>
            <ul className="mt-4 space-y-2">
              {role.permissions.map((permission) => (
                <li key={permission} className="flex items-center gap-2 text-sm text-sme-muted">
                  <span className="h-2 w-2 rounded-full bg-sme-yellow" />
                  {permission}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  );
}
