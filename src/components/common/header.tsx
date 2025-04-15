// components/common/Header/index.tsx

import { robotoSlab } from "@/app/fonts";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./header.module.css";

export const Header = ({
  isDarkMode,
  isAdminLogged,
  toggleDarkMode,
}: {
  isDarkMode: boolean;
  isAdminLogged: boolean;
  toggleDarkMode: () => void;
}) => {
  return (
    <header className={cn(styles.header, robotoSlab.className)}>
      <div className="content-container">
        <div className={styles.container}>
          <div className={`${styles.logoContainer} stretch`}>
            {isDarkMode ? (
              <Image
                src="/logo2.svg"
                alt="Logo da Clínica"
                width={200}
                height={75}
                className="object-contain"
              />
            ) : (
              <Image
                src="/logo.svg"
                alt="Logo da Clínica"
                width={200}
                height={75}
                className="object-contain"
              />
            )}
          </div>

          <nav className={styles.navigation}>
            <Link href="/" className={styles.navLink}>
              Home
            </Link>
            <Link href="/about" className={styles.navLink}>
              Sobre
            </Link>
            <Link href="/terapias" className={styles.navLink}>
              Terapias
            </Link>
            <Link href="/avaliacoes" className={styles.navLink}>
              Avaliações
            </Link>
            <Link href="/agendamento" className={styles.navLink}>
              Agendamento
            </Link>
            <Link href="/contato" className={styles.navLink}>
              Contato
            </Link>

            {isAdminLogged ? (
              <Link
                href="/admin/dashboard"
                className={`${styles.navLink} hover:text-primary`}
              >
                <Button variant="default" className="h-9">
                  Área Admin
                </Button>
              </Link>
            ) : (
              <Link
                href="/admin/login"
                className={`${styles.navLink} hover:text-primary`}
              >
                <Button variant="default" className="h-9">
                  Admin Login
                </Button>
              </Link>
            )}
          </nav>

          <div className={styles.darkModeToggle}>
            {isDarkMode ? (
              <span className={styles.iconContainer}>
                <Sun className={styles.darkModeIcon} />
              </span>
            ) : (
              <span className={styles.iconContainer}>
                <Moon className={styles.lightModeIcon} />
              </span>
            )}
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </div>
        </div>
      </div>
    </header>
  );
};
