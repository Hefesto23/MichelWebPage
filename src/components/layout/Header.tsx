// src/components/layout/Header.tsx
"use client";
import { robotoSlab } from "@/app/fonts";
import { Switch } from "@/components/shared/ui/switch";
import { ROUTES } from "@/utils/constants";
import { cn } from "@/utils/utils";
import { Menu, Moon, Sun, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const Header = ({
  isDarkMode,
  toggleDarkMode,
  mounted,
}: {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  mounted: boolean;
}) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={cn("header-main", robotoSlab.className)}>
      <div className="content-container">
        <div className="header-container">
          <div className="header-logo">
            <Link href={ROUTES.HOME} className="relative w-[140px] h-[52px] sm:w-[170px] sm:h-[63px] md:w-[200px] md:h-[75px] flex items-center justify-center cursor-pointer">
              <Image
                src="/logo.png"
                alt="Logo da Clínica"
                fill
                className="object-contain logo-light"
                priority
              />
              <Image
                src="/logo2.png"
                alt="Logo da Clínica"
                fill
                className="object-contain logo-dark"
                priority
              />
            </Link>
          </div>

          {/* Mobile Menu Button - Visible below 1200px */}
          <button
            onClick={toggleMobileMenu}
            className="flex xl:hidden items-center justify-center w-10 h-10 rounded-lg bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>

          {/* Desktop Navigation - Visible from 1200px and up */}
          <nav className="header-nav hidden xl:flex">
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
          </nav>

          {/* Desktop Admin Button - REMOVED FOR PRODUCTION
          <div className="hidden xl:flex items-center space-x-2">
            {isAdminLogged ? (
              <>
                <Link href={ROUTES.ADMIN.DASHBOARD}>
                  <Button variant="default" className="h-9">
                    Área Admin
                  </Button>
                </Link>
                <LogoutButton />
              </>
            ) : (
              <Link href={ROUTES.ADMIN.LOGIN}>
                <Button variant="default" className="h-9">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
          */}

          {/* Desktop Theme Toggle */}
          <div className="header-actions hidden xl:flex">
            <span className="inline-flex items-center font-extrabold relative">
              <Sun className="mr-1 h-5 w-5 text-primary-foreground icon-sun" />
              <Moon className="mr-1 h-5 w-5 text-foreground icon-moon" />
            </span>
            {mounted ? (
              <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
            ) : (
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Visible below 1200px */}
      {isMobileMenuOpen && (
        <div className="block xl:hidden bg-background border-t border-gray-200 dark:border-gray-700 shadow-lg animate-in slide-in-from-top-2 duration-300">
          <nav className="content-container py-4">
            <div className="flex flex-col space-y-3">
              <Link
                href={ROUTES.HOME}
                onClick={closeMobileMenu}
                className={cn(
                  "px-4 py-3 rounded-lg font-medium transition-colors text-foreground hover:bg-primary hover:text-primary-foreground",
                  isActive(ROUTES.HOME) && "bg-primary text-primary-foreground"
                )}
              >
                Home
              </Link>
              <Link
                href={ROUTES.ABOUT}
                onClick={closeMobileMenu}
                className={cn(
                  "px-4 py-3 rounded-lg font-medium transition-colors text-foreground hover:bg-primary hover:text-primary-foreground",
                  isActive(ROUTES.ABOUT) && "bg-primary text-primary-foreground"
                )}
              >
                Sobre
              </Link>
              <Link
                href={ROUTES.SERVICES}
                onClick={closeMobileMenu}
                className={cn(
                  "px-4 py-3 rounded-lg font-medium transition-colors text-foreground hover:bg-primary hover:text-primary-foreground",
                  isActive(ROUTES.SERVICES) && "bg-primary text-primary-foreground"
                )}
              >
                Terapias
              </Link>
              <Link
                href={ROUTES.AVALIACOES}
                onClick={closeMobileMenu}
                className={cn(
                  "px-4 py-3 rounded-lg font-medium transition-colors text-foreground hover:bg-primary hover:text-primary-foreground",
                  isActive(ROUTES.AVALIACOES) && "bg-primary text-primary-foreground"
                )}
              >
                Avaliações
              </Link>
              <Link
                href={ROUTES.APPOINTMENT}
                onClick={closeMobileMenu}
                className={cn(
                  "px-4 py-3 rounded-lg font-medium transition-colors text-foreground hover:bg-primary hover:text-primary-foreground",
                  isActive(ROUTES.APPOINTMENT) && "bg-primary text-primary-foreground"
                )}
              >
                Agendamento
              </Link>
              <Link
                href={ROUTES.CONTACT}
                onClick={closeMobileMenu}
                className={cn(
                  "px-4 py-3 rounded-lg font-medium transition-colors text-foreground hover:bg-primary hover:text-primary-foreground",
                  isActive(ROUTES.CONTACT) && "bg-primary text-primary-foreground"
                )}
              >
                Contato
              </Link>
              
              {/* Theme Toggle in Mobile Menu */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 mt-3 pt-6">
                <span className="font-medium text-foreground">Modo Escuro</span>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-primary-foreground icon-sun" />
                  <Moon className="h-4 w-4 text-foreground icon-moon" />
                  {mounted ? (
                    <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                  ) : (
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  )}
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
