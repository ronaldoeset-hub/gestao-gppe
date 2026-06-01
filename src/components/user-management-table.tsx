"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { approveUser, blockUser } from "@/lib/actions/profiles";
import type { ProfileRecord } from "@/lib/types";

type Mode = "pending" | "approved" | "blocked";

const roleLabels: Record<string, string> = {
  admin_sme: "Admin SME",
  tecnico_gppe: "Técnico GPPE",
  gestor_escolar: "Gestor Escolar",
  conselho_escolar: "Conselho Escolar",
  funcionario_escola: "Funcionário",
};

function ActionButton({
  label,
  onClick,
  variant,
}: {
  label: string;
  onClick: () => void;
  variant: "approve" | "block" | "unblock";
}) {
  const [pending, startTransition] = useTransition();

  const colors = {
    approve: "bg-emerald-600 text-white hover:bg-emerald-700",
    block: "bg-red-600 text-white hover:bg-red-700",
    unblock: "bg-slate-600 text-white hover:bg-slate-700",
  };

  return (
    <Button
      disabled={pending}
      onClick={() => startTransition(onClick)}
      className={`h-8 px-3 text-xs font-black ${colors[variant]}`}
    >
      {pending ? "Aguarde..." : label}
    </Button>
  );
}

export function UserManagementTable({
  profiles,
  mode,
}: {
  profiles: ProfileRecord[];
  mode: Mode;
}) {
  if (profiles.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white shadow-soft">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 text-left">
            <th className="px-4 py-3 font-black text-slate-700">Nome</th>
            <th className="px-4 py-3 font-black text-slate-700">Perfil</th>
            <th className="px-4 py-3 font-black text-slate-700">Escola</th>
            <th className="px-4 py-3 font-black text-slate-700">Telefone</th>
            <th className="px-4 py-3 font-black text-slate-700">Desde</th>
            <th className="px-4 py-3 font-black text-slate-700">Ações</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.id} className="border-b border-slate-50 hover:bg-slate-50">
              <td className="px-4 py-3 font-semibold text-slate-800">{profile.fullName}</td>
              <td className="px-4 py-3 text-slate-600">
                {roleLabels[profile.role] ?? profile.role}
              </td>
              <td className="px-4 py-3 text-slate-600">{profile.school || "—"}</td>
              <td className="px-4 py-3 text-slate-600">{profile.phone || "—"}</td>
              <td className="px-4 py-3 text-slate-500">
                {new Date(profile.createdAt).toLocaleDateString("pt-BR")}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  {mode === "pending" && (
                    <ActionButton
                      label="Aprovar"
                      variant="approve"
                      onClick={async () => {
                        const result = await approveUser(profile.id);
                        if (result.error) alert(result.error);
                      }}
                    />
                  )}
                  {mode === "approved" && (
                    <ActionButton
                      label="Bloquear"
                      variant="block"
                      onClick={async () => {
                        if (!confirm(`Bloquear ${profile.fullName}?`)) return;
                        const result = await blockUser(profile.id);
                        if (result.error) alert(result.error);
                      }}
                    />
                  )}
                  {mode === "blocked" && (
                    <ActionButton
                      label="Desbloquear"
                      variant="unblock"
                      onClick={async () => {
                        const result = await approveUser(profile.id);
                        if (result.error) alert(result.error);
                      }}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
