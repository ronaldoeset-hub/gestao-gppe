"use client";

import { useMemo, useState } from "react";
import { Bot, ClipboardCheck, FileText, Sparkles } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Label, Select, Textarea } from "@/components/ui";

const models = {
  diagnostico: "Diagnostico da Unidade",
  checklist: "Checklist automatico",
  oficio: "Minuta de oficio",
  parecer: "Parecer tecnico",
  notificacao: "Notificacao de pendencia"
};

export default function IaEducacionalPage() {
  const [unit, setUnit] = useState("Unidade selecionada");
  const [kind, setKind] = useState<keyof typeof models>("diagnostico");
  const [context, setContext] = useState("Prestacao de contas pendente, conselho em atencao e documentos a conferir.");

  const generatedText = useMemo(() => {
    if (kind === "diagnostico") {
      return `Diagnostico GPPE - ${unit}\n\nFinanceiro: acompanhar saldos por programa e conferir se ha movimentacao recente.\nDocumental: validar checklist de atas, extratos, protocolos e comprovantes.\nConselho Escolar: revisar mandato, composicao e documentos obrigatorios.\nPrestacao de contas: priorizar pendencias vencidas ou sem protocolo.\nSuporte: abrir chamado quando a unidade precisar de orientacao assistida.\n\nContexto informado: ${context}`;
    }

    if (kind === "checklist") {
      return `Checklist automatico - ${unit}\n\n1. Conferir cadastro da unidade.\n2. Validar conselho escolar vigente.\n3. Verificar documentos vencidos ou pendentes.\n4. Conciliar saldo recebido, gasto e disponivel.\n5. Registrar protocolo de prestacao de contas.\n6. Gerar alerta para prazo critico.\n7. Encaminhar suporte caso a unidade precise de orientacao.\n\nContexto: ${context}`;
    }

    if (kind === "oficio") {
      return `Oficio GPPE\n\nAssunto: Regularizacao de informacoes da unidade ${unit}\n\nSenhor(a) Gestor(a),\n\nSolicitamos a atualizacao das informacoes relacionadas a prestacao de contas, documentos obrigatorios e regularidade do conselho escolar. A medida busca garantir acompanhamento tempestivo dos recursos e cumprimento dos prazos administrativos.\n\nContexto: ${context}\n\nAtenciosamente,\nGPPE/SME`;
    }

    if (kind === "parecer") {
      return `Parecer tecnico preliminar - ${unit}\n\nApos analise das informacoes registradas, recomenda-se conferir a consistencia dos saldos, anexar documentos comprobatórios e atualizar a situacao da prestacao de contas. Havendo pendencia documental ou financeira, a unidade deve ser notificada para saneamento.\n\nContexto analisado: ${context}`;
    }

    return `Notificacao de pendencia - ${unit}\n\nIdentificamos pendencias que exigem providencias da unidade. Solicitamos regularizacao das informacoes abaixo e envio dos documentos/protocolos correspondentes.\n\nPendencias observadas: ${context}\n\nPrazo sugerido: 5 dias uteis.`;
  }, [context, kind, unit]);

  return (
    <div className="space-y-6">
      <header className="rounded-md border border-neutral-200 bg-white p-6 shadow-card">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-600 text-white">
            <Bot className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase text-secondary-700">Assistente GPPE Inteligente</p>
            <h1 className="mt-1 text-3xl font-bold text-neutral-900">IA Educacional para gestao municipal</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">
              Gera diagnosticos, checklists, minutas e pareceres por template local. Funciona mesmo sem chave externa de IA.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Gerar documento inteligente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="unit">Unidade</Label>
              <input id="unit" value={unit} onChange={(event) => setUnit(event.target.value)} className="mt-2 min-h-11 w-full rounded-md border border-neutral-300 px-3 text-sm" />
            </div>
            <div>
              <Label htmlFor="kind">Tipo de geracao</Label>
              <Select id="kind" value={kind} onChange={(event) => setKind(event.target.value as keyof typeof models)} className="mt-2">
                {Object.entries(models).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="context">Contexto</Label>
              <Textarea id="context" value={context} onChange={(event) => setContext(event.target.value)} className="mt-2" />
            </div>
            <Button type="button" className="w-full">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Atualizar geracao
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>{models[kind]}</CardTitle>
              <p className="text-sm text-neutral-600">Texto pronto para revisar e adaptar antes do envio oficial.</p>
            </div>
            <FileText className="h-5 w-5 text-primary-700" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <pre className="min-h-[420px] whitespace-pre-wrap rounded-md border border-neutral-200 bg-neutral-50 p-4 text-sm leading-6 text-neutral-800">{generatedText}</pre>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardContent className="grid gap-4 p-5 md:grid-cols-3">
          {["Financeiro", "Documental", "Conselho"].map((item) => (
            <div key={item} className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
              <ClipboardCheck className="h-5 w-5 text-secondary-700" aria-hidden="true" />
              <p className="mt-3 font-bold text-neutral-900">{item}</p>
              <p className="mt-1 text-sm text-neutral-600">Semaforo operacional preparado para conectar aos dados reais da unidade.</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
