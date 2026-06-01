import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Escolas",
  description: "Redirecionamento para o cadastro de unidades escolares do GPPE."
};

export default function EscolasPage() {
  redirect("/unidades");
}
