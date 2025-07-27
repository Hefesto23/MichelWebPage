// components/pages/contact/ContactInfo.tsx
import { CLINIC_INFO, EXTERNAL_LINKS } from "@/utils/constants";
import { Mail } from "lucide-react";
import Link from "next/link";
import { IoLogoWhatsapp } from "react-icons/io";

export const ContactInfo = () => {
  return (
    <div className="space-y-6">
      {/* Phone */}
      <Link
        href={EXTERNAL_LINKS.WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        className="contact-item group"
      >
        <div className="flex items-center w-full hover:-translate-x-1 transition-transform duration-300">
          <IoLogoWhatsapp
            className="contact-icon group-hover:scale-110 transition-transform duration-300"
            size={24}
          />
          <span className="contact-text group-hover:text-foreground/80 transition-colors">
            {CLINIC_INFO.CONTACT.PHONE_DISPLAY}
          </span>
        </div>
      </Link>

      {/* Email */}
      <Link href={EXTERNAL_LINKS.EMAIL} className="contact-item">
        <div className="flex items-center w-full">
          <Mail className="contact-icon" size={24} strokeWidth={3} />
          <span className="contact-text">{CLINIC_INFO.CONTACT.EMAIL}</span>
        </div>
      </Link>
    </div>
  );
};
