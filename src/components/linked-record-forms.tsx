"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Save } from "lucide-react";
import { createAlert } from "@/lib/actions/alerts";
import { createCouncilFromForm } from "@/lib/actions/councils";
import { createClient } from "@/lib/supabase/client";

const initialActionState = {
  ok: false,
  message: ""
};

type SchoolOption = {
  id: string;
  name: string;
};

function useSchoolOptions() {
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchools() {
      const supabase = createClient();
      const { data } = await supabase.from("school_units").select("id,name").order("name", { ascending: true });
      setSchools(data ?? []);
      setLoading(false);
    }

    loadSchools();
  }, []);

  return { schools, loading };
}

function SchoolSelect({ allowEmpty = false }: { allowEmpty?: boolean }) {
  const { schools, loading } = useSchoolOptions();

  return (
    <select
      name="school_unit_id"
      required={!allowEmpty}
      className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
      disabled={loading}
    >
      {allowEmpty ? <option value="">Todas as unidades</option> : null}
      {schools.map((school) => (
        <option key={school.id} value={school.id}>
          {school.name}
        </option>
      ))}
    </select>
  );
}

function SubmitRow({ status, idleText, label, ok = false }: { status: string; idleText: string; label: string; ok?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className={ok ? "text-sm font-semibold text-emerald-700" : "text-sm text-slate-600"}>{pending ? "Salvando..." : status || idleText}</p>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-sme-blue px-4 text-sm font-semibold text-white hover:bg-sme-navy focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2"
      >
        <Save className="h-4 w-4" aria-hidden="true" />
        {pending ? "Salvando" : label}
      </button>
    </div>
  );
}

export function CouncilForm() {
  const [state, formAction] = useFormState(createCouncilFromForm, initialActionState);

  return (
    <form action={formAction} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="block text-sm font-semibold text-slate-700 xl:col-span-2">
          Unidade escolar
          <SchoolSelect />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Início do mandato
          <input name="mandate_start" type="date" required className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Fim do mandato
          <input name="mandate_end" type="date" required className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Presidente
          <input name="president_name" required className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Vice-presidente
          <input name="vice_president_name" className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Membros
          <input name="members_count" type="number" min="0" defaultValue="7" className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Status
          <select name="status" className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow">
            <option value="regular">Regular</option>
            <option value="atencao">Atenção</option>
            <option value="pendente">Pendente</option>
          </select>
        </label>
      </div>
      <SubmitRow status={state.message} ok={state.ok} idleText="Os dados serão gravados na tabela school_councils." label="Salvar conselho" />
    </form>
  );
}

export function ResourceForm() {
  const [status, setStatus] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Salvando recurso...");
    const formData = new FormData(event.currentTarget);
    const amount = Number(formData.get("amount") ?? 0);
    const supabase = createClient();
    const { error } = await supabase.from("resource_transfers").insert({
      school_unit_id: String(formData.get("school_unit_id")),
      program: String(formData.get("program") ?? ""),
      source: String(formData.get("source") ?? "") || null,
      amount,
      released_at: String(formData.get("released_at")),
      balance: Number(formData.get("balance") ?? amount),
      status: String(formData.get("status") ?? "regular")
    });

    if (error) {
      setStatus(`Erro ao salvar: ${error.message}`);
      return;
    }

    event.currentTarget.reset();
    setStatus("Recurso cadastrado com sucesso.");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="block text-sm font-semibold text-slate-700 xl:col-span-2">
          Unidade escolar
          <SchoolSelect />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Programa
          <input name="program" required placeholder="PDDE, Manutenção..." className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Fonte
          <input name="source" placeholder="Federal, municipal..." className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Valor
          <input name="amount" type="number" min="0" step="0.01" required className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Saldo
          <input name="balance" type="number" min="0" step="0.01" className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Data de liberação
          <input name="released_at" type="date" required className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Status
          <select name="status" className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow">
            <option value="regular">Regular</option>
            <option value="atencao">Atenção</option>
            <option value="pendente">Pendente</option>
          </select>
        </label>
      </div>
      <SubmitRow status={status} idleText="Os dados serão gravados na tabela resource_transfers." label="Salvar recurso" />
    </form>
  );
}

export function AccountabilityForm() {
  const [status, setStatus] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Salvando prestação...");
    const formData = new FormData(event.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.from("accountabilities").insert({
      school_unit_id: String(formData.get("school_unit_id")),
      reference_period: String(formData.get("reference_period") ?? ""),
      due_date: String(formData.get("due_date")),
      submitted_at: String(formData.get("submitted_at") ?? "") || null,
      status: String(formData.get("status") ?? "pendente"),
      technical_opinion: String(formData.get("technical_opinion") ?? "") || null
    });

    if (error) {
      setStatus(`Erro ao salvar: ${error.message}`);
      return;
    }

    event.currentTarget.reset();
    setStatus("Prestação cadastrada com sucesso.");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="block text-sm font-semibold text-slate-700 xl:col-span-2">
          Unidade escolar
          <SchoolSelect />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Referência
          <input name="reference_period" required placeholder="1º quadrimestre de 2026" className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Prazo
          <input name="due_date" type="date" required className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Data de envio
          <input name="submitted_at" type="date" className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Status
          <select name="status" className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow">
            <option value="pendente">Pendente</option>
            <option value="regular">Regular</option>
            <option value="atencao">Atenção</option>
            <option value="vencido">Vencido</option>
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-700 xl:col-span-2">
          Parecer técnico
          <input name="technical_opinion" className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
      </div>
      <SubmitRow status={status} idleText="Os dados serão gravados na tabela accountabilities." label="Salvar prestação" />
    </form>
  );
}

export function AlertForm() {
  const [state, formAction] = useFormState(createAlert, initialActionState);

  return (
    <form action={formAction} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="block text-sm font-semibold text-slate-700">
          Unidade
          <SchoolSelect allowEmpty />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Prioridade
          <select name="severity" className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow">
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-700 xl:col-span-2">
          Título
          <input name="title" required className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700 xl:col-span-3">
          Descrição
          <input name="description" required className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Prazo
          <input name="due_date" type="date" className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
      </div>
      <SubmitRow status={state.message} ok={state.ok} idleText="Os dados serão gravados na tabela alerts." label="Salvar alerta" />
    </form>
  );
}
