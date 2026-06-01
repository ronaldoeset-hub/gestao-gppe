import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Início",
  description: "Redirecionamento para o painel principal do Gestão GPPE."
};

export default function Home() {
  redirect("/dashboard");
}
