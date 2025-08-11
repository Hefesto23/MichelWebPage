// components/pages/contact/ContactHours.tsx - COM CONFIGURAÇÕES DINÂMICAS
"use client";

import { usePublicSettings } from "@/hooks/usePublicSettings";
import { CLINIC_INFO } from "@/utils/constants";
import { Clock, MapPin } from "lucide-react";

export const ContactHours = () => {
  const { settings, loading, formatWorkingDays } = usePublicSettings();

  // Usar configurações dinâmicas ou fallback para constants
  const workingDaysText = !loading && settings ? formatWorkingDays() : CLINIC_INFO.HOURS.WEEKDAYS;
  const startTime = settings?.start_time || CLINIC_INFO.HOURS.START;
  const endTime = settings?.end_time || CLINIC_INFO.HOURS.END;

  return (
    <div className="space-y-6">
      <div className="address-item group">
        <MapPin
          className="address-icon group-hover:scale-110 transition-transform duration-300"
          size={24}
          strokeWidth={3}
        />
        <div className="text-foreground hover:-translate-x-1 transition-transform duration-300">
          <p className="text-lg">{CLINIC_INFO.ADDRESS.STREET}</p>
          <p className="text-lg">
            {CLINIC_INFO.ADDRESS.NEIGHBORHOOD}, {CLINIC_INFO.ADDRESS.CITY}{" "}
            {CLINIC_INFO.ADDRESS.STATE}
          </p>
          <p className="text-lg">
            {CLINIC_INFO.ADDRESS.ZIP}, {CLINIC_INFO.ADDRESS.COUNTRY}
          </p>
        </div>
      </div>

      {/* Hours */}
      <div className="address-item">
        <Clock className="address-icon" size={24} strokeWidth={3} />
        <div className="text-foreground">
          <p className="text-lg">{loading ? "Carregando..." : workingDaysText}</p>
          <p className="text-lg">
            Das {startTime} as {endTime}
          </p>
          <p className="text-sm text-muted-foreground mt-2 italic">
            Obs: {CLINIC_INFO.HOURS.NOTE}
          </p>
        </div>
      </div>
    </div>
  );
};
