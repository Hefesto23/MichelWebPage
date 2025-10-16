// src/components/pages/admin/Settings.tsx
"use client";

import { AdminCard } from "@/components/shared/cards/BaseCard";
import { WeekDaySelector } from "@/components/shared/ui/WeekDaySelector";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useSettings, WorkingDays } from "@/hooks/useSettings";
import {
  AlertTriangle,
  Bell,
  Clock,
  Globe,
  RefreshCw,
  Save,
  X,
  MapPin,
  User,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState } from "react";

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
  disabled?: boolean;
}

export const Settings = () => {
  const [activeSection, setActiveSection] = useState("agendamento");
  const [settingSections, setSettingSections] = useState<SettingsSection[]>([]);
  const [localChanges, setLocalChanges] = useState<Record<string, any>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [sectionToRestore, setSectionToRestore] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  const {
    settings,
    loading,
    saveMultipleSettings,
  } = useSettings();

  useEffect(() => {
    if (!loading && settings) {
      // Get clinic settings directly without function dependency
      const agendamento = settings.agendamento || {};
      const clinicSettings = {
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
        id: "clinica",
        name: "Informações da Clínica",
        icon: User,
        settings: [
          {
            id: "psychologist_name",
            label: "Nome do Psicólogo",
            description: "Nome completo que aparece no site",
            type: "text",
            value: settings.clinica?.psychologist_name || "Michel de Camargo",
          },
          {
            id: "crp_number",
            label: "Número do CRP",
            description: "Registro profissional (ex: CRP 06/174807)",
            type: "text",
            value: settings.clinica?.crp_number || "CRP 06/174807",
          },
          {
            id: "age_disclaimer",
            label: "Disclaimer de Idade para Atendimento",
            description: "Texto sobre faixa etária de atendimento. Aparece no Hero (página inicial) e no Footer (todas as páginas). Use texto livre como: '* Crianças de 5 a 12 e Adultos a partir de 20 anos'",
            type: "textarea",
            value: settings.clinica?.age_disclaimer || "* Atendimentos a partir de 20 anos de idade",
          },
          {
            id: "appointment_note",
            label: "Observação sobre Agendamentos",
            description: "Nota importante sobre consultas (ex: 'As consultas necessitam ser previamente agendadas.')",
            type: "text",
            value: settings.clinica?.appointment_note || "As consultas necessitam ser previamente agendadas.",
          },
          {
            id: "additional_notes",
            label: "Observações Adicionais",
            description: "Outras informações importantes para exibir no footer",
            type: "textarea",
            value: settings.clinica?.additional_notes || "",
          },
        ],
      },
      {
        id: "endereco",
        name: "Endereços da Clínica",
        icon: MapPin,
        settings: [
          // Primeiro endereço (principal)
          {
            id: "street",
            label: "Rua e Número (Endereço 1)",
            description: "Endereço principal completo com número",
            type: "text",
            value: settings.endereco?.street || "Rua Antônio Ferreira, 171",
          },
          {
            id: "neighborhood",
            label: "Bairro (Endereço 1)",
            description: "Nome do bairro do endereço principal",
            type: "text",
            value: settings.endereco?.neighborhood || "Parque Campolim",
          },
          {
            id: "city",
            label: "Cidade (Endereço 1)",
            description: "Nome da cidade do endereço principal",
            type: "text",
            value: settings.endereco?.city || "Sorocaba",
          },
          {
            id: "state",
            label: "Estado (Endereço 1)",
            description: "Sigla do estado do endereço principal (ex: SP)",
            type: "text",
            value: settings.endereco?.state || "SP",
          },
          {
            id: "zip_code",
            label: "CEP (Endereço 1)",
            description: "Código postal do endereço principal",
            type: "text",
            value: settings.endereco?.zip_code || "18047-636",
          },
          // Segundo endereço (opcional)
          {
            id: "street2",
            label: "Rua e Número (Endereço 2)",
            description: "Segundo endereço (opcional) - deixe vazio se não usar",
            type: "text",
            value: settings.endereco?.street2 || "",
          },
          {
            id: "neighborhood2",
            label: "Bairro (Endereço 2)",
            description: "Nome do bairro do segundo endereço",
            type: "text",
            value: settings.endereco?.neighborhood2 || "",
          },
          {
            id: "city2",
            label: "Cidade (Endereço 2)",
            description: "Nome da cidade do segundo endereço",
            type: "text",
            value: settings.endereco?.city2 || "",
          },
          {
            id: "state2",
            label: "Estado (Endereço 2)",
            description: "Sigla do estado do segundo endereço (ex: SP)",
            type: "text",
            value: settings.endereco?.state2 || "",
          },
          {
            id: "zip_code2",
            label: "CEP (Endereço 2)",
            description: "Código postal do segundo endereço",
            type: "text",
            value: settings.endereco?.zip_code2 || "",
          },
          // Coordenadas (do endereço principal)
          {
            id: "latitude",
            label: "Latitude",
            description: "Coordenada de latitude para o Google Maps (endereço principal)",
            type: "text",
            value: settings.endereco?.latitude || "-23.493335284719095",
          },
          {
            id: "longitude",
            label: "Longitude",
            description: "Coordenada de longitude para o Google Maps (endereço principal)",
            type: "text",
            value: settings.endereco?.longitude || "-47.47244788549275",
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
            description: "🚧 Em desenvolvimento - Funcionalidade será implementada em breve",
            type: "switch",
            value: false,
            disabled: true,
          },
        ],
      },
      ];

      setSettingSections(sections);
    }
  }, [loading, settings]);


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

      // Settings will be refreshed automatically via useEffect
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      setError("Erro ao salvar configurações. Tente novamente.");
    }
  };

  const cancelChanges = () => {
    setLocalChanges({});
    setSuccess(null);
    setError(null);
    // Settings will be refreshed automatically via useEffect
  };

  const handleRestoreClick = (section?: string) => {
    setSectionToRestore(section || null);
    setConfirmDialogOpen(true);
  };

  const restoreDefaults = async () => {
    setResetting(true);
    setError(null);
    setSuccess(null);
    setConfirmDialogOpen(false);

    try {
      // Montar URL com ou sem section query param
      const url = sectionToRestore
        ? `/api/admin/settings?section=${sectionToRestore}`
        : `/api/admin/settings`;

      // Chamar endpoint DELETE para resetar
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao restaurar configurações");
      }

      setLocalChanges({});

      const successMessage = sectionToRestore
        ? `Seção "${sectionToRestore}" restaurada com sucesso!`
        : "Todas as configurações restauradas com sucesso!";

      setSuccess(successMessage);

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(null), 3000);

      // Recarregar a página para refletir as mudanças
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error("Erro ao restaurar configurações:", error);
      setError(error instanceof Error ? error.message : "Erro ao restaurar configurações. Tente novamente.");
    } finally {
      setResetting(false);
      setSectionToRestore(null);
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
        const isDisabled = setting.disabled || false;
        return (
          <div className="flex items-center">
            <button
              onClick={() => !isDisabled && handleSettingChange(sectionId, setting.id, !value)}
              disabled={isDisabled}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                isDisabled 
                  ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed opacity-50" 
                  : value ? "bg-primary-foreground" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                  isDisabled 
                    ? "bg-gray-400 translate-x-1" 
                    : value ? "bg-white translate-x-6" : "bg-white translate-x-1"
                }`}
              />
            </button>
            <span className={`ml-2 text-sm ${isDisabled ? "text-gray-400" : ""}`}>
              {isDisabled ? "Em desenvolvimento" : (value ? "Ativado" : "Desativado")}
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
            <AdminCard
              title={
                <div className="flex items-center justify-between w-full">
                  <span>{activeSettingsSection.name}</span>
                  <button
                    onClick={() => handleRestoreClick(activeSection)}
                    disabled={resetting}
                    className="flex items-center gap-2 px-3 py-2 border border-orange-500 dark:border-orange-400
                               text-orange-600 dark:text-orange-400 rounded-md hover:bg-orange-50
                               dark:hover:bg-orange-900/20 transition-colors text-sm disabled:opacity-50
                               disabled:cursor-not-allowed"
                    title="Restaurar esta seção ao padrão"
                  >
                    <RotateCcw size={16} />
                    <span>Restaurar Seção</span>
                  </button>
                </div>
              }
            >
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
                      onClick={() => handleRestoreClick()}
                      disabled={resetting}
                      className="inline-flex items-center space-x-2 px-4 py-2 border border-[var(--destructive)] text-[var(--destructive)] rounded-md hover:bg-white/10 hover:font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>{resetting ? "Restaurando..." : "Restaurar Todas"}</span>
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

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => {
          setConfirmDialogOpen(false);
          setSectionToRestore(null);
        }}
        onConfirm={restoreDefaults}
        title={
          sectionToRestore
            ? "Restaurar seção ao padrão?"
            : "Restaurar todas as configurações ao padrão?"
        }
        description={
          sectionToRestore
            ? `Tem certeza que deseja restaurar a seção "${
                settingSections.find(s => s.id === sectionToRestore)?.name || sectionToRestore
              }" para os valores padrão? Todas as configurações customizadas desta seção serão perdidas.`
            : "Tem certeza que deseja restaurar TODAS as configurações para os valores padrão? Todas as configurações customizadas serão perdidas. Esta ação não pode ser desfeita."
        }
        confirmText="Sim, restaurar"
        cancelText="Cancelar"
        variant="danger"
        loading={resetting}
      />
    </div>
  );
};
