// src/components/pages/admin/Settings.tsx
"use client";

import { AdminCard } from "@/components/shared/cards/BaseCard";
import {
  AlertTriangle,
  Bell,
  Calendar,
  Globe,
  Lock,
  Mail,
  Save,
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
  | "email";

interface Setting {
  id: string;
  label: string;
  description?: string;
  type: SettingType;
  value: string | boolean;
  options?: { value: string; label: string }[];
}

export const Settings = () => {
  const [activeSection, setActiveSection] = useState("geral");
  const [settings, setSettings] = useState<SettingsSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changes, setChanges] = useState<Record<string, unknown>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setError(null);

      // Simulando carregamento
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dados simulados
      const mockSettings: SettingsSection[] = [
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
              value: "Psicólogo Michel | Consultório",
            },
            {
              id: "meta_description",
              label: "Meta Descrição",
              description: "Descrição usada por mecanismos de busca",
              type: "textarea",
              value:
                "Consultório especializado em análise comportamental e atendimento para ansiedade e depressão.",
            },
            {
              id: "phone_number",
              label: "Telefone de Contato",
              description: "Número exibido no site e usado para WhatsApp",
              type: "text",
              value: "(15) 99764-6421",
            },
            {
              id: "maintenance_mode",
              label: "Modo Manutenção",
              description: "Exibe uma página de manutenção em vez do site",
              type: "switch",
              value: false,
            },
          ],
        },
        {
          id: "email",
          name: "Configurações de Email",
          icon: Mail,
          settings: [
            {
              id: "contact_email",
              label: "Email de Contato",
              description: "Email para receber mensagens do formulário",
              type: "email",
              value: "michelcamargo.psi@gmail.com",
            },
            {
              id: "email_confirmation",
              label: "Enviar Confirmação por Email",
              description: "Envia email automático após agendamento",
              type: "switch",
              value: true,
            },
            {
              id: "email_reminder",
              label: "Enviar Lembretes por Email",
              description: "Envia lembretes 24h antes da consulta",
              type: "switch",
              value: true,
            },
            {
              id: "email_template",
              label: "Template de Email",
              description: "Modelo usado para emails automáticos",
              type: "select",
              value: "default",
              options: [
                { value: "default", label: "Padrão" },
                { value: "minimal", label: "Minimalista" },
                { value: "professional", label: "Profissional" },
              ],
            },
          ],
        },
        {
          id: "agendamento",
          name: "Configurações de Agendamento",
          icon: Calendar,
          settings: [
            {
              id: "default_session_time",
              label: "Duração Padrão (minutos)",
              description: "Duração padrão das consultas de retorno",
              type: "select",
              value: "50",
              options: [
                { value: "30", label: "30 minutos" },
                { value: "45", label: "45 minutos" },
                { value: "50", label: "50 minutos" },
                { value: "60", label: "60 minutos" },
              ],
            },
            {
              id: "first_session_time",
              label: "Duração Primeira Consulta (minutos)",
              description: "Duração das primeiras consultas",
              type: "select",
              value: "60",
              options: [
                { value: "45", label: "45 minutos" },
                { value: "50", label: "50 minutos" },
                { value: "60", label: "60 minutos" },
                { value: "90", label: "90 minutos" },
              ],
            },
            {
              id: "block_weekends",
              label: "Bloquear Finais de Semana",
              description: "Impede agendamentos aos sábados e domingos",
              type: "switch",
              value: true,
            },
            {
              id: "advance_days",
              label: "Dias de Antecedência",
              description: "Quantos dias no futuro permitir agendamentos",
              type: "select",
              value: "60",
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
              id: "admin_new_appointment",
              label: "Nova Consulta Agendada",
              description: "Notificar quando um novo agendamento for feito",
              type: "switch",
              value: true,
            },
            {
              id: "admin_appointment_canceled",
              label: "Consulta Cancelada",
              description: "Notificar quando uma consulta for cancelada",
              type: "switch",
              value: true,
            },
            {
              id: "whatsapp_confirmation",
              label: "Confirmação via WhatsApp",
              description: "Enviar mensagem de WhatsApp após agendamento",
              type: "switch",
              value: true,
            },
            {
              id: "whatsapp_reminder",
              label: "Lembrete via WhatsApp",
              description: "Enviar lembrete via WhatsApp 24h antes",
              type: "switch",
              value: true,
            },
          ],
        },
        {
          id: "senha",
          name: "Senha e Segurança",
          icon: Lock,
          settings: [
            {
              id: "admin_user",
              label: "Usuário Admin",
              type: "text",
              value: "admin@clinica.com",
            },
            {
              id: "change_password",
              label: "Alterar Senha",
              description: "Clique para alterar a senha de administrador",
              type: "text",
              value: "••••••••",
            },
          ],
        },
      ];

      setSettings(mockSettings);
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      setError("Erro ao carregar configurações. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (
    sectionId: string,
    settingId: string,
    value: string | boolean
  ) => {
    setChanges((prev) => ({
      ...prev,
      [`${sectionId}.${settingId}`]: value,
    }));
  };

  const saveSettings = async () => {
    if (Object.keys(changes).length === 0) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulando salvamento
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Atualizar estado local com as mudanças
      const updatedSettings = [...settings];

      Object.entries(changes).forEach(([key, value]) => {
        const [sectionId, settingId] = key.split(".");
        const sectionIndex = updatedSettings.findIndex(
          (s) => s.id === sectionId
        );

        if (sectionIndex !== -1) {
          const settingIndex = updatedSettings[sectionIndex].settings.findIndex(
            (s) => s.id === settingId
          );

          if (settingIndex !== -1) {
            updatedSettings[sectionIndex].settings[settingIndex].value =
              value as string | boolean;
          }
        }
      });

      setSettings(updatedSettings);
      setChanges({});
      setSuccess("Configurações salvas com sucesso!");

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      setError("Erro ao salvar configurações. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const renderSettingInput = (setting: Setting, sectionId: string) => {
    const key = `${sectionId}.${setting.id}`;
    const value = changes[key] !== undefined ? changes[key] : setting.value;

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

  const activeSettingsSection = settings.find(
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
          {settings.map((section) => {
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
                      {changes[`${activeSection}.${setting.id}`] !==
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

                {/* Save Button */}
                <div className="flex justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={saveSettings}
                    disabled={saving || Object.keys(changes).length === 0}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-foreground text-white rounded-md hover:bg-primary-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? "Salvando..." : "Salvar Alterações"}</span>
                  </button>
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
      {Object.keys(changes).length > 0 && (
        <div className="fixed bottom-4 right-4 bg-orange-100 dark:bg-orange-900 border border-orange-300 dark:border-orange-700 rounded-lg p-4 shadow-lg">
          <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
            {Object.keys(changes).length} alteração(ões) não salva(s)
          </p>
        </div>
      )}
    </div>
  );
};
