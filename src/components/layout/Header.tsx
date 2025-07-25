// src/components/layout/Header.tsx
import { robotoSlab } from "@/app/fonts";
import { Button } from "@/components/shared/ui/button";
import { Switch } from "@/components/shared/ui/switch";
import { ROUTES } from "@/utils/constants"; // ✅ ÚNICA MUDANÇA: usar constants
import { cn } from "@/utils/utils";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    <header className={cn("header-main", robotoSlab.className)}>
      <div className="content-container">
        <div className="header-container">
          <div className="header-logo">
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

          <nav className="header-nav">
            {/* ✅ USANDO CONSTANTS EM VEZ DE STRINGS HARDCODED */}
            <Link href={ROUTES.HOME} className="header-nav-link">
              Home
            </Link>
            <Link href={ROUTES.ABOUT} className="header-nav-link">
              Sobre
            </Link>
            <Link href={ROUTES.SERVICES} className="header-nav-link">
              Terapias
            </Link>
            <Link href="/avaliacoes" className="header-nav-link">
              Avaliações
            </Link>
            <Link href={ROUTES.APPOINTMENT} className="header-nav-link">
              Agendamento
            </Link>
            <Link href={ROUTES.CONTACT} className="header-nav-link">
              Contato
            </Link>

            {isAdminLogged ? (
              <Link href={ROUTES.ADMIN.DASHBOARD} className="header-nav-link">
                <Button variant="default" className="h-9">
                  Área Admin
                </Button>
              </Link>
            ) : (
              <Link href={ROUTES.ADMIN.LOGIN} className="header-nav-link">
                <Button variant="default" className="h-9">
                  Admin Login
                </Button>
              </Link>
            )}
          </nav>

          <div className="header-actions">
            {isDarkMode ? (
              <span className="inline-flex items-center font-extrabold">
                <Sun className="mr-1 h-5 w-5 text-primary-foreground" />
              </span>
            ) : (
              <span className="inline-flex items-center font-extrabold">
                <Moon className="mr-1 h-5 w-5 text-foreground" />
              </span>
            )}
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </div>
        </div>
      </div>
    </header>
  );
};
