// src/hooks/useAuth.ts - VERSÃO SIMPLIFICADA
import {
  type AuthUser,
  getCurrentUser,
  hasValidToken,
  isAuthenticated,
  logoutUser,
} from "@/lib/auth";
import { useCallback, useEffect, useState } from "react";

// ============================================
// 🏗️ TIPOS SIMPLIFICADOS
// ============================================
interface UseAuthReturn {
  // Estado
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Ações
  logout: () => Promise<void>;
}

// ============================================
// 🎣 HOOK useAuth SIMPLIFICADO
// ============================================
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ============================================
  // 🔍 VERIFICAR AUTENTICAÇÃO (sem auto-logout)
  // ============================================
  const checkAuth = useCallback(() => {
    try {
      const currentUser = getCurrentUser();
      const authenticated = isAuthenticated();

      if (authenticated && currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Erro ao verificar autenticação:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============================================
  // 🚪 LOGOUT
  // ============================================
  const logout = useCallback(async () => {
    setUser(null);
    await logoutUser();
  }, []);

  // ============================================
  // ⚡ EFEITO INICIAL
  // ============================================
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthenticated: !!user && hasValidToken(),
    isLoading,
    logout,
  };
};

// ============================================
// 🔍 HOOK SIMPLES PARA VERIFICAÇÃO RÁPIDA
// ============================================
export const useAuthCheck = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = getCurrentUser();
        const valid = hasValidToken();
        setIsAuth(user !== null && valid);
      } catch {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated: isAuth, loading };
};