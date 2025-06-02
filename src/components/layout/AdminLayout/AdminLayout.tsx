// ==========================================
// src/components/layout/AdminLayout/AdminLayout.tsx
// ==========================================
"use client";

import { roboto } from "@/app/fonts";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import styles from "./AdminLayout.module.css";

export interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  // Se não autenticado, não renderizar nada (useAuth já redireciona)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={cn(styles.adminLayout, roboto.className)}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <AdminHeader />
        <main className={styles.pageContent}>{children}</main>
      </div>
    </div>
  );
};
