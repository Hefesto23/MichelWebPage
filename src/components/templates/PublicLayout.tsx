// ============================================
// components/templates/PublicLayout.tsx - SIMPLIFICADO
// ============================================
"use client";

interface PublicLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  className = "",
}) => {
  // ✅ AGORA APENAS UM WRAPPER SIMPLES
  // A lógica de dark mode está no layout raiz
  return <div className={className}>{children}</div>;
};
