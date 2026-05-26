import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { institutionalNoticeText } from "@/components/institutional-notice";

export const metadata = {
  title: "Aviso Institucional - EduConecta",
  description: "Aviso sobre independencia, prototipo e uso demonstrativo do EduConecta."
};

export default function InstitutionalNoticePage() {
  return (
    <main className="min-h-screen bg-[#f3f7fb] px-5 py-8 text-sme-ink">
      <section className="mx-auto max-w-4xl rounded-md border border-slate-200 bg-white p-6 shadow-soft">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-sme-blue hover:text-sme-navy">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar
        </Link>

        <div className="mt-6 flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-sme-yellow text-sme-ink">
            <ShieldAlert className="h-8 w-8" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-amber-500">Prototipo independente</p>
            <h1 className="mt-2 text-3xl font-black text-sme-ink">Aviso Institucional EduConecta</h1>
          </div>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
          <p>{institutionalNoticeText}</p>
          <p>
            A aplicacao esta sendo estruturada como plataforma SaaS demonstrativa para organizacao de informacoes educacionais,
            incluindo recursos, conselhos, documentos, prazos, relatorios, analytics e comunicacao.
          </p>
          <p>
            A eventual utilizacao por qualquer instituicao depende de validacao tecnica, administrativa e juridica, incluindo definicao de responsabilidades,
            regras de acesso, politica de dados, rotina de backup e demais controles necessarios.
          </p>
          <p>
            Durante os testes, recomenda-se utilizar apenas dados ficticios, demonstrativos ou informacoes previamente autorizadas, evitando a insercao de
            dados pessoais sensiveis, documentos sigilosos ou informacoes que exijam tratamento institucional formal.
          </p>
          <p>
            A area de parceiros possui finalidade exclusivamente publicitaria e nao representa recomendacao oficial, credenciamento,
            preferencia ou garantia de contratacao.
          </p>
        </div>
      </section>
    </main>
  );
}
