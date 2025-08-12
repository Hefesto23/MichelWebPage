// src/components/admin/Sidebar.tsx
"use client";
import { useDarkMode } from "@/hooks/useDarkMode";
import { logoutUser } from "@/lib/auth";
import { cn } from "@/utils/utils";
import {
  BarChart3,
  Calendar,
  FileText,
  Home,
  Image as ImageIcon,
  LogOut,
  Moon,
  Settings,
  Sun,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Home },
  { href: "/admin/appointments", label: "Agendamentos", icon: Calendar },
  { href: "/admin/analytics", label: "Estatísticas", icon: BarChart3 },
  { href: "/admin/content", label: "Gerenciar Conteúdo", icon: FileText },
  { href: "/admin/media", label: "Mídia", icon: ImageIcon },
  { href: "/admin/settings", label: "Configurações", icon: Settings },
];

export const AdminSidebar = () => {
  const pathname = usePathname();
  const { isDarkMode, toggleDarkMode, mounted } = useDarkMode();

  const handleLogout = async () => {
    // Usar a função centralizada de logout que faz limpeza completa
    await logoutUser();
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r-2 border-gray-200 dark:border-gray-700 min-h-screen relative z-10">
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

      <nav className="mt-6">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary",
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

      {/* Seção de controles logo após navegação */}
      <div className="border-t-2 border-gray-200 dark:border-gray-700 mt-6 p-6 space-y-4">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Tema</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleDarkMode();
            }}
            disabled={!mounted}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600 transition-colors hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            aria-label="Toggle theme"
            type="button"
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform flex items-center justify-center",
                isDarkMode ? "translate-x-6" : "translate-x-1"
              )}
            >
              {mounted && (
                isDarkMode ? (
                  <Moon className="h-2.5 w-2.5 text-gray-600" />
                ) : (
                  <Sun className="h-2.5 w-2.5 text-yellow-500" />
                )
              )}
            </span>
          </button>
        </div>

        {/* Logout Button - cor original restaurada */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLogout();
          }}
          className="flex items-center w-full px-4 py-3 text-primary-foreground hover:bg-black/10 rounded-lg transition-colors font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          type="button"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};
