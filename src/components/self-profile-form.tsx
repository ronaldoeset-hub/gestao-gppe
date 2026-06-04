"use client";

import { useFormState, useFormStatus } from "react-dom";
import { KeyRound, Save } from "lucide-react";
import { updateOwnPassword, updateOwnProfile } from "@/lib/actions/profiles";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";

type SelfProfileFormProps = {
  fullName: string;
  phone: string;
  email?: string;
};

const initialActionState = {
  ok: false,
  message: ""
};

function SubmitButton({ label, busyLabel, icon }: { label: string; busyLabel: string; icon: "save" | "key" }) {
  const { pending } = useFormStatus();
  const Icon = icon === "save" ? Save : KeyRound;

  return (
    <Button type="submit" disabled={pending}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      {pending ? busyLabel : label}
    </Button>
  );
}

export function SelfProfileForm({ fullName, phone, email }: SelfProfileFormProps) {
  const [profileState, profileAction] = useFormState(updateOwnProfile, initialActionState);
  const [passwordState, passwordAction] = useFormState(updateOwnPassword, initialActionState);

  return (
    <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <form action={profileAction} className="rounded-md border border-sme-line bg-white p-5 shadow-soft">
        <div>
          <h2 className="text-lg font-black text-sme-ink">Meu perfil</h2>
          <p className="mt-1 text-sm leading-6 text-sme-muted">Mantenha seus dados de contato atualizados para notificacoes e suporte operacional.</p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-semibold text-sme-ink md:col-span-2">
            E-mail de acesso
            <input value={email ?? ""} disabled className="mt-2 h-11 w-full rounded-md border border-sme-line bg-sme-surface px-3 text-sme-muted" />
          </label>
          <label className="block text-sm font-semibold text-sme-ink">
            Nome completo
            <input
              name="full_name"
              defaultValue={fullName}
              required
              minLength={3}
              className="mt-2 h-11 w-full rounded-md border border-sme-line px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
            />
          </label>
          <label className="block text-sm font-semibold text-sme-ink">
            Telefone
            <input
              name="phone"
              defaultValue={phone}
              placeholder="(61) 00000-0000"
              className="mt-2 h-11 w-full rounded-md border border-sme-line px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
            />
          </label>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <FormMessage tone={profileState.ok ? "success" : profileState.message ? "error" : "neutral"}>
            {profileState.message || "Alteracoes refletem no cabecalho e nos registros administrativos."}
          </FormMessage>
          <SubmitButton icon="save" label="Salvar dados" busyLabel="Salvando" />
        </div>
      </form>

      <form action={passwordAction} className="rounded-md border border-sme-line bg-white p-5 shadow-soft">
        <div>
          <h2 className="text-lg font-black text-sme-ink">Seguranca da conta</h2>
          <p className="mt-1 text-sm leading-6 text-sme-muted">Troque a senha periodicamente e use pelo menos 8 caracteres.</p>
        </div>
        <div className="mt-4 space-y-4">
          <label className="block text-sm font-semibold text-sme-ink">
            Nova senha
            <input
              name="password"
              type="password"
              minLength={8}
              required
              className="mt-2 h-11 w-full rounded-md border border-sme-line px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
            />
          </label>
          <label className="block text-sm font-semibold text-sme-ink">
            Confirmar nova senha
            <input
              name="password_confirmation"
              type="password"
              minLength={8}
              required
              className="mt-2 h-11 w-full rounded-md border border-sme-line px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
            />
          </label>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <FormMessage tone={passwordState.ok ? "success" : passwordState.message ? "error" : "neutral"}>
            {passwordState.message || "A troca usa a sessao autenticada atual no Supabase."}
          </FormMessage>
          <SubmitButton icon="key" label="Trocar senha" busyLabel="Atualizando" />
        </div>
      </form>
    </section>
  );
}
