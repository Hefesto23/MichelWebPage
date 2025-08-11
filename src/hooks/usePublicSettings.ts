// src/hooks/usePublicSettings.ts
"use client";

import { useEffect, useState } from "react";

export interface PublicWorkingDays {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
}

export interface PublicClinicSettings {
  working_days: PublicWorkingDays;
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
  minimum_age: number;
  appointment_note: string;
  additional_notes: string;
  // Endereço
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: string;
  longitude: string;
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
      
      // Fallback para configurações padrão
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
        minimum_age: 20,
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

  // Helper para formatar dias da semana para exibição
  const formatWorkingDays = (workingDays: PublicWorkingDays): string => {
    const dayNames = {
      monday: "Segunda",
      tuesday: "Terça",
      wednesday: "Quarta",
      thursday: "Quinta",
      friday: "Sexta",
      saturday: "Sábado",
    };

    const activeDays = Object.entries(workingDays)
      .filter(([, isActive]) => isActive)
      .map(([day]) => dayNames[day as keyof typeof dayNames]);

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

  // Helper para verificar se um dia está ativo
  const isDayActive = (dayKey: keyof PublicWorkingDays): boolean => {
    return settings?.working_days[dayKey] ?? false;
  };

  // Helper para obter lista de dias ativos como números (0-6, onde 0 = domingo)
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

    return Object.entries(settings.working_days)
      .filter(([, isActive]) => isActive)
      .map(([day]) => dayMapping[day as keyof typeof dayMapping]);
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
    refetch: fetchSettings,
  };
};