import { FileArchive, UploadCloud } from "lucide-react";
import { DocumentUploader } from "@/components/document-uploader";
import { ExportButtons } from "@/components/export-buttons";
import { Badge, Card, CardContent, CardHeader, CardTitle, EmptyState, PageHeader } from "@/components/ui";
import { getDocuments } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils";

export default async function ArquivosPage() {
  const documents = await getDocuments();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Arquivos"
        description="Upload, organizacao e consulta de documentos vinculados a unidades, conselhos, recursos e prestacoes."
        breadcrumbs={[{ label: "Inicio", href: "/dashboard" }, { label: "Arquivos" }]}
        actions={<ExportButtons filename="arquivos-gppe" rows={documents.map((item) => ({ Titulo: item.title, Categoria: item.category, Unidade: item.school, Criado: formatDate(item.createdAt), Caminho: item.storagePath }))} />}
      />

      <section id="upload-arquivo">
        <DocumentUploader />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Documentos cadastrados</CardTitle>
          <p className="text-sm leading-6 text-neutral-600">A lista abaixo vem da tabela `documents` e usa os arquivos enviados ao Storage.</p>
        </CardHeader>
        <CardContent>
          {documents.length ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {documents.map((document) => (
                <article key={document.id} className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-primary-700">
                      <FileArchive className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <Badge tone="info">{document.category}</Badge>
                  </div>
                  <h2 className="mt-4 text-base font-bold text-neutral-900">{document.title}</h2>
                  <p className="mt-2 text-sm text-neutral-600">{document.school}</p>
                  <p className="mt-2 text-xs font-semibold text-neutral-500">Enviado em {formatDate(document.createdAt)}</p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhum arquivo enviado"
              description="Use o formulario de upload para alimentar a biblioteca documental do GPPE."
              action={
                <a href="#upload-arquivo" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary-600 px-4 text-sm font-bold text-white hover:bg-primary-700">
                  <UploadCloud className="h-4 w-4" aria-hidden="true" />
                  Enviar primeiro arquivo
                </a>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
