// src/components/pages/admin/Settings.tsx
"use client";

import { AdminCard } from "@/components/shared/cards/BaseCard";
import { WeekDaySelector } from "@/components/shared/ui/WeekDaySelector";
import { useSettings, WorkingDays } from "@/hooks/useSettings";
import {
  AlertTriangle,
  Bell,
  Clock,
  Globe,
  RefreshCw,
  Save,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface SettingsSection {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  settings: Setting[];
}

type SettingType =
  | "text"
  | "textarea"
  | "switch"
  | "select"
  | "color"
  | "email"
  | "weekdays"
  | "time";

interface Setting {
  id: string;
  label: string;
  description?: string;
  type: SettingType;
  value: any;
  options?: { value: string; label: string }[];
}

export const Settings = () => {
  const [activeSection, setActiveSection] = useState("agendamento");
  const [settingSections, setSettingSections] = useState<SettingsSection[]>([]);
  const [localChanges, setLocalChanges] = useState<Record<string, any>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    settings,
    loading,
    saveMultipleSettings,
    getClinicSettings,
  } = useSettings();

  const initializeSettingSections = useCallback(() => {
    const clinicSettings = getClinicSettings();
    
    const sections: SettingsSection[] = [
      {
        id: "geral",
        name: "Configurações Gerais",
        icon: Globe,
        settings: [
          {
            id: "site_title",
            label: "Título do Site",
            description: "Nome que aparece na aba do navegador",
            type: "text",
            value: settings.geral?.site_title || "Michel de Camargo - Psicólogo Clínico",
          },
          {
            id: "phone_number",
            label: "Telefone de Contato",
            description: "Número exibido no site e usado para WhatsApp",
            type: "text",
            value: settings.geral?.phone_number || "(15) 99764-6421",
          },
          {
            id: "contact_email",
            label: "Email de Contato",
            description: "Email para receber mensagens do formulário",
            type: "email",
            value: settings.geral?.contact_email || "michelcamargo.psi@gmail.com",
          },
        ],
      },
      {
        id: "agendamento",
        name: "Horários de Funcionamento",
        icon: Clock,
        settings: [
          {
            id: "working_days",
            label: "Dias de Atendimento",
            description: "Selecione os dias da semana em que a clínica funciona",
            type: "weekdays",
            value: clinicSettings.working_days,
          },
          {
            id: "start_time",
            label: "Horário de Início",
            description: "Primeiro horário disponível para consultas",
            type: "time",
            value: clinicSettings.start_time,
          },
          {
            id: "end_time",
            label: "Horário de Término",
            description: "Último horário disponível para consultas",
            type: "time",
            value: clinicSettings.end_time,
          },
          {
            id: "session_duration",
            label: "Duração da Consulta (minutos)",
            description: "Duração padrão das consultas",
            type: "select",
            value: clinicSettings.session_duration.toString(),
            options: [
              { value: "30", label: "30 minutos" },
              { value: "45", label: "45 minutos" },
              { value: "50", label: "50 minutos" },
              { value: "60", label: "60 minutos" },
              { value: "90", label: "90 minutos" },
            ],
          },
          {
            id: "first_session_duration",
            label: "Duração Primeira Consulta (minutos)",
            description: "Duração das primeiras consultas",
            type: "select",
            value: clinicSettings.first_session_duration.toString(),
            options: [
              { value: "45", label: "45 minutos" },
              { value: "50", label: "50 minutos" },
              { value: "60", label: "60 minutos" },
              { value: "90", label: "90 minutos" },
            ],
          },
          {
            id: "advance_days",
            label: "Dias de Antecedência",
            description: "Quantos dias no futuro permitir agendamentos",
            type: "select",
            value: clinicSettings.advance_days.toString(),
            options: [
              { value: "30", label: "30 dias" },
              { value: "45", label: "45 dias" },
              { value: "60", label: "60 dias" },
              { value: "90", label: "90 dias" },
            ],
          },
        ],
      },
      {
        id: "notificacoes",
        name: "Notificações",
        icon: Bell,
        settings: [
          {
            id: "email_notifications",
            label: "Notificações por Email",
            description: "Enviar confirmações e lembretes por email",
            type: "switch",
            value: clinicSettings.email_notifications,
          },
          {
            id: "whatsapp_notifications",
            label: "Notificações via WhatsApp",
            description: "Enviar confirmações via WhatsApp",
            type: "switch",
            value: clinicSettings.whatsapp_notifications,
          },
        ],
      },
    ];

    setSettingSections(sections);
  }, [settings, getClinicSettings]);

  useEffect(() => {
    if (!loading) {
      initializeSettingSections();
    }
  }, [loading, settings, initializeSettingSections]);


  const handleSettingChange = (
    sectionId: string,
    settingId: string,
    value: any
  ) => {
    setLocalChanges((prev) => ({
      ...prev,
      [`${sectionId}.${settingId}`]: value,
    }));
  };

  const saveSettings = async () => {
    if (Object.keys(localChanges).length === 0) return;

    setError(null);
    setSuccess(null);

    try {
      // Agrupar mudanças por seção
      const changesBySection: Record<string, Record<string, any>> = {};
      
      Object.entries(localChanges).forEach(([key, value]) => {
        const [sectionId, settingId] = key.split(".");
        if (!changesBySection[sectionId]) {
          changesBySection[sectionId] = {};
        }
        changesBySection[sectionId][settingId] = value;
      });

      // Salvar cada seção
      for (const [sectionId, sectionSettings] of Object.entries(changesBySection)) {
        await saveMultipleSettings(sectionId, sectionSettings);
      }

      setLocalChanges({});
      setSuccess("Configurações salvas com sucesso!");

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(null), 3000);

      // Reinicializar as seções com os novos valores
      setTimeout(() => {
        initializeSettingSections();
      }, 500);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      setError("Erro ao salvar configurações. Tente novamente.");
    }
  };

  const cancelChanges = () => {
    setLocalChanges({});
    setSuccess(null);
    setError(null);
    // Reinicializar as seções com os valores atuais
    initializeSettingSections();
  };

  const restoreDefaults = async () => {
    setError(null);
    setSuccess(null);

    try {
      // Configurações padrão
      const defaultSettings = {
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
        session_duration: 50,
        first_session_duration: 60,
        advance_days: 60,
        email_notifications: true,
        whatsapp_notifications: true,
      };

      await saveMultipleSettings("agendamento", defaultSettings);
      await saveMultipleSettings("geral", {
        site_title: "Michel de Camargo - Psicólogo Clínico",
        phone_number: "(15) 99764-6421",
        contact_email: "michelcamargo.psi@gmail.com",
      });

      setLocalChanges({});
      setSuccess("Configurações restauradas para o padrão!");

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(null), 3000);

      // Reinicializar as seções com os novos valores
      setTimeout(() => {
        initializeSettingSections();
      }, 500);
    } catch (error) {
      console.error("Erro ao restaurar configurações:", error);
      setError("Erro ao restaurar configurações. Tente novamente.");
    }
  };

  const renderSettingInput = (setting: Setting, sectionId: string) => {
    const key = `${sectionId}.${setting.id}`;
    const value = localChanges[key] !== undefined ? localChanges[key] : setting.value;

    switch (setting.type) {
      case "text":
      case "email":
        return (
          <input
            type={setting.type === "email" ? "email" : "text"}
            value={value as string}
            onChange={(e) =>
              handleSettingChange(sectionId, setting.id, e.target.value)
            }
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          />
        );

      case "time":
        return (
          <input
            type="time"
            value={value as string}
            onChange={(e) =>
              handleSettingChange(sectionId, setting.id, e.target.value)
            }
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          />
        );

      case "textarea":
        return (
          <textarea
            value={value as string}
            onChange={(e) =>
              handleSettingChange(sectionId, setting.id, e.target.value)
            }
            rows={3}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 resize-vertical"
          />
        );

      case "weekdays":
        return (
          <WeekDaySelector
            value={value as WorkingDays}
            onChange={(workingDays) =>
              handleSettingChange(sectionId, setting.id, workingDays)
            }
          />
        );

      case "switch":
        return (
          <div className="flex items-center">
            <button
              onClick={() => handleSettingChange(sectionId, setting.id, !value)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                value ? "bg-primary-foreground" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="ml-2 text-sm">
              {value ? "Ativado" : "Desativado"}
            </span>
          </div>
        );

      case "select":
        return (
          <select
            value={value as string}
            onChange={(e) =>
              handleSettingChange(sectionId, setting.id, e.target.value)
            }
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          >
            {setting.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "color":
        return (
          <input
            type="color"
            value={value as string}
            onChange={(e) =>
              handleSettingChange(sectionId, setting.id, e.target.value)
            }
            className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600"
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-4 gap-6" style={{ height: "400px" }}>
            <div className="h-full bg-gray-300 rounded-xl"></div>
            <div className="col-span-3 h-full bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const activeSettingsSection = settingSections.find(
    (section) => section.id === activeSection
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as configurações do sistema
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-600 dark:text-green-400">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="space-y-1">
          {settingSections.map((section) => {
            const SectionIcon = section.icon;
            const isActive = section.id === activeSection;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                  isActive
                    ? "bg-primary-foreground/10 text-primary-foreground"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <SectionIcon className="w-5 h-5 mr-3" />
                <span>{section.name}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3">
          {activeSettingsSection ? (
            <AdminCard title={activeSettingsSection.name}>
              <div className="space-y-8">
                {activeSettingsSection.settings.map((setting) => (
                  <div key={setting.id} className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      {setting.label}
                      {localChanges[`${activeSection}.${setting.id}`] !==
                        undefined && (
                        <span className="ml-2 text-xs text-orange-600 dark:text-orange-400">
                          (alterado)
                        </span>
                      )}
                    </label>

                    {setting.description && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {setting.description}
                      </p>
                    )}

                    {renderSettingInput(setting, activeSection)}
                  </div>
                ))}

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <button
                      onClick={restoreDefaults}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Restaurar Padrão</span>
                    </button>
                  </div>

                  <div className="flex space-x-2">
                    {Object.keys(localChanges).length > 0 && (
                      <button
                        onClick={cancelChanges}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancelar</span>
                      </button>
                    )}
                    
                    <button
                      onClick={saveSettings}
                      disabled={Object.keys(localChanges).length === 0}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-foreground text-white rounded-md hover:bg-primary-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Salvar Alterações</span>
                    </button>
                  </div>
                </div>
              </div>
            </AdminCard>
          ) : (
            <AdminCard title="Configurações">
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <AlertTriangle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Seção não encontrada
                  </h3>
                  <p className="text-muted-foreground">
                    Selecione uma seção de configurações no menu lateral.
                  </p>
                </div>
              </div>
            </AdminCard>
          )}
        </div>
      </div>

      {/* Changes Indicator */}
      {Object.keys(localChanges).length > 0 && (
        <div className="fixed bottom-4 right-4 bg-orange-100 dark:bg-orange-900 border border-orange-300 dark:border-orange-700 rounded-lg p-4 shadow-lg">
          <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
            {Object.keys(localChanges).length} alteração(ões) não salva(s)
          </p>
        </div>
      )}
    </div>
  );
};
