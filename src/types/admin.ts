// src/types/admin.ts - VERSÃO REFATORADA

import { AppointmentStats } from "./appointment";
import { BaseEntity, TableColumn, WithPagination } from "./common";

// ============================================
// 👤 TIPOS DE USUÁRIO ADMIN
// ============================================
export interface AdminUser extends BaseEntity {
  email: string;
  name?: string;
  role: AdminRole;
  permissions: AdminPermission[];
  lastLogin?: string;
  isActive: boolean;
}

export enum AdminRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  MANAGER = "manager",
  VIEWER = "viewer",
}

export enum AdminPermission {
  // Appointments
  VIEW_APPOINTMENTS = "view_appointments",
  CREATE_APPOINTMENTS = "create_appointments",
  EDIT_APPOINTMENTS = "edit_appointments",
  DELETE_APPOINTMENTS = "delete_appointments",

  // Content
  VIEW_CONTENT = "view_content",
  EDIT_CONTENT = "edit_content",

  // Media
  VIEW_MEDIA = "view_media",
  UPLOAD_MEDIA = "upload_media",
  DELETE_MEDIA = "delete_media",

  // Analytics
  VIEW_ANALYTICS = "view_analytics",
  EXPORT_ANALYTICS = "export_analytics",

  // Settings
  VIEW_SETTINGS = "view_settings",
  EDIT_SETTINGS = "edit_settings",

  // Users
  MANAGE_USERS = "manage_users",
}

// ============================================
// 📄 TIPOS DE CONTEÚDO
// ============================================
export interface ContentItem extends BaseEntity {
  page: string;
  section: string;
  key: string;
  type: ContentType;
  value: string;
  metadata?: ContentMetadata;
  isActive: boolean;
  version?: number;
  lastEditedBy?: string;
}

export enum ContentType {
  TEXT = "text",
  TITLE = "title",
  DESCRIPTION = "description",
  IMAGE = "image",
  HTML = "html",
  MARKDOWN = "markdown",
  JSON = "json",
}

export interface ContentMetadata {
  maxLength?: number;
  minLength?: number;
  allowedFormats?: string[];
  dimensions?: {
    width: number;
    height: number;
  };
  [key: string]: unknown;
}

export interface ContentPage {
  key: string;
  name: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  sections: ContentSection[];
  lastUpdated: string;
  isEditable: boolean;
}

export interface ContentSection {
  key: string;
  name: string;
  description?: string;
  items: ContentItem[];
  order: number;
}

// ============================================
// 📊 TIPOS DE ANALYTICS
// ============================================
export interface AnalyticsData extends BaseEntity {
  event: AnalyticsEvent;
  page?: string;
  section?: string;
  metadata?: Record<string, unknown>;
  sessionId?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  timestamp: string;
}

export enum AnalyticsEvent {
  PAGE_VIEW = "page_view",
  BUTTON_CLICK = "button_click",
  FORM_SUBMIT = "form_submit",
  APPOINTMENT_CREATED = "appointment_created",
  APPOINTMENT_CANCELLED = "appointment_cancelled",
  DOWNLOAD = "download",
  EXTERNAL_LINK = "external_link",
  ERROR = "error",
}

export interface AnalyticsOverview {
  totalViews: number;
  uniqueVisitors: number;
  averageSessionDuration: string;
  bounceRate: number;
  conversionRate: number;

  comparison: {
    period: "day" | "week" | "month";
    current: number;
    previous: number;
    percentageChange: number;
  };
}

export interface PageAnalytics {
  path: string;
  title: string;
  views: number;
  uniqueVisitors: number;
  averageTime: string;
  bounceRate: number;
  exitRate: number;
}

export interface TrafficSource {
  source: string;
  medium?: string;
  visits: number;
  percentage: number;
  conversionRate: number;
}

export interface DeviceAnalytics {
  type: "mobile" | "tablet" | "desktop";
  brand?: string;
  os?: string;
  browser?: string;
  count: number;
  percentage: number;
}

