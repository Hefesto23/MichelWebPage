// src/app/contato/page.tsx - REFATORADO
"use client";

import { ContactCard } from "@/components/shared/cards/BaseCard";
import Divisor from "@/components/shared/ui/divisor";
import { Clock, Mail, MapPin, Maximize2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { IoLogoWhatsapp } from "react-icons/io";

export default function Contact() {
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  return (
    <div>
      <section className="contact-section">
        <div className="content-container">
          <div className="relative z-10">
            <h1 className="section-title">Contato</h1>

            <div className="grid-contact">
              {/* Contact Information Card */}
              <ContactCard title="Informações de Contato">
                <div className="space-y-6">
                  {/* Phone */}
                  <Link
                    href="https://wa.me/5515997646421"
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
                        +55 (15) 99764-6421
                      </span>
                    </div>
                  </Link>

                  {/* Email */}
                  <Link
                    href="mailto:michelcamargo.psi@gmail.com"
                    className="contact-item"
                  >
                    <div className="flex items-center w-full">
                      <Mail
                        className="contact-icon"
                        size={24}
                        strokeWidth={3}
                      />
                      <span className="contact-text">
                        michelcamargo.psi@gmail.com
                      </span>
                    </div>
                  </Link>
                </div>
              </ContactCard>

              {/* Location and Hours Card */}
              <ContactCard title="Atendimento">
                <div className="space-y-6">
                  <div className="address-item group">
                    <MapPin
                      className="address-icon group-hover:scale-110 transition-transform duration-300"
                      size={24}
                      strokeWidth={3}
                    />
                    <div className="text-foreground hover:-translate-x-1 transition-transform duration-300">
                      <p className="text-lg">Rua Antônio Ferreira, 171</p>
                      <p className="text-lg">Parque Campolim, Sorocaba SP</p>
                      <p className="text-lg">18047-636, Brasil</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="address-item">
                    <Clock className="address-icon" size={24} strokeWidth={3} />
                    <div className="text-foreground">
                      <p className="text-lg">Segunda à Sexta</p>
                      <p className="text-lg">Das 8:00 as 21:00</p>
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        Obs: As consultas necessitam ser previamente agendadas.
                      </p>
                    </div>
                  </div>
                </div>
              </ContactCard>
            </div>

            {/* Map Card */}
            <ContactCard title="Localização no Mapa">
              <div
                className={`relative overflow-hidden transition-all duration-300 ${
                  isMapExpanded ? "h-[500px]" : "h-64"
                }`}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.5088240408087!2d-47.47244788549275!3d-23.493335284719095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c5d9d6e9e5d7a7%3A0x9fdc74c22ed20a13!2sRua%20Ant%C3%B4nio%20Ferreira%2C%20171%20-%20Parque%20Campolim%2C%20Sorocaba%20-%20SP%2C%2018047-636%2C%20Brasil!5e0!3m2!1sen!2sus!4v1696692299380!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa da Clínica"
                  className="rounded-lg"
                />
              </div>
              <button
                onClick={() => setIsMapExpanded(!isMapExpanded)}
                className="mt-4 flex items-center hover:text-foreground/80 transition-colors group"
              >
                <Maximize2
                  size={20}
                  className="mr-2 group-hover:scale-110 transition-transform duration-300"
                />
                {isMapExpanded ? "Reduzir mapa" : "Expandir mapa"}
              </button>
            </ContactCard>
          </div>
        </div>
      </section>
      <Divisor index={5} />
    </div>
  );
}
