import { robotoSlab } from "@/app/fonts";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";

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
    <header
      className={cn(
        "dark:bg-background dark:text-foreground shadow-md w-full p-4",
        robotoSlab.className
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4 stretch">
          {isDarkMode ? (
            <Image
              src="/logo2.png"
              alt="Logo da Clínica"
              width={150}
              height={50}
            />
          ) : (
            <Image
              src="/logo.png"
              alt="Logo da Clínica"
              width={150}
              height={50}
            />
          )}
        </div>

        <nav className="flex items-center space-x-4">
          {/* Usando variável CSS para links e hover */}
          <Link
            href="/"
            className="text-foreground dark:text-card-foreground hover:text-primary-foreground dark:hover:text-primary-foreground"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-foreground dark:text-card-foreground hover:text-primary-foreground dark:hover:text-primary-foreground"
          >
            Sobre
          </Link>
          <Link
            href="/services"
            className="text-foreground dark:text-card-foreground hover:text-primary-foreground dark:hover:text-primary-foreground"
          >
            Serviços
          </Link>
          <Link
            href="/appointment"
            className="text-foreground dark:text-card-foreground hover:text-primary-foreground dark:hover:text-primary-foreground"
          >
            Agendamento
          </Link>
          <Link
            href="/contact"
            className="text-foreground dark:text-card-foreground hover:text-primary-foreground dark:hover:text-primary-foreground"
          >
            Contato
          </Link>

          {isAdminLogged ? (
            <Link href="/admin/dashboard" className="hover:text-primary">
              <Button variant="default">Área Admin</Button>
            </Link>
          ) : (
            <Link href="/admin/login" className="hover:text-primary">
              <Button variant="default">Admin Login</Button>
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-2">
          {/* Usando variável CSS para o texto do modo escuro */}
          {isDarkMode ? (
            <span className="font-extrabold text-primary-foreground">
              <Sun className="mr-1 h-5 w-5" />
            </span>
          ) : (
            <span className="font-extrabold text-foreground">
              <Moon className="mr-1 h-5 w-5" />
            </span>
          )}
          <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
        </div>
      </div>
    </header>
  );
};
