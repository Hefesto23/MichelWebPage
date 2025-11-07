// src/lib/auth.ts - CENTRALIZADOR DE AUTENTICAÇÃO
import jwt from "jsonwebtoken";

// ============================================
// 🔧 CONFIGURAÇÕES
// ============================================
const SECRET_KEY = process.env.JWT_SECRET || "minha-chave-secreta";
const TOKEN_KEY = "token";
const TOKEN_EXPIRY = "8h"; // Aumentado para 8 horas para melhor UX

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
    // Também salva em cookie para SSR
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${60 * 60}; SameSite=Strict; Secure=${
      window.location.protocol === "https:"
    }`;
  }
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    // Primeiro tenta localStorage
    let token = localStorage.getItem(TOKEN_KEY);
    
    // Se não tiver no localStorage, tenta cookie
    if (!token) {
      const cookies = document.cookie.split(";");
      const tokenCookie = cookies.find(cookie => 
        cookie.trim().startsWith(`${TOKEN_KEY}=`)
      );
      if (tokenCookie) {
        token = tokenCookie.split("=")[1];
        // Sincroniza com localStorage
        localStorage.setItem(TOKEN_KEY, token);
      }
    }
    
    return token;
  }
  return null;
};

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    // Remove cookie também
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`;
  }
};

export const hasValidToken = (): boolean => {
  const token = getToken();
  const expired = token ? isTokenExpired(token) : true;
  const isValid = token ? !expired : false;
  console.log("hasValidToken - Token:", token ? "existe" : "não existe", "Expired:", expired, "Valid:", isValid);
  return isValid;
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

export const logoutUser = async (): Promise<void> => {
  try {
    // Chama API de logout para limpar cookies do servidor
    await fetch("/api/auth/logout", { 
      method: "POST",
      headers: createAuthHeaders(),
    });
  } catch (error) {
    console.error("Erro ao fazer logout no servidor:", error);
  } finally {
    // Remove token local independente do resultado da API
    removeToken();
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
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

export const handleAuthError = (response: Response): boolean => {
  if (response.status === 401) {
    removeToken();
    alert("Sua sessão expirou. Você será redirecionado para o login.");
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    return true;
  }
  return false;
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

  const response = await fetch(url, { ...options, headers });
  
  // Auto-handle 401 errors
  if (handleAuthError(response)) {
    throw new Error("Authentication expired");
  }
  
  return response;
};

// ============================================
// 📊 USER FUNCTIONS
// ============================================
export const getCurrentUser = (): AuthUser | null => {
  const token = getToken();
  console.log("getCurrentUser - Token:", token ? "existe" : "não existe");
  if (!token) return null;

  const payload = verifyToken(token);
  console.log("getCurrentUser - Payload:", payload);
  if (!payload) return null;

  const user = {
    id: payload.adminId,
    email: payload.email || "",
    role: "admin",
  };
  console.log("getCurrentUser - User:", user);
  return user;
};

export const isAuthenticated = (): boolean => {
  return hasValidToken();
};
