// src/app/layout.tsx - LAYOUT PRINCIPAL ATUALIZADO

"use client";

import { Footer } from "@/components/common/footer";
import PageTransition from "@/components/common/page-transition";
import WhatsAppButton from "@/components/common/whatsapp-icon";
import { useDarkMode } from "@/hooks/useDarkMode";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Header } from "../components/common/header";
import { roboto } from "./fonts";

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [isAdminLogged, setIsAdminLogged] = useState(false);
  const pathname = usePathname();

  // Verificar se é rota administrativa
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    // Só verificar token se não for rota admin (evita conflito)
    if (!isAdminRoute) {
      const token = localStorage.getItem("token");
      setIsAdminLogged(!!token);
    }
  }, [isAdminRoute]);

  return (
    <html lang="pt-BR" className={isDarkMode ? "dark" : ""}>
      <body>
        {isAdminRoute ? (
          // Layout específico para admin (sem header, footer, transições)
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className={cn("min-h-screen", roboto.className)}>
              {children}
            </main>
          </div>
        ) : (
          // Layout padrão do site
          <div className="min-h-screen flex flex-col">
            <Header
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              isAdminLogged={isAdminLogged}
            />
            <main className={cn("flex-grow py-0 bg-primary", roboto.className)}>
              <PageTransition isDarkMode={isDarkMode}>
                {children}
              </PageTransition>
              <WhatsAppButton />
            </main>
            <Footer />
          </div>
        )}
      </body>
    </html>
  );
}
