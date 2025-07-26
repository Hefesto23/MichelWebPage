// src/types/common.ts - VERSÃO REFATORADA

// ============================================
// 🎨 TIPOS BASE
// ============================================
export interface BaseEntity {
  id: number | string;
  createdAt: string;
  updatedAt: string;
}

export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface WithLoading {
  loading?: boolean;
  error?: string | null;
}

export interface WithPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// ============================================
// 🔄 TIPOS DE RESPOSTA API
// ============================================
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
}

export interface PaginatedResponse<T> extends WithPagination {
  data: T[];
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  details?: Record<string, unknown>;
}

// ============================================
// 🔐 TIPOS DE AUTENTICAÇÃO
// ============================================
export interface AuthUser {
  id: number;
  email: string;
  name?: string;
  role?: "admin" | "user";
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

// ============================================
// 🎯 TIPOS DE FORMULÁRIO
// ============================================
export interface FormField<T = unknown> {
  name: keyof T;
  label: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "date"
    | "time";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: OptionType[];
  validation?: (value: unknown) => string | null;
  dependsOn?: keyof T;
}

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export interface OptionType {
  value: string;
  label: string;
  disabled?: boolean;
}

// ============================================
// 🗂️ TIPOS DE MÍDIA
// ============================================
export interface MediaFile extends BaseEntity {
  filename: string;
  originalName: string;
  url: string;
  path?: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  category?: string;
  tags?: string[];
  isActive: boolean;
}

export interface UploadProgress {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  result?: MediaFile;
}

// ============================================
// 📊 TIPOS DE DADOS
// ============================================
export interface TableColumn<T = unknown> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: "left" | "center" | "right";
  render?: (value: unknown, item: T, index: number) => React.ReactNode;
}

export interface FilterOption {
  field: string;
  operator:
    | "equals"
    | "contains"
    | "startsWith"
    | "endsWith"
    | "gt"
    | "lt"
    | "between";
  value: unknown;
}

export interface SortOption {
  field: string;
  direction: "asc" | "desc";
}

// ============================================
// 🏷️ TIPOS DE COMPONENTE
// ============================================
export interface CardProps extends BaseProps {
  variant?: "default" | "elevated" | "bordered" | "compact";
  interactive?: boolean;
  onClick?: () => void;
}

export interface ButtonProps extends BaseProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ModalProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

// ============================================
// 🔧 TIPOS DE CONFIGURAÇÃO
// ============================================
export interface RouteConfig {
  path: string;
  component: React.ComponentType<unknown>;
  layout?: React.ComponentType<unknown>;
  protected?: boolean;
  roles?: string[];
  exact?: boolean;
}

export interface MenuItemConfig {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  children?: MenuItemConfig[];
  divider?: boolean;
  disabled?: boolean;
}

export interface ThemeConfig {
  mode: "light" | "dark" | "auto";
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}

// ============================================
// 🔄 TIPOS DE ESTADO
// ============================================
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  error: Error | null;
  message?: string;
}

export interface SuccessState {
  isSuccess: boolean;
  message?: string;
}

export type AsyncState<T = unknown> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

// ============================================
// 🎨 TIPOS DE TEMA
// ============================================
export interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: ThemeConfig;
  setTheme: (theme: Partial<ThemeConfig>) => void;
}

// ============================================
// 📱 TIPOS DE DISPOSITIVO
// ============================================
export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  os?: string;
  browser?: string;
}

// ============================================
// 🔧 TIPOS UTILITÁRIOS
// ============================================
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ValueOf<T> = T[keyof T];
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
