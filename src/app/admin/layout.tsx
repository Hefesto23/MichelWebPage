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
  
  // Forçar re-verificação quando localStorage mudar (logout)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      if (!token && isAuthenticated) {
        // Token foi removido (logout), forçar re-verificação
        setIsAuthenticated(false);
        setLoading(true);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isAuthenticated]);

  // Verificar se é a página de login (que tem seu próprio layout)
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Se for página de login, não fazer verificação de autenticação aqui
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        router.replace("/admin/login");
        return;
      }

      try {
        // Verificar token com o servidor
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.valid) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            router.replace("/admin/login");
          }
        } else {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          router.replace("/admin/login");
        }
      } catch (error) {
        console.error("Erro na verificação de autenticação:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        router.replace("/admin/login");
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

  // SEMPRE mostrar loading ou bloquear acesso até verificação completa
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {loading ? "Verificando autenticação..." : "Redirecionando..."}
          </p>
        </div>
      </div>
    );
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
