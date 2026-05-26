import Link from "next/link";
import { ExternalLink, Landmark, SearchCheck, ShieldCheck } from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle, EmptyState, PageHeader } from "@/components/ui";
import { getFndeLinks } from "@/lib/supabase/queries";

const categoryLabels: Record<string, string> = {
  portal: "Portal",
  pdde: "PDDE",
  sistema: "Sistema",
  consulta: "Consulta",
  prestacao: "Prestacao",
  manual: "Manual"
};

export default async function FndePddePage() {
  const links = await getFndeLinks();

  return (
    <div className="space-y-6">
      <PageHeader
        title="FNDE/PDDE"
        description="Central operacional com links oficiais, sistemas de consulta e atalhos de acompanhamento para recursos federais."
        breadcrumbs={[{ label: "Inicio", href: "/dashboard" }, { label: "FNDE/PDDE" }]}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <Landmark className="h-6 w-6 text-primary-700" aria-hidden="true" />
          <p className="mt-4 text-2xl font-bold text-neutral-900">{links.length}</p>
          <p className="text-sm font-semibold text-neutral-600">links oficiais cadastrados</p>
        </Card>
        <Card className="p-5">
          <SearchCheck className="h-6 w-6 text-secondary-700" aria-hidden="true" />
          <p className="mt-4 text-2xl font-bold text-neutral-900">PDDEWeb</p>
          <p className="text-sm font-semibold text-neutral-600">consulta e acompanhamento externo</p>
        </Card>
        <Card className="p-5">
          <ShieldCheck className="h-6 w-6 text-warning" aria-hidden="true" />
          <p className="mt-4 text-2xl font-bold text-neutral-900">SiGPC</p>
          <p className="text-sm font-semibold text-neutral-600">prestacao de contas e manuais</p>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Links oficiais</CardTitle>
          <p className="text-sm leading-6 text-neutral-600">
            Os botoes abrem os sistemas oficiais em nova aba. O sistema nao realiza login automatico, consulta privada ou raspagem de dados.
          </p>
        </CardHeader>
        <CardContent>
          {links.length ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {links.map((link) => (
                <article key={link.id} className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <Badge tone="info">{categoryLabels[link.category] ?? link.category}</Badge>
                    <Link href={link.url} target="_blank" rel="noreferrer" aria-label={`Abrir ${link.title}`} className="rounded-md p-2 text-primary-700 hover:bg-primary-50">
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                  <h2 className="mt-3 text-base font-bold text-neutral-900">{link.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{link.description}</p>
                  <p className="mt-3 truncate text-xs font-semibold text-neutral-500">{link.url}</p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="Nenhum link cadastrado" description="A migration operacional cria os links oficiais do FNDE/PDDE automaticamente." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
