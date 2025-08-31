// Tipos core usados em todo o projeto

export interface BaseEntity {
  id: number | string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface WithLoading {
  loading?: boolean;
  error?: string | null;
}

export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

// Utilities TypeScript
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;