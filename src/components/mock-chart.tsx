type MockChartProps = {
  title: string;
  values: Array<{ label: string; value: number; color?: string }>;
  type?: "bars" | "line" | "donut";
};

export function MockChart({ title, values, type = "bars" }: MockChartProps) {
  const max = Math.max(...values.map((item) => item.value), 1);

  if (type === "donut") {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="font-black text-slate-950">{title}</h2>
        <div className="mt-5 flex items-center gap-6">
          <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[conic-gradient(#0ea5e9_0_45%,#22c55e_45%_72%,#f59e0b_72%_88%,#ef4444_88%_100%)]">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-xl font-black text-slate-950">
              {values.reduce((sum, item) => sum + item.value, 0)}
            </div>
          </div>
          <div className="space-y-2">
            {values.map((item) => (
              <p key={item.label} className="text-sm font-semibold text-slate-600">
                {item.label}: <span className="font-black text-slate-950">{item.value}</span>
              </p>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="font-black text-slate-950">{title}</h2>
      <div className="mt-5 flex h-52 items-end gap-3 border-b border-l border-slate-200 px-3">
        {values.map((item) => (
          <div key={item.label} className="flex h-full flex-1 flex-col justify-end gap-2">
            <div
              className={`mx-auto w-full max-w-12 rounded-t-xl ${item.color ?? "bg-blue-600"}`}
              style={{ height: `${Math.max((item.value / max) * 180, 12)}px` }}
            />
            <p className="h-8 truncate text-center text-xs font-bold text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>
      {type === "line" ? <p className="mt-3 text-xs font-semibold text-slate-500">Linha mockada representada por barras temporarias.</p> : null}
    </section>
  );
}