// ============================================
// 📊 TIPOS DE DASHBOARD
// ============================================
export interface DashboardStats {
  appointments: AppointmentStats;
  analytics: {
    pageViews: number;
    weeklyGrowth: number;
  };
  media: {
    totalFiles: number;
    totalSize: string;
    recentUploads: number;
  };
  content: {
    totalPages: number;
    recentUpdates: number;
  };
}

export interface DashboardWidget {
  id: string;
  type: "stats" | "chart" | "list" | "calendar";
  title: string;
  data: unknown;
  config?: WidgetConfig;
  position: { x: number; y: number; w: number; h: number };
}

export interface WidgetConfig {
  refreshInterval?: number;
  chartType?: "line" | "bar" | "pie" | "donut";
  displayItems?: number;
  dateRange?: "today" | "week" | "month" | "year";
}

export interface RecentActivity {
  id: string;
  action: string;
  description?: string;
  user: string;
  timestamp: string;
  type: ActivityType;
  metadata?: Record<string, unknown>;
}

export enum ActivityType {
  APPOINTMENT = "appointment",
  UPLOAD = "upload",
  CONTENT = "content",
  ANALYTICS = "analytics",
  SETTINGS = "settings",
  USER = "user",
}

// ============================================
// ⚙️ TIPOS DE CONFIGURAÇÃO
// ============================================
export interface SystemSettings {
  general: GeneralSettings;
  email: EmailSettings;
  appointment: AppointmentSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
}

export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logo?: string;
  favicon?: string;
  maintenanceMode: boolean;
  language: string;
  timezone: string;
}

export interface EmailSettings {
  provider: "sendgrid" | "mailgun" | "ses" | "smtp";
  fromEmail: string;
  fromName: string;
  replyTo?: string;
  templates: EmailTemplate[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  isActive: boolean;
}

export interface AppointmentSettings {
  workingDays: number[]; // 0-6 (domingo-sábado)
  workingHours: {
    start: string;
    end: string;
  };
  slotDuration: number;
  bufferTime: number;
  maxAdvanceDays: number;
  cancellationDeadline: number;
  reminderTime: number;
  blockedDates: string[];
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  whatsappNotifications: boolean;
  adminNotifications: {
    newAppointment: boolean;
    appointmentCancelled: boolean;
    newMessage: boolean;
  };
  patientNotifications: {
    confirmationEmail: boolean;
    reminderEmail: boolean;
    cancellationEmail: boolean;
  };
}

// src/types/admin.ts - CONTINUAÇÃO

export interface SecuritySettings {
  twoFactorAuth: boolean;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expirationDays: number;
  };
  sessionTimeout: number; // minutos
  ipWhitelist: string[];
  maxLoginAttempts: number;
  lockoutDuration: number; // minutos
}

// ============================================
// 📋 TIPOS DE TABELA E LISTAGEM
// ============================================
export interface AdminTableProps<T> extends WithPagination {
  data: T[];
  columns: TableColumn<T>[];
  filters?: AdminFilters;
  onSort?: (field: string, direction: "asc" | "desc") => void;
  onFilter?: (filters: AdminFilters) => void;
  onRowClick?: (item: T) => void;
  onRowSelect?: (items: T[]) => void;
  actions?: AdminTableAction<T>[];
  bulkActions?: AdminBulkAction<T>[];
}

export interface AdminTableAction<T> {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (item: T) => void;
  isVisible?: (item: T) => boolean;
  isDisabled?: (item: T) => boolean;
  variant?: "default" | "danger" | "success";
}

export interface AdminBulkAction<T> {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (items: T[]) => void;
  confirmMessage?: string;
  variant?: "default" | "danger";
}

export interface AdminFilters {
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  status?: string[];
  categories?: string[];
  tags?: string[];
  [key: string]: unknown;
}

