import type { Metadata } from "next";
import { EduConectaModulePage } from "@/components/educonecta-module-page";
import { modules } from "@/data/educonecta";

export const metadata: Metadata = {
  title: "Feedback",
  description: "Sugestões, avaliações e retorno de usuários sobre a plataforma GPPE."
};

export default function FeedbackPage() {
  return <EduConectaModulePage module={modules.feedback} />;
}
