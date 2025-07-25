// src/components/common/footer.tsx - REFATORADO
import { CONTACT_INFO, WORKING_HOURS } from "@/utils/constants";
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
              <h3 className="footer-title">{CONTACT_INFO.PSYCHOLOGIST_NAME}</h3>{" "}
              {/* ✅ USANDO CONSTANT */}
              <p className="text-base font-bold mb-2">
                {CONTACT_INFO.CRP}
              </p>{" "}
              {/* ✅ USANDO CONSTANT */}
              <div className="flex items-center font-bold justify-center md:justify-start mb-4">
                <IoLogoWhatsapp className="mr-2" size={24} />
                <Link
                  href={`https://wa.me/${CONTACT_INFO.WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base hover:text-gray-500 text-foreground transition-colors"
                >
                  {CONTACT_INFO.PHONE_DISPLAY} {/* ✅ USANDO CONSTANT */}
                </Link>
              </div>
            </div>

            {/* Middle Column - MANTIDO EXATAMENTE IGUAL */}
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
                {/* ✅ USANDO CONSTANTS EM VEZ DE STRINGS HARDCODED */}
                Segunda à Sexta das {WORKING_HOURS.START}:00 às{" "}
                {WORKING_HOURS.END}:00
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
            &copy; 2024 {CONTACT_INFO.COMPANY_NAME}. Todos os direitos
            reservados. {/* ✅ USANDO CONSTANT */}
          </div>
        </div>
      </div>
    </footer>
  );
};
