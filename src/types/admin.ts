// src/types/admin.ts

export interface AdminUser {
  id: number;
  email: string;
  createdAt: string; // ISO string
}

export interface ContentItem {
  id: number;
  page: string;
  section: string;
  key: string;
  type: "text" | "title" | "description" | "image" | "html";
  value: string;
  metadata?: Record<string, unknown>;
  isActive: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface MediaFile {
  id: number;
  filename: string;
  originalName: string;
  path: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  category?: "profile" | "service" | "gallery" | "hero" | "testimonials";
  isActive: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface AnalyticsData {
  id: number;
  event: string;
  page?: string;
  section?: string;
  metadata?: Record<string, unknown>;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string; // ISO string
}

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

export interface PageViewData {
  path: string;
  title: string;
  views: number;
  uniqueVisitors: number;
  averageTime: string;
  bounceRate: string;
}

export interface TimeSeriesData {
  date: string; // YYYY-MM-DD
  views: number;
  visitors: number;
}

export interface DeviceData {
  type: string;
  count: number;
  percentage: number;
}

export interface SourceData {
  source: string;
  visits: number;
  percentage: number;
}

export interface AdminCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "neutral" | "negative";
  icon: React.ComponentType<{ className?: string }>;
}

export interface RecentActivity {
  action: string;
  user: string;
  time: string;
  type: "appointment" | "upload" | "content" | "analytics";
}

export interface MediaCategory {
  key: string;
  name: string;
  description: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  lastUpdated: string; // ISO string
}

export interface MediaStats {
  totalImages: number;
  totalSize: string;
  recentUploads: number;
  categories: MediaCategory[];
}

export interface UploadedFile {
  id: number;
  url: string;
  filename: string;
  originalName: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  category?: string;
  status: "uploading" | "success" | "error";
  error?: string;
}

export interface Setting {
  id: string;
  label: string;
  description?: string;
  type: "text" | "textarea" | "switch" | "select" | "color" | "email";
  value: string | boolean;
  options?: { value: string; label: string }[];
}

export interface SettingsSection {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  settings: Setting[];
}
