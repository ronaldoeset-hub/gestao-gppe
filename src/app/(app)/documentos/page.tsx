import type { Metadata } from "next";
import { CheckCircle2, FileArchive } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { DocumentUploader } from "@/components/document-uploader";
import { ModuleHeader } from "@/components/module-header";
import { getDocuments } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Documentos",
  description: "Upload, checklist e consulta de documentos vinculados às unidades e prestações."
};

const documentTypes = [
  "Edital de Convocacao",
  "Ata de Eleicao e Posse",
  "Ata de Posse",
  "Estatuto do Conselho",
  "Regimento Interno",
  "Registro em Cartorio",
  "Plano de Aplicacao",
  "Relatorio de Aplicacao de Recursos",
  "Comprovante de Pagamento",
  "Parecer tecnico"
];

export default async function DocumentsPage() {
  const documents = await getDocuments();
  const sentCategories = new Set(documents.map((document) => document.category));

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Upload de Documentos"
        description="Envio seguro para o Supabase Storage, com vinculo posterior a unidade, conselho, recurso ou prestacao de contas."
        icon={FileArchive}
      />
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <DocumentUploader />
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-sme-ink">Checklist documental</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">Categorias alinhadas com conselho escolar, recursos e prestacao de contas.</p>
            </div>
            <div className="rounded-md bg-sky-50 px-3 py-2 text-sm font-bold text-sme-blue ring-1 ring-sky-100">
              {sentCategories.size}/{documentTypes.length}
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {documentTypes.map((type) => {
              const sent = sentCategories.has(type);
              return (
                <div key={type} className="flex items-center gap-2 rounded-md border border-slate-200 p-3 text-sm font-semibold text-slate-700">
                  <CheckCircle2 className={`h-4 w-4 ${sent ? "text-emerald-600" : "text-slate-300"}`} aria-hidden="true" />
                  {type}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-sme-ink">Documentos enviados</h2>
        <DataTable
          rows={documents}
          columns={[
            { key: "title", header: "Titulo", render: (row) => <span className="font-semibold text-sme-ink">{row.title}</span> },
            { key: "category", header: "Categoria", render: (row) => row.category },
            { key: "school", header: "Unidade", render: (row) => row.school },
            { key: "createdAt", header: "Envio", render: (row) => formatDate(row.createdAt) },
            { key: "path", header: "Arquivo", render: (row) => row.storagePath }
          ]}
        />
      </section>
    </div>
  );
}
