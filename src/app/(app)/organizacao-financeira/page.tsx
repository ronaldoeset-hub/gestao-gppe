import { EduConectaModulePage } from "@/components/educonecta-module-page";
import { modules } from "@/data/educonecta";

export default function FinancialOrganizationPage() {
  return <EduConectaModulePage module={modules["organizacao-financeira"]} />;
}
