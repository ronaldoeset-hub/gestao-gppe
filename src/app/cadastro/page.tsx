"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { ArrowLeft, Building2, FileCheck2, Lock, Mail, Phone, UserRound } from "lucide-react";
import { InstitutionalNotice } from "@/components/institutional-notice";
import { schoolUnits } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";

export default function CadastroPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [accountKind, setAccountKind] = useState<"unidade" | "gppe">("unidade");
  const [profileType, setProfileType] = useState<"gestor_escolar" | "conselho_escolar">("gestor_escolar");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schools = useMemo(() => [...schoolUnits].sort((a, b) => a.name.localeCompare(b.name)), []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("Enviando cadastro para analise...");

    try {
      const requestedRole = accountKind === "gppe" ? "tecnico_gppe" : profileType;
      const selectedSchool = accountKind === "unidade" ? schoolName : "";
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
            role: requestedRole,
            account_kind: accountKind,
            selected_school_name: selectedSchool,
            access_status: "pendente"
          },
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (error) {
        setMessage(`Nao foi possivel criar o cadastro: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      setMessage("Cadastro enviado. O administrador deve aprovar seu acesso e vincular sua unidade no menu Perfis.");
      setFullName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setSchoolName("");
      setAccountKind("unidade");
      setProfileType("gestor_escolar");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido.";
      setMessage(`Falha ao conectar com o cadastro: ${errorMessage}`);
    }

    setIsSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-gradient-to-br from-blue-950 via-blue-800 to-emerald-700 p-8 text-white lg:p-10">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-black text-blue-100 hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar ao login
          </Link>
          <div className="mt-16">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-300 text-blue-950">
              <FileCheck2 className="h-8 w-8" aria-hidden="true" />
            </div>
            <p className="mt-6 text-sm font-black uppercase tracking-wide text-amber-300">Solicitacao de acesso</p>
            <h1 className="mt-3 text-4xl font-black leading-tight">Cadastro EduConecta</h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-blue-50">
              O usuario escolhe a unidade de ensino correspondente. Depois, o administrador aprova o acesso para que ele visualize apenas as informacoes vinculadas a essa unidade.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6 lg:p-10">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-emerald-600">Novo usuario</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Criar cadastro</h2>
            <p className="mt-1 text-sm text-slate-600">Campos com dados reais devem ser usados apenas quando houver autorizacao.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nome completo" icon={<UserRound className="h-4 w-4" />}>
              <input value={fullName} onChange={(event) => setFullName(event.target.value)} required className="h-11 w-full border-0 outline-none" placeholder="Nome do usuario" />
            </Field>
            <Field label="Telefone" icon={<Phone className="h-4 w-4" />}>
              <input value={phone} onChange={(event) => setPhone(event.target.value)} className="h-11 w-full border-0 outline-none" placeholder="(61) 00000-0000" />
            </Field>
            <Field label="E-mail" icon={<Mail className="h-4 w-4" />}>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="h-11 w-full border-0 outline-none" placeholder="usuario@email.com" />
            </Field>
            <Field label="Senha" icon={<Lock className="h-4 w-4" />}>
              <input type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required className="h-11 w-full border-0 outline-none" placeholder="Minimo 6 caracteres" />
            </Field>
          </div>

          <label className="block text-sm font-semibold text-slate-700">
            Tipo de cadastro
            <select value={accountKind} onChange={(event) => setAccountKind(event.target.value as "unidade" | "gppe")} className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-amber-300">
              <option value="unidade">Funcionario de unidade escolar</option>
              <option value="gppe">Equipe GPPE / Departamento</option>
            </select>
          </label>

          {accountKind === "unidade" ? (
            <>
              <label className="block text-sm font-semibold text-slate-700">
                Perfil solicitado
                <select value={profileType} onChange={(event) => setProfileType(event.target.value as "gestor_escolar" | "conselho_escolar")} className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-amber-300">
                  <option value="gestor_escolar">Gestor Escolar</option>
                  <option value="conselho_escolar">Conselho Escolar</option>
                </select>
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Unidade de ensino correspondente
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-300 px-3 focus-within:ring-2 focus-within:ring-amber-300">
                  <Building2 className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  <select value={schoolName} onChange={(event) => setSchoolName(event.target.value)} required className="h-11 w-full border-0 bg-white outline-none">
                    <option value="">Selecione sua unica escola ou creche</option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.name}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="mt-2 block text-xs font-semibold text-slate-500">
                  O acesso ficara limitado a esta unidade. Alteracoes posteriores somente pelo administrador.
                </span>
              </label>
            </>
          ) : (
            <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold leading-6 text-blue-950">
              Cadastro solicitado como Tecnico GPPE. Esse perfil podera alimentar o sistema em varias unidades, mas nao tera permissao de administrador.
              A liberacao continua dependendo da aprovacao do administrador.
            </section>
          )}

          <InstitutionalNotice compact />

          <button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-xl bg-blue-700 px-4 text-sm font-black text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "Enviando..." : "Solicitar acesso"}
          </button>

          {message ? <p className="rounded-xl bg-blue-50 p-3 text-sm font-semibold leading-6 text-blue-900">{message}</p> : null}
        </form>
      </section>
    </main>
  );
}

function Field({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-300 px-3 focus-within:ring-2 focus-within:ring-amber-300">
        <span className="text-slate-400">{icon}</span>
        {children}
      </div>
    </label>
  );
}
