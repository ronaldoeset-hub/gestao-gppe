"use client";

import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { approveUser, blockUser } from "@/lib/actions/profiles";
import type { ProfileRecord } from "@/lib/types";

type Mode = "pending" | "approved" | "blocked";

const roleLabels: Record<string, string> = {
  admin_sme: "Admin SME",
  tecnico_gppe: "Técnico GPPE",
  gestor_escolar: "Gestor Escolar",
  conselho_escolar: "Conselho Escolar",
  funcionario_escola: "Funcionário"
};

function ActionButton({
  label,
  onClick,
  variant
}: {
  label: string;
  onClick: () => void;
  variant: "approve" | "block" | "unblock";
}) {
  const [pending, startTransition] = useTransition();

  const styles: Record<typeof variant, string> = {
    approve: "bg-sme-green text-white hover:bg-emerald-700 border-transparent",
    block: "bg-sme-red text-white hover:bg-red-700 border-transparent",
    unblock: "border-sme-line bg-white text-sme-ink hover:bg-sme-surface"
  };

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(onClick)}
      className={cn(
        "inline-flex h-8 items-center rounded-xl border px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        styles[variant]
      )}
    >
      {pending ? "Aguarde..." : label}
    </button>
  );
}

export function UserManagementTable({ profiles, mode }: { profiles: ProfileRecord[]; mode: Mode }) {
  if (profiles.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-sme-line bg-white shadow-soft-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-sme-line bg-sme-surface text-left">
            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-sme-muted">Nome</th>
            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-sme-muted">Perfil</th>
            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-sme-muted">Escola</th>
            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-sme-muted">Telefone</th>
            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-sme-muted">Desde</th>
            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-sme-muted">Ações</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.id} className="border-b border-sme-line transition hover:bg-sme-surface/70">
              <td className="px-4 py-3 font-semibold text-sme-ink">{profile.fullName}</td>
              <td className="px-4 py-3 text-sme-muted">{roleLabels[profile.role] ?? profile.role}</td>
              <td className="px-4 py-3 text-sme-muted">{profile.school || "—"}</td>
              <td className="px-4 py-3 text-sme-muted">{profile.phone || "—"}</td>
              <td className="px-4 py-3 text-sme-muted">
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
