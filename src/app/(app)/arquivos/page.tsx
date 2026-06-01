import type { Metadata } from "next";
import { EduConectaModulePage } from "@/components/educonecta-module-page";
import { modules } from "@/data/educonecta";

export const metadata: Metadata = {
  title: "Arquivos",
  description: "Organização e consulta visual de arquivos administrativos do GPPE."
};

export default function ArquivosPage() {
  return <EduConectaModulePage module={modules.arquivos} />;
}
