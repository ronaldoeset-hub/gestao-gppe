import type { Metadata } from "next";
import { AlertTriangle, Bell, CheckCircle2, Clock, TriangleAlert } from "lucide-react";
import { AlertForm } from "@/components/linked-record-forms";
import { ModuleHeader } from "@/components/module-header";
import { StatCard } from "@/components/stat-card";
import { getAlerts } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Alertas",
  description: "Central de alertas e pendências operacionais do GPPE."
};

export const revalidate = 60;

const SEV = {
  alta: { label: "Alta prioridade", pill: "bg-red-50 text-sme-red border-sme-red/30", borda: "border-l-4 border-l-sme-red", ic: TriangleAlert },
  media: { label: "Média prioridade", pill: "bg-amber-50 text-sme-gold border-sme-gold/30", borda: "border-l-4 border-l-sme-gold", ic: AlertTriangle },
  baixa: { label: "Baixa prioridade", pill: "bg-sme-blue-soft text-sme-blue border-sme-blue/20", borda: "border-l-4 border-l-sme-blue", ic: Bell }
};

export default async function AlertsPage() {
  const alerts = await getAlerts();

  const alta = alerts.filter((a) => a.severity === "alta");
  const media = alerts.filter((a) => a.severity === "media");
  const baixa = alerts.filter((a) => a.severity === "baixa");

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Central de Alertas"
        description="Avisos operacionais sobre prazos de mandato, prestações pendentes, pendências documentais e prioridades de acompanhamento."
        icon={AlertTriangle}
        action={
          <a href="#novo-alerta" className="inline-flex h-10 items-center gap-2 rounded-xl bg-sme-navy px-4 text-sm font-semibold text-white transition hover:bg-sme-blue">
            + Novo alerta
          </a>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Alta prioridade" value={String(alta.length)} detail="Ação imediata necessária" icon={TriangleAlert} tone="red" />
        <StatCard label="Média prioridade" value={String(media.length)} detail="Acompanhamento necessário" icon={AlertTriangle} tone="yellow" />
        <StatCard label="Baixa prioridade" value={String(baixa.length)} detail="Monitorar" icon={Bell} tone="blue" />
      </div>

      <section id="novo-alerta" className="rounded-2xl border border-sme-line bg-white p-5 shadow-soft-sm">
        <h2 className="font-display mb-4 font-bold text-sme-navy">Registrar novo alerta</h2>
        <AlertForm />
      </section>

      {alerts.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-sme-green/30 bg-emerald-50 py-14 text-center">
          <CheckCircle2 className="h-14 w-14 text-sme-green" aria-hidden="true" />
          <p className="font-display mt-4 text-xl font-bold text-sme-navy">Nenhum alerta aberto</p>
          <p className="mt-2 text-sm text-sme-muted">Todas as pendências operacionais estão em dia.</p>
        </div>
      )}

      {(["alta", "media", "baixa"] as const).map((sev) => {
        const grupo = alerts.filter((a) => a.severity === sev);
        if (grupo.length === 0) return null;
        const cfg = SEV[sev];
        const Ic = cfg.ic;
        return (
          <section key={sev} className="space-y-3">
            <div className="flex items-center gap-2">
              <Ic className={`h-4 w-4 ${sev === "alta" ? "text-sme-red" : sev === "media" ? "text-sme-gold" : "text-sme-blue"}`} aria-hidden="true" />
              <h2 className="font-display font-bold text-sme-navy">{cfg.label}</h2>
              <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${cfg.pill}`}>{grupo.length}</span>
            </div>
            <div className="space-y-3">
              {grupo.map((alerta) => (
                <article key={alerta.id} className={`rounded-2xl border border-sme-line bg-white p-5 shadow-soft-sm transition hover:shadow-soft ${cfg.borda}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${cfg.pill}`}>{cfg.label}</span>
                    {alerta.dueDate && (
                      <span className="flex items-center gap-1 text-xs text-sme-muted">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        Prazo: {formatDate(alerta.dueDate)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display mt-2 font-bold text-sme-navy">{alerta.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-sme-muted">{alerta.description}</p>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
