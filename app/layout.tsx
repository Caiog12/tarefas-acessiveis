import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minhas tarefas",
  description: "Lista de tarefas pessoal e acessível.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body><main>{children}</main></body>
    </html>
  );
}
