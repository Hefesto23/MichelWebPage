import { robotoSlab } from "@/app/fonts";
import { cn } from "@/lib/utils";

export const Footer = () => {
  return (
    <footer
      className={cn(
        "bg-background text-foreground dark:bg-background dark:text-card-foreground p-4 text-center",
        robotoSlab.className
      )}
    >
      &copy; 2023 Consultório de Psicologia. Todos os direitos reservados.
    </footer>
  );
};
