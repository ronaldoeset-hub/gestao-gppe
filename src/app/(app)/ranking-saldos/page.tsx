import { AlertTriangle, TrendingDown } from "lucide-react";
import { ModuleHeader } from "@/components/module-header";
import { ExportButtons } from "@/components/export-buttons";
import { getRankingSaldosParados } from "@/lib/supabase/queries/schools";
import { isSupabaseEnabled } from "@/lib/supabase/config";

export const metadata = {
  title: "Ranking de Saldos Parados — EduConecta GPPE",
};

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);
}

function execucaoBadge(pct: number) {
  if (pct >= 80)
    return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800">{pct}%</span>;
  if (pct >= 50)
    return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-black text-amber-800">{pct}%</span>;
  return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-black text-red-800">{pct}%</span>;
}

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

  const exportRows = rows.map((r, i) => ({
    Posicao: i + 1,
    Unidade: r.escola,
    Tipo: r.tipo,
    "Saldo Parado": r.saldo_total_parado,
    "Total Recebido": r.total_recebido,
    "Total Executado": r.total_executado,
    "% Execução": r.percentual_execucao,
  }));

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Ranking de Saldos Parados"
        description="Unidades escolares com saldo financeiro não executado. Independente do valor, toda escola com saldo disponível aparece aqui."
        icon={TrendingDown}
      />

      <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
          <div>
            <p className="text-sm font-black text-red-800">Atenção — Prazo de execução</p>
            <p className="mt-1 text-sm text-red-700">
              Conforme norma municipal, saldos não executados até o dia{" "}
              <strong>20 de fevereiro de 2027</strong> poderão ser recolhidos ao fundo municipal.
              Oriente as unidades escolares a planejarem e executarem os recursos dentro do prazo.
            </p>
          </div>
        </div>
      </div>

      {!enabled && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>Modo demonstração</strong> — conecte o Supabase para visualizar dados reais.
        </div>
      )}

      {enabled && rows.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Nenhuma unidade com saldo parado encontrada. Parabéns pela execução!
        </div>
      )}

      {rows.length > 0 && (
        <>
          <ExportButtons filename="ranking-saldos-parados-gppe" rows={exportRows} />

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-soft">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-4 py-3 font-black text-slate-700">#</th>
                  <th className="px-4 py-3 font-black text-slate-700">Unidade</th>
                  <th className="px-4 py-3 font-black text-slate-700">Tipo</th>
                  <th className="px-4 py-3 text-right font-black text-slate-700">Saldo Parado</th>
                  <th className="px-4 py-3 text-right font-black text-slate-700">Total Recebido</th>
                  <th className="px-4 py-3 text-right font-black text-slate-700">% Executado</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.school_unit_id}
                    className="border-b border-slate-50 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-black text-slate-500">{i + 1}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{row.escola}</td>
                    <td className="px-4 py-3 capitalize text-slate-600">{row.tipo}</td>
                    <td className="px-4 py-3 text-right font-black text-red-700">
                      {formatBRL(Number(row.saldo_total_parado))}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {formatBRL(Number(row.total_recebido))}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {execucaoBadge(Number(row.percentual_execucao))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
