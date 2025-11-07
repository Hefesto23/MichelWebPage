// src/app/admin/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminRedirect() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          // Token existe, verificar se é válido
          try {
            // Parse basic JWT validation (without verification for client-side)
            const tokenPayload = JSON.parse(atob(token.split(".")[1]));
            const currentTime = Date.now() / 1000;

            if (tokenPayload.exp > currentTime) {
              // Token válido, redirecionar para dashboard
              router.replace("/admin/dashboard");
              return;
            }
          } catch {
            // Token inválido, remover e continuar para login
            localStorage.removeItem("token");
          }
        }

        // Sem token válido, redirecionar para login
        router.replace("/admin/login");
      } catch (error) {
        console.error("Erro na verificação de autenticação:", error);
        router.replace("/admin/login");
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  // Loading state enquanto verifica autenticação
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Não renderizar nada após redirecionamento
  return null;
}
