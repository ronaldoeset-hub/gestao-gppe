import Link from "next/link";
import { AlertTriangle, ArrowRight, ShieldAlert, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { calcularAlerta, calcularFinanceiro, ALERTA_CONFIG } from "@/data/gestao-recursos";
import type { FinanceiroUnidade } from "@/lib/types";

type UnidadeAlerta = {
  id: string;
  nome: string;
  saldoGeral: number;
  updatedAt?: string;
};

type Props = {
  registros: FinanceiroUnidade[];
  unidades: Array<{ id: string; name: string }>;
};

export function GestaoAlertasPainel({ registros, unidades }: Props) {
  const nomeMap = new Map(unidades.map((u) => [u.id, u.name]));

  const byUnit = new Map<string, { saldoGeral: number; updatedAt?: string }>();
  for (const r of registros) {
    const c = calcularFinanceiro(r);
    const prev = byUnit.get(r.unidadeId);
    byUnit.set(r.unidadeId, {
      saldoGeral: (prev?.saldoGeral ?? 0) + c.saldoGeral,
      updatedAt: !prev?.updatedAt || (r.updatedAt && r.updatedAt > prev.updatedAt)
        ? r.updatedAt
        : prev.updatedAt
    });
  }

  const alertas: UnidadeAlerta[] = Array.from(byUnit.entries())
    .map(([id, data]) => ({ id, nome: nomeMap.get(id) ?? id, ...data }));

  const criticas  = alertas.filter((u) => calcularAlerta(u.saldoGeral, u.updatedAt) === "critico");
  const atencao   = alertas.filter((u) => calcularAlerta(u.saldoGeral, u.updatedAt) === "atencao");
  const valorParado = [...criticas, ...atencao].reduce((a, u) => a + u.saldoGeral, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recursos em Alerta</CardTitle>
        <Link href="/gestao-recursos/alertas" className="inline-flex items-center gap-1 text-xs font-bold text-primary-700 hover:text-primary-900">
          Ver ranking completo <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          <AlertStat
            icon={ShieldAlert}
            label="Críticos"
            count={criticas.length}
            color="text-red-600"
            bg="bg-red-50"
          />
          <AlertStat
            icon={AlertTriangle}
            label="Em atenção"
            count={atencao.length}
            color="text-amber-600"
            bg="bg-amber-50"
          />
          <AlertStat
            icon={ShieldCheck}
            label="Valor parado"
            count={null}
            value={formatCurrency(valorParado)}
            color="text-neutral-700"
            bg="bg-neutral-50"
          />
        </div>

        {criticas.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-bold uppercase text-red-600">Unidades críticas</p>
            {criticas.slice(0, 5).map((u) => (
              <Link
                key={u.id}
                href={`/gestao-recursos/unidade/${u.id}`}
                className="flex items-center justify-between rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm hover:border-red-200"
              >
                <span className="font-semibold text-neutral-800">{u.nome}</span>
                <span className="font-black text-red-700">{formatCurrency(u.saldoGeral)}</span>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AlertStat({
  icon: Icon, label, count, value, color, bg
}: {
  icon: React.ElementType; label: string; count: number | null; value?: string; color: string; bg: string;
}) {
  return (
    <div className={`rounded-md ${bg} p-4`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${color}`} aria-hidden="true" />
        <p className={`text-xs font-bold uppercase ${color}`}>{label}</p>
      </div>
      <p className={`mt-2 text-2xl font-black ${color}`}>
        {value ?? count}
      </p>
    </div>
  );
}

// ── Badge inline reutilizável ─────────────────────────────────────────────────
export function AlertaBadge({ nivel }: { nivel: "regular" | "atencao" | "critico" }) {
  const cfg = ALERTA_CONFIG[nivel];
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-black ${cfg.badge}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}
