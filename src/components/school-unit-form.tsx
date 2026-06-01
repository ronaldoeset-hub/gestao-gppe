"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";

const schoolTypeOptions = [
  { label: "Escola", value: "escola" },
  { label: "Creche", value: "creche" },
  { label: "CEMEI", value: "cemei" },
  { label: "Conveniada", value: "conveniada" }
];

export function SchoolUnitForm() {
  const [status, setStatus] = useState("");
  const [tone, setTone] = useState<"neutral" | "success" | "error">("neutral");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("Salvando cadastro...");
    setTone("neutral");
    setSubmitting(true);

    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    if (name.length < 3) {
      setStatus("Informe um nome de unidade com pelo menos 3 caracteres.");
      setTone("error");
      setSubmitting(false);
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("Informe um e-mail valido.");
      setTone("error");
      setSubmitting(false);
      return;
    }

    const payload = {
      name,
      inep: String(formData.get("inep") ?? "") || null,
      type: String(formData.get("type") ?? "escola"),
      district: String(formData.get("district") ?? "") || null,
      address: String(formData.get("address") ?? "") || null,
      manager_name: String(formData.get("manager_name") ?? "") || null,
      phone: String(formData.get("phone") ?? "") || null,
      email: email || null
    };

    const supabase = createClient();
    const { error } = await supabase.from("school_units").insert(payload);

    if (error) {
      setStatus(`Erro ao salvar: ${error.message}`);
      setTone("error");
      setSubmitting(false);
      return;
    }

    form.reset();
    setStatus("Unidade cadastrada com sucesso.");
    setTone("success");
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="block text-sm font-semibold text-slate-700 xl:col-span-2">
          Nome da unidade
          <input
            name="name"
            required
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
            placeholder="Ex.: Escola Municipal..."
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          INEP
          <input
            name="inep"
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
            placeholder="Código INEP"
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
          Endereço
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
        <FormMessage tone={tone}>{status || "Os dados serão gravados na tabela school_units do Supabase."}</FormMessage>
        <Button
          type="submit"
          disabled={submitting}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-sme-blue px-4 text-sm font-semibold text-white hover:bg-sme-navy focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {submitting ? "Salvando" : "Salvar unidade"}
        </Button>
      </div>
    </form>
  );
}
