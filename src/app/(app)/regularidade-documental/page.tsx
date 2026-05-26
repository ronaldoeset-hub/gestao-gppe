import { EduConectaModulePage } from "@/components/educonecta-module-page";
import { modules } from "@/data/educonecta";

export default function DocumentRegularityPage() {
  return <EduConectaModulePage module={modules["regularidade-documental"]} />;
}
