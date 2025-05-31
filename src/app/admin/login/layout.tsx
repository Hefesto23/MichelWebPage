// src/app/admin/login/layout.tsx - LAYOUT DE LOGIN CORRIGIDO

"use client";

import { roboto } from "@/app/fonts";
import { cn } from "@/lib/utils";

interface AdminLoginLayoutProps {
  children: React.ReactNode;
}

export default function AdminLoginLayout({ children }: AdminLoginLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-gray-50 dark:bg-gray-900",
        roboto.className
      )}
    >
      {children}
    </div>
  );
}
