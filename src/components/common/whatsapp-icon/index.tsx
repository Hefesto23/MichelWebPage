"use client";

import { IoLogoWhatsapp } from "react-icons/io";
import styles from "./whatsapp.module.css";

const WhatsAppButton = () => {
  // Número do WhatsApp formatado para o link
  const phoneNumber = "5515997646421"; // Substitua pelo número correto
  const message = "Olá! Gostaria de agendar uma consulta."; // Mensagem padrão

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.whatsappButton} group hover:bg-primary-foreground hover:shadow-xl hover:scale-110 transition-all duration-300`}
      aria-label="Contato via WhatsApp"
    >
      <IoLogoWhatsapp className={styles.icon} />

      {/* Tooltip */}
      <span
        className={`${styles.tooltip} group-hover:opacity-100
        pointer-events-none
        transition-opacity duration-300`}
      >
        Fale conosco no WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppButton;
