// ============================================
// app/layout.tsx - Layout Raiz CORRIGIDO com Dark Mode
// ============================================
"use client";

import { robotoSlab } from "@/app/fonts";
import { Footer, Header } from "@/components/layout"; // ✅ COMPONENTES ORIGINAIS
import {
  SectionNavigator,
  WhatsAppButton,
} from "@/components/shared/navigation"; // ✅ NAVEGAÇÃO ORIGINAL
import PageTransition from "@/components/shared/transitions/PageTransition";
// import { useAuth } from "@/hooks/useAuth"; // ✅ HOOK ORIGINAL
import { useDarkMode } from "@/hooks/useDarkMode"; // ✅ HOOK ORIGINAL
import { cn } from "@/utils/utils";
import "@styles/globals.css";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ HOOKS ORIGINAIS MANTIDOS
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  // const { isAdminLogged } = useAuth();
  const pathname = usePathname();

  // ✅ LÓGICA ORIGINAL PARA MOSTRAR COMPONENTES
  const isHomePage = pathname === "/";
  const isAdminPage = pathname.startsWith("/admin");
  const showWhatsApp = !isAdminPage;
  const showSectionNav = isHomePage;

  return (
    <html
      lang="pt-BR"
      className={isDarkMode ? "dark" : ""} // ✅ CLASSE DARK APLICADA CORRETAMENTE
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          robotoSlab.variable
        )}
        suppressHydrationWarning
      >
        {/* ✅ ESTRUTURA ORIGINAL PRESERVADA */}
        <div className="min-h-screen flex flex-col">
          {/* ✅ HEADER ORIGINAL COM DARK MODE */}
          {!isAdminPage && (
            <Header
              isDarkMode={isDarkMode}
              isAdminLogged={false}
              toggleDarkMode={toggleDarkMode}
            />
          )}

          {/* ✅ MAIN CONTENT COM TRANSIÇÕES */}
          <PageTransition isDarkMode={isDarkMode}>
            <main className="flex-1">{children}</main>
          </PageTransition>

          {/* ✅ FOOTER ORIGINAL */}
          {!isAdminPage && <Footer />}

          {/* ✅ COMPONENTES FLUTUANTES ORIGINAIS */}
          {showWhatsApp && <WhatsAppButton />}
          {showSectionNav && <SectionNavigator />}
        </div>
      </body>
    </html>
  );
}
