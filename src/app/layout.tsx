// ============================================
// app/layout.tsx - Layout Raiz CORRIGIDO com Dark Mode
// ============================================
"use client";

import { robotoSlab } from "@/app/fonts";
import { Footer, Header } from "@/components/layout"; // ✅ COMPONENTES ORIGINAIS
import { ThemeProvider } from "@/components/providers";
import {
  SectionNavigator,
  WhatsAppButton,
} from "@/components/shared/navigation"; // ✅ NAVEGAÇÃO ORIGINAL
import { PageTransition } from "@/components/shared/transitions";
import { useDarkMode } from "@/hooks/useDarkMode"; // ✅ HOOK ORIGINAL
import { cn } from "@/utils/utils";
import "@styles/globals.css";
import { usePathname } from "next/navigation";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isDarkMode, toggleDarkMode, mounted } = useDarkMode();
  const pathname = usePathname();

  const isHomePage = pathname === "/";
  const isAdminPage = pathname.startsWith("/admin");
  const showWhatsApp = !isAdminPage;
  const showSectionNav = isHomePage;

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminPage && (
        <Header
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          mounted={mounted}
        />
      )}

      {isAdminPage ? (
        <main className="flex-1">{children}</main>
      ) : (
        <PageTransition isDarkMode={isDarkMode}>
          <main className="flex-1">{children}</main>
        </PageTransition>
      )}

      {!isAdminPage && <Footer />}

      {showWhatsApp && <WhatsAppButton />}
      {showSectionNav && <SectionNavigator />}
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 
                             (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.classList.toggle('dark', theme === 'dark');
              } catch {}
            `,
          }}
        />
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <LayoutContent>{children}</LayoutContent>
        </ThemeProvider>
      </body>
    </html>
  );
}
