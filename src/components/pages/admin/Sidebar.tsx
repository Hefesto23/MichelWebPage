// src/components/admin/Sidebar.tsx
"use client";
import { cn } from "@/utils/utils";
import {
  BarChart3,
  Calendar,
  FileText,
  Home,
  Image as ImageIcon,
  LogOut,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const sidebarItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Home },
  { href: "/admin/appointments", label: "Agendamentos", icon: Calendar },
  { href: "/admin/analytics", label: "Estatísticas", icon: BarChart3 },
  { href: "/admin/content", label: "Gerenciar Conteúdo", icon: FileText },
  { href: "/admin/media", label: "Mídia", icon: ImageIcon },
  { href: "/admin/settings", label: "Configurações", icon: Settings },
];

export const AdminSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r-2 border-gray-200 dark:border-gray-700 min-h-screen relative">
      <div className="p-6 border-b-2 border-gray-200 dark:border-gray-700">
        {/* Logo centralizado */}
        <div className="flex justify-center mb-4">
          <Image
            src="/PsiLogo.svg"
            alt="Logo Consultório"
            width={60}
            height={60}
            className="w-15 h-15"
          />
        </div>

        {/* Textos centralizados */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">
            Painel do Administrador
          </h1>
          <p className="text-sm text-muted-foreground">Consultório Michel</p>
        </div>
      </div>

      <nav className="mt-6 flex-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-foreground transition-colors",
                isActive &&
                  "bg-primary/10 text-primary-foreground border-r-4 border-primary-foreground font-bold text-lg"
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};
