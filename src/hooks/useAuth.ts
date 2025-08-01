// src/hooks/useAuth.ts
import {
  type AuthUser,
  getCurrentUser,
  hasValidToken,
  isAuthenticated,
  loginUser,
  logoutUser,
} from "@/lib/auth";
import { useCallback, useEffect, useState } from "react";

// ============================================
// 🏗️ TIPOS
// ============================================
interface UseAuthReturn {
  // Estado
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Ações
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
  clearError: () => void;
}

// ============================================
// 🎣 HOOK useAuth
// ============================================
export const useAuth = (): UseAuthReturn => {
  // Estados
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // 🔍 VERIFICAR AUTENTICAÇÃO
  // ============================================
  const checkAuth = useCallback(() => {
    setIsLoading(true);
    setError(null);

    try {
      const currentUser = getCurrentUser();
      const authenticated = isAuthenticated();

      if (authenticated && currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        // Se tem token inválido, remove
        if (!hasValidToken()) {
          logoutUser();
        }
      }
    } catch (err) {
      console.error("Erro ao verificar autenticação:", err);
      setError("Erro ao verificar autenticação");
      setUser(null);
    } finally {
      setIsLoading(false);
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

        if (result.success) {
          // Recarrega os dados do usuário após login
          checkAuth();
          return true;
        } else {
          setError(result.error || "Erro no login");
          return false;
        }
      } catch (err) {
        console.error("Erro no login:", err);
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
  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    logoutUser(); // Já redireciona
  }, []);

  // ============================================
  // 🧹 LIMPAR ERRO
  // ============================================
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================
  // ⚡ EFEITOS
  // ============================================
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Auto-logout quando token expira
  useEffect(() => {
    if (!isLoading && user && !hasValidToken()) {
      logout();
    }
  }, [user, isLoading, logout]);

  // ============================================
  // 📤 RETORNO
  // ============================================
  return {
    // Estado
    user,
    isAuthenticated: !!user && isAuthenticated(),
    isLoading,
    error,

    // Ações
    login,
    logout,
    checkAuth,
    clearError,
  };
};

// ============================================
// 🎯 HOOK SIMPLIFICADO (para casos específicos)
// ============================================
export const useAuthCheck = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsAuth(isAuthenticated());
    setLoading(false);
  }, []);

  return { isAuthenticated: isAuth, loading };
};

// ============================================
// 🔐 HOOK PARA PROTEÇÃO DE ROTAS (Client-side)
// ============================================
export const useAuthGuard = (redirectTo: string = "/admin/login") => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return { isAuthenticated, isLoading };
};
