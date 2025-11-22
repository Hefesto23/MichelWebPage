// components/pages/contact/ContactInfo.tsx
"use client";

import { usePublicSettings } from "@/hooks/usePublicSettings";
import { CLINIC_INFO } from "@/utils/constants";
import { Mail } from "lucide-react";
import Link from "next/link";
import { IoLogoWhatsapp } from "react-icons/io";

export const ContactInfo = () => {
  const { settings } = usePublicSettings();

  // Usar configurações dinâmicas ou fallback
  const phoneDisplay = settings?.phone_number || CLINIC_INFO.CONTACT.PHONE_DISPLAY;
  const whatsappNumber = settings?.phone_number?.replace(/\D/g, "") || CLINIC_INFO.CONTACT.WHATSAPP;
  const contactEmail = settings?.contact_email || CLINIC_INFO.CONTACT.EMAIL;
  return (
    <div className="space-y-6">
      {/* Phone */}
      <Link
        href={`https://wa.me/55${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="contact-item group"
      >
        <div className="flex items-center w-full hover:-translate-x-1 transition-transform duration-300">
          <IoLogoWhatsapp
            className="contact-icon group-hover:scale-110 transition-transform duration-300 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
            size={24}
          />
          <span className="contact-text group-hover:text-foreground/80 transition-colors">
            {phoneDisplay}
          </span>
        </div>
      </Link>

      {/* Email */}
      <Link href={`mailto:${contactEmail}`} className="contact-item">
        <div className="flex items-center w-full">
          <Mail className="contact-icon w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" size={24} strokeWidth={3} />
          <span className="contact-text">{contactEmail}</span>
        </div>
      </Link>
    </div>
  );
};
