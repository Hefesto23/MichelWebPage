// src/hooks/useSettings.ts
"use client";

import { useEffect, useState } from "react";

interface Settings {
  [section: string]: {
    [key: string]: any;
  };
}

export interface WorkingDays {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
}

export interface ClinicSettings {
  working_days: WorkingDays;
  start_time: string;
  end_time: string;
  session_duration: number;
  first_session_duration: number;
  advance_days: number;
  email_notifications: boolean;
  whatsapp_notifications: boolean;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar configurações");
      }

      const result = await response.json();
      setSettings(result.data || {});
    } catch (err) {
      console.error("Erro ao buscar configurações:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (section: string, key: string, value: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          section,
          key,
          value,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar configuração");
      }

      // Atualizar estado local
      setSettings((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      }));

      return true;
    } catch (err) {
      console.error("Erro ao atualizar configuração:", err);
      throw err;
    }
  };

  const saveMultipleSettings = async (section: string, newSettings: Record<string, any>) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          section,
          settings: newSettings,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar configurações");
      }

      // Atualizar estado local
      setSettings((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          ...newSettings,
        },
      }));

      return true;
    } catch (err) {
      console.error("Erro ao salvar configurações:", err);
      throw err;
    }
  };

  // Helper para obter configurações específicas da clínica
  const getClinicSettings = (): ClinicSettings => {
    const agendamento = settings.agendamento || {};
    
    return {
      working_days: agendamento.working_days || {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: false,
        saturday: false,
      },
      start_time: agendamento.start_time || "08:00",
      end_time: agendamento.end_time || "21:00",
      session_duration: agendamento.session_duration || 50,
      first_session_duration: agendamento.first_session_duration || 60,
      advance_days: agendamento.advance_days || 60,
      email_notifications: agendamento.email_notifications ?? true,
      whatsapp_notifications: agendamento.whatsapp_notifications ?? true,
    };
  };

  // Helper para formatar dias da semana para exibição
  const formatWorkingDays = (workingDays: WorkingDays): string => {
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

    if (activeDays.length === 0) return "Nenhum dia selecionado";
    if (activeDays.length === 1) return activeDays[0];
    if (activeDays.length === 2) return activeDays.join(" e ");
    
    const lastDay = activeDays.pop();
    return activeDays.join(", ") + " e " + lastDay;
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSetting,
    saveMultipleSettings,
    getClinicSettings,
    formatWorkingDays,
  };
};