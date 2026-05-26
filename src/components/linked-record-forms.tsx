"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type SchoolOption = {
  id: string;
  name: string;
};

type ProgramOption = {
  id: string;
  name: string;
  acronym: string;
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

function useProgramOptions() {
  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrograms() {
      const supabase = createClient();
      const { data } = await supabase.from("resource_programs").select("id,name,acronym").order("acronym", { ascending: true });
      setPrograms(data ?? []);
      setLoading(false);
    }

    loadPrograms();
  }, []);

  return { programs, loading };
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

function ProgramSelect() {
  const { programs, loading } = useProgramOptions();

  return (
    <select
      name="program_id"
      required
      className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
      disabled={loading}
    >
      <option value="">Selecione</option>
      {programs.map((program) => (
        <option key={program.id} value={program.id}>
          {program.acronym} - {program.name}
        </option>
      ))}
    </select>
  );
}

function SubmitRow({ status, idleText, label }: { status: string; idleText: string; label: string }) {
  return (
    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">{status || idleText}</p>
      <button
        type="submit"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-sme-blue px-4 text-sm font-semibold text-white hover:bg-sme-navy focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2"
      >
        <Save className="h-4 w-4" aria-hidden="true" />
        {label}
      </button>
    </div>
  );
}

export function CouncilForm() {
  const [status, setStatus] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Salvando conselho...");
    const formData = new FormData(event.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.from("school_councils").insert({
      school_unit_id: String(formData.get("school_unit_id")),
      president_name: String(formData.get("president_name") ?? ""),
      vice_president_name: String(formData.get("vice_president_name") ?? "") || null,
      mandate_start: String(formData.get("mandate_start")),
      mandate_end: String(formData.get("mandate_end")),
      members_count: Number(formData.get("members_count") ?? 0),
      status: String(formData.get("status") ?? "regular")
    });

    if (error) {
      setStatus(`Erro ao salvar: ${error.message}`);
      return;
    }

    event.currentTarget.reset();
    setStatus("Conselho cadastrado com sucesso.");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
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
      <SubmitRow status={status} idleText="Os dados serão gravados na tabela school_councils." label="Salvar conselho" />
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

export function FinancialMovementForm() {
  const [status, setStatus] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Registrando movimentacao financeira...");
    const formData = new FormData(event.currentTarget);
    const supabase = createClient();

    const movement = {
      school_unit_id: String(formData.get("school_unit_id")),
      program_id: String(formData.get("program_id")),
      movement_type: String(formData.get("movement_type") ?? "receita"),
      amount: Number(formData.get("amount") ?? 0),
      movement_date: String(formData.get("movement_date")),
      description: String(formData.get("description") ?? ""),
      document_number: String(formData.get("document_number") ?? "") || null,
      supplier_name: String(formData.get("supplier_name") ?? "") || null,
      expense_category: String(formData.get("expense_category") ?? "outros")
    };

    const { error } = await supabase.from("financial_movements").insert(movement);

    if (error) {
      setStatus(`Nao foi possivel salvar em financial_movements: ${error.message}. Use a migration operacional no Supabase antes de usar este formulario.`);
      return;
    }

    event.currentTarget.reset();
    setStatus("Movimentacao registrada com sucesso.");
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
          <ProgramSelect />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Tipo
          <select name="movement_type" className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow">
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
            <option value="estorno">Estorno</option>
            <option value="ajuste">Ajuste</option>
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Valor
          <input name="amount" type="number" min="0" step="0.01" required className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Data
          <input name="movement_date" type="date" required className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Categoria
          <select name="expense_category" className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow">
            <option value="custeio">Custeio</option>
            <option value="capital">Capital</option>
            <option value="outros">Outros</option>
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Documento/protocolo
          <input name="document_number" className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Fornecedor
          <input name="supplier_name" className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700 xl:col-span-4">
          Descricao
          <input name="description" required className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
      </div>
      <SubmitRow status={status} idleText="Registra receitas, despesas, estornos e ajustes na tabela financial_movements." label="Registrar movimentacao" />
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
  const [status, setStatus] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Salvando alerta...");
    const formData = new FormData(event.currentTarget);
    const schoolUnitId = String(formData.get("school_unit_id") ?? "");
    const supabase = createClient();
    const { error } = await supabase.from("alerts").insert({
      school_unit_id: schoolUnitId || null,
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      severity: String(formData.get("severity") ?? "media"),
      due_date: String(formData.get("due_date") ?? "") || null
    });

    if (error) {
      setStatus(`Erro ao salvar: ${error.message}`);
      return;
    }

    event.currentTarget.reset();
    setStatus("Alerta cadastrado com sucesso.");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
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
      <SubmitRow status={status} idleText="Os dados serão gravados na tabela alerts." label="Salvar alerta" />
    </form>
  );
}

export function SupportTicketForm() {
  const [status, setStatus] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Abrindo chamado...");
    const formData = new FormData(event.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.from("support_tickets").insert({
      school_unit_id: String(formData.get("school_unit_id") ?? "") || null,
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      priority: String(formData.get("priority") ?? "media"),
      status: "aberto"
    });

    if (error) {
      setStatus(`Nao foi possivel abrir chamado: ${error.message}. Verifique se a migration operacional foi aplicada.`);
      return;
    }

    event.currentTarget.reset();
    setStatus("Chamado aberto com sucesso.");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="block text-sm font-semibold text-slate-700 xl:col-span-2">
          Unidade
          <SchoolSelect />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Prioridade
          <select name="priority" className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow">
            <option value="baixa">Baixa</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="critica">Critica</option>
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-700 xl:col-span-4">
          Assunto
          <input name="title" required className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
        <label className="block text-sm font-semibold text-slate-700 xl:col-span-4">
          Descricao
          <input name="description" required className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow" />
        </label>
      </div>
      <SubmitRow status={status} idleText="O chamado ficara vinculado a unidade selecionada." label="Abrir chamado" />
    </form>
  );
}
