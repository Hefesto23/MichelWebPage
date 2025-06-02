// ==========================================
// src/components/layout/Header/Header.tsx
// ==========================================
import { robotoSlab } from "@/app/fonts";
import { Container } from "@/components/base/Container";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/utils/constants";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

export interface HeaderProps {
  isDarkMode: boolean;
  isAdminLogged: boolean;
  toggleDarkMode: () => void;
}

const navLinks = [
  { href: ROUTES.HOME, label: "Home" },
  { href: ROUTES.ABOUT, label: "Sobre" },
  { href: ROUTES.SERVICES, label: "Terapias" },
  { href: ROUTES.ASSESSMENT, label: "Avaliações" },
  { href: ROUTES.APPOINTMENT, label: "Agendamento" },
  { href: ROUTES.CONTACT, label: "Contato" },
];

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  isAdminLogged,
  toggleDarkMode,
}) => {
  const pathname = usePathname();

  return (
    <header className={cn(styles.header, robotoSlab.className)}>
      <Container>
        <div className={styles.container}>
          {/* Logo */}
          <Link
            href={ROUTES.HOME}
            className={`${styles.logoContainer} stretch`}
          >
            <Image
              src={isDarkMode ? "/logo2.svg" : "/logo.svg"}
              alt="Logo da Clínica"
              width={200}
              height={75}
              className="object-contain"
              priority
            />
          </Link>

          {/* Navigation */}
          <nav className={styles.navigation}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  styles.navLink,
                  pathname === link.href && styles.active
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Admin Button */}
            <Link
              href={isAdminLogged ? ROUTES.ADMIN.DASHBOARD : ROUTES.ADMIN.LOGIN}
              className={`${styles.navLink} hover:text-primary`}
            >
              <Button variant="default" className="h-9">
                {isAdminLogged ? "Área Admin" : "Admin Login"}
              </Button>
            </Link>
          </nav>

          {/* Dark Mode Toggle */}
          <div className={styles.darkModeToggle}>
            <span className={styles.iconContainer}>
              {isDarkMode ? (
                <Sun className={styles.darkModeIcon} />
              ) : (
                <Moon className={styles.lightModeIcon} />
              )}
            </span>
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </div>

          {/* Mobile Menu Button (para implementação futura) */}
          <button className={styles.mobileMenuButton} aria-label="Menu">
            <span className={styles.hamburger}></span>
          </button>
        </div>
      </Container>
    </header>
  );
};
