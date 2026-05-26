import { FileCheck2, FileWarning, ShieldCheck } from "lucide-react";
import { DocumentUploader } from "@/components/document-uploader";
import { Badge, Card, CardContent, CardHeader, CardTitle, PageHeader } from "@/components/ui";
import { getDocuments, getSchoolUnits } from "@/lib/supabase/queries";

const requiredDocuments = ["Ata do Conselho", "Extrato bancario", "Protocolo de prestacao", "Documentos dos Membros"];

export default async function DocumentRegularityPage() {
  const [units, documents] = await Promise.all([getSchoolUnits(), getDocuments()]);

  const matrix = units.slice(0, 12).map((unit) => {
    const unitDocs = documents.filter((document) => document.school === unit.name);
    const covered = requiredDocuments.filter((required) => unitDocs.some((document) => document.category.toLowerCase().includes(required.toLowerCase().slice(0, 8))));
    return { unit, covered: covered.length, pending: requiredDocuments.length - covered.length };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Regularidade Documental"
        description="Checklist por unidade, matriz de pendencias e envio de arquivos para saneamento documental."
        breadcrumbs={[{ label: "Inicio", href: "/dashboard" }, { label: "Regularidade Documental" }]}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Metric icon={ShieldCheck} label="Unidades avaliadas" value={String(matrix.length)} tone="info" />
        <Metric icon={FileCheck2} label="Itens conferidos" value={String(matrix.reduce((sum, item) => sum + item.covered, 0))} tone="success" />
        <Metric icon={FileWarning} label="Pendencias" value={String(matrix.reduce((sum, item) => sum + item.pending, 0))} tone="warning" />
      </section>

      <DocumentUploader />

      <Card>
        <CardHeader>
          <CardTitle>Matriz de regularidade</CardTitle>
          <p className="text-sm leading-6 text-neutral-600">Visao objetiva para o GPPE identificar quem precisa de cobranca ou apoio documental.</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-neutral-500">Unidade</th>
                  {requiredDocuments.map((document) => (
                    <th key={document} className="px-4 py-3 text-left text-xs font-bold uppercase text-neutral-500">{document}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {matrix.map(({ unit, covered }) => (
                  <tr key={unit.id}>
                    <td className="px-4 py-3 font-bold text-neutral-900">{unit.name}</td>
                    {requiredDocuments.map((document, index) => (
                      <td key={document} className="px-4 py-3">
                        <Badge tone={index < covered ? "success" : "warning"}>{index < covered ? "Valido" : "Pendente"}</Badge>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone }: { icon: typeof ShieldCheck; label: string; value: string; tone: "success" | "warning" | "info" }) {
  return (
    <Card className="p-5">
      <Icon className={tone === "success" ? "h-5 w-5 text-emerald-700" : tone === "warning" ? "h-5 w-5 text-amber-700" : "h-5 w-5 text-primary-700"} aria-hidden="true" />
      <p className="mt-4 text-xs font-bold uppercase text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-neutral-900">{value}</p>
    </Card>
  );
}