// ============================================
// 🎨 TIPOS DE COMPONENTES ADMIN
// ============================================
export interface AdminCardProps {
  title?: string | React.ReactNode;
  subtitle?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  error?: string;
}

export interface AdminStatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ComponentType<{ className?: string }>;
  trend?: number[];
  format?: "number" | "currency" | "percentage";
}

export interface AdminBreadcrumb {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface AdminMenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: AdminMenuItem[];
  permissions?: AdminPermission[];
}

// ============================================
// 📤 TIPOS DE EXPORTAÇÃO
// ============================================
export interface ExportConfig {
  format: "csv" | "excel" | "pdf" | "json";
  fields: string[];
  filters?: AdminFilters;
  dateRange?: {
    start: string;
    end: string;
  };
  includeHeaders: boolean;
  filename?: string;
}

export interface ImportConfig {
  format: "csv" | "excel" | "json";
  mapping: Record<string, string>;
  validation?: Record<string, (value: unknown) => boolean>;
  onProgress?: (progress: number) => void;
  onError?: (error: ImportError) => void;
}

export interface ImportError {
  row: number;
  field: string;
  value: unknown;
  message: string;
}

// ============================================
// 🔔 TIPOS DE NOTIFICAÇÃO
// ============================================
export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
}

// ============================================
// 📊 TIPOS DE RELATÓRIO
// ============================================
export interface Report {
  id: string;
  name: string;
  description?: string;
  type: ReportType;
  schedule?: ReportSchedule;
  filters: ReportFilters;
  recipients?: string[];
  lastGenerated?: string;
  isActive: boolean;
}

export enum ReportType {
  APPOINTMENTS = "appointments",
  ANALYTICS = "analytics",
  FINANCIAL = "financial",
  PATIENTS = "patients",
  CUSTOM = "custom",
}

export interface ReportSchedule {
  frequency: "daily" | "weekly" | "monthly";
  time?: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
}

export interface ReportFilters {
  dateRange: {
    type: "fixed" | "relative";
    start?: string;
    end?: string;
    relativePeriod?:
      | "last_7_days"
      | "last_30_days"
      | "last_month"
      | "last_year";
  };
  [key: string]: unknown;
}

// ============================================
// 🔍 TIPOS DE BUSCA
// ============================================
export interface SearchConfig {
  placeholder?: string;
  fields: string[];
  fuzzy?: boolean;
  minLength?: number;
  debounceMs?: number;
}

export interface SearchResult<T = unknown> {
  item: T;
  score: number;
  highlights?: Record<string, string>;
}

// ============================================
// 🔧 TIPOS DE API ADMIN
// ============================================
export interface AdminApiEndpoint {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  permissions: AdminPermission[];
  rateLimit?: {
    requests: number;
    window: number; // segundos
  };
}

export interface AdminApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    requestId: string;
    timestamp: string;
    version: string;
  };
}

// ============================================
// 🎯 TIPOS DE AÇÃO ADMIN
// ============================================
export type AdminAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_DATA"; payload: unknown }
  | { type: "UPDATE_FILTERS"; payload: AdminFilters }
  | { type: "UPDATE_PAGINATION"; payload: Partial<WithPagination> }
  | { type: "TOGGLE_SELECTION"; payload: string | number }
  | { type: "SELECT_ALL"; payload: boolean }
  | { type: "RESET" };

// Type guards
export const isAdminRole = (role: unknown): role is AdminRole => {
  return Object.values(AdminRole).includes(role as AdminRole);
};

export const hasPermission = (
  user: AdminUser,
  permission: AdminPermission
): boolean => {
  return (
    user.permissions.includes(permission) || user.role === AdminRole.SUPER_ADMIN
  );
};

export const canAccessRoute = (
  user: AdminUser,
  requiredPermissions: AdminPermission[]
): boolean => {
  if (user.role === AdminRole.SUPER_ADMIN) return true;
  return requiredPermissions.every((permission) =>
    user.permissions.includes(permission)
  );
};
