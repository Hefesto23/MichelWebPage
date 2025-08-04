// src/components/layout/Header.tsx
"use client";
import { robotoSlab } from "@/app/fonts";
import { LogoutButton } from "@/components/shared/navigation";
import { Button } from "@/components/shared/ui/button";
import { Switch } from "@/components/shared/ui/switch";
import { ROUTES } from "@/utils/constants";
import { cn } from "@/utils/utils";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = ({
  isDarkMode,
  isAdminLogged,
  toggleDarkMode,
}: {
  isDarkMode: boolean;
  isAdminLogged: boolean;
  toggleDarkMode: () => void;
}) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className={cn("header-main", robotoSlab.className)}>
      <div className="content-container">
        <div className="header-container">
          <div className="header-logo">
            <div className="w-[200px] h-[75px] flex items-center justify-center">
              {isDarkMode ? (
                <Image
                  src="/logo2.svg"
                  alt="Logo da Clínica"
                  width={247}
                  height={72}
                  className="object-contain w-[200px]"
                />
              ) : (
                <Image
                  src="/logo.svg"
                  alt="Logo da Clínica"
                  width={247}
                  height={72}
                  className="object-contain w-[200px]"
                />
              )}
            </div>
          </div>

          <nav className="header-nav">
            {/* ✅ USANDO CONSTANTS EM VEZ DE STRINGS HARDCODED */}
            <Link
              href={ROUTES.HOME}
              className={cn(
                "header-nav-link",
                isActive(ROUTES.HOME) && "active"
              )}
            >
              Home
            </Link>
            <Link
              href={ROUTES.ABOUT}
              className={cn(
                "header-nav-link",
                isActive(ROUTES.ABOUT) && "active"
              )}
            >
              Sobre
            </Link>
            <Link
              href={ROUTES.SERVICES}
              className={cn(
                "header-nav-link",
                isActive(ROUTES.SERVICES) && "active"
              )}
            >
              Terapias
            </Link>
            <Link
              href={ROUTES.AVALIACOES}
              className={cn(
                "header-nav-link",
                isActive(ROUTES.AVALIACOES) && "active"
              )}
            >
              Avaliações
            </Link>
            <Link
              href={ROUTES.APPOINTMENT}
              className={cn(
                "header-nav-link",
                isActive(ROUTES.APPOINTMENT) && "active"
              )}
            >
              Agendamento
            </Link>
            <Link
              href={ROUTES.CONTACT}
              className={cn(
                "header-nav-link",
                isActive(ROUTES.CONTACT) && "active"
              )}
            >
              Contato
            </Link>

            {isAdminLogged ? (
              <div className="flex items-center space-x-2">
                <Link href={ROUTES.ADMIN.DASHBOARD}>
                  <Button variant="default" className="h-9">
                    Área Admin
                  </Button>
                </Link>
                <LogoutButton />
              </div>
            ) : (
              <Link href={ROUTES.ADMIN.LOGIN}>
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
