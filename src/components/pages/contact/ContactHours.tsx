// components/pages/contact/ContactHours.tsx - COM CONFIGURAÇÕES DINÂMICAS
"use client";

import { usePublicSettings } from "@/hooks/usePublicSettings";
import { CLINIC_INFO } from "@/utils/constants";
import { Clock, MapPin } from "lucide-react";
import { useState } from "react";

type AddressType = "primary" | "secondary";

export const ContactHours = () => {
  const { settings, loading, formatWorkingDays, formatScheduleByLocation } = usePublicSettings();
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
            className="address-icon group-hover:scale-110 transition-transform duration-300 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
            size={24}
            strokeWidth={3}
          />
          <div className="text-foreground hover:-translate-x-1 transition-transform duration-300">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg">{street1}</p>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg">
              {neighborhood1}, {city1} {state1}
            </p>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg">
              {zipCode1}, Brasil
            </p>
          </div>
        </div>
        {hasSecondAddress && (
          <button
            onClick={() => handleAddressChange("primary")}
            className={`flex items-center gap-1 sm:gap-1.5 py-2 px-3 sm:py-2.5 sm:px-4 md:py-3 md:px-6 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all duration-200 whitespace-nowrap self-start min-h-[40px] sm:min-h-[42px] md:min-h-[44px] ${
              selectedAddress === "primary"
                ? "bg-primary-foreground text-btnFg dark:bg-btn dark:text-btn-fg shadow-md"
                : "bg-background text-card-foreground border-2 border-card hover:border-foreground dark:bg-secondary dark:text-secondary-foreground dark:hover:border-white dark:hover:shadow-md"
            }`}
          >
            <MapPin size={16} className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4" />
            Ver no Mapa
          </button>
        )}
      </div>

      {/* Segundo Endereço com Botão à direita (se existir e não estiver vazio) */}
      {hasSecondAddress && (
        <div className="flex items-start justify-between gap-4">
          <div className="address-item group flex-1">
            <MapPin
              className="address-icon group-hover:scale-110 transition-transform duration-300 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
              size={24}
              strokeWidth={3}
            />
            <div className="text-foreground hover:-translate-x-1 transition-transform duration-300">
              <p className="text-xs sm:text-sm md:text-base lg:text-lg">{street2}</p>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg">
                {neighborhood2}, {city2} {state2}
              </p>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg">
                {zipCode2}, Brasil
              </p>
            </div>
          </div>
          <button
            onClick={() => handleAddressChange("secondary")}
            className={`flex items-center gap-1 sm:gap-1.5 py-2 px-3 sm:py-2.5 sm:px-4 md:py-3 md:px-6 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all duration-200 whitespace-nowrap self-start min-h-[40px] sm:min-h-[42px] md:min-h-[44px] ${
              selectedAddress === "secondary"
                ? "bg-primary-foreground text-btnFg dark:bg-btn dark:text-btn-fg shadow-md"
                : "bg-background text-card-foreground border-2 border-card hover:border-foreground dark:bg-secondary dark:text-secondary-foreground dark:hover:border-white dark:hover:shadow-md"
            }`}
          >
            <MapPin size={16} className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4" />
            Ver no Mapa
          </button>
        </div>
      )}

      {/* Hours - Location Based Schedule */}
      {(() => {
        const locationSchedules = formatScheduleByLocation();

        // If there are location-based schedules, show them
        if (locationSchedules.length > 0) {
          return (
            <div className="space-y-6">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-4">
                📅 Horários de Atendimento por Localidade
              </h3>
              {locationSchedules.map((schedule, index) => (
                <div key={index} className="address-item group">
                  <Clock
                    className="address-icon group-hover:scale-110 transition-transform duration-300 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
                    size={24}
                    strokeWidth={3}
                  />
                  <div className="text-foreground hover:-translate-x-1 transition-transform duration-300">
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl font-extrabold text-primary">
                      {schedule.locationName}
                    </p>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg mt-1">
                      {schedule.days.join(', ')}
                    </p>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg">
                      {schedule.hours}
                    </p>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
                      📍 {schedule.address}, {schedule.neighborhood}
                    </p>
                    {appointmentNote && (
                      <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-2 italic">
                        Obs: {appointmentNote}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        }

        // Fallback to traditional display
        return (
          <div className="address-item">
            <Clock className="address-icon w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" size={24} strokeWidth={3} />
            <div className="text-foreground">
              {loading ? (
                <p className="text-xs sm:text-sm md:text-base lg:text-lg">Carregando...</p>
              ) : workingDaysText.toLowerCase() === "fechado" ? (
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-amber-600 dark:text-amber-400 font-bold">
                  ⚠️ Agendamentos indisponíveis - Favor entrar em contato
                </p>
              ) : (
                <>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg">{workingDaysText}</p>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg">
                    Das {startTime} as {endTime}
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-2 italic">
                    Obs: {appointmentNote}
                  </p>
                </>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
