import type { Metadata } from "next";
import { EduConectaModulePage } from "@/components/educonecta-module-page";
import { modules } from "@/data/educonecta";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Indicadores de acesso, downloads, origem e uso da plataforma GPPE."
};

export default function AnalyticsPage() {
  return <EduConectaModulePage module={modules.analytics} />;
}
