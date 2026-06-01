"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { roleLabels } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import type { ProfileRecord, UserRole } from "@/lib/types";

type SchoolOption = {
  id: string;
  name: string;
};

type ProfileManagerProps = {
  profiles: ProfileRecord[];
};

const roles: UserRole[] = ["admin_sme", "tecnico_gppe", "gestor_escolar", "funcionario_escola", "conselho_escolar"];

export function ProfileManager({ profiles }: ProfileManagerProps) {
  const [selectedUser, setSelectedUser] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("gestor_escolar");
  const [accessStatus, setAccessStatus] = useState<"pendente" | "aprovado" | "bloqueado">("aprovado");
  const [schoolUnitId, setSchoolUnitId] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");
  const [schools, setSchools] = useState<SchoolOption[]>([]);

  useEffect(() => {
    async function loadSchools() {
      const supabase = createClient();
      const { data } = await supabase.from("school_units").select("id,name").order("name", { ascending: true });
      setSchools(data ?? []);
    }

    loadSchools();
  }, []);

  function handleSelectedUserChange(userId: string) {
    setSelectedUser(userId);

    const profile = profiles.find((item) => item.id === userId);
    if (!profile) return;

    setFullName(profile.fullName);
    setRole(profile.role);
    setPhone(profile.phone);
    setAccessStatus(profile.accessStatus ?? "aprovado");
    setSchoolUnitId("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedUser) return;

    setStatus("Atualizando perfil...");
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        role,
        access_status: accessStatus,
        school_unit_id: schoolUnitId || null,
        phone: phone || null
      })
      .eq("id", selectedUser);

    setStatus(error ? `Erro ao atualizar: ${error.message}` : "Perfil atualizado com sucesso.");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-bold text-sme-ink">Atualizar usuário</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="block text-sm font-semibold text-slate-700 xl:col-span-2">
          Usuário
          <select
            value={selectedUser}
            onChange={(event) => handleSelectedUserChange(event.target.value)}
            required
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
          >
            <option value="">Selecione</option>
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.fullName} - {roleLabels[profile.role]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-700 xl:col-span-2">
          Nome
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Perfil
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole)}
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
          >
            {roles.map((item) => (
              <option key={item} value={item}>
                {roleLabels[item]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Acesso
          <select
            value={accessStatus}
            onChange={(event) => setAccessStatus(event.target.value as "pendente" | "aprovado" | "bloqueado")}
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
          >
            <option value="pendente">Pendente</option>
            <option value="aprovado">Aprovado</option>
            <option value="bloqueado">Bloqueado</option>
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-700 xl:col-span-2">
          Unidade vinculada
          <select
            value={schoolUnitId}
            onChange={(event) => setSchoolUnitId(event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
          >
            <option value="">Sem vínculo ou manter atual</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Telefone
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
            placeholder="(61) 00000-0000"
          />
        </label>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">{status || "O login deve ser criado antes em Authentication > Users no Supabase."}</p>
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-sme-blue px-4 text-sm font-semibold text-white hover:bg-sme-navy focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Salvar perfil
        </button>
      </div>
    </form>
  );
}
