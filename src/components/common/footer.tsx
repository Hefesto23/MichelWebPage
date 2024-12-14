import { robotoSlab } from "@/app/fonts";
import { cn } from "@/lib/utils";
import { Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer
      className={cn(
        "bg-background text-foreground dark:bg-background dark:text-card-foreground py-8 px-4",
        robotoSlab.className
      )}
    >
      <div className="container mx-auto grid md:grid-cols-3 gap-8 items-start">
        {/* First Column - Psychologist Info */}
        <div className="text-left">
          <h3 className="text-xl font-bold mb-2">Michel de Camargo</h3>
          <p className="text-md mb-2">Psicólogo Clínico</p>
          <p className="text-sm mb-2">CRP 06/174807</p>
          <Link
            href="mailto:michelcamargo.psi@gmail.com"
            className="text-sm hover:text-blue-600 transition-colors"
          >
            michelcamargo.psi@gmail.com
          </Link>
        </div>

        {/* Central Column - Logo */}
        <div className="flex justify-center items-center">
          <Image
            src="/logo.png"
            alt="Consultório de Psicologia Logo"
            width={200}
            height={100}
            className="object-contain"
          />
        </div>

        {/* Third Column - Contact and Hours */}
        <div className="text-left">
          <div className="flex items-center mb-4">
            <Phone className="mr-2 text-green-600" size={24} />
            <Link
              href="https://wa.me/5515997646421"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg hover:text-green-700 transition-colors"
            >
              +55 (15) 99764-6421
            </Link>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Horário de Atendimento</h4>
            <p className="text-sm">Segunda à Sexta das 8:00 as 21:00</p>
            <p className="text-xs text-gray-600 italic mt-2">
              Obs: As consultas necessitam ser previamente agendadas.
            </p>
            <p className="text-xs text-gray-600 mt-1">
              ***Atendimentos a partir de 20 anos de idade
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-8 pt-4 border-t">
        &copy; 2024 Consultório de Psicologia. Todos os direitos reservados.
      </div>
    </footer>
  );
};
