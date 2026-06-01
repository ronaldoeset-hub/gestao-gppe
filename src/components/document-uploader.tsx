"use client";

import { useEffect, useState } from "react";
import { Save, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { createClient } from "@/lib/supabase/client";

type SchoolOption = {
  id: string;
  name: string;
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

export function DocumentUploader() {
  const [status, setStatus] = useState<string>("");
  const [tone, setTone] = useState<"neutral" | "success" | "error">("neutral");
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [schools, setSchools] = useState<SchoolOption[]>([]);

  useEffect(() => {
    async function loadSchools() {
      const supabase = createClient();
      const { data } = await supabase.from("school_units").select("id,name").order("name", { ascending: true });
      setSchools(data ?? []);
    }

    loadSchools();
  }, []);

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setStatus("Selecione um arquivo antes de enviar.");
      setTone("error");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setStatus("O arquivo deve ter no máximo 25 MB.");
      setTone("error");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const schoolUnitId = String(formData.get("school_unit_id") ?? "");
    const title = String(formData.get("title") ?? "").trim();
    const category = String(formData.get("category") ?? "");

    if (title.length < 3) {
      setStatus("Informe um titulo com pelo menos 3 caracteres.");
      setTone("error");
      return;
    }

    setStatus("Enviando...");
    setTone("neutral");
    setSubmitting(true);
    const supabase = createClient();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${schoolUnitId || "geral"}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage.from("documentos-gppe").upload(path, file, { upsert: false });

    if (uploadError) {
      setStatus(`Erro no upload: ${uploadError.message}`);
      setTone("error");
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("documents").insert({
      school_unit_id: schoolUnitId || null,
      title,
      category,
      storage_path: path,
      mime_type: file.type || null,
      file_size: file.size
    });

    if (insertError) {
      setStatus(`Arquivo enviado, mas houve erro ao salvar registro: ${insertError.message}`);
      setTone("error");
      setSubmitting(false);
      return;
    }

    form.reset();
    setFile(null);
    setStatus("Documento enviado e registrado com sucesso.");
    setTone("success");
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleUpload} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
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
          Título
          <input
            name="title"
            required
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
            placeholder="Ex.: Ata de eleição do conselho"
          />
        </label>
      </div>
      <label className="mt-4 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-sme-blue hover:bg-sky-50">
        <UploadCloud className="h-10 w-10 text-sme-blue" aria-hidden="true" />
        <span className="mt-3 text-sm font-semibold text-sme-ink">{file ? file.name : "Selecionar documento"}</span>
        <span className="mt-1 text-xs text-slate-500">PDF, imagem ou planilha até 25 MB</span>
        <input type="file" required className="sr-only" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
      </label>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FormMessage tone={tone}>{status || "O arquivo será enviado ao Storage e registrado na tabela documents."}</FormMessage>
        <Button type="submit" disabled={submitting}>
          <Save className="h-4 w-4" aria-hidden="true" />
          {submitting ? "Enviando" : "Enviar documento"}
        </Button>
      </div>
    </form>
  );
}
