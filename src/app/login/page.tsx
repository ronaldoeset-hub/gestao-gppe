"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileCheck2, Lock, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isRecovering, setIsRecovering] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Validando acesso...");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage("Não foi possível entrar. Confira e-mail e senha.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handlePasswordRecovery() {
    if (!email) {
      setMessage("Informe seu e-mail para receber o link de recuperacao de senha.");
      return;
    }

    setIsRecovering(true);
    setMessage("Enviando link de recuperacao...");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/nova-senha`
    });

    if (error) {
      setMessage("Nao foi possivel enviar o link. Confira o e-mail e tente novamente.");
      setIsRecovering(false);
      return;
    }

    setMessage("Enviamos um link de recuperacao para o seu e-mail.");
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
            <p className="font-bold">SME Águas Lindas de Goiás</p>
            <p className="text-sm text-sky-100">Gerência GPPE</p>
          </div>
        </div>
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex rounded-md bg-white/12 px-3 py-1 text-sm font-semibold">Sistema interno</p>
          <h1 className="text-4xl font-bold leading-tight lg:text-5xl">Gestão de Recursos e Conselhos - GPPE</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-sky-50">
            Acompanhamento de unidades escolares, conselhos, repasses, documentos e prestações de contas em uma
            aplicação independente preparada para publicação institucional.
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
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="mt-6 h-11 w-full rounded-md bg-sme-blue px-4 text-sm font-bold text-white transition hover:bg-sme-navy focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2"
          >
            Acessar sistema
          </button>
          <button
            type="button"
            onClick={handlePasswordRecovery}
            disabled={isRecovering}
            className="mt-3 h-10 w-full rounded-md border border-slate-300 px-4 text-sm font-bold text-sme-blue transition hover:border-sme-blue hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRecovering ? "Enviando..." : "Esqueci minha senha"}
          </button>
          {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
        </form>
      </section>
    </main>
  );
}
