// src/components/layout/Footer.tsx - COM CONFIGURAÇÕES DINÂMICAS
"use client";

import { usePublicSettings } from "@/hooks/usePublicSettings";
import { CLINIC_INFO } from "@/utils/constants";
import Image from "next/image";
import Link from "next/link";
import { IoLogoWhatsapp } from "react-icons/io";
import { format } from "date-fns";

export const Footer = () => {
  const { settings, loading, formatWorkingDays } = usePublicSettings();

  // Usar configurações dinâmicas ou fallback para constants
  const phoneDisplay = settings?.phone_number || CLINIC_INFO.CONTACT.PHONE_DISPLAY;
  const whatsappNumber = settings?.phone_number?.replace(/\D/g, "") || CLINIC_INFO.CONTACT.WHATSAPP;
  const workingDaysText =
    !loading && settings ? formatWorkingDays() : `${CLINIC_INFO.HOURS.WEEKDAYS}`;
  const startTime = settings?.start_time || CLINIC_INFO.HOURS.START;
  const endTime = settings?.end_time || CLINIC_INFO.HOURS.END;

  // Novas configurações dinâmicas
  const psychologistName = settings?.psychologist_name || CLINIC_INFO.PSYCHOLOGIST.NAME;
  const crpNumber = settings?.crp_number || CLINIC_INFO.PSYCHOLOGIST.CRP;
  const ageDisclaimer = settings?.age_disclaimer || "* Atendimentos a partir de 20 anos de idade";
  const appointmentNote = settings?.appointment_note || CLINIC_INFO.HOURS.NOTE;
  const additionalNotes = settings?.additional_notes;

  // Ano atual
  const currentYear = format(new Date(), "yyyy");

  return (
    <footer className="footer-container">
      <div className="content-container">
        <div className="w-full flex flex-col">
          <div className="footer-grid">
            {/* First Column */}
            <div className="footer-column">
              <h3 className="footer-title">{psychologistName}</h3>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold mb-2">{crpNumber}</p>
              <div className="flex items-center font-bold justify-center md:justify-start mb-4">
                <IoLogoWhatsapp className="mr-2 sm:mr-2.5 md:mr-3 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" size={24} />
                <Link
                  href={`https://wa.me/55${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm md:text-base lg:text-lg hover:text-gray-500 text-foreground transition-colors"
                >
                  {phoneDisplay}
                </Link>
              </div>
            </div>

            {/* Middle Column - Logo com tema dinâmico */}
            <div className="flex justify-center items-start mt-0 pt-1">
              <div className="relative w-[160px] h-[45px] sm:w-[200px] sm:h-[57px] md:w-[265px] md:h-[75px] flex items-center justify-center">
                <Image
                  src="/logo.svg"
                  alt="Consultório de Psicologia Logo"
                  fill
                  className="object-contain logo-light"
                />
                <Image
                  src="/logo2.svg"
                  alt="Consultório de Psicologia Logo"
                  fill
                  className="object-contain logo-dark"
                />
              </div>
            </div>

            {/* Third Column */}
            <div className="footer-column text-center md:text-right">
              <h3 className="footer-title">Horário de Atendimento</h3>
              {loading ? (
                <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold mb-2">
                  Carregando...
                </p>
              ) : workingDaysText.toLowerCase() === "fechado" ? (
                <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold mb-2 text-amber-600 dark:text-amber-400">
                  ⚠️ Agendamentos indisponíveis - Favor entrar em contato
                </p>
              ) : (
                <>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold mb-2">
                    {`${workingDaysText} das ${startTime} às ${endTime}`}
                  </p>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold mb-2">Obs: {appointmentNote}</p>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-600 mt-1 italic">
                    {ageDisclaimer}
                  </p>
                  {additionalNotes && (
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-600 mt-1 italic">{additionalNotes}</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Copyright */}
          <div className="footer-copyright">
            &copy; {currentYear} {psychologistName}. Todos os direitos reservados.
            {/* Developer Credit */}
            <div className="mt-2 text-xs sm:text-sm md:text-base">
              Desenvolvido com ❤️ por{" "}
              <Link href="#" className="hover:text-gray-500 transition-colors">
                Vinícius Raszl
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
