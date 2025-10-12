// components/pages/contact/ContactHours.tsx - COM CONFIGURAÇÕES DINÂMICAS
"use client";

import { usePublicSettings } from "@/hooks/usePublicSettings";
import { CLINIC_INFO } from "@/utils/constants";
import { Clock, MapPin } from "lucide-react";
import { useState } from "react";

type AddressType = "primary" | "secondary";

export const ContactHours = () => {
  const { settings, loading, formatWorkingDays } = usePublicSettings();
  const [selectedAddress, setSelectedAddress] = useState<AddressType>("primary");

  // Função para notificar o mapa sobre a mudança de endereço
  const handleAddressChange = (type: AddressType) => {
    setSelectedAddress(type);
    // Disparar evento customizado para o mapa atualizar
    window.dispatchEvent(new CustomEvent('addressChange', { detail: type }));
  };

  // Usar configurações dinâmicas ou fallback para constants
  const workingDaysText = !loading && settings ? formatWorkingDays() : CLINIC_INFO.HOURS.WEEKDAYS;
  const startTime = settings?.start_time || CLINIC_INFO.HOURS.START;
  const endTime = settings?.end_time || CLINIC_INFO.HOURS.END;
  
  // Configurações dinâmicas de endereços (suporte para 2 endereços)
  const street1 = settings?.street || CLINIC_INFO.ADDRESS.STREET;
  const neighborhood1 = settings?.neighborhood || CLINIC_INFO.ADDRESS.NEIGHBORHOOD;
  const city1 = settings?.city || CLINIC_INFO.ADDRESS.CITY;
  const state1 = settings?.state || CLINIC_INFO.ADDRESS.STATE;
  const zipCode1 = settings?.zip_code || CLINIC_INFO.ADDRESS.ZIP;
  
  // Segundo endereço (opcional)
  const street2 = settings?.street2;
  const neighborhood2 = settings?.neighborhood2;
  const city2 = settings?.city2;
  const state2 = settings?.state2;
  const zipCode2 = settings?.zip_code2;
  
  const appointmentNote = settings?.appointment_note || CLINIC_INFO.HOURS.NOTE;

  // Verificar se há segundo endereço
  const hasSecondAddress = street2 && street2.trim() !== "";

  return (
    <div className="space-y-6">
      {/* Primeiro Endereço com Botão à direita */}
      <div className="flex items-start justify-between gap-4">
        <div className="address-item group flex-1">
          <MapPin
            className="address-icon group-hover:scale-110 transition-transform duration-300"
            size={24}
            strokeWidth={3}
          />
          <div className="text-foreground hover:-translate-x-1 transition-transform duration-300">
            <p className="text-lg">{street1}</p>
            <p className="text-lg">
              {neighborhood1}, {city1} {state1}
            </p>
            <p className="text-lg">
              {zipCode1}, Brasil
            </p>
          </div>
        </div>
        {hasSecondAddress && (
          <button
            onClick={() => handleAddressChange("primary")}
            className={`flex items-center gap-1.5 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap self-start ${
              selectedAddress === "primary"
                ? "bg-primary-foreground text-btnFg dark:bg-btn dark:text-btn-fg shadow-md"
                : "bg-background text-card-foreground border-2 border-card hover:border-foreground dark:bg-secondary dark:text-secondary-foreground dark:hover:border-white dark:hover:shadow-md"
            }`}
          >
            <MapPin size={16} />
            Ver no Mapa
          </button>
        )}
      </div>

      {/* Segundo Endereço com Botão à direita (se existir e não estiver vazio) */}
      {hasSecondAddress && (
        <div className="flex items-start justify-between gap-4">
          <div className="address-item group flex-1">
            <MapPin
              className="address-icon group-hover:scale-110 transition-transform duration-300"
              size={24}
              strokeWidth={3}
            />
            <div className="text-foreground hover:-translate-x-1 transition-transform duration-300">
              <p className="text-lg">{street2}</p>
              <p className="text-lg">
                {neighborhood2}, {city2} {state2}
              </p>
              <p className="text-lg">
                {zipCode2}, Brasil
              </p>
            </div>
          </div>
          <button
            onClick={() => handleAddressChange("secondary")}
            className={`flex items-center gap-1.5 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap self-start ${
              selectedAddress === "secondary"
                ? "bg-primary-foreground text-btnFg dark:bg-btn dark:text-btn-fg shadow-md"
                : "bg-background text-card-foreground border-2 border-card hover:border-foreground dark:bg-secondary dark:text-secondary-foreground dark:hover:border-white dark:hover:shadow-md"
            }`}
          >
            <MapPin size={16} />
            Ver no Mapa
          </button>
        </div>
      )}

      {/* Hours */}
      <div className="address-item">
        <Clock className="address-icon" size={24} strokeWidth={3} />
        <div className="text-foreground">
          <p className="text-lg">{loading ? "Carregando..." : workingDaysText}</p>
          <p className="text-lg">
            Das {startTime} as {endTime}
          </p>
          <p className="text-sm text-muted-foreground mt-2 italic">
            Obs: {appointmentNote}
          </p>
        </div>
      </div>
    </div>
  );
};
