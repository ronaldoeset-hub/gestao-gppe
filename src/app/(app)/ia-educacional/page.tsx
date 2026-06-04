"use client";

import { useState } from "react";
import { Bot, CheckCircle2, ChevronRight, FileText, HelpCircle, Lightbulb, RotateCcw } from "lucide-react";
import { ModuleHeader } from "@/components/module-header";

type Template = {
  id: string;
  categoria: string;
  pergunta: string;
  resposta: string;
};

const TEMPLATES: Template[] = [
  {
    id: "t1",
    categoria: "Conselhos Escolares",
    pergunta: "Como renovar o mandato do Conselho Escolar?",
    resposta: `Para renovar o mandato do Conselho Escolar, siga os seguintes passos:\n\n1. **Convocação:** Publique edital de convocação com antecedência mínima de 10 dias, afixado na escola e divulgado à comunidade.\n\n2. **Eleição:** Realize a assembleia eleitoral com presença de todos os segmentos (professores, funcionários, pais e alunos). Registre em ata.\n\n3. **Posse:** Realize cerimônia de posse dos eleitos e lavra nova ata de posse.\n\n4. **Registro em cartório:** Leve a ata ao cartório para o registro legal do novo mandato.\n\n5. **Comunicação à GPPE:** Envie cópia da ata e comprovante de registro para a GPPE pelo EduConecta.\n\n6. **Prazo:** O processo deve ser concluído **antes do vencimento** do mandato atual.\n\nDocumentos necessários: edital, lista de presença, ata de eleição, ata de posse e comprovante de registro.`
  },
  {
    id: "t2",
    categoria: "Prestação de Contas",
    pergunta: "Quais documentos são necessários para a prestação de contas PDDE?",
    resposta: `A prestação de contas do PDDE exige os seguintes documentos:\n\n**Documentos obrigatórios:**\n- Extrato bancário do período (conta do PDDE)\n- Notas fiscais de todas as despesas realizadas\n- Comprovantes de pagamento (recibos, transferências)\n- Relatório de execução financeira preenchido\n- Ata do Conselho Escolar autorizando as despesas\n- Cotação de preços (mínimo 3 fornecedores para compras acima de R$ 2.000)\n- Fotos dos itens adquiridos (quando aplicável)\n\n**Documentos complementares:**\n- Lista de membros do Conselho Escolar\n- CNPJ atualizado da unidade\n- Comprovante de conta bancária ativa\n\n**Prazo:** Enviar até a data limite informada pelo FNDE e pela GPPE.\n\nTodas as despesas devem ser realizadas exclusivamente com recursos do programa correspondente.`
  },
  {
    id: "t3",
    categoria: "Prestação de Contas",
    pergunta: "Como lançar um recurso PDDE no sistema?",
    resposta: `Para lançar um recurso PDDE no EduConecta:\n\n1. Acesse **Recursos** no menu lateral\n2. Clique em **Novo recurso**\n3. Preencha os campos:\n   - **Programa:** selecione PDDE, QUALIDADE, EQUIDADE ou INTEGRAL\n   - **Unidade escolar:** selecione sua escola\n   - **Valor recebido:** informe o valor conforme depósito bancário\n   - **Data de liberação:** data do crédito na conta\n   - **Categoria:** Custeio ou Capital\n   - **Status:** Em execução\n4. Salve o registro\n5. Acesse **Prestação de Contas** para vincular as despesas\n\n**Importante:** O lançamento no sistema não substitui a prestação de contas oficial. Mantenha todos os documentos físicos organizados.`
  },
  {
    id: "t4",
    categoria: "Documentação",
    pergunta: "Quais documentos obrigatórios o Conselho Escolar deve manter?",
    resposta: `O Conselho Escolar deve manter os seguintes documentos atualizados:\n\n**Documentos de constituição:**\n- Estatuto do Conselho\n- Ata de eleição dos membros\n- Ata de posse dos membros\n- Lista de membros com assinaturas\n- Registro em cartório do mandato vigente\n\n**Documentos financeiros:**\n- Livro caixa atualizado\n- Extratos bancários mensais\n- Notas fiscais e recibos organizados por data\n- Cotações de preços\n- Relatórios de execução\n\n**Documentos operacionais:**\n- Atas de todas as reuniões realizadas\n- Plano de Aplicação dos recursos\n- Prestação de contas entregues\n\nGuardar por mínimo de **5 anos** após a prestação de contas.`
  },
  {
    id: "t5",
    categoria: "Regulamentação",
    pergunta: "O que é o PDDE e como funciona?",
    resposta: `O **PDDE (Programa Dinheiro Direto na Escola)** é um programa do governo federal que repassa recursos financeiros diretamente às escolas públicas.\n\n**Como funciona:**\n- Os recursos são depositados na conta bancária do Conselho Escolar\n- A escola tem autonomia para utilizar conforme o Plano de Aplicação\n- Os gastos devem seguir as categorias permitidas pelo programa\n\n**Categorias de gasto:**\n- **Custeio:** materiais de consumo, pequenos reparos, serviços\n- **Capital:** equipamentos, mobiliários, obras estruturais\n\n**Modalidades do PDDE:**\n- PDDE Básico (manutenção e melhoria)\n- PDDE QUALIDADE (projetos específicos)\n- PDDE EQUIDADE (escolas em situação de vulnerabilidade)\n- PDDE INTEGRAL (escolas de tempo integral)\n\n**Obrigações:** prestar contas ao FNDE dentro do prazo, manter documentação organizada e registrar todas as movimentações.`
  },
  {
    id: "t6",
    categoria: "Regulamentação",
    pergunta: "Quais são os prazos importantes do calendário PDDE?",
    resposta: `Os principais prazos do calendário PDDE são:\n\n**Início do exercício (jan/fev):**\n- Aprovação do Plano de Aplicação pelo Conselho\n- Abertura ou verificação da conta bancária\n- Levantamento de necessidades da escola\n\n**Durante o exercício (mar/nov):**\n- Execução das despesas conforme Plano de Aplicação\n- Reuniões mensais do Conselho para aprovação de gastos\n- Organização dos documentos comprobatórios\n\n**Encerramento (nov/fev):**\n- Conclusão de todas as despesas\n- Prestação de contas ao FNDE\n- Saldo não executado pode gerar devolução\n\n**Atenção:** O prazo exato varia por ano e por modalidade. Acompanhe as circulares do FNDE e os comunicados da GPPE no Mural.`
  }
];

