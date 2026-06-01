import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Controle financeiro",
  description: "Redirecionamento para o painel público de controle financeiro."
};

export default function ControleFinanceiroPage() {
  redirect("/controle-financeiro/index.html");
}
