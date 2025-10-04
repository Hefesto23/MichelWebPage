// components/pages/contact/ContactMap.tsx
"use client";

import { usePublicSettings } from "@/hooks/usePublicSettings";
import { CLINIC_INFO } from "@/utils/constants";
import { MapPin, Maximize2 } from "lucide-react";
import { useState } from "react";

type AddressType = "primary" | "secondary";

export const ContactMap = () => {
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressType>("primary");
  const { settings } = usePublicSettings();

  // Função para formatar endereço completo baseado no tipo
  const formatFullAddress = (type: AddressType = "primary"): string => {
    if (settings) {
      if (type === "secondary" && hasSecondAddress) {
        const street = settings.street2!;
        const neighborhood = settings.neighborhood2 || "";
        const city = settings.city2 || "";
        const state = settings.state2 || "";
        const zipCode = settings.zip_code2 || "";
        return `${street}${neighborhood ? ` - ${neighborhood}` : ""}${city ? `, ${city}` : ""}${state ? ` - ${state}` : ""}${zipCode ? `, ${zipCode}` : ""}`;
      }

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

  // Determinar qual endereço mostrar no mapa
  const currentAddress = formatFullAddress(selectedAddress);

  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.5088240408087!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c5d9d6e9e5d7a7%3A0x9fdc74c22ed20a13!2s${encodeURIComponent(
    currentAddress
  )}!5e0!3m2!1sen!2sus!4v1696692299380!5m2!1sen!2sus`;

  return (
    <>
      {/* Botões de seleção de endereço - aparecem apenas se houver 2 endereços */}
      {hasSecondAddress && (
        <div className="mb-4 flex gap-3 flex-wrap">
          <button
            onClick={() => setSelectedAddress("primary")}
            className={`flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              selectedAddress === "primary"
                ? "bg-primary-foreground text-btnFg dark:bg-btn dark:text-btn-fg dark:border-btn-border"
                : "bg-background text-card-foreground border-2 border-card hover:border-foreground hover:text-card-foreground dark:bg-secondary dark:text-secondary-foreground dark:hover:border-white dark:hover:text-secondary-foreground dark:hover:shadow-md"
            }`}
          >
            <MapPin size={20} />
            Endereço Principal
          </button>
          <button
            onClick={() => setSelectedAddress("secondary")}
            className={`flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              selectedAddress === "secondary"
                ? "bg-primary-foreground text-btnFg dark:bg-btn dark:text-btn-fg dark:border-btn-border"
                : "bg-background text-card-foreground border-2 border-card hover:border-foreground hover:text-card-foreground dark:bg-secondary dark:text-secondary-foreground dark:hover:border-white dark:hover:text-secondary-foreground dark:hover:shadow-md"
            }`}
          >
            <MapPin size={20} />
            Endereço Secundário
          </button>
        </div>
      )}

      <div
        className={`relative overflow-hidden transition-all duration-300 ${
          isMapExpanded ? "h-[500px]" : "h-64"
        }`}
      >
        <iframe
          key={selectedAddress} // Força re-render quando muda o endereço
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Mapa da Clínica - ${selectedAddress === "primary" ? "Endereço Principal" : "Endereço Secundário"}`}
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
      </div>
    </>
  );
};