const CATEGORIAS = Array.from(new Set(TEMPLATES.map((t) => t.categoria)));

export default function IaEducacionalPage() {
  const [ativo, setAtivo] = useState<Template | null>(null);
  const [filtro, setFiltro] = useState("Todos");

  const filtrados = filtro === "Todos" ? TEMPLATES : TEMPLATES.filter((t) => t.categoria === filtro);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="IA Educacional — Assistente GPPE"
        description="Respostas prontas para as dúvidas mais frequentes sobre conselhos, recursos, prestação de contas e regulamentação."
        icon={Bot}
      />

      <div className="flex flex-wrap gap-2">
        {["Todos", ...CATEGORIAS].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFiltro(cat)}
            className={`rounded-xl border px-3 py-1.5 text-sm font-semibold transition ${filtro === cat ? "border-sme-blue bg-sme-blue-soft text-sme-blue" : "border-sme-line bg-white text-sme-muted hover:border-sme-blue hover:text-sme-blue"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-sme-muted">Perguntas frequentes</p>
          {filtrados.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setAtivo(t)}
              className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${ativo?.id === t.id ? "border-sme-blue bg-sme-blue-soft" : "border-sme-line bg-white hover:border-sme-blue hover:bg-sme-blue-soft/50"}`}
            >
              <HelpCircle className={`h-5 w-5 shrink-0 ${ativo?.id === t.id ? "text-sme-blue" : "text-sme-muted"}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-bold uppercase tracking-wide ${ativo?.id === t.id ? "text-sme-blue" : "text-sme-muted"}`}>{t.categoria}</p>
                <p className={`mt-0.5 text-sm font-semibold leading-5 ${ativo?.id === t.id ? "text-sme-navy" : "text-sme-ink"}`}>{t.pergunta}</p>
              </div>
              <ChevronRight className={`h-4 w-4 shrink-0 ${ativo?.id === t.id ? "text-sme-blue" : "text-sme-muted"}`} aria-hidden="true" />
            </button>
          ))}
        </div>

        <div className="lg:sticky lg:top-24">
          {ativo ? (
            <div className="rounded-2xl border border-sme-line bg-white p-6 shadow-soft-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="rounded-full bg-sme-blue-soft px-3 py-1 text-xs font-bold text-sme-blue">
                    {ativo.categoria}
                  </span>
                  <h2 className="font-display mt-3 text-lg font-bold text-sme-navy">{ativo.pergunta}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setAtivo(null)}
                  className="rounded-xl border border-sme-line p-2 hover:bg-sme-surface transition"
                  aria-label="Fechar resposta"
                >
                  <RotateCcw className="h-4 w-4 text-sme-muted" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-4 space-y-2 text-sm leading-7 text-sme-ink">
                {ativo.resposta.split("\n\n").map((paragrafo, i) => (
                  <p key={i} dangerouslySetInnerHTML={{
                    __html: paragrafo
                      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                      .replace(/^- (.+)$/gm, "• $1")
                  }} />
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-xl bg-sme-surface px-3 py-2">
                <CheckCircle2 className="h-4 w-4 text-sme-green" aria-hidden="true" />
                <p className="text-xs font-medium text-sme-muted">Resposta baseada na regulamentação FNDE/PDDE e normas da SME.</p>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-sme-line bg-white p-8 text-center">
              <Lightbulb className="h-12 w-12 text-sme-yellow" aria-hidden="true" />
              <p className="font-display mt-4 font-bold text-sme-navy">Selecione uma pergunta</p>
              <p className="mt-2 text-sm text-sme-muted">Clique em qualquer pergunta ao lado para ver a resposta detalhada.</p>
            </div>
          )}

          {!ativo && (
            <div className="mt-4 rounded-2xl border border-sme-line bg-white p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-sme-blue" aria-hidden="true" />
                <p className="text-sm font-bold text-sme-navy">Precisa de mais ajuda?</p>
              </div>
              <p className="mt-1 text-sm text-sme-muted">Entre em contato com a GPPE pelo Suporte ou consulte a Biblioteca SEI para modelos de documentos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
