"use client";

import { useState } from "react";
import { AlertTriangle, ClipboardCheck, FileArchive, Landmark, UsersRound } from "lucide-react";
import { AlertForm, AccountabilityForm, CouncilForm, ResourceForm } from "@/components/linked-record-forms";
import { DocumentUploader } from "@/components/document-uploader";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "conselho", label: "Conselho", icon: UsersRound, description: "Mandato, presidente, membros e situacao documental.", component: CouncilForm },
  { key: "recurso", label: "Recurso", icon: Landmark, description: "Repasse, saldo, programa, fonte e data de liberacao.", component: ResourceForm },
  { key: "prestacao", label: "Prestacao", icon: ClipboardCheck, description: "Referencia, prazo, envio, protocolo e status de analise.", component: AccountabilityForm },
  { key: "alerta", label: "Alerta", icon: AlertTriangle, description: "Avisos, pendencias e prioridades de acompanhamento.", component: AlertForm },
  { key: "documento", label: "Documento", icon: FileArchive, description: "Upload real para o Supabase Storage e registro vinculado.", component: DocumentUploader }
];

export function FeedDataTabs() {
  const [active, setActive] = useState(tabs[0].key);
  const selected = tabs.find((tab) => tab.key === active) ?? tabs[0];
  const ActiveComponent = selected.component;

  return (
    <section className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const current = tab.key === active;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={cn(
                "flex min-h-20 items-center gap-3 rounded-md border px-4 text-left transition focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2",
                current ? "border-sme-blue bg-sme-blue-soft text-sme-navy shadow-soft-sm" : "border-sme-line bg-white text-sme-ink hover:border-sme-blue"
              )}
              aria-pressed={current}
            >
              <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-md", current ? "bg-sme-blue text-white" : "bg-sme-surface text-sme-blue")}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-black">{tab.label}</span>
                <span className="mt-1 block text-xs leading-5 text-sme-muted">{tab.description}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-md border border-sme-line bg-sme-surface p-4">
        <div className="mb-4">
          <h2 className="text-lg font-black text-sme-ink">{selected.label}</h2>
          <p className="mt-1 text-sm text-sme-muted">{selected.description}</p>
        </div>
        <ActiveComponent />
      </div>
    </section>
  );
}
