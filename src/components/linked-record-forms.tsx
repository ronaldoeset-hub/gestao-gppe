"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Save } from "lucide-react";
import { createAccountability } from "@/lib/actions/accountabilities";
import { createAlert } from "@/lib/actions/alerts";
import { createCouncilFromForm } from "@/lib/actions/councils";
import { createResourceTransfer } from "@/lib/actions/resources";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";

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
      {allowEmpty ? <option value="">Todas as unidades</option> : <option value="">Selecione</option>}
      {schools.map((school) => (
        <option key={school.id} value={school.id}>
          {school.name}
        </option>
      ))}
    </select>
  );
}

function SubmitRow({
  status,
  idleText,
  label,
  ok = false
}: {
  status: string;
  idleText: string;
  label: string;
  ok?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <FormMessage tone={ok ? "success" : status ? "error" : "neutral"}>{pending ? "Salvando..." : status || idleText}</FormMessage>
      <Button type="submit" disabled={pending}>
        <Save className="h-4 w-4" aria-hidden="true" />
        {pending ? "Salvando" : label}
      </Button>
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
          Inicio do mandato
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
            <option value="atencao">Atencao</option>
            <option value="pendente">Pendente</option>
          </select>
        </label>
      </div>
      <SubmitRow status={state.message} ok={state.ok} idleText="Os dados serao gravados por Server Action na tabela school_councils." label="Salvar conselho" />
    </form>
  );
}

export function ResourceForm() {
  const [state, formAction] = useFormState(createResourceTransfer, initialActionState);

  return (
    <form action={formAction} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="block text-sm font-semibold text-slate-700 xl:col-span-2">
          Unidade escolar
          <SchoolSelect />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Programa
          <input name="program" required placeholder="PDDE, Manutencao..." className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
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
          Data de liberacao
          <input name="released_at" type="date" required className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Status
          <select name="status" className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow">
            <option value="regular">Regular</option>
            <option value="atencao">Atencao</option>
            <option value="pendente">Pendente</option>
          </select>
        </label>
      </div>
      <SubmitRow status={state.message} ok={state.ok} idleText="Os dados serao gravados por Server Action na tabela resource_transfers." label="Salvar recurso" />
    </form>
  );
}

export function AccountabilityForm() {
  const [state, formAction] = useFormState(createAccountability, initialActionState);

  return (
    <form action={formAction} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="block text-sm font-semibold text-slate-700 xl:col-span-2">
          Unidade escolar
          <SchoolSelect />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Referencia
          <input name="reference_period" required placeholder="1o quadrimestre de 2026" className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
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
            <option value="atencao">Atencao</option>
            <option value="vencido">Vencido</option>
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-700 xl:col-span-2">
          Parecer tecnico
          <input name="technical_opinion" className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
      </div>
      <SubmitRow status={state.message} ok={state.ok} idleText="Os dados serao gravados por Server Action na tabela accountabilities." label="Salvar prestacao" />
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
            <option value="media">Media</option>
            <option value="baixa">Baixa</option>
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-700 xl:col-span-2">
          Titulo
          <input name="title" required className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700 xl:col-span-3">
          Descricao
          <input name="description" required className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Prazo
          <input name="due_date" type="date" className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
      </div>
      <SubmitRow status={state.message} ok={state.ok} idleText="Os dados serao gravados por Server Action na tabela alerts." label="Salvar alerta" />
    </form>
  );
}
