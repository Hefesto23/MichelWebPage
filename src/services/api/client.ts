// ==========================================
// src/services/api/client.ts
// ==========================================
export interface ApiConfig {
  baseURL?: string;
  headers?: Record<string, string>;
}

export interface ApiError {
  error: string;
  status?: number;
  details?: unknown;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiConfig = {}) {
    this.baseURL = config.baseURL || "";
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...config.headers,
    };
  }

  /**
   * Obtém o header de autenticação se disponível
   */
  private getAuthHeader(): Record<string, string> {
    if (typeof window === "undefined") return {};

    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Faz uma requisição HTTP
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeader(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw new Error(
          error.error || `HTTP error! status: ${response.status}`
        );
      }

      // Se não houver conteúdo, retorna objeto vazio
      const text = await response.text();
      return text ? JSON.parse(text) : ({} as T);
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  /**
   * GET request
   */
  get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request<T>(`${endpoint}${queryString}`, { method: "GET" });
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  /**
   * Upload de arquivo
   */
  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const headers = {
      ...this.getAuthHeader(),
      // Remove Content-Type para deixar o browser definir com boundary
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiError;
      throw new Error(error.error || "Upload failed");
    }

    return response.json();
  }
}

// Instância padrão do cliente API
export const apiClient = new ApiClient();

// Clientes específicos para diferentes APIs
export const appointmentApi = new ApiClient({ baseURL: "/api/calendario" });
export const adminApi = new ApiClient({ baseURL: "/api/admin" });
export const authApi = new ApiClient({ baseURL: "/api/auth" });
