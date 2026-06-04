"use client";

import { useState } from "react";
import { CheckCircle2, MessageSquare, Send } from "lucide-react";
import { ModuleHeader } from "@/components/module-header";

type TipoFeedback = "sugestao" | "problema" | "elogio" | "duvida";

const TIPOS: Record<TipoFeedback, { label: string; cor: string }> = {
  sugestao: { label: "Sugestão de melhoria", cor: "border-sme-blue text-sme-blue bg-sme-blue-soft" },
  problema: { label: "Problema no sistema", cor: "border-sme-red text-sme-red bg-red-50" },
  elogio: { label: "Elogio", cor: "border-sme-green text-sme-green bg-emerald-50" },
  duvida: { label: "Dúvida", cor: "border-sme-gold text-sme-gold bg-amber-50" }
};

export default function FeedbackPage() {
  const [tipo, setTipo] = useState<TipoFeedback>("sugestao");
  const [mensagem, setMensagem] = useState("");
  const [unidade, setUnidade] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mensagem.trim()) return;
    setEnviando(true);
    await new Promise((r) => setTimeout(r, 800));
    setEnviado(true);
    setEnviando(false);
  }

  if (enviado) {
    return (
      <div className="space-y-6">
        <ModuleHeader title="Feedback" description="Envie sua opinião sobre o portal EduConecta." icon={MessageSquare} />
        <div className="flex flex-col items-center justify-center rounded-2xl border border-sme-green/30 bg-emerald-50 py-16 text-center">
          <CheckCircle2 className="h-16 w-16 text-sme-green" aria-hidden="true" />
          <h2 className="font-display mt-4 text-2xl font-bold text-sme-navy">Obrigado pelo feedback!</h2>
          <p className="mt-2 text-sme-muted">Sua mensagem foi recebida e será analisada pela equipe técnica da GPPE.</p>
          <button
            type="button"
            onClick={() => { setEnviado(false); setMensagem(""); setUnidade(""); setTipo("sugestao"); }}
            className="mt-6 rounded-xl bg-sme-navy px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sme-blue"
          >
            Enviar novo feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Feedback"
        description="Compartilhe sugestões, problemas, elogios ou dúvidas sobre o portal EduConecta."
        icon={MessageSquare}
      />

      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-sme-line bg-white p-8 shadow-soft-sm">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <p className="text-sm font-semibold text-sme-ink">Tipo de feedback</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(Object.entries(TIPOS) as [TipoFeedback, typeof TIPOS[TipoFeedback]][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTipo(key)}
                    className={`rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition ${tipo === key ? cfg.cor : "border-sme-line bg-white text-sme-muted hover:border-sme-blue"}`}
                  >
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="unidade" className="block text-sm font-semibold text-sme-ink">
                Unidade escolar <span className="text-sme-muted font-normal">(opcional)</span>
              </label>
              <input
                id="unidade"
                type="text"
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                placeholder="Ex: EM Prof. Geraldo Costa"
                className="mt-1.5 h-11 w-full rounded-xl border border-sme-line px-3 text-sme-ink placeholder:text-sme-muted outline-none focus:border-sme-blue focus:ring-2 focus:ring-sme-yellow/30 transition"
              />
            </div>

            <div>
              <label htmlFor="mensagem" className="block text-sm font-semibold text-sme-ink">
                Mensagem <span className="text-sme-red">*</span>
              </label>
              <textarea
                id="mensagem"
                required
                rows={5}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Descreva detalhadamente sua sugestão, problema ou dúvida..."
                className="mt-1.5 w-full rounded-xl border border-sme-line px-3 py-2.5 text-sme-ink placeholder:text-sme-muted outline-none focus:border-sme-blue focus:ring-2 focus:ring-sme-yellow/30 transition resize-none"
              />
              <p className="mt-1 text-xs text-sme-muted">{mensagem.length}/500 caracteres</p>
            </div>

            <button
              type="submit"
              disabled={enviando || !mensagem.trim()}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-sme-navy text-sm font-semibold text-white transition hover:bg-sme-blue disabled:cursor-not-allowed disabled:opacity-60"
            >
              {enviando ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Enviar feedback
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-4 rounded-2xl border border-sme-line bg-sme-surface p-4">
          <p className="text-sm text-sme-muted">
            <strong className="text-sme-navy">Privacidade:</strong> Seu feedback é anônimo e utilizado exclusivamente para melhorar o portal. Não inclua dados pessoais de terceiros.
          </p>
        </div>
      </div>
    </div>
  );
}
