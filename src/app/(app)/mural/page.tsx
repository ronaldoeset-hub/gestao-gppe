import type { Metadata } from "next";
import { EduConectaModulePage } from "@/components/educonecta-module-page";
import { modules } from "@/data/educonecta";

export const metadata: Metadata = {
  title: "Mural",
  description: "Avisos, publicações, eventos e comunicados acompanhados pelo GPPE."
};

export default function MuralPage() {
  return <EduConectaModulePage module={modules.mural} />;
}
