// ============================================
// 10. src/app/admin/layout.tsx
// ============================================
"use client";

import { roboto } from "@/app/fonts";
import { AdminSidebar } from "@/components/pages/admin";
import { cn } from "@/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar se é a página de login (que tem seu próprio layout)
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Se for página de login, não fazer verificação de autenticação aqui
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin/login");
      } else {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, [router, isLoginPage]);

  // Se for página de login, renderizar sem layout admin
  if (isLoginPage) {
    return (
      <div
        className={cn(
          "min-h-screen bg-gray-50 dark:bg-gray-900",
          roboto.className
        )}
      >
        {children}
      </div>
    );
  }

  // Loading state para outras páginas admin
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-foreground"></div>
      </div>
    );
  }

  // Se não autenticado, não renderizar nada (já redirecionado)
  if (!isAuthenticated) {
    return null;
  }

  // Layout padrão admin com sidebar para todas as outras páginas
  return (
    <div
      className={cn(
        "min-h-screen flex bg-gray-50 dark:bg-gray-900",
        roboto.className
      )}
    >
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="bg-gray-50 dark:bg-gray-900 min-h-full">{children}</div>
      </main>
    </div>
  );
}
