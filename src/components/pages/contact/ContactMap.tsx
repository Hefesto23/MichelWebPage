// components/pages/contact/ContactMap.tsx
"use client";

import { usePublicSettings } from "@/hooks/usePublicSettings";
import { CLINIC_INFO } from "@/utils/constants";
import { Maximize2 } from "lucide-react";
import { useState } from "react";

export const ContactMap = () => {
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const { settings } = usePublicSettings();

  // Função para formatar endereço completo baseado nas configurações
  const formatFullAddress = (): string => {
    if (settings) {
      const street = settings.street || CLINIC_INFO.ADDRESS.STREET;
      const neighborhood = settings.neighborhood || CLINIC_INFO.ADDRESS.NEIGHBORHOOD;
      const city = settings.city || CLINIC_INFO.ADDRESS.CITY;
      const state = settings.state || CLINIC_INFO.ADDRESS.STATE;
      const zipCode = settings.zip_code || CLINIC_INFO.ADDRESS.ZIP;
      return `${street} - ${neighborhood}, ${city} - ${state}, ${zipCode}`;
    }
    
    const { STREET, NEIGHBORHOOD, CITY, STATE, ZIP } = CLINIC_INFO.ADDRESS;
    return `${STREET} - ${NEIGHBORHOOD}, ${CITY} - ${STATE}, ${ZIP}`;
  };

  // Verificar se há segundo endereço (não vazio)
  const hasSecondAddress = settings?.street2 && settings.street2.trim() !== "";

  // Usar coordenadas dinâmicas ou fallback
  const latitude = settings?.latitude || CLINIC_INFO.ADDRESS.COORDINATES.LAT;
  const longitude = settings?.longitude || CLINIC_INFO.ADDRESS.COORDINATES.LNG;

  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.5088240408087!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c5d9d6e9e5d7a7%3A0x9fdc74c22ed20a13!2s${encodeURIComponent(
    formatFullAddress()
  )}!5e0!3m2!1sen!2sus!4v1696692299380!5m2!1sen!2sus`;

  return (
    <>
      <div
        className={`relative overflow-hidden transition-all duration-300 ${
          isMapExpanded ? "h-[500px]" : "h-64"
        }`}
      >
        <iframe
          src={mapUrl}
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
      
      <div className="mt-4 flex flex-col space-y-2">
        <button
          onClick={() => setIsMapExpanded(!isMapExpanded)}
          className="flex items-center hover:text-foreground/80 transition-colors group self-start"
        >
          <Maximize2
            size={20}
            className="mr-2 group-hover:scale-110 transition-transform duration-300"
          />
          {isMapExpanded ? "Reduzir mapa" : "Expandir mapa"}
        </button>
        
        {hasSecondAddress && (
          <p className="text-sm text-muted-foreground italic">
            * O mapa mostra apenas o endereço principal. Consulte os endereços completos na seção &quot;Atendimento&quot; acima.
          </p>
        )}
      </div>
    </>
  );
};
