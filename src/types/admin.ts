// ==========================================
// src/types/admin.ts
// ==========================================

import { SelectOption } from "./common";

/**
 * Interface do administrador
 */
export interface Admin {
  id: number;
  email: string;
  createdAt: string;
}

/**
 * Estatísticas do dashboard
 */
export interface DashboardStats {
  totalAppointments: number;
  monthlyAppointments: number;
  pageViews: number;
  newPatients: number;
  pendingAppointments: number;
  completedAppointments: number;
  totalImages: number;
  weeklyGrowth: number;
}

/**
 * Atividade recente
 */
export interface RecentActivity {
  action: string;
  user: string;
  time: string;
  type: "appointment" | "upload" | "content" | "analytics";
}

/**
 * Item de conteúdo CMS
 */
export interface ContentItem {
  id: number;
  page: string;
  section: string;
  key: string;
  type: "text" | "title" | "description" | "image" | "html";
  value: string;
  metadata?: Record<string, unknown>;
  isActive?: boolean;
  label?: string;
  placeholder?: string;
}

/**
 * Seção de página
 */
export interface PageSection {
  name: string;
  description: string;
  items: ContentItem[];
}

/**
 * Página de conteúdo
 */
export interface ContentPage {
  key: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  sections: number;
  lastUpdated: string;
}

/**
 * Imagem uploadada
 */
export interface UploadedImage {
  id: number;
  url: string;
  filename: string;
  originalName: string;
  path: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  category?: string;
  isActive?: boolean;
  status?: "uploading" | "success" | "error";
  error?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Progresso de upload
 */
export interface UploadProgress {
  [key: string]: number;
}

/**
 * Categoria de mídia
 */
export interface MediaCategory {
  key: string;
  name: string;
  description: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  lastUpdated: string;
}

/**
 * Estatísticas de mídia
 */
export interface MediaStats {
  totalImages: number;
  totalSize: string;
  recentUploads: number;
  categories: MediaCategory[];
}

/**
 * Dados de analytics - Visão geral
 */
export interface AnalyticsOverview {
  totalViews: number;
  weeklyViews: number;
  monthlyViews: number;
  uniqueVisitors: number;
  averageVisitDuration: string;
  bounceRate: string;
  conversionRate: string;
}

/**
 * Dados de analytics - Página
 */
export interface PageViewData {
  path: string;
  title: string;
  views: number;
  uniqueVisitors: number;
  averageTime: string;
  bounceRate: string;
}

/**
 * Dados de analytics - Série temporal
 */
export interface TimeSeriesData {
  date: string;
  views: number;
  visitors: number;
}

/**
 * Dados de analytics - Dispositivo
 */
export interface DeviceData {
  type: string;
  count: number;
  percentage: number;
}

/**
 * Dados de analytics - Fonte de tráfego
 */
export interface SourceData {
  source: string;
  visits: number;
  percentage: number;
}

/**
 * Dados completos de analytics
 */
export interface AnalyticsData {
  overview: AnalyticsOverview;
  topPages: PageViewData[];
  timeData: TimeSeriesData[];
  deviceData: DeviceData[];
  sourceData: SourceData[];
}

/**
 * Configuração do sistema
 */
export interface SystemSettings {
  id: string;
  label: string;
  description?: string;
  type: "text" | "textarea" | "switch" | "select" | "color" | "email";
  value: string | boolean;
  options?: SelectOption[];
}

/**
 * Seção de configurações
 */
export interface SettingsSection {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  settings: SystemSettings[];
}
