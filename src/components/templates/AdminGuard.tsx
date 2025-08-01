// src/components/templates/AdminGuard.tsx
"use client";

import { AdminDashboardSkeleton } from "@/components/shared/transitions";
import { ReactNode, useEffect, useState } from "react";

interface AdminGuardProps {
  children: ReactNode;
}

export const AdminGuard = ({ children }: AdminGuardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Fix hidratação do Next.js App Router
  useEffect(() => {
    setMounted(true);
    // Simples delay para hidratação
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Se não montou ainda, mostra skeleton
  if (!mounted) {
    return (
      <AdminDashboardSkeleton isLoading={true}>
        {children}
      </AdminDashboardSkeleton>
    );
  }

  // O middleware já protege as rotas, então só precisamos do skeleton
  return (
    <AdminDashboardSkeleton isLoading={isLoading}>
      {children}
    </AdminDashboardSkeleton>
  );
};
