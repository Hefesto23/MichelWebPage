// src/hooks/useAuthLogin.ts - Hook específico para página de login
import {
  type AuthUser,
  getCurrentUser,
  hasValidToken,
  isAuthenticated,
  loginUser,
  logoutUser,
} from "@/lib/auth";
import { useCallback, useEffect, useState } from "react";

interface UseAuthLoginReturn {
  // Estado
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Ações
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthLogin = (): UseAuthLoginReturn => {
  // Estados
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Não carrega automaticamente
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // 🔍 VERIFICAR AUTENTICAÇÃO (sem auto-logout)
  // ============================================
  const checkAuth = useCallback(() => {
    try {
      const currentUser = getCurrentUser();
      const authenticated = isAuthenticated();
      console.log("useAuthLogin checkAuth:", { currentUser, authenticated });

      if (authenticated && currentUser) {
        setUser(currentUser);
        console.log("useAuthLogin - Usuário autenticado:", currentUser);
      } else {
        setUser(null);
        console.log("useAuthLogin - Usuário não autenticado");
      }
    } catch (err) {
      console.error("useAuthLogin - Erro ao verificar autenticação:", err);
      setUser(null);
    }
  }, []);

  // ============================================
  // 🔐 LOGIN
  // ============================================
  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await loginUser(email, password);
        console.log("useAuthLogin - Resultado do login:", result);

        if (result.success) {
          checkAuth();
          console.log("useAuthLogin - Login bem-sucedido, checando auth...");
          return true;
        } else {
          setError(result.error || "Erro no login");
          console.log("useAuthLogin - Login falhou:", result.error);
          return false;
        }
      } catch (err) {
        console.error("useAuthLogin - Erro no login:", err);
        setError("Erro de conexão");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [checkAuth]
  );

  // ============================================
  // 🚪 LOGOUT
  // ============================================
  const logout = useCallback(async () => {
    setUser(null);
    setError(null);
    await logoutUser();
  }, []);

  // ============================================
  // 🧹 LIMPAR ERRO
  // ============================================
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================
  // ⚡ EFEITOS - apenas verifica auth inicial
  // ============================================
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    // Estado
    user,
    isAuthenticated: !!user && hasValidToken(),
    isLoading,
    error,

    // Ações
    login,
    logout,
    clearError,
  };
};