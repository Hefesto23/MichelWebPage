// ============================================
// 11. src/app/admin/login/layout.tsx
// ============================================
"use client";

import { roboto } from "@/app/fonts";
import { AdminLoginTransition } from "@/components/shared/transitions";
import { cn } from "@/utils/utils";

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
      <AdminLoginTransition>
        {children}
      </AdminLoginTransition>
    </div>
  );
}
