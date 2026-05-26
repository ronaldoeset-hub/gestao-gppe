import { ShieldCheck } from "lucide-react";
import { AccessApprovalPanel } from "@/components/access-approval-panel";
import { DataTable } from "@/components/data-table";
import { ModuleHeader } from "@/components/module-header";
import { ProfileManager } from "@/components/profile-manager";
import { roleLabels, rolePermissions } from "@/lib/data";
import { getProfiles } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils";

export default async function RolesPage() {
  const profiles = await getProfiles();

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Perfis de acesso"
        description="Matriz inicial de permissões para Administrador SME, Técnico GPPE, Gestor Escolar e Conselho Escolar."
        icon={ShieldCheck}
      />
      <AccessApprovalPanel profiles={profiles} />
      <ProfileManager profiles={profiles} />
      <section id="usuarios-cadastrados" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-bold text-sme-ink">Usuários cadastrados</h2>
        <DataTable
          rows={profiles}
          columns={[
            { key: "name", header: "Nome", render: (row) => <span className="font-semibold text-sme-ink">{row.fullName}</span> },
            { key: "role", header: "Perfil", render: (row) => roleLabels[row.role] },
            { key: "school", header: "Unidade", render: (row) => row.school },
            {
              key: "access",
              header: "Acesso",
              render: (row) => {
                const access = row.accessStatus ?? "aprovado";
                const color =
                  access === "aprovado"
                    ? "bg-emerald-100 text-emerald-800"
                    : access === "bloqueado"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800";

                return <span className={`rounded-md px-2.5 py-1 text-xs font-black uppercase ${color}`}>{access}</span>;
              }
            },
            { key: "phone", header: "Telefone", render: (row) => row.phone || "-" },
            { key: "createdAt", header: "Criado em", render: (row) => formatDate(row.createdAt) }
          ]}
        />
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {rolePermissions.map((role) => (
          <article key={role.role} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-lg font-bold text-sme-ink">{role.role}</h2>
            <ul className="mt-4 space-y-2">
              {role.permissions.map((permission) => (
                <li key={permission} className="flex items-center gap-2 text-sm text-slate-700">
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
