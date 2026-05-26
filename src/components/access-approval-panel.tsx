"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, CheckCircle2, Clock, UserCheck } from "lucide-react";
import { roleLabels } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { ProfileRecord } from "@/lib/types";

type AccessApprovalPanelProps = {
  profiles: ProfileRecord[];
};

export function AccessApprovalPanel({ profiles }: AccessApprovalPanelProps) {
  const router = useRouter();
  const [items, setItems] = useState(profiles);
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");

  const pendingProfiles = useMemo(() => items.filter((profile) => profile.accessStatus === "pendente"), [items]);

  async function updateAccess(profileId: string, accessStatus: "aprovado" | "bloqueado") {
    setBusyId(profileId);
    setMessage(accessStatus === "aprovado" ? "Aprovando acesso..." : "Bloqueando acesso...");

    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("profiles")
      .update({
        access_status: accessStatus,
        approved_at: accessStatus === "aprovado" ? new Date().toISOString() : null,
        approved_by: accessStatus === "aprovado" ? user?.id ?? null : null
      })
      .eq("id", profileId);

    if (error) {
      setMessage(`Nao foi possivel atualizar o acesso: ${error.message}`);
      setBusyId("");
      return;
    }

    setItems((current) => current.map((profile) => (profile.id === profileId ? { ...profile, accessStatus } : profile)));
    setMessage(accessStatus === "aprovado" ? "Acesso aprovado com sucesso." : "Solicitacao bloqueada.");
    setBusyId("");
    router.refresh();
  }

  return (
    <section className="rounded-md border border-amber-200 bg-amber-50 p-5 shadow-soft">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-amber-300 text-blue-950">
              <UserCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-black uppercase text-blue-950">Aprovacao de acessos</p>
              <h2 className="text-xl font-black text-slate-950">
                {pendingProfiles.length === 1 ? "1 cadastro aguardando" : `${pendingProfiles.length} cadastros aguardando`}
              </h2>
            </div>
          </div>
          <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-slate-700">
            Novas solicitacoes ficam pendentes ate que um administrador aprove. Depois da aprovacao, o usuario consegue entrar no sistema conforme o perfil solicitado.
          </p>
        </div>
        <a
          href="#usuarios-cadastrados"
          className="inline-flex h-10 items-center justify-center rounded-md border border-amber-300 bg-white px-4 text-sm font-black text-blue-950 hover:bg-amber-100"
        >
          Ver todos
        </a>
      </div>

      {pendingProfiles.length ? (
        <div className="mt-5 grid gap-3">
          {pendingProfiles.map((profile) => (
            <article key={profile.id} className="rounded-md border border-amber-200 bg-white p-4">
              <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_auto] lg:items-center">
                <div>
                  <p className="font-black text-slate-950">{profile.fullName}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    {roleLabels[profile.role]} | {profile.school}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Solicitado em {formatDate(profile.accessRequestedAt ?? profile.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-black uppercase">
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2.5 py-1 text-amber-800">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    Pendente
                  </span>
                  {profile.phone ? <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-600">{profile.phone}</span> : null}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
                  <button
                    type="button"
                    disabled={busyId === profile.id}
                    onClick={() => updateAccess(profile.id, "aprovado")}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-black text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Aprovar
                  </button>
                  <button
                    type="button"
                    disabled={busyId === profile.id}
                    onClick={() => updateAccess(profile.id, "bloqueado")}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Ban className="h-4 w-4" aria-hidden="true" />
                    Bloquear
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-emerald-200 bg-white p-4 text-sm font-semibold text-emerald-800">
          Nenhum cadastro pendente no momento.
        </div>
      )}

      {message ? <p className="mt-4 rounded-md bg-white px-3 py-2 text-sm font-semibold text-blue-950">{message}</p> : null}
    </section>
  );
}
