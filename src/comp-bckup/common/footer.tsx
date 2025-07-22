// src/components/common/footer.tsx - REFATORADO
import Image from "next/image";
import Link from "next/link";
import { IoLogoWhatsapp } from "react-icons/io";

export const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="content-container">
        <div className="w-full flex flex-col">
          <div className="footer-grid">
            {/* First Column */}
            <div className="footer-column">
              <h3 className="footer-title">Michel de Camargo</h3>
              <p className="text-base font-bold mb-2">CRP 06/174807</p>
              <div className="flex items-center font-bold justify-center md:justify-start mb-4">
                <IoLogoWhatsapp className="mr-2" size={24} />
                <Link
                  href="https://wa.me/5515997646421"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base hover:text-gray-500 text-foreground transition-colors"
                >
                  +55 (15) 99764-6421
                </Link>
              </div>
            </div>

            {/* Middle Column */}
            <div className="flex justify-center items-start mt-0 pt-1">
              <Image
                src="/logo.svg"
                alt="Consultório de Psicologia Logo"
                width={265}
                height={75}
                className="object-contain"
              />
            </div>

            {/* Third Column */}
            <div className="footer-column text-center md:text-right">
              <h3 className="footer-title">Horário de Atendimento</h3>
              <p className="text-base font-bold mb-2">
                Segunda à Sexta das 8:00 as 21:00
              </p>
              <p className="text-base font-bold mb-2">
                Obs: As consultas necessitam ser previamente agendadas.
              </p>
              <p className="text-base font-bold text-gray-600 mt-1 italic">
                * Atendimentos a partir de 20 anos de idade
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="footer-copyright">
            &copy; 2024 Consultório de Psicologia. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};
