"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Download,
  FileText,
  GraduationCap,
  MonitorPlay,
  Search,
  Sparkles,
  Users
} from "lucide-react";
import type { EducationalResource } from "@/lib/types";

type DisplayResource = {
  key: string;
  title: string;
  category: string;
  audience: string;
  type: string;
  description: string;
  tags: string[];
  externalUrl?: string;
  filePath?: string;
};

const categories = ["Todos", "Alfabetizacao", "Matematica", "Inclusao", "Gestao pedagogica", "Formacao", "Documentos"];

const mockResources: DisplayResource[] = [
  {
    key: "seq-alfa",
    title: "Sequencia didatica de alfabetizacao",
    category: "Alfabetizacao",
    audience: "1o ao 3o ano",
    type: "PDF",
    description: "Modelo inicial para organizar objetivos, habilidades, atividades e avaliacao.",
    tags: ["planejamento", "leitura", "escrita"]
  },
  {
    key: "mat-atividades",
    title: "Banco de atividades de matematica",
    category: "Matematica",
    audience: "Ensino fundamental",
    type: "Modelo",
    description: "Sugestao de atividades por eixo: numeros, geometria, grandezas e problemas.",
    tags: ["atividades", "habilidades", "avaliacao"]
  },
  {
    key: "aee-roteiro",
    title: "Roteiro de atendimento educacional especializado",
    category: "Inclusao",
    audience: "AEE e gestao escolar",
    type: "PDF",
    description: "Checklist para acompanhar adaptacoes, relatorios e plano de atendimento.",
    tags: ["inclusao", "aee", "relatorio"]
  },
  {
    key: "painel-pedagogico",
    title: "Painel de acompanhamento pedagogico",
    category: "Gestao pedagogica",
    audience: "Coordenacao e direcao",
    type: "Modelo",
    description: "Estrutura para acompanhar frequencia, aprendizagem e intervencoes por turma.",
    tags: ["gestao", "indicadores", "turmas"]
  },
  {
    key: "formacao-digital",
    title: "Formacao continuada: uso de recursos digitais",
    category: "Formacao",
    audience: "Professores",
    type: "Video",
    description: "Trilha de apoio para uso de ferramentas digitais na sala de aula.",
    tags: ["tecnologia", "formacao", "praticas"]
  },
  {
    key: "plano-aula",
    title: "Modelo de plano de aula padronizado",
    category: "Documentos",
    audience: "Todas as etapas",
    type: "Modelo",
    description: "Documento base para padronizar o planejamento semanal nas unidades.",
    tags: ["plano", "modelo", "rotina"]
  }
];

const typeIcons: Record<string, typeof FileText> = {
  PDF: FileText,
  Video: MonitorPlay,
  Link: BookOpen,
  Modelo: Download
};

function getTypeIcon(type: string) {
  return typeIcons[type] ?? FileText;
}

function fromServerResource(r: EducationalResource): DisplayResource {
  return {
    key: r.id,
    title: r.title,
    category: r.category,
    audience: [r.stage, r.modality].filter(Boolean).join(" - ") || "Todas as etapas",
    type: r.type,
    description: r.description ?? "",
    tags: r.tags,
    filePath: r.filePath,
    externalUrl: r.externalUrl
  };
}

export function EducationalResourcesBrowser({ initialResources }: { initialResources?: EducationalResource[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");

  const allResources = useMemo(() => {
    if (initialResources && initialResources.length > 0) {
      return initialResources.map(fromServerResource);
    }
    return mockResources;
  }, [initialResources]);

  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return allResources.filter((resource) => {
      const matchesCategory = category === "Todos" || resource.category === category;
      const matchesQuery =
        !normalizedQuery ||
        resource.title.toLowerCase().includes(normalizedQuery) ||
        resource.description.toLowerCase().includes(normalizedQuery) ||
        resource.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return matchesCategory && matchesQuery;
    });
  }, [category, query, allResources]);

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-slate-200 bg-white p-4 shadow-soft">
        <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
          <label className="block text-sm font-bold text-slate-700">
            Buscar recurso
            <div className="mt-2 flex h-11 items-center gap-2 rounded-md border border-slate-300 px-3 focus-within:ring-2 focus-within:ring-sme-yellow">
              <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full border-0 outline-none"
                placeholder="Digite tema, etapa, habilidade ou material"
              />
            </div>
          </label>
          <label className="block text-sm font-bold text-slate-700">
            Categoria
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-sme-yellow"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {filteredResources.length === 0 ? (
        <section className="rounded-md border border-slate-200 bg-white p-10 text-center shadow-soft">
          <GraduationCap className="mx-auto h-10 w-10 text-slate-300" aria-hidden="true" />
          <p className="mt-4 font-bold text-slate-500">Nenhum recurso encontrado para este filtro.</p>
          <p className="mt-1 text-sm text-slate-400">Tente outro termo ou categoria.</p>
        </section>
      ) : (
        <section className="grid gap-4 lg:grid-cols-3">
          {filteredResources.map((resource) => {
            const Icon = getTypeIcon(resource.type);

            return (
              <article key={resource.key} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-sme-blue text-white">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black uppercase text-sme-blue">
                    {resource.type}
                  </span>
                </div>
                <p className="mt-4 text-xs font-black uppercase tracking-wide text-amber-500">{resource.category}</p>
                <h2 className="mt-2 text-lg font-black text-sme-ink">{resource.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{resource.description}</p>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <Users className="h-4 w-4" aria-hidden="true" />
                  {resource.audience}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
                {resource.externalUrl ? (
                  <a
                    href={resource.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-sme-blue px-3 text-sm font-bold text-white hover:bg-sme-navy"
                  >
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    Acessar recurso
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="mt-5 inline-flex h-10 w-full cursor-not-allowed items-center justify-center gap-2 rounded-md bg-slate-100 px-3 text-sm font-bold text-slate-400"
                  >
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    Em preparacao
                  </button>
                )}
              </article>
            );
          })}
        </section>
      )}

      <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-soft lg:grid-cols-[1fr_260px] lg:items-center">
        <div>
          <div className="flex items-center gap-3">
            <GraduationCap className="h-7 w-7 text-sme-blue" aria-hidden="true" />
            <h2 className="text-xl font-black text-sme-ink">Fila de alimentacao do portal</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            A proxima etapa e trocar estes modelos iniciais pelos arquivos oficiais, links de video, documentos em PDF e materiais produzidos pela SME.
          </p>
        </div>
        <div className="rounded-md bg-blue-50 p-4 text-sm font-semibold text-[#003b7a]">
          {filteredResources.length} recurso(s) encontrado(s)
        </div>
      </section>
    </div>
  );
}
