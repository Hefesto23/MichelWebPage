"use client";
// ============================================
// src/components/pages/appointment/AppointmentFlow.tsx - MELHORADO
// ============================================
import { ContactCard } from "@/components/shared/cards/BaseCard";
import {
  AppointmentFormData,
  AppointmentFormState,
  AppointmentModality,
  AppointmentStep,
} from "@/types/appointment";
import { isFutureDate, isValidEmail, isValidPhone } from "@/utils/validators";
import { useState } from "react";

// Importa componentes refatorados
import AppointmentConfirmation from "@/components/pages/agendamento/AppointmentConfirmation";
import AppointmentDetails from "@/components/pages/agendamento/AppointmentDetails";
import AppointmentLookup from "@/components/pages/agendamento/AppointmentLookup";
import Confirmation from "@/components/pages/agendamento/steps/Confirmation";
import ContactInfo from "@/components/pages/agendamento/steps/ContactInfo";
import DateTimeSelection from "@/components/pages/agendamento/steps/DateTimeSelection";

interface AppointmentFlowProps {
  mode?: "schedule" | "manage";
}

// Estado inicial do formulário usando tipo centralizado
const initialFormData: AppointmentFormData = {
  nome: "",
  email: "",
  telefone: "",
  dataSelecionada: "",
  horarioSelecionado: "",
  modalidade: AppointmentModality.IN_PERSON,
  mensagem: "",
  codigoAgendamento: "",
  codigoConfirmacao: "",
  primeiraConsulta: false,
};

// Estado inicial da aplicação
const initialState: AppointmentFormState = {
  step: AppointmentStep.DATE_TIME,
  enviado: false,
  cancelar: false,
  carregando: false,
  erro: null,
};

export const AppointmentFlow: React.FC<AppointmentFlowProps> = ({
  mode = "schedule",
}) => {
  // Estados usando tipos centralizados
  const [formData, setFormData] =
    useState<AppointmentFormData>(initialFormData);
  const [state, setState] = useState<AppointmentFormState>({
    ...initialState,
    step:
      mode === "manage" ? AppointmentStep.LOOKUP : AppointmentStep.DATE_TIME,
  });

  // Funções auxiliares para atualizar estado
  const updateFormData = (data: Partial<AppointmentFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const updateState = (newState: Partial<AppointmentFormState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  const handleError = (message: string) => {
    updateState({ erro: message });
    setTimeout(() => updateState({ erro: null }), 5000);
  };

  // Validação centralizada usando utilitários
  const validateStep = (step: AppointmentStep): boolean => {
    switch (step) {
      case AppointmentStep.DATE_TIME:
        if (
          !formData.dataSelecionada ||
          !isFutureDate(formData.dataSelecionada)
        ) {
          handleError("Selecione uma data válida.");
          return false;
        }
        if (!formData.horarioSelecionado) {
          handleError("Selecione um horário.");
          return false;
        }
        if (!formData.modalidade) {
          handleError("Selecione a modalidade da consulta.");
          return false;
        }
        return true;

      case AppointmentStep.CONTACT_INFO:
        if (!formData.nome.trim()) {
          handleError("Nome é obrigatório.");
          return false;
        }
        if (!isValidEmail(formData.email)) {
          handleError("E-mail inválido.");
          return false;
        }
        if (!isValidPhone(formData.telefone)) {
          handleError("Telefone inválido.");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const proximoPasso = () => {
    if (validateStep(state.step)) {
      updateState({ step: state.step + 1 });
      window.scrollTo(0, 0);
    }
  };

  const passoAnterior = () => {
    updateState({ step: state.step - 1 });
    window.scrollTo(0, 0);
  };

  const enviarFormulario = async (e: React.FormEvent) => {
    e.preventDefault();
    updateState({ carregando: true });

    try {
      const response = await fetch("/api/calendario/agendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          data: formData.dataSelecionada,
          horario: formData.horarioSelecionado,
          modalidade: formData.modalidade,
          mensagem: formData.mensagem,
          primeiraConsulta: formData.primeiraConsulta,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao agendar consulta");
      }

      updateFormData({ codigoAgendamento: data.codigo });
      updateState({ enviado: true });
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
      handleError(
        (error as Error).message ||
          "Ocorreu um erro ao agendar sua consulta. Por favor, tente novamente."
      );
    } finally {
      updateState({ carregando: false });
    }
  };

  const renderTabNavigation = () => {
    if (mode === "schedule") return null;

    return (
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => {
            updateState({ step: AppointmentStep.LOOKUP, cancelar: false });
          }}
          className={`py-3 px-6 rounded-lg font-medium transition-colors ${
            state.step === AppointmentStep.LOOKUP
              ? "bg-primary-foreground text-btnFg shadow-md"
              : "border-2 border-border hover:bg-secondary"
          }`}
        >
          Buscar Agendamento
        </button>
        <button
          onClick={() => {
            updateState({ step: AppointmentStep.DATE_TIME, cancelar: false });
          }}
          className={`py-3 px-6 rounded-lg font-medium transition-colors ${
            state.step >= AppointmentStep.DATE_TIME && !state.cancelar
              ? "bg-primary-foreground text-btnFg shadow-md"
              : "border-2 border-border hover:bg-secondary"
          }`}
        >
          Novo Agendamento
        </button>
      </div>
    );
  };

  const renderCurrentStep = () => {
    if (state.erro) {
      return (
        <ContactCard title="Erro">
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300">
            {state.erro}
          </div>
          <button
            onClick={() => updateState({ erro: null })}
            className="py-3 px-6 rounded-lg font-bold bg-primary-foreground text-btnFg shadow-md"
          >
            Tentar Novamente
          </button>
        </ContactCard>
      );
    }

    if (state.enviado) {
      return (
        <AppointmentConfirmation
          formData={formData}
          cancelar={state.cancelar}
        />
      );
    }

    if (state.cancelar && state.step > AppointmentStep.LOOKUP) {
      return (
        <AppointmentDetails
          formData={formData}
          setCancelar={(status) => updateState({ cancelar: status })}
          setEnviado={(status) => updateState({ enviado: status })}
          carregando={state.carregando}
          setCarregando={(status) => updateState({ carregando: status })}
          handleError={handleError}
        />
      );
    }

    switch (state.step) {
      case AppointmentStep.LOOKUP:
        return (
          <AppointmentLookup
            formData={formData}
            updateFormData={updateFormData}
            setCarregando={(status) => updateState({ carregando: status })}
            setCancelar={(status) => updateState({ cancelar: status })}
            handleError={handleError}
            carregando={state.carregando}
          />
        );

      case AppointmentStep.DATE_TIME:
        return (
          <DateTimeSelection
            formData={formData}
            updateFormData={updateFormData}
            proximoPasso={proximoPasso}
            carregando={state.carregando}
            setCarregando={(status) => updateState({ carregando: status })}
            handleError={handleError}
          />
        );

      case AppointmentStep.CONTACT_INFO:
        return (
          <ContactInfo
            formData={formData}
            updateFormData={updateFormData}
            proximoPasso={proximoPasso}
            passoAnterior={passoAnterior}
            carregando={state.carregando}
          />
        );

      case AppointmentStep.CONFIRMATION:
        return (
          <Confirmation
            formData={formData}
            passoAnterior={passoAnterior}
            enviarFormulario={enviarFormulario}
            carregando={state.carregando}
          />
        );

      default:
        return (
          <ContactCard title="Erro">
            <p>Passo inválido. Por favor, recarregue a página.</p>
          </ContactCard>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {renderTabNavigation()}
      {renderCurrentStep()}
    </div>
  );
};
