"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, ExternalLink, FileText, Search, Sparkles } from "lucide-react";
import type { EducationalResource } from "@/lib/types";

type EducationalResourcesBrowserProps = {
  resources: EducationalResource[];
};

export function EducationalResourcesBrowser({ resources }: EducationalResourcesBrowserProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const categories = useMemo(() => ["Todos", ...Array.from(new Set(resources.map((resource) => resource.category)))], [resources]);

  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesCategory = category === "Todos" || resource.category === category;
      const matchesQuery =
        !normalizedQuery ||
        resource.title.toLowerCase().includes(normalizedQuery) ||
        resource.description.toLowerCase().includes(normalizedQuery) ||
        resource.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, query, resources]);

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
        {filteredResources.map((resource) => (
          <article key={resource.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-sme-blue text-white">
                <FileText className="h-6 w-6" aria-hidden="true" />
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black uppercase text-sme-blue">
                {resource.category}
              </span>
            </div>
            <h2 className="mt-4 text-lg font-black text-sme-ink">{resource.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{resource.description}</p>
            {resource.url ? (
              <Link href={resource.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-sme-blue px-3 text-sm font-bold text-white hover:bg-sme-navy">
                Acessar
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : (
              <button type="button" className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-sme-blue px-3 text-sm font-bold text-white hover:bg-sme-navy">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Preparar material
              </button>
            )}
          </article>
        ))}
      </section>

      <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-soft lg:grid-cols-[1fr_260px] lg:items-center">
        <div>
          <div className="flex items-center gap-3">
            <BookOpen className="h-7 w-7 text-sme-blue" aria-hidden="true" />
            <h2 className="text-xl font-black text-sme-ink">Portal alimentado pelo Supabase</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Quando a tabela `recursos_educacionais` existir no banco, os materiais publicados aqui passam a vir dela automaticamente.
          </p>
        </div>
        <div className="rounded-md bg-blue-50 p-4 text-sm font-semibold text-[#003b7a]">
          {filteredResources.length} recurso(s) encontrado(s)
        </div>
      </section>
    </div>
  );
}
