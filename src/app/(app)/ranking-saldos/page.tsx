import { AlertTriangle, TrendingDown } from "lucide-react";
import { ExportButtons } from "@/components/export-buttons";
import { ModuleHeader } from "@/components/module-header";
import { RankingVisualTable } from "@/components/v4-filter-panels";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { getRankingSaldosParados } from "@/lib/supabase/queries/schools";

export const metadata = {
  title: "Ranking de Saldos Parados - EduConecta GPPE"
};

export const revalidate = 60;

type RankingRow = {
  school_unit_id: string;
  escola: string;
  tipo: string;
  saldo_total_parado: number;
  total_recebido: number;
  total_executado: number;
  percentual_execucao: number;
  num_alocacoes: number;
  ultima_liberacao: string | null;
};

export default async function RankingSaldosPage() {
  const enabled = isSupabaseEnabled();
  const rows = enabled ? ((await getRankingSaldosParados()) as RankingRow[]) : [];

  const exportRows = rows.map((row, index) => ({
    Posicao: index + 1,
    Unidade: row.escola,
    Tipo: row.tipo,
    "Saldo Parado": row.saldo_total_parado,
    "Total Recebido": row.total_recebido,
    "Total Executado": row.total_executado,
    "% Execucao": row.percentual_execucao
  }));

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Ranking de saldos parados"
        description="Unidades com recursos disponiveis e baixa execucao financeira, ordenadas para acompanhamento prioritario."
        icon={TrendingDown}
      />

      <div className="rounded-md border border-sme-yellow bg-sme-yellow/20 p-4">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-sme-gold" aria-hidden="true" />
          <div>
            <p className="text-sm font-black text-sme-navy">Prazo de execucao</p>
            <p className="mt-1 text-sm leading-6 text-sme-ink">
              Conforme regra municipal, saldos nao executados ate 20 de fevereiro de 2027 devem ser acompanhados com prioridade para evitar recolhimento ao fundo municipal.
            </p>
          </div>
        </div>
      </div>

      {!enabled ? (
        <div className="rounded-md border border-sme-yellow bg-sme-yellow/20 px-4 py-3 text-sm text-sme-navy">
          Conecte o Supabase para visualizar dados reais.
        </div>
      ) : null}

      {enabled && rows.length === 0 ? (
        <div className="rounded-md border border-sme-line bg-white p-8 text-center text-sme-muted">
          Nenhuma unidade com saldo parado encontrada.
        </div>
      ) : null}

      {rows.length > 0 ? (
        <>
          <ExportButtons filename="ranking-saldos-parados-gppe" rows={exportRows} />
          <RankingVisualTable rows={rows} />
        </>
      ) : null}
    </div>
  );
}
