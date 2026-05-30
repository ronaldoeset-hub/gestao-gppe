import { Banknote, Building2, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Card } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

type Props = {
  saldoCusteio: number;
  saldoCapital: number;
  saldoGeral: number;
  executadoCusteio: number;
  executadoCapital: number;
  totalUnidades: number;
};

export function GestaoRecursosCards({
  saldoCusteio,
  saldoCapital,
  saldoGeral,
  executadoCusteio,
  executadoCapital,
  totalUnidades
}: Props) {
  const cards = [
    { label: "Saldo Total Custeio", value: saldoCusteio, icon: Wallet,       tone: "blue"    as const },
    { label: "Saldo Total Capital", value: saldoCapital, icon: Banknote,     tone: "emerald" as const },
    { label: "Saldo Geral da Rede", value: saldoGeral,   icon: saldoGeral >= 0 ? TrendingUp : TrendingDown,
      tone: saldoGeral >= 0 ? "emerald" as const : "red" as const },
    { label: "Executado Custeio",   value: executadoCusteio, icon: TrendingDown, tone: "amber"  as const },
    { label: "Executado Capital",   value: executadoCapital, icon: TrendingDown, tone: "amber"  as const },
    { label: "Unidades c/ Recursos", value: null, count: totalUnidades, icon: Building2, tone: "slate" as const }
  ];

  const toneMap = {
    blue:   "bg-sky-50    text-sky-700",
    emerald:"bg-emerald-50 text-emerald-700",
    red:    "bg-red-50    text-red-700",
    amber:  "bg-amber-50  text-amber-700",
    slate:  "bg-slate-100 text-slate-700"
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase text-neutral-500">{card.label}</p>
                <p className="mt-3 text-2xl font-black text-neutral-900">
                  {card.count !== undefined ? card.count : formatCurrency(card.value ?? 0)}
                </p>
              </div>
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${toneMap[card.tone]}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
