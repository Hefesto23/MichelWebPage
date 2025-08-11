// src/components/layout/Footer.tsx - COM CONFIGURAÇÕES DINÂMICAS
"use client";

import { usePublicSettings } from "@/hooks/usePublicSettings";
import { CLINIC_INFO } from "@/utils/constants";
import Image from "next/image";
import Link from "next/link";
import { IoLogoWhatsapp } from "react-icons/io";

export const Footer = () => {
  const { settings, loading, formatWorkingDays } = usePublicSettings();

  // Usar configurações dinâmicas ou fallback para constants
  const phoneDisplay = settings?.phone_number || CLINIC_INFO.CONTACT.PHONE_DISPLAY;
  const whatsappNumber = settings?.phone_number?.replace(/\D/g, "") || CLINIC_INFO.CONTACT.WHATSAPP;
  const workingDaysText = !loading && settings ? formatWorkingDays() : `${CLINIC_INFO.HOURS.WEEKDAYS}`;
  const startTime = settings?.start_time || CLINIC_INFO.HOURS.START;
  const endTime = settings?.end_time || CLINIC_INFO.HOURS.END;

  return (
    <footer className="footer-container">
      <div className="content-container">
        <div className="w-full flex flex-col">
          <div className="footer-grid">
            {/* First Column */}
            <div className="footer-column">
              <h3 className="footer-title">{CLINIC_INFO.PSYCHOLOGIST.NAME}</h3>{" "}
              {/* ✅ USANDO CONSTANT */}
              <p className="text-base font-bold mb-2">
                {CLINIC_INFO.PSYCHOLOGIST.CRP}
              </p>{" "}
              {/* ✅ USANDO CONSTANT */}
              <div className="flex items-center font-bold justify-center md:justify-start mb-4">
                <IoLogoWhatsapp className="mr-2" size={24} />
                <Link
                  href={`https://wa.me/55${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base hover:text-gray-500 text-foreground transition-colors"
                >
                  {phoneDisplay} {/* ✅ USANDO CONFIGURAÇÃO DINÂMICA */}
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
                {/* ✅ USANDO CONFIGURAÇÕES DINÂMICAS */}
                {loading ? "Carregando..." : `${workingDaysText} das ${startTime} às ${endTime}`}
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
            &copy; 2024 {CLINIC_INFO.PSYCHOLOGIST.NAME}. Todos os direitos
            reservados. {/* ✅ USANDO CONSTANT */}
          </div>
        </div>
      </div>
    </footer>
  );
};