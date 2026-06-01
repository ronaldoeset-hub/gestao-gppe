import type { Metadata } from "next";
import { EduConectaModulePage } from "@/components/educonecta-module-page";
import { modules } from "@/data/educonecta";

export const metadata: Metadata = {
  title: "Biblioteca SEI",
  description: "Modelos administrativos para ofícios, despachos, atas, pareceres e relatórios."
};

export default function BibliotecaSeiPage() {
  return <EduConectaModulePage module={modules["biblioteca-sei"]} />;
}
