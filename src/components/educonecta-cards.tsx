import { cn } from "@/lib/utils";
import type { EduCard } from "@/data/educonecta";

type Tone = EduCard["tone"];

const toneAccent: Record<Tone, string> = {
  blue: "bg-sme-blue",
  green: "bg-sme-green",
  yellow: "bg-sme-yellow",
  red: "bg-sme-red",
  slate: "bg-sme-muted"
};

const toneText: Record<Tone, string> = {
  blue: "text-sme-blue",
  green: "text-sme-green",
  yellow: "text-sme-gold",
  red: "text-sme-red",
  slate: "text-sme-muted"
};

export function EduConectaCards({ cards }: { cards: EduCard[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="relative overflow-hidden rounded-2xl border border-sme-line bg-white p-5 shadow-soft-sm transition hover:-translate-y-0.5 hover:shadow-soft"
        >
          <div className={cn("absolute inset-y-0 left-0 w-1 rounded-l-2xl", toneAccent[card.tone])} aria-hidden="true" />
          <p className={cn("pl-3 text-xs font-bold uppercase tracking-wide", toneText[card.tone])}>{card.label}</p>
          <p className="font-display mt-3 pl-3 text-3xl font-bold text-sme-ink">{card.value}</p>
          <p className="mt-1 pl-3 text-sm font-medium text-sme-muted">{card.detail}</p>
        </div>
      ))}
    </section>
  );
}
