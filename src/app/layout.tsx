import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Gestão de Recursos e Conselhos - GPPE",
    template: "%s | GPPE"
  },
  description: "Sistema interno para gestão de recursos, conselhos escolares e prestação de contas da SME.",
  openGraph: {
    title: "Gestão de Recursos e Conselhos - GPPE",
    description: "Painel interno para gestão escolar, conselhos, prazos, documentos e recursos.",
    type: "website",
    locale: "pt_BR"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
