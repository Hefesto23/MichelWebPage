"use client"; // Adicione isso na primeira linha

import "@/app/globals.css"; // Estilos globais
import { Footer } from "@/components/common/footer";
import { useDarkMode } from "@/hooks/useDarkMode";
import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useState } from "react";
import { Header } from "../components/common/header";
import { roboto } from "./fonts";

interface LayoutProps {
  children: ReactNode;
}

// export const metadata = {
//   title: "Consultório de Psicologia",
//   description:
//     "Página elegante para agendamento de consultas com suporte a modo escuro.",
// };

export default function RootLayout({ children }: LayoutProps) {
  // Usando o hook useDarkMode
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  const [isAdminLogged, setIsAdminLogged] = useState(false);

  useEffect(() => {
    // Verifica se o token do admin existe no localStorage
    const token = localStorage.getItem("token");
    setIsAdminLogged(!!token);
  }, []);

  return (
    <html lang="pt-BR" className={isDarkMode ? "dark" : ""}>
      <body>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <Header
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            isAdminLogged={isAdminLogged}
          />
          {/* Main Content */}
          <main className={cn("flex-grow py-0 bg-primary", roboto.className)}>
            {children}
          </main>
          {/* Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
