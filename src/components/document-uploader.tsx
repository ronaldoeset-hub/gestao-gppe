"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Save, UploadCloud } from "lucide-react";
import { createDocument } from "@/lib/actions/documents";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { createClient } from "@/lib/supabase/client";

type SchoolOption = {
  id: string;
  name: string;
};

const initialActionState = {
  ok: false,
  message: ""
};

const categories = [
  "Ata do Conselho",
  "Ata de Eleicao e Posse",
  "Ata de Posse",
  "Ata de Alteracao do Estatuto",
  "Edital de Convocacao",
  "Edital de Revogacao",
  "Comissao Eleitoral",
  "Estatuto do Conselho",
  "Regimento Interno",
  "Requerimento ao Cartorio",
  "Encaminhamento da Quantidade de Alunos",
  "Registro em Cartorio",
  "Documentos dos Membros",
  "Consulta FNDE/PDDE",
  "Plano de Aplicacao",
  "Programacao Anual",
  "Relatorio de Aplicacao de Recursos",
  "Nota fiscal",
  "Extrato bancario",
  "Comprovante de Pagamento",
  "Parecer tecnico",
  "Outro"
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      <Save className="h-4 w-4" aria-hidden="true" />
      {pending ? "Enviando" : "Enviar documento"}
    </Button>
  );
}

export function DocumentUploader() {
  const [state, formAction] = useFormState(createDocument, initialActionState);
  const [fileName, setFileName] = useState("");
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const tone = state.ok ? "success" : state.message ? "error" : "neutral";

  useEffect(() => {
    async function loadSchools() {
      const supabase = createClient();
      const { data } = await supabase.from("school_units").select("id,name").order("name", { ascending: true });
      setSchools(data ?? []);
    }

    loadSchools();
  }, []);

  return (
    <form action={formAction} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700 md:col-span-2">
          Unidade escolar
          <select
            name="school_unit_id"
            required
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
          >
            <option value="">Selecione</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Categoria
          <select
            name="category"
            required
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Titulo
          <input
            name="title"
            required
            minLength={3}
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
            placeholder="Ex.: Ata de eleicao do conselho"
          />
        </label>
      </div>
      <label className="mt-4 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-sme-blue hover:bg-sky-50">
        <UploadCloud className="h-10 w-10 text-sme-blue" aria-hidden="true" />
        <span className="mt-3 text-sm font-semibold text-sme-ink">{fileName || "Selecionar documento"}</span>
        <span className="mt-1 text-xs text-slate-500">PDF, imagem ou planilha ate 25 MB</span>
        <input
          name="file"
          type="file"
          required
          className="sr-only"
          onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
        />
      </label>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FormMessage tone={tone}>{state.message || "O arquivo sera enviado ao Storage e registrado por Server Action."}</FormMessage>
        <SubmitButton />
      </div>
    </form>
  );
}
