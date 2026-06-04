import { Card } from "@/components/ui/card";

type MockChartProps = {
  title: string;
  values: Array<{ label: string; value: number; color?: string }>;
  type?: "bars" | "line" | "donut";
};

/* Paleta SME para rosca — 4 cores */
const DONUT_COLORS = ["#0A3149", "#0E7FA8", "#FFC400", "#138A36"];

export function MockChart({ title, values, type = "bars" }: MockChartProps) {
  if (type === "donut") {
    /* Rosca via conic-gradient com cores SME */
    const total = values.reduce((s, v) => s + v.value, 0) || 1;
    let accumulated = 0;
    const stops = values.map((item, i) => {
      const pct = (item.value / total) * 100;
      const color = DONUT_COLORS[i % DONUT_COLORS.length];
      const start = accumulated;
      accumulated += pct;
      return `${color} ${start.toFixed(1)}% ${accumulated.toFixed(1)}%`;
    });
    const gradient = `conic-gradient(${stops.join(", ")})`;

    return (
      <Card>
        <h2 className="font-display font-bold text-sme-navy">{title}</h2>
        <div className="mt-5 flex items-center gap-6">
          <div
            className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full"
            style={{ background: gradient }}
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-xl font-display font-bold text-sme-ink">
              {total}
            </div>
          </div>
          <div className="space-y-2">
            {values.map((item, i) => (
              <p key={item.label} className="flex items-center gap-2 text-sm font-medium text-sme-muted">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
                  aria-hidden="true"
                />
                {item.label}: <span className="font-bold text-sme-ink">{item.value}</span>
              </p>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  /* Barras com degradê navy → azul via CSS inline; alturas em % sem JS math */
  const max = Math.max(...values.map((v) => v.value), 1);

  return (
    <Card>
      <h2 className="font-display font-bold text-sme-navy">{title}</h2>
      <div className="mt-5 flex h-52 items-end gap-3 border-b border-l border-sme-line px-3">
        {values.map((item) => {
          const heightPct = `${Math.max((item.value / max) * 100, 6)}%`;
          return (
            <div key={item.label} className="flex h-full flex-1 flex-col justify-end gap-2">
              <div
                className="mx-auto w-full max-w-12 rounded-t-xl"
                style={{
                  height: heightPct,
                  background: item.color ?? "linear-gradient(180deg, #0A3149 0%, #0E7FA8 100%)"
                }}
              />
              <p className="h-8 truncate text-center text-xs font-semibold text-sme-muted">{item.label}</p>
            </div>
          );
        })}
      </div>
      {type === "line" ? (
        <p className="mt-3 text-xs font-medium text-sme-muted">Linha representada por barras temporarias.</p>
      ) : null}
    </Card>
  );
}
