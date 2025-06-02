// ==========================================
// src/components/layout/AdminLayout/AdminSidebar.tsx
// ==========================================
import { cn } from "@/lib/utils";
import { ROUTES } from "@/utils/constants";
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
import styles from "./AdminLayout.module.css";

const sidebarItems = [
  { href: ROUTES.ADMIN.DASHBOARD, label: "Dashboard", icon: Home },
  { href: ROUTES.ADMIN.APPOINTMENTS, label: "Agendamentos", icon: Calendar },
  { href: ROUTES.ADMIN.ANALYTICS, label: "Estatísticas", icon: BarChart3 },
  { href: ROUTES.ADMIN.CONTENT, label: "Gerenciar Conteúdo", icon: FileText },
  { href: ROUTES.ADMIN.MEDIA, label: "Mídia", icon: ImageIcon },
  { href: ROUTES.ADMIN.SETTINGS, label: "Configurações", icon: Settings },
];

export const AdminSidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push(ROUTES.ADMIN.LOGIN);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        {/* Logo centralizado */}
        <div className={styles.logoWrapper}>
          <Image
            src="/PsiLogo.svg"
            alt="Logo Consultório"
            width={60}
            height={60}
            className="w-15 h-15"
          />
        </div>

        {/* Textos centralizados */}
        <div className={styles.sidebarTitle}>
          <h1>Painel do Administrador</h1>
          <p>Consultório Michel</p>
        </div>
      </div>

      <nav className={styles.sidebarNav}>
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(styles.navItem, isActive && styles.navItemActive)}
            >
              <item.icon className={styles.navIcon} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.sidebarFooter}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <LogOut className={styles.navIcon} />
          Logout
        </button>
      </div>
    </aside>
  );
};
