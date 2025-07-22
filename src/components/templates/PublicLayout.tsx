// ============================================
// src/components/templates/PublicLayout.tsx
// ============================================
"use client";

import { Footer, Header } from "@/components/layout";
import {
  SectionNavigator,
  WhatsAppButton,
} from "@/components/shared/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useDarkMode } from "@/hooks/useDarkMode";

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
