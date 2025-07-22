// src/types/common.ts

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface CardProps {
  variant?: "default" | "elevated" | "bordered";
  className?: string;
  children: React.ReactNode;
}

export interface SectionProps {
  id?: string;
  className?: string;
  container?: boolean;
  children: React.ReactNode;
}

export interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface FileUploadProgress {
  [key: string]: number;
}

export interface ServiceCardProps {
  icon?: React.ComponentType<{ className?: string }>;
  imageUrl?: string;
  title: string;
  description: string;
  href: string;
}

export interface OptionType {
  value: string;
  label: string;
}

export interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: OptionType[];
  required?: boolean;
}

export interface ComponentConfig {
  type: string;
  props: Record<string, unknown | string | number | boolean>;
  children?: ComponentConfig[];
}

export interface RouteConfig {
  path: string;
  component: string;
  layout?: string;
  protected?: boolean;
}

