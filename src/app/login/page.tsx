"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { InstitutionalNotice } from "@/components/institutional-notice";
import { FormMessage } from "@/components/ui/form-message";
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
    }
    setIsRecovering(false);
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
      {/* Painel esquerdo — identidade SME */}
      <section className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-sme-navy via-sme-navy-700 to-sme-blue p-8 text-white lg:p-14">
        {/* faixa tricolor no topo do painel */}
        <div className="sme-tricolor absolute left-0 right-0 top-0" aria-hidden="true" />

        <div className="relative mt-4 flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sme-navy shadow-soft-sm">
            <ShieldCheck className="h-7 w-7" aria-hidden="true" />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-sme-yellow" aria-hidden="true" />
          </div>
          <div>
            <p className="font-display font-bold tracking-tight">EDUCONECTA</p>
            <p className="text-xs font-medium text-blue-200">Secretaria Mun. de Educação</p>
          </div>
        </div>

        <div className="relative max-w-xl">
          <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-sme-yellow">
            Plataforma independente · GPPE
          </span>
          <h1 className="font-display mt-4 text-4xl font-bold leading-tight lg:text-5xl">
            Gestão Educacional Inteligente
          </h1>
          <p className="mt-4 text-base leading-7 text-blue-100">
            Escolas, conselhos, recursos, prazos, documentos e indicadores em um único ambiente seguro.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 text-sm font-medium text-blue-200">
            <span>✓ Controle de recursos PDDE</span>
            <span>✓ Aprovação de acessos</span>
            <span>✓ Prestação de contas</span>
          </div>
        </div>

        <div>
          <div className="h-1 w-32 rounded-full bg-sme-yellow opacity-80" aria-hidden="true" />
          <p className="mt-3 text-xs text-blue-300">Águas Lindas de Goiás · SME · {new Date().getFullYear()}</p>
        </div>
      </section>

      {/* Painel direito — formulário */}
      <section className="flex items-center justify-center bg-sme-surface p-6">
        <div className="w-full max-w-md animate-rise">
          <div className="rounded-2xl border border-sme-line bg-white p-8 shadow-soft">
            <h2 className="font-display text-2xl font-bold text-sme-navy">Entrar no sistema</h2>
            <p className="mt-1 text-sm text-sme-muted">Use as credenciais cadastradas e aprovadas pelo administrador.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label className="block text-sm font-semibold text-sme-ink" htmlFor="email">
                  E-mail institucional
                </label>
                <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-sme-line bg-white px-3 focus-within:border-sme-blue focus-within:ring-2 focus-within:ring-sme-yellow/30 transition">
                  <Mail className="h-4 w-4 shrink-0 text-sme-muted" aria-hidden="true" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-11 w-full border-0 bg-transparent outline-none text-sme-ink placeholder:text-sme-muted"
                    placeholder="usuario@sme.gov.br"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-sme-ink" htmlFor="password">
                  Senha
                </label>
                <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-sme-line bg-white px-3 focus-within:border-sme-blue focus-within:ring-2 focus-within:ring-sme-yellow/30 transition">
                  <Lock className="h-4 w-4 shrink-0 text-sme-muted" aria-hidden="true" />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-11 w-full border-0 bg-transparent outline-none text-sme-ink placeholder:text-sme-muted"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-11 w-full rounded-xl bg-sme-navy px-4 text-sm font-semibold text-white transition hover:bg-sme-blue focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Validando acesso..." : "Acessar sistema"}
              </button>
            </form>

            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={handlePasswordRecovery}
                disabled={isRecovering}
                className="h-10 w-full rounded-xl border border-sme-line px-4 text-sm font-semibold text-sme-blue transition hover:bg-sme-blue-soft focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRecovering ? "Enviando link..." : "Esqueci minha senha"}
              </button>
              <Link
                href="/cadastro"
                className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-sme-line bg-sme-surface px-4 text-sm font-semibold text-sme-ink transition hover:bg-sme-blue-soft focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2"
              >
                Solicitar cadastro de acesso
              </Link>
            </div>

            {message ? (
              <div className="mt-4">
                <FormMessage
                  tone={
                    message.startsWith("Enviamos")
                      ? "success"
                      : message.includes("...")
                        ? "neutral"
                        : "error"
                  }
                >
                  {message}
                </FormMessage>
              </div>
            ) : null}

            <div className="mt-6">
              <InstitutionalNotice compact />
            </div>
            <Link href="/aviso-institucional" className="mt-4 inline-flex text-sm font-semibold text-sme-blue hover:text-sme-navy">
              Ler aviso institucional
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
