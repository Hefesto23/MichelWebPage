// src/components/common/whatsapp-icon/index.tsx - REFATORADO
"use client";

import { IoLogoWhatsapp } from "react-icons/io";

const WhatsAppButton = () => {
  const phoneNumber = "5515997646421";
  const message = "Olá! Gostaria de agendar uma consulta.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex items-center justify-center 
                 w-14 h-14 bg-[var(--zap-logo)] rounded-full shadow-lg
                 group hover:bg-primary-foreground hover:shadow-xl hover:scale-110 
                 transition-all duration-300"
      aria-label="Contato via WhatsApp"
    >
      <IoLogoWhatsapp className="text-white text-3xl" />

      {/* Tooltip */}
      <span
        className="absolute left-full ml-4 px-4 py-2 
                       bg-white dark:bg-gray-800 text-gray-800 dark:text-white 
                       text-sm font-medium rounded-lg shadow-lg whitespace-nowrap 
                       opacity-0 group-hover:opacity-100 pointer-events-none
                       transition-opacity duration-300
                       border border-gray-200 dark:border-gray-700"
      >
        Fale conosco no WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppButton;
