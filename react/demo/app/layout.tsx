import "./index.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Demo Fullstack Assets",
  description: "Demonstração de componentes reutilizáveis com PandaCSS",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
