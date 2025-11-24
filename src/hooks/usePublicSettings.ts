// src/hooks/usePublicSettings.ts
"use client";

import { useEffect, useState } from "react";
import type {
  WorkingDayConfig,
  LocationBasedWorkingDays,
  LocationScheduleDisplay
} from "@/types/location-schedule";
import {
  isLocationBasedWorkingDays
} from "@/types/location-schedule";

// Legacy format (for backward compatibility)
export interface PublicWorkingDays {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
}

// Type que aceita ambos os formatos
export type WorkingDaysFormat = PublicWorkingDays | LocationBasedWorkingDays;

export interface PublicClinicSettings {
  working_days: WorkingDaysFormat; // Aceita ambos os formatos
  start_time: string;
  end_time: string;
  phone_number: string;
  contact_email: string;
  session_duration: number;
  first_session_duration: number;
  advance_days: number;
  // Informações da Clínica
  psychologist_name: string;
  crp_number: string;
  age_disclaimer: string;
  appointment_note: string;
  additional_notes: string;
  // Endereço principal
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: string;
  longitude: string;
  // Segundo endereço (opcional)
  street2?: string;
  neighborhood2?: string;
  city2?: string;
  state2?: string;
  zip_code2?: string;
}

export const usePublicSettings = () => {
  const [settings, setSettings] = useState<PublicClinicSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/public/settings");

      if (!response.ok) {
        throw new Error("Erro ao buscar configurações");
      }

      const result = await response.json();
      setSettings(result.data);
    } catch (err) {
      console.error("Erro ao buscar configurações:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      
      // Fallback para configurações padrão (usando formato antigo para compatibilidade)
      // Se a API falhar, usa formato legacy que funciona com ambas as versões
      setSettings({
        working_days: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: false,
          saturday: false,
        },
        start_time: "08:00",
        end_time: "21:00",
        phone_number: "(15) 99764-6421",
        contact_email: "michelcamargo.psi@gmail.com",
        session_duration: 50,
        first_session_duration: 60,
        advance_days: 60,
        // Informações da Clínica
        psychologist_name: "Michel de Camargo",
        crp_number: "CRP 06/174807",
        age_disclaimer: "* Atendimentos a partir de 20 anos de idade",
        appointment_note: "As consultas necessitam ser previamente agendadas.",
        additional_notes: "",
        // Endereço
        street: "Rua Antônio Ferreira, 171",
        neighborhood: "Parque Campolim",
        city: "Sorocaba",
        state: "SP",
        zip_code: "18047-636",
        latitude: "-23.493335284719095",
        longitude: "-47.47244788549275",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper para formatar dias da semana para exibição (suporta ambos os formatos)
  const formatWorkingDays = (workingDays: WorkingDaysFormat): string => {
    const dayNames = {
      monday: "Segunda",
      tuesday: "Terça",
      wednesday: "Quarta",
      thursday: "Quinta",
      friday: "Sexta",
      saturday: "Sábado",
    };

    let activeDays: string[];

    // Check if it's the new format (LocationBasedWorkingDays)
    if (isLocationBasedWorkingDays(workingDays)) {
      activeDays = Object.entries(workingDays)
        .filter(([, config]) => (config as WorkingDayConfig).enabled)
        .map(([day]) => dayNames[day as keyof typeof dayNames]);
    } else {
      // Legacy format (boolean)
      activeDays = Object.entries(workingDays)
        .filter(([, isActive]) => isActive)
        .map(([day]) => dayNames[day as keyof typeof dayNames]);
    }

    if (activeDays.length === 0) return "Fechado";
    if (activeDays.length === 1) return activeDays[0];
    if (activeDays.length === 2) return activeDays.join(" e ");

    // Para mais de 2 dias, fazer intervalos inteligentes
    const dayOrder = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const orderedActiveDays = activeDays.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

    // Verificar se é um intervalo contínuo
    const isContiguous = orderedActiveDays.every((day, index) => {
      if (index === 0) return true;
      const currentIndex = dayOrder.indexOf(day);
      const prevIndex = dayOrder.indexOf(orderedActiveDays[index - 1]);
      return currentIndex === prevIndex + 1;
    });

    if (isContiguous && orderedActiveDays.length > 2) {
      const firstDay = orderedActiveDays[0];
      const lastDay = orderedActiveDays[orderedActiveDays.length - 1];
      return `${firstDay} à ${lastDay}`;
    }

    const lastDay = orderedActiveDays.pop();
    return orderedActiveDays.join(", ") + " e " + lastDay;
  };

  // Helper para verificar se um dia está ativo (suporta ambos os formatos)
  const isDayActive = (dayKey: keyof PublicWorkingDays): boolean => {
    if (!settings) return false;
    const dayConfig = settings.working_days[dayKey];

    // New format
    if (typeof dayConfig === 'object' && dayConfig !== null) {
      return (dayConfig as WorkingDayConfig).enabled;
    }

    // Legacy format
    return dayConfig as boolean ?? false;
  };

  // Helper para obter lista de dias ativos como números (1-7, onde 1 = segunda)
  const getActiveDaysAsNumbers = (): number[] => {
    if (!settings) return [];

    const dayMapping = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    const workingDays = settings.working_days;

    // New format
    if (isLocationBasedWorkingDays(workingDays)) {
      return Object.entries(workingDays)
        .filter(([, config]) => (config as WorkingDayConfig).enabled)
        .map(([day]) => dayMapping[day as keyof typeof dayMapping]);
    }

    // Legacy format
    return Object.entries(workingDays)
      .filter(([, isActive]) => isActive)
      .map(([day]) => dayMapping[day as keyof typeof dayMapping]);
  };

  // 🆕 Helper para obter agendamentos organizados por localidade
  const formatScheduleByLocation = (): LocationScheduleDisplay[] => {
    if (!settings) return [];

    const workingDays = settings.working_days;

    // Se não está no novo formato, retornar vazio
    if (!isLocationBasedWorkingDays(workingDays)) {
      return [];
    }

    const locationSchedules: LocationScheduleDisplay[] = [];
    const dayMapping: Record<keyof LocationBasedWorkingDays, string> = {
      monday: 'Segunda-feira',
      tuesday: 'Terça-feira',
      wednesday: 'Quarta-feira',
      thursday: 'Quinta-feira',
      friday: 'Sexta-feira',
      saturday: 'Sábado',
      sunday: 'Domingo'
    };

    // Group days by location
    const location1Days: string[] = [];
    const location2Days: string[] = [];
    const bothLocationsDays: string[] = [];

    Object.entries(workingDays).forEach(([day, config]) => {
      const dayConfig = config as WorkingDayConfig;
      if (!dayConfig.enabled) return;

      const dayLabel = dayMapping[day as keyof LocationBasedWorkingDays];

      if (dayConfig.location === 1) {
        location1Days.push(dayLabel);
      } else if (dayConfig.location === 2) {
        location2Days.push(dayLabel);
      } else {
        bothLocationsDays.push(dayLabel);
      }
    });

    const hours = `das ${settings.start_time} às ${settings.end_time}`;

    // Add location 1 if it has specific days
    if (location1Days.length > 0 || bothLocationsDays.length > 0) {
      locationSchedules.push({
        locationName: 'Localidade Principal',
        locationNumber: 1,
        address: settings.street,
        neighborhood: settings.neighborhood,
        city: settings.city,
        state: settings.state,
        zipCode: settings.zip_code,
        days: [...location1Days, ...bothLocationsDays],
        hours
      });
    }

    // Add location 2 if it has specific days and address exists
    if ((location2Days.length > 0 || bothLocationsDays.length > 0) && settings.street2) {
      locationSchedules.push({
        locationName: 'Localidade Secundária',
        locationNumber: 2,
        address: settings.street2,
        neighborhood: settings.neighborhood2 || '',
        city: settings.city2 || '',
        state: settings.state2 || '',
        zipCode: settings.zip_code2 || '',
        days: [...location2Days, ...bothLocationsDays],
        hours
      });
    }

    return locationSchedules;
  };

  // 🆕 Helper para verificar se um dia é válido para uma localidade específica
  const isDayValidForLocation = (dayKey: keyof PublicWorkingDays, locationNumber: 1 | 2): boolean => {
    if (!settings) return false;

    const workingDays = settings.working_days;
    if (!isLocationBasedWorkingDays(workingDays)) {
      // Legacy format: all days are valid for all locations
      return isDayActive(dayKey);
    }

    const dayConfig = workingDays[dayKey] as WorkingDayConfig;
    if (!dayConfig.enabled) return false;

    // null = both locations
    if (dayConfig.location === null) return true;

    // Check specific location
    return dayConfig.location === locationNumber;
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    formatWorkingDays: settings ? () => formatWorkingDays(settings.working_days) : () => "Carregando...",
    isDayActive,
    getActiveDaysAsNumbers,
    formatScheduleByLocation, // 🆕 Nova função para agendar por localidade
    isDayValidForLocation, // 🆕 Nova função para validar dia por localidade
    refetch: fetchSettings,
  };
};