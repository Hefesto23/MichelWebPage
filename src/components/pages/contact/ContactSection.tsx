// components/pages/contact/ContactSection.tsx
"use client";

import { ContactCard } from "@/components/shared/cards/BaseCard";
import { ContactHours } from "./ContactHours";
import { ContactInfo } from "./ContactInfo";
import { ContactMap } from "./ContactMap";

export const ContactSection = () => {
  return (
    <section className="contact-section">
      <div className="content-container">
        <div className="relative z-10">
          <h1 className="section-title">Contato</h1>

          <div className="grid-contact">
            <ContactCard title="Informações de Contato">
              <ContactInfo />
            </ContactCard>

            <ContactCard title="Atendimento">
              <ContactHours />
            </ContactCard>
          </div>

          <ContactCard title="Localização no Mapa">
            <ContactMap />
          </ContactCard>
        </div>
      </div>
    </section>
  );
};
