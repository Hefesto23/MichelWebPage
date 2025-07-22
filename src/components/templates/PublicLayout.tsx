// ============================================
// src/components/templates/PublicLayout.tsx
// ============================================
"use client";

import { Header, Footer, PageTransition } from "@/components/layout";
import {
  WhatsAppButton,
  SectionNavigator,
} from "@/components/shared/navigation";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useAuth } from "@/hooks/useAuth";

interface PublicLayoutProps {
  children: React.ReactNode;
  showWhatsApp?: boolean;
  showSectionNav?: boolean;
  className?: string;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  showWhatsApp = true,
  showSectionNav = false,
  className = "",
}) => {
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const { isAdminLogged } = useAuth();

  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <Header
        isDarkMode={isDarkMode}
        isAdminLogged={isAdminLogged}
        toggleDarkMode={toggleDarkMode}
      />

      <PageTransition isDarkMode={isDarkMode}>
        <main className="flex-1">{children}</main>
      </PageTransition>

      <Footer />

      {showWhatsApp && <WhatsAppButton />}
      {showSectionNav && <SectionNavigator />}
    </div>
  );
};
