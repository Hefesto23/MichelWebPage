// ==========================================
// src/hooks/useAuth.ts
// ==========================================
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { authApi } from "@/services/api/client";

interface User {
  id: number;
  email: string;
}

interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  isAdminRoute: boolean;
  isLoginPage: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Verificar tipo de rota
  const isAdminRoute = pathname?.startsWith("/admin") || false;
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Se for página de login, não verificar autenticação
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    // Verificar autenticação apenas em rotas admin
    if (isAdminRoute) {
      checkAuth();
    } else {
      // Para rotas públicas, apenas verifica se tem token (para mostrar botão admin)
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
      setIsLoading(false);
    }
  }, [isAdminRoute, isLoginPage, pathname]);

  const checkAuth = () => {
    const token = localStorage.getItem("token");

    if (!token && isAdminRoute && !isLoginPage) {
      router.push("/admin/login");
      setIsAuthenticated(false);
    } else if (token) {
      setIsAuthenticated(true);
      // TODO: Decodificar token JWT para obter dados do usuário
      setUser({ id: 1, email: "admin@clinica.com" });
    }

    setIsLoading(false);
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.post<{ token: string }>("/login", {
        email,
        password,
      });

      if (response.token) {
        localStorage.setItem("token", response.token);
        setIsAuthenticated(true);
        setUser({ id: 1, email });
        return { success: true };
      }

      return { success: false, error: "Credenciais inválidas" };
    } catch (error) {
      console.error("Erro no login:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro no servidor",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    router.push("/admin/login");
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    isAdminRoute,
    isLoginPage,
    login,
    logout,
    checkAuth,
  };
};
