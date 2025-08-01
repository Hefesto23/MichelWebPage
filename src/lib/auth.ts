// src/lib/auth.ts - CENTRALIZADOR DE AUTENTICAÇÃO
import jwt from "jsonwebtoken";

// ============================================
// 🔧 CONFIGURAÇÕES
// ============================================
const SECRET_KEY = process.env.JWT_SECRET || "minha-chave-secreta";
const TOKEN_KEY = "token";
const TOKEN_EXPIRY = "1h";

// ============================================
// 🏗️ TIPOS
// ============================================
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export interface AuthTokenPayload {
  adminId: string;
  email?: string;
  iat?: number;
  exp?: number;
}

// ============================================
// 🔐 JWT FUNCTIONS
// ============================================
export const generateToken = (adminId: number, email?: string): string => {
  return jwt.sign({ adminId, email }, SECRET_KEY, { expiresIn: TOKEN_EXPIRY });
};

export const verifyToken = (token: string): AuthTokenPayload | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as AuthTokenPayload;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as { exp?: number };
    return decoded?.exp ? Date.now() >= decoded.exp * 1000 : true;
  } catch {
    return true;
  }
};

// ============================================
// 💾 STORAGE FUNCTIONS (CLIENT-SIDE)
// ============================================
export const saveToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const hasValidToken = (): boolean => {
  const token = getToken();
  return token ? !isTokenExpired(token) : false;
};

// ============================================
// 🌐 API FUNCTIONS
// ============================================
export const loginUser = async (
  email: string,
  password: string
): Promise<{ success: boolean; token?: string; error?: string }> => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      saveToken(data.token);
      return { success: true, token: data.token };
    }

    return { success: false, error: data.error || "Credenciais inválidas" };
  } catch {
    return { success: false, error: "Erro de conexão" };
  }
};

export const logoutUser = (): void => {
  removeToken();
  if (typeof window !== "undefined") {
    window.location.href = "/admin/login";
  }
};

// ============================================
// 🔍 VALIDATION FUNCTIONS
// ============================================
export const extractTokenFromHeader = (
  authHeader: string | null
): string | null => {
  return authHeader?.replace("Bearer ", "") || null;
};

export const validateAuthHeader = (
  authHeader: string | null
): AuthTokenPayload | null => {
  const token = extractTokenFromHeader(authHeader);
  return token ? verifyToken(token) : null;
};

// ============================================
// 🛡️ MIDDLEWARE HELPERS
// ============================================
export const isProtectedRoute = (pathname: string): boolean => {
  return pathname.startsWith("/admin") && pathname !== "/admin/login";
};

export const getRedirectUrl = (pathname: string): string => {
  return isProtectedRoute(pathname) ? "/admin/login" : "/";
};

// ============================================
// ⚡ REQUEST HELPERS
// ============================================
export const createAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const headers = {
    "Content-Type": "application/json",
    ...createAuthHeaders(),
    ...options.headers,
  };

  return fetch(url, { ...options, headers });
};

// ============================================
// 📊 USER FUNCTIONS
// ============================================
export const getCurrentUser = (): AuthUser | null => {
  const token = getToken();
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  return {
    id: payload.adminId,
    email: payload.email || "",
    role: "admin", // Por enquanto fixo, pode vir do token depois
  };
};

export const isAuthenticated = (): boolean => {
  return hasValidToken();
};
