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

type EducationalResource = {
  title: string;
  category: string;
  audience: string;
  type: "PDF" | "Video" | "Link" | "Modelo";
  description: string;
  tags: string[];
};

const categories = ["Todos", "Alfabetizacao", "Matematica", "Inclusao", "Gestao pedagogica", "Formacao", "Documentos"];

const resources: EducationalResource[] = [
  {
    title: "Sequencia didatica de alfabetizacao",
    category: "Alfabetizacao",
    audience: "1o ao 3o ano",
    type: "PDF",
    description: "Modelo inicial para organizar objetivos, habilidades, atividades e avaliacao.",
    tags: ["planejamento", "leitura", "escrita"]
  },
  {
    title: "Banco de atividades de matematica",
    category: "Matematica",
    audience: "Ensino fundamental",
    type: "Modelo",
    description: "Sugestao de atividades por eixo: numeros, geometria, grandezas e problemas.",
    tags: ["atividades", "habilidades", "avaliacao"]
  },
  {
    title: "Roteiro de atendimento educacional especializado",
    category: "Inclusao",
    audience: "AEE e gestao escolar",
    type: "PDF",
    description: "Checklist para acompanhar adaptacoes, relatorios e plano de atendimento.",
    tags: ["inclusao", "aee", "relatorio"]
  },
  {
    title: "Painel de acompanhamento pedagogico",
    category: "Gestao pedagogica",
    audience: "Coordenacao e direcao",
    type: "Modelo",
    description: "Estrutura para acompanhar frequencia, aprendizagem e intervencoes por turma.",
    tags: ["gestao", "indicadores", "turmas"]
  },
  {
    title: "Formacao continuada: uso de recursos digitais",
    category: "Formacao",
    audience: "Professores",
    type: "Video",
    description: "Trilha de apoio para uso de ferramentas digitais na sala de aula.",
    tags: ["tecnologia", "formacao", "praticas"]
  },
  {
    title: "Modelo de plano de aula padronizado",
    category: "Documentos",
    audience: "Todas as etapas",
    type: "Modelo",
    description: "Documento base para padronizar o planejamento semanal nas unidades.",
    tags: ["plano", "modelo", "rotina"]
  }
];

const typeIcons = {
  PDF: FileText,
  Video: MonitorPlay,
  Link: BookOpen,
  Modelo: Download
};

export function EducationalResourcesBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");

  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesCategory = category === "Todos" || resource.category === category;
      const matchesQuery =
        !normalizedQuery ||
        resource.title.toLowerCase().includes(normalizedQuery) ||
        resource.description.toLowerCase().includes(normalizedQuery) ||
        resource.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

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

      <section className="grid gap-4 lg:grid-cols-3">
        {filteredResources.map((resource) => {
          const Icon = typeIcons[resource.type];

          return (
            <article key={resource.title} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
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
              <button
                type="button"
                className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-sme-blue px-3 text-sm font-bold text-white hover:bg-sme-navy"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Preparar material
              </button>
            </article>
          );
        })}
      </section>

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
