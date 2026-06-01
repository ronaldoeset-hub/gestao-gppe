import type { Metadata } from "next";
import { EduConectaModulePage } from "@/components/educonecta-module-page";
import { modules } from "@/data/educonecta";

export const metadata: Metadata = {
  title: "IA Educacional",
  description: "Área de apoio para rascunhos administrativos e checklists educacionais."
};

export default function IaEducacionalPage() {
  return <EduConectaModulePage module={modules["ia-educacional"]} />;
}
