// ==========================================
// src/components/layout/AdminLayout/AdminHeader.tsx
// ==========================================
import { useAuth } from "@/hooks/useAuth";
import { Bell, Search, User } from "lucide-react";
import styles from "./AdminLayout.module.css";

export const AdminHeader: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className={styles.adminHeader}>
      <div className={styles.headerContent}>
        {/* Search Bar */}
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar..."
            className={styles.searchInput}
          />
        </div>

        {/* Right Section */}
        <div className={styles.headerRight}>
          {/* Notifications */}
          <button className={styles.iconButton}>
            <Bell className="w-5 h-5" />
            <span className={styles.notificationBadge}>3</span>
          </button>

          {/* User Menu */}
          <div className={styles.userMenu}>
            <User className="w-5 h-5" />
            <span>Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};
