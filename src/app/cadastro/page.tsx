"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { ArrowLeft, Building2, Lock, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { InstitutionalNotice } from "@/components/institutional-notice";
import { FormMessage } from "@/components/ui/form-message";
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
      setMessage("Cadastro recebido com sucesso! O seu acesso permanecera PENDENTE ate que o administrador da SME aprove manualmente. Voce sera notificado quando seu acesso for liberado.");
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
    <main className="grid min-h-screen lg:grid-cols-[1fr_1.2fr]">
      {/* Painel esquerdo — identidade SME */}
      <section className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-sme-navy via-sme-navy-700 to-sme-blue p-8 text-white lg:p-14">
        <div className="sme-tricolor absolute left-0 right-0 top-0" aria-hidden="true" />

        <div className="relative mt-4">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-medium text-blue-200 hover:text-white transition">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar ao login
          </Link>
        </div>

        <div className="relative max-w-sm">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sme-navy shadow-soft-sm">
            <ShieldCheck className="h-8 w-8" aria-hidden="true" />
            <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-sme-yellow" aria-hidden="true" />
          </div>
          <span className="mt-5 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-sme-yellow">
            Solicitação de acesso
          </span>
          <h1 className="font-display mt-3 text-4xl font-bold leading-tight">
            Cadastro EduConecta
          </h1>
          <p className="mt-4 text-sm leading-7 text-blue-100">
            Preencha o formulário com seus dados. Após o envio, seu acesso ficará <strong className="text-sme-yellow">pendente</strong> até a aprovação manual do administrador da SME.
          </p>
          <div className="mt-6 space-y-2 text-sm font-medium text-blue-200">
            <p>✓ Dados protegidos pelo Supabase Auth</p>
            <p>✓ Aprovação individual por administrador</p>
            <p>✓ Acesso limitado à sua unidade</p>
          </div>
        </div>

        <div>
          <div className="h-1 w-24 rounded-full bg-sme-yellow opacity-80" aria-hidden="true" />
          <p className="mt-3 text-xs text-blue-300">Águas Lindas de Goiás · SME · {new Date().getFullYear()}</p>
        </div>
      </section>

      {/* Painel direito — formulário */}
      <section className="flex items-start justify-center bg-sme-surface p-6 lg:py-10">
        <div className="w-full max-w-lg animate-rise">
          <div className="rounded-2xl border border-sme-line bg-white p-8 shadow-soft">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wide text-sme-blue">Novo usuário</p>
              <h2 className="font-display mt-1 text-2xl font-bold text-sme-navy">Criar cadastro</h2>
              <p className="mt-1 text-sm text-sme-muted">Campos com dados reais devem ser usados apenas quando houver autorização.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nome completo" icon={<UserRound className="h-4 w-4" />}>
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    required
                    className="h-11 w-full border-0 bg-transparent outline-none text-sme-ink placeholder:text-sme-muted"
                    placeholder="Nome do usuário"
                  />
                </Field>
                <Field label="Telefone" icon={<Phone className="h-4 w-4" />}>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="h-11 w-full border-0 bg-transparent outline-none text-sme-ink placeholder:text-sme-muted"
                    placeholder="(61) 00000-0000"
                  />
                </Field>
                <Field label="E-mail" icon={<Mail className="h-4 w-4" />}>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="h-11 w-full border-0 bg-transparent outline-none text-sme-ink placeholder:text-sme-muted"
                    placeholder="usuario@email.com"
                  />
                </Field>
                <Field label="Senha" icon={<Lock className="h-4 w-4" />}>
                  <input
                    type="password"
                    minLength={6}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="h-11 w-full border-0 bg-transparent outline-none text-sme-ink placeholder:text-sme-muted"
                    placeholder="Mínimo 6 caracteres"
                  />
                </Field>
              </div>

              <div>
                <label className="block text-sm font-semibold text-sme-ink" htmlFor="accountKind">
                  Tipo de cadastro
                </label>
                <select
                  id="accountKind"
                  value={accountKind}
                  onChange={(event) => setAccountKind(event.target.value as "unidade" | "gppe")}
                  className="mt-1.5 h-11 w-full rounded-xl border border-sme-line px-3 text-sme-ink outline-none focus:border-sme-blue focus:ring-2 focus:ring-sme-yellow/30 transition"
                >
                  <option value="unidade">Funcionário de unidade escolar</option>
                  <option value="gppe">Equipe GPPE / Departamento</option>
                </select>
              </div>

              {accountKind === "unidade" ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-sme-ink" htmlFor="profileType">
                      Perfil solicitado
                    </label>
                    <select
                      id="profileType"
                      value={profileType}
                      onChange={(event) => setProfileType(event.target.value as "gestor_escolar" | "conselho_escolar")}
                      className="mt-1.5 h-11 w-full rounded-xl border border-sme-line px-3 text-sme-ink outline-none focus:border-sme-blue focus:ring-2 focus:ring-sme-yellow/30 transition"
                    >
                      <option value="gestor_escolar">Gestor Escolar</option>
                      <option value="conselho_escolar">Conselho Escolar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-sme-ink" htmlFor="schoolName">
                      Unidade de ensino
                    </label>
                    <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-sme-line bg-white px-3 focus-within:border-sme-blue focus-within:ring-2 focus-within:ring-sme-yellow/30 transition">
                      <Building2 className="h-4 w-4 shrink-0 text-sme-muted" aria-hidden="true" />
                      <select
                        id="schoolName"
                        value={schoolName}
                        onChange={(event) => setSchoolName(event.target.value)}
                        required
                        className="h-11 w-full border-0 bg-transparent outline-none text-sme-ink"
                      >
                        <option value="">Selecione sua escola ou creche</option>
                        {schools.map((school) => (
                          <option key={school.id} value={school.name}>
                            {school.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="mt-1.5 text-xs font-medium text-sme-muted">
                      O acesso ficará limitado a esta unidade. Alterações somente pelo administrador.
                    </p>
                  </div>
                </>
              ) : (
                <section className="rounded-xl border border-sme-blue-soft bg-sme-blue-soft p-4 text-sm font-medium leading-6 text-sme-navy">
                  Cadastro como Técnico GPPE. Esse perfil poderá atuar em várias unidades, mas não terá permissão de administrador. A liberação depende da aprovação do administrador.
                </section>
              )}

              <InstitutionalNotice compact />

              <button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl bg-sme-navy px-4 text-sm font-semibold text-white transition hover:bg-sme-blue focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Enviando..." : "Solicitar acesso"}
              </button>

              {message ? (
                <div className="rounded-xl border border-sme-line bg-sme-surface p-3">
                  <FormMessage
                    tone={
                      message.startsWith("Nao") || message.startsWith("Falha")
                        ? "error"
                        : message.startsWith("Enviando")
                          ? "neutral"
                          : "success"
                    }
                  >
                    {message}
                  </FormMessage>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-sme-ink">
      {label}
      <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-sme-line bg-white px-3 focus-within:border-sme-blue focus-within:ring-2 focus-within:ring-sme-yellow/30 transition">
        <span className="text-sme-muted">{icon}</span>
        {children}
      </div>
    </label>
  );
}
