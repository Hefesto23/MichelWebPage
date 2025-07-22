// src/components/common/header.tsx
import { robotoSlab } from "@/app/fonts";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
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
            <Link href="/" className="header-nav-link">
              Home
            </Link>
            <Link href="/about" className="header-nav-link">
              Sobre
            </Link>
            <Link href="/terapias" className="header-nav-link">
              Terapias
            </Link>
            <Link href="/avaliacoes" className="header-nav-link">
              Avaliações
            </Link>
            <Link href="/agendamento" className="header-nav-link">
              Agendamento
            </Link>
            <Link href="/contato" className="header-nav-link">
              Contato
            </Link>

            {isAdminLogged ? (
              <Link href="/admin/dashboard" className="header-nav-link">
                <Button variant="default" className="h-9">
                  Área Admin
                </Button>
              </Link>
            ) : (
              <Link href="/admin/login" className="header-nav-link">
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
