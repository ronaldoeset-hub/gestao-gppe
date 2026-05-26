import type { EduCard } from "@/data/educonecta";

const cardTones: Record<EduCard["tone"], string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  green: "bg-emerald-50 text-emerald-700 border-emerald-100",
  yellow: "bg-amber-50 text-amber-700 border-amber-100",
  red: "bg-red-50 text-red-700 border-red-100",
  slate: "bg-slate-50 text-slate-700 border-slate-100"
};

export function EduConectaCards({ cards }: { cards: EduCard[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article key={card.label} className={`rounded-2xl border bg-white p-5 shadow-soft ${cardTones[card.tone]}`}>
          <p className="text-xs font-black uppercase tracking-wide opacity-80">{card.label}</p>
          <p className="mt-3 text-3xl font-black text-slate-950">{card.value}</p>
          <p className="mt-1 text-sm font-semibold opacity-80">{card.detail}</p>
        </article>
      ))}
    </section>
  );
}
