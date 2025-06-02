// ==========================================
// src/types/common.ts
// ==========================================
/**
 * Resposta padrão da API
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Resposta paginada
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Opção de select
 */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Dados de imagem
 */
export interface ImageData {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  title?: string;
}

/**
 * Imagem da galeria
 */
export interface GalleryImage {
  original: string;
  thumbnail?: string;
  originalAlt?: string;
  originalTitle?: string;
  description?: string;
}

/**
 * Item de serviço
 */
export interface ServiceItem {
  icon?: React.ComponentType<{ className?: string }>;
  imageUrl?: string;
  title: string;
  description: string;
  href: string;
}

/**
 * Citação/Quote
 */
export interface Quote {
  info: string;
  info2?: string;
  info3?: string;
  detail: string;
  backgroundImage: string;
}

/**
 * Link de navegação
 */
export interface NavLink {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
}

/**
 * Dados de formulário de contato
 */
export interface ContactFormData {
  nome: string;
  email: string;
  telefone: string;
  assunto: string;
  mensagem: string;
}

/**
 * Status de formulário
 */
export interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

/**
 * Erros de validação
 */
export interface ValidationErrors {
  [field: string]: string;
}

/**
 * Usuário autenticado
 */
export interface AuthUser {
  id: number;
  email: string;
  role: "admin" | "user";
}

/**
 * Token JWT decodificado
 */
export interface DecodedToken {
  adminId?: number;
  userId?: number;
  email: string;
  exp: number;
  iat: number;
}

/**
 * Tema da aplicação
 */
export type Theme = "light" | "dark";

/**
 * Breakpoints responsivos
 */
export type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

/**
 * Variantes de componentes
 */
export type ComponentVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

/**
 * Tamanhos de componentes
 */
export type ComponentSize = "xs" | "sm" | "md" | "lg" | "xl";
