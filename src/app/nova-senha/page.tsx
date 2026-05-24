"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileCheck2, LockKeyhole } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function NewPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 6) {
      setMessage("A nova senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("As senhas informadas nao conferem.");
      return;
    }

    setIsSaving(true);
    setMessage("Atualizando sua senha...");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage("Nao foi possivel atualizar a senha. Abra novamente o link recebido por e-mail.");
      setIsSaving(false);
      return;
    }

    setMessage("Senha atualizada com sucesso. Redirecionando...");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen bg-sme-surface lg:grid-cols-[1.15fr_0.85fr]">
      <section className="flex min-h-[42vh] flex-col justify-between bg-sme-blue p-8 text-white lg:min-h-screen lg:p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-sme-yellow text-sme-ink">
            <FileCheck2 className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <p className="font-bold">SME Aguas Lindas de Goias</p>
            <p className="text-sm text-sky-100">Gerencia GPPE</p>
          </div>
        </div>
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex rounded-md bg-white/12 px-3 py-1 text-sm font-semibold">Recuperacao de acesso</p>
          <h1 className="text-4xl font-bold leading-tight lg:text-5xl">Defina uma nova senha</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-sky-50">
            Use esta tela apenas quando chegar pelo link de recuperacao enviado para o seu e-mail.
          </p>
        </div>
        <div className="h-2 w-40 rounded-full bg-gradient-to-r from-sme-yellow via-white to-sme-red" />
      </section>
      <section className="flex items-center justify-center p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-bold text-sme-ink">Nova senha</h2>
          <p className="mt-1 text-sm text-slate-600">Digite e confirme sua nova senha de acesso.</p>

          <label className="mt-6 block text-sm font-semibold text-slate-700" htmlFor="password">
            Nova senha
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-md border border-slate-300 px-3 focus-within:ring-2 focus-within:ring-sme-yellow">
            <LockKeyhole className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 w-full border-0 outline-none"
              placeholder="Minimo de 6 caracteres"
            />
          </div>

          <label className="mt-4 block text-sm font-semibold text-slate-700" htmlFor="confirm-password">
            Confirmar senha
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-md border border-slate-300 px-3 focus-within:ring-2 focus-within:ring-sme-yellow">
            <LockKeyhole className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="h-11 w-full border-0 outline-none"
              placeholder="Repita a nova senha"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="mt-6 h-11 w-full rounded-md bg-sme-blue px-4 text-sm font-bold text-white transition hover:bg-sme-navy focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Salvando..." : "Salvar nova senha"}
          </button>
          {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
        </form>
      </section>
    </main>
  );
}
