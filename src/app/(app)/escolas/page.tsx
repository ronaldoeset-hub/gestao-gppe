import { EduConectaModulePage } from "@/components/educonecta-module-page";
import { modules } from "@/data/educonecta";

export default function EscolasPage() {
  return <EduConectaModulePage module={modules.escolas} />;
}
