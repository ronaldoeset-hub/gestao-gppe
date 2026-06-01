import type { Metadata } from "next";
import { EduConectaModulePage } from "@/components/educonecta-module-page";
import { modules } from "@/data/educonecta";

export const metadata: Metadata = {
  title: "Redes sociais",
  description: "Planejamento e visão operacional dos canais sociais da comunicação educacional."
};

export default function RedesSociaisPage() {
  return <EduConectaModulePage module={modules["redes-sociais"]} />;
}
