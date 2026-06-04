import type { Metadata } from "next";
import { Bell, CalendarDays, Info, Megaphone, Pin, TriangleAlert } from "lucide-react";
import { ModuleHeader } from "@/components/module-header";

export const metadata: Metadata = {
  title: "Mural de Comunicados",
  description: "Avisos, prazos e comunicados da GPPE para as unidades escolares."
};

export const revalidate = 60;

type TipoComunicado = "urgente" | "prazo" | "informativo" | "aviso";

const COMUNICADOS: Array<{
  id: string;
  titulo: string;
  corpo: string;
  tipo: TipoComunicado;
  data: string;
  autor: string;
  fixado?: boolean;
}> = [
  {
    id: "1",
    titulo: "Prazo final — Prestação de contas PDDE 2025",
    corpo: "O prazo para envio da prestação de contas do PDDE exercício 2025 é 28/02/2026. Unidades pendentes devem contatar a GPPE imediatamente para orientações e regularização.",
    tipo: "urgente",
    data: "2026-01-15",
    autor: "GPPE / SME",
    fixado: true
  },
  {
    id: "2",
    titulo: "Renovação de mandatos dos Conselhos Escolares",
    corpo: "Unidades com mandato vencido ou a vencer nos próximos 90 dias devem iniciar o processo: convocação, eleição, posse e registro em cartório. Consulte o guia na Biblioteca SEI.",
    tipo: "prazo",
    data: "2026-01-20",
    autor: "GPPE / SME",
    fixado: true
  },
  {
    id: "3",
    titulo: "Encerramento PDDE EQUIDADE 2025",
    corpo: "As unidades contempladas com PDDE EQUIDADE devem concluir a execução dos recursos até 31/03/2026. Saldos não executados poderão ser objeto de devolução ao FNDE.",
    tipo: "urgente",
    data: "2026-02-05",
    autor: "GPPE / SME"
  },
  {
    id: "4",
    titulo: "Capacitação de gestores — fevereiro 2026",
    corpo: "Encontro de capacitação para gestores no dia 10/02/2026, das 8h às 12h, na sede da SME. Pauta: uso do EduConecta, prestação de contas e regularidade documental. Presença obrigatória.",
    tipo: "informativo",
    data: "2026-01-22",
    autor: "GPPE / SME"
  },
  {
    id: "5",
    titulo: "Documentação obrigatória para 2026",
    corpo: "Cada unidade deve manter atualizado: ata de posse do conselho, lista de membros, CNPJ ativo, conta bancária vinculada e comprovante de execução financeira. Levantamento em março.",
    tipo: "informativo",
    data: "2026-02-01",
    autor: "GPPE / SME"
  },
  {
    id: "6",
    titulo: "Portal EduConecta atualizado",
    corpo: "O portal foi atualizado com novo design, melhor desempenho e novas funcionalidades. Todos os gestores devem verificar as informações de sua unidade e atualizar o cadastro.",
    tipo: "aviso",
    data: "2026-01-28",
    autor: "Suporte Técnico"
  }
];

const TIPO: Record<TipoComunicado, { label: string; pill: string; borda: string; icone: React.ElementType }> = {
  urgente: { label: "Urgente", pill: "bg-red-50 text-sme-red border-sme-red/30", borda: "border-sme-red/30", icone: TriangleAlert },
  prazo: { label: "Prazo", pill: "bg-amber-50 text-sme-gold border-sme-gold/40", borda: "border-sme-gold/30", icone: CalendarDays },
  informativo: { label: "Informativo", pill: "bg-sme-blue-soft text-sme-blue border-sme-blue/20", borda: "border-sme-line", icone: Info },
  aviso: { label: "Aviso", pill: "bg-sme-surface text-sme-muted border-sme-line", borda: "border-sme-line", icone: Bell }
};

function Card({ c }: { c: typeof COMUNICADOS[0] }) {
  const cfg = TIPO[c.tipo];
  const Ic = cfg.icone;
  return (
    <article className={`relative rounded-2xl border-2 bg-white p-5 shadow-soft-sm transition hover:shadow-soft ${cfg.borda}`}>
      {c.fixado && (
        <span className="absolute right-4 top-4 flex items-center gap-1 text-xs font-semibold text-sme-muted">
          <Pin className="h-3 w-3" aria-hidden="true" /> Fixado
        </span>
      )}
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${cfg.pill}`}>
          <Ic className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${cfg.pill}`}>{cfg.label}</span>
            <time className="text-xs text-sme-muted">{new Intl.DateTimeFormat("pt-BR").format(new Date(c.data + "T12:00:00"))}</time>
          </div>
          <h2 className="font-display mt-2 font-bold text-sme-navy">{c.titulo}</h2>
          <p className="mt-2 text-sm leading-6 text-sme-muted">{c.corpo}</p>
          <p className="mt-3 text-xs font-semibold text-sme-muted">Por: {c.autor}</p>
        </div>
      </div>
    </article>
  );
}

export default function MuralPage() {
  const fixados = COMUNICADOS.filter((c) => c.fixado);
  const demais = COMUNICADOS.filter((c) => !c.fixado);
  const urgentes = COMUNICADOS.filter((c) => c.tipo === "urgente").length;

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Mural de Comunicados"
        description="Avisos, publicações, prazos e comunicados da GPPE para as unidades escolares da rede municipal."
        icon={Megaphone}
      />

      {urgentes > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-sme-red/30 bg-red-50 px-4 py-3" role="alert">
          <TriangleAlert className="h-5 w-5 shrink-0 text-sme-red" aria-hidden="true" />
          <p className="text-sm font-semibold text-sme-red">
            {urgentes} comunicado{urgentes > 1 ? "s urgentes" : " urgente"} — leia com atenção.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {(Object.entries(TIPO) as [TipoComunicado, typeof TIPO[TipoComunicado]][]).map(([tipo, cfg]) => (
          <span key={tipo} className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${cfg.pill}`}>
            <cfg.icone className="h-3 w-3" aria-hidden="true" />
            {cfg.label}
          </span>
        ))}
      </div>

      {fixados.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-xs font-bold uppercase tracking-widest text-sme-muted">Fixados</h2>
          <div className="grid gap-4 lg:grid-cols-2">{fixados.map((c) => <Card key={c.id} c={c} />)}</div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="font-display text-xs font-bold uppercase tracking-widest text-sme-muted">Comunicados recentes</h2>
        <div className="grid gap-4 lg:grid-cols-2">{demais.map((c) => <Card key={c.id} c={c} />)}</div>
      </section>
    </div>
  );
}
