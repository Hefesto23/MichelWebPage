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
import { useState, useCallback, useMemo } from "react";
import { useBatchUpdates } from "@/hooks/useBatchUpdates";

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
  endereco: "",
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
    step: AppointmentStep.DATE_TIME, // Sempre inicia com "Novo Agendamento"
  });

  // Hook para batch updates
  const { batchObjectUpdates } = useBatchUpdates();

  // Funções auxiliares para atualizar estado (memoizadas)
  const updateFormData = useCallback((data: Partial<AppointmentFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const updateState = useCallback((newState: Partial<AppointmentFormState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  }, []);

  const handleError = useCallback((message: string) => {
    updateState({ erro: message });
    setTimeout(() => updateState({ erro: null }), 5000);
  }, [updateState]);

  // Validação centralizada usando utilitários (memoizada)
  const validateStep = useCallback((step: AppointmentStep): boolean => {
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
  }, [formData.dataSelecionada, formData.horarioSelecionado, formData.modalidade, formData.nome, formData.email, formData.telefone, handleError]);

  const proximoPasso = useCallback(() => {
    if (validateStep(state.step)) {
      updateState({ step: state.step + 1 });
      window.scrollTo(0, 0);
    }
  }, [validateStep, state.step, updateState]);

  const passoAnterior = useCallback(() => {
    const novoStep = state.step - 1;
    
    // Se voltando para DATE_TIME, limpar dados de data e horário (batch update)
    if (novoStep === AppointmentStep.DATE_TIME) {
      batchObjectUpdates(setFormData, {
        dataSelecionada: "",
        horarioSelecionado: "",
      });
    }
    
    updateState({ step: novoStep });
    window.scrollTo(0, 0);
  }, [state.step, batchObjectUpdates, updateState]);

  const enviarFormulario = useCallback(async (e: React.FormEvent) => {
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
          endereco: formData.endereco,
          mensagem: formData.mensagem,
          primeiraConsulta: formData.primeiraConsulta,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao agendar consulta");
      }

      // Batch updates para melhor performance
      batchObjectUpdates(setFormData, { codigoAgendamento: data.codigo });
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
  }, [formData, batchObjectUpdates, updateState, handleError]);

  // Classes CSS memoizadas para evitar recálculos
  const activeButtonClasses = useMemo(() => 
    "py-3 px-6 rounded-lg font-medium transition-all duration-200 bg-primary-foreground text-btnFg shadow-md dark:bg-btn dark:text-btn-fg dark:border-btn-border",
    []
  );

  const inactiveButtonClasses = useMemo(() =>
    "py-3 px-6 rounded-lg font-medium transition-all duration-200 bg-background text-card-foreground border-2 border-card hover:border-foreground dark:bg-secondary dark:text-secondary-foreground dark:hover:border-white dark:hover:shadow-md",
    []
  );

  const novoAgendamentoClasses = useMemo(() => 
    `py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
      state.step >= AppointmentStep.DATE_TIME && !state.cancelar
        ? activeButtonClasses
        : inactiveButtonClasses
    }`,
    [state.step, state.cancelar, activeButtonClasses, inactiveButtonClasses]
  );

  const buscarAgendamentoClasses = useMemo(() =>
    `py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
      state.step === AppointmentStep.LOOKUP
        ? activeButtonClasses
        : inactiveButtonClasses
    }`,
    [state.step, activeButtonClasses, inactiveButtonClasses]
  );

  const renderTabNavigation = useCallback(() => {
    if (mode === "schedule") return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => {
            updateState({ step: AppointmentStep.DATE_TIME, cancelar: false });
          }}
          className={novoAgendamentoClasses}
        >
          Novo Agendamento
        </button>
        <button
          onClick={() => {
            updateState({ step: AppointmentStep.LOOKUP, cancelar: false });
          }}
          className={buscarAgendamentoClasses}
        >
          Buscar Agendamento
        </button>
      </div>
    );
  }, [mode, updateState, novoAgendamentoClasses, buscarAgendamentoClasses]);

  const renderCurrentStep = useCallback(() => {
    if (state.erro) {
      return (
        <ContactCard title="Erro">
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300">
            {state.erro}
          </div>
          <button
            onClick={() => updateState({ erro: null })}
            className="py-3 px-6 rounded-lg font-bold bg-primary-foreground text-btnFg shadow-md dark:bg-btn dark:text-btn-fg dark:border-btn-border"
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

    if (state.cancelar && state.step >= AppointmentStep.LOOKUP) {
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
  }, [
    state.erro,
    state.enviado,
    state.cancelar,
    state.step,
    state.carregando,
    formData,
    updateState,
    updateFormData,
    proximoPasso,
    passoAnterior,
    enviarFormulario,
    handleError,
  ]);

  return (
    <div className="w-full" data-testid="appointment-container">
      {renderTabNavigation()}
      {renderCurrentStep()}
    </div>
  );
};
