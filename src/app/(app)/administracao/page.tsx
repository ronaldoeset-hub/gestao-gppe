import { EduConectaModulePage } from "@/components/educonecta-module-page";
import { modules } from "@/data/educonecta";

export default function AdministracaoPage() {
  return <EduConectaModulePage module={modules.administracao} />;
}
