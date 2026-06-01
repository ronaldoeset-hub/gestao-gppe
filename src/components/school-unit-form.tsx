"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Save } from "lucide-react";
import { createSchoolUnit } from "@/lib/actions/schools";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";

const schoolTypeOptions = [
  { label: "Escola", value: "escola" },
  { label: "Creche", value: "creche" },
  { label: "CEMEI", value: "cemei" },
  { label: "Conveniada", value: "conveniada" }
];

const initialActionState = {
  ok: false,
  message: ""
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      <Save className="h-4 w-4" aria-hidden="true" />
      {pending ? "Salvando" : "Salvar unidade"}
    </Button>
  );
}

export function SchoolUnitForm() {
  const [state, formAction] = useFormState(createSchoolUnit, initialActionState);
  const tone = state.ok ? "success" : state.message ? "error" : "neutral";

  return (
    <form action={formAction} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="block text-sm font-semibold text-slate-700 xl:col-span-2">
          Nome da unidade
          <input
            name="name"
            required
            minLength={3}
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
            placeholder="Ex.: Escola Municipal..."
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          INEP
          <input
            name="inep"
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
            placeholder="Codigo INEP"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Tipo
          <select name="type" className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow">
            {schoolTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Bairro
          <input
            name="district"
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
            placeholder="Bairro"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700 xl:col-span-2">
          Endereco
          <input
            name="address"
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
            placeholder="Rua, quadra, lote..."
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Gestor(a)
          <input
            name="manager_name"
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
            placeholder="Nome do gestor"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Telefone
          <input
            name="phone"
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
            placeholder="(61) 00000-0000"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700 xl:col-span-2">
          E-mail
          <input
            name="email"
            type="email"
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
            placeholder="unidade@sme.gov.br"
          />
        </label>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FormMessage tone={tone}>{state.message || "Os dados serao gravados por Server Action na tabela school_units."}</FormMessage>
        <SubmitButton />
      </div>
    </form>
  );
}
