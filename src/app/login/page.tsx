"use client";

import { useState } from "react";
import Link from "next/link";
import { FileCheck2, Lock, Mail } from "lucide-react";
import { InstitutionalNotice } from "@/components/institutional-notice";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isRecovering, setIsRecovering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function loginErrorMessage(errorMessage: string) {
    const normalized = errorMessage.toLowerCase();

    if (normalized.includes("invalid login credentials")) {
      return "E-mail ou senha incorretos. Confira os dados ou use Esqueci minha senha.";
    }

    if (normalized.includes("email not confirmed")) {
      return "Este e-mail ainda nao foi confirmado no Supabase. Confirme o usuario em Authentication > Users.";
    }

    return `Nao foi possivel entrar: ${errorMessage}`;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("Validando acesso...");

    try {
      const supabase = createClient();
      const loginAttempt = supabase.auth.signInWithPassword({ email: email.trim(), password });
      const timeout = new Promise<never>((_, reject) => {
        window.setTimeout(() => reject(new Error("Tempo de resposta esgotado ao conectar com o Supabase.")), 15000);
      });
      const { error } = await Promise.race([loginAttempt, timeout]);

      if (error) {
        setMessage(loginErrorMessage(error.message));
        setIsSubmitting(false);
        return;
      }

      window.location.assign("/dashboard");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido no login.";
      setMessage(`Nao foi possivel conectar ao login: ${errorMessage}`);
      setIsSubmitting(false);
    }
  }

  async function handlePasswordRecovery() {
    if (!email) {
      setMessage("Informe seu e-mail para receber o link de recuperacao de senha.");
      return;
    }

    setIsRecovering(true);
    setMessage("Enviando link de recuperacao...");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/nova-senha`
      });

      if (error) {
        setMessage(`Nao foi possivel enviar o link: ${error.message}`);
        setIsRecovering(false);
        return;
      }

      setMessage("Enviamos um link de recuperacao para o seu e-mail.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido na recuperacao.";
      setMessage(`Nao foi possivel conectar ao Supabase: ${errorMessage}`);
      setIsRecovering(false);
    }

    setIsRecovering(false);
  }

  return (
    <main className="grid min-h-screen bg-sme-surface lg:grid-cols-[1.15fr_0.85fr]">
      <section className="flex min-h-[42vh] flex-col justify-between bg-sme-blue p-8 text-white lg:min-h-screen lg:p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-sme-yellow text-sme-ink">
            <FileCheck2 className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <p className="font-bold">EDUCONECTA</p>
            <p className="text-sm text-sky-100">Gestao Educacional Inteligente</p>
          </div>
        </div>
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex rounded-md bg-white/12 px-3 py-1 text-sm font-semibold">Plataforma SaaS independente</p>
          <h1 className="text-4xl font-bold leading-tight lg:text-5xl">EDUCONECTA</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-sky-50">
            Transformando informacao educacional em gestao inteligente, com escolas, conselhos, recursos,
            prazos, arquivos, relatorios e indicadores em um unico ambiente.
          </p>
        </div>
        <div className="h-2 w-40 rounded-full bg-gradient-to-r from-sme-yellow via-white to-sme-red" />
      </section>
      <section className="flex items-center justify-center p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-bold text-sme-ink">Entrar</h2>
          <p className="mt-1 text-sm text-slate-600">Use as credenciais cadastradas no Supabase Auth.</p>

          <label className="mt-6 block text-sm font-semibold text-slate-700" htmlFor="email">
            E-mail
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-md border border-slate-300 px-3 focus-within:ring-2 focus-within:ring-sme-yellow">
            <Mail className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 w-full border-0 outline-none"
              placeholder="usuario@sme.gov.br"
            />
          </div>

          <label className="mt-4 block text-sm font-semibold text-slate-700" htmlFor="password">
            Senha
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-md border border-slate-300 px-3 focus-within:ring-2 focus-within:ring-sme-yellow">
            <Lock className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 w-full border-0 outline-none"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 h-11 w-full rounded-md bg-sme-blue px-4 text-sm font-bold text-white transition hover:bg-sme-navy focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Entrando..." : "Acessar sistema"}
          </button>
          <button
            type="button"
            onClick={handlePasswordRecovery}
            disabled={isRecovering}
            className="mt-3 h-10 w-full rounded-md border border-slate-300 px-4 text-sm font-bold text-sme-blue transition hover:border-sme-blue hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRecovering ? "Enviando..." : "Esqueci minha senha"}
          </button>
          <Link
            href="/cadastro"
            className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-md border border-sme-blue bg-blue-50 px-4 text-sm font-bold text-sme-blue transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2"
          >
            Criar cadastro de acesso
          </Link>
          {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
          <div className="mt-5">
            <InstitutionalNotice compact />
          </div>
          <Link href="/aviso-institucional" className="mt-4 inline-flex text-sm font-bold text-sme-blue hover:text-sme-navy">
            Ler aviso institucional
          </Link>
        </form>
      </section>
    </main>
  );
}
