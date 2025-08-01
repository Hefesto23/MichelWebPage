// ============================================
// src/hooks/useAppointmentForm.ts
// ============================================
import {
  AppointmentFormData,
  AppointmentFormState,
  AppointmentModality,
  AppointmentStep,
  ValidationErrors,
} from "@/types/appointment";
import { isFutureDate, isValidEmail, isValidPhone } from "@/utils/validators";
import { useCallback, useState } from "react";

// Estado inicial do formulário
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

export const useAppointmentForm = (
  mode: "schedule" | "manage" = "schedule"
) => {
  // Estados
  const [formData, setFormData] =
    useState<AppointmentFormData>(initialFormData);
  const [state, setState] = useState<AppointmentFormState>({
    ...initialState,
    step:
      mode === "manage" ? AppointmentStep.LOOKUP : AppointmentStep.DATE_TIME,
  });

  // Funções para atualizar estados
  const updateFormData = useCallback((data: Partial<AppointmentFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const updateState = useCallback((newState: Partial<AppointmentFormState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  }, []);

  // Gerenciamento de erros
  const handleError = useCallback(
    (message: string) => {
      updateState({ erro: message });
      setTimeout(() => updateState({ erro: null }), 5000);
    },
    [updateState]
  );

  // Validação centralizada
  const validateStep = useCallback(
    (step: AppointmentStep): ValidationErrors => {
      const errors: ValidationErrors = {};

      switch (step) {
        case AppointmentStep.DATE_TIME:
          if (!formData.dataSelecionada) {
            errors.dataSelecionada = "Selecione uma data para a consulta.";
          } else if (!isFutureDate(formData.dataSelecionada)) {
            errors.dataSelecionada = "A data deve ser futura.";
          }

          if (!formData.horarioSelecionado) {
            errors.horarioSelecionado = "Selecione um horário.";
          }

          if (!formData.modalidade) {
            errors.modalidade = "Selecione a modalidade da consulta.";
          }
          break;

        case AppointmentStep.CONTACT_INFO:
          if (!formData.nome.trim()) {
            errors.nome = "Nome é obrigatório.";
          } else if (formData.nome.length < 2) {
            errors.nome = "Nome deve ter pelo menos 2 caracteres.";
          }

          if (!formData.email) {
            errors.email = "E-mail é obrigatório.";
          } else if (!isValidEmail(formData.email)) {
            errors.email = "E-mail inválido.";
          }

          if (!formData.telefone) {
            errors.telefone = "Telefone é obrigatório.";
          } else if (!isValidPhone(formData.telefone)) {
            errors.telefone = "Telefone inválido.";
          }
          break;
      }

      return errors;
    },
    [formData]
  );

  // Função para verificar se um step é válido
  const isStepValid = useCallback(
    (step: AppointmentStep): boolean => {
      const errors = validateStep(step);
      const hasErrors = Object.keys(errors).length > 0;

      if (hasErrors) {
        const firstError = Object.values(errors)[0];
        handleError(firstError);
      }

      return !hasErrors;
    },
    [validateStep, handleError]
  );

  // Navegação entre steps
  const proximoPasso = useCallback(() => {
    if (isStepValid(state.step)) {
      updateState({ step: state.step + 1 });
      window.scrollTo(0, 0);
    }
  }, [state.step, isStepValid, updateState]);

  const passoAnterior = useCallback(() => {
    updateState({ step: state.step - 1 });
    window.scrollTo(0, 0);
  }, [state.step, updateState]);

  const irParaStep = useCallback(
    (step: AppointmentStep) => {
      updateState({ step, cancelar: false });
    },
    [updateState]
  );

  // Reset do formulário
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setState({
      ...initialState,
      step:
        mode === "manage" ? AppointmentStep.LOOKUP : AppointmentStep.DATE_TIME,
    });
  }, [mode]);

  // Submissão do formulário
  const enviarFormulario = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!isStepValid(AppointmentStep.CONTACT_INFO)) {
        return;
      }

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
    },
    [formData, isStepValid, updateFormData, updateState, handleError]
  );

  // Buscar agendamento existente
  const buscarAgendamento = useCallback(
    async (codigo: string) => {
      if (!codigo.trim()) {
        handleError("Digite o código de confirmação.");
        return;
      }

      updateState({ carregando: true });

      try {
        const response = await fetch("/api/calendario/buscar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codigo }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Agendamento não encontrado");
        }

        const { agendamento } = data;

        updateFormData({
          nome: agendamento.nome,
          email: agendamento.email,
          telefone: agendamento.telefone,
          dataSelecionada: agendamento.data,
          horarioSelecionado: agendamento.horario,
          modalidade: agendamento.modalidade,
          mensagem: agendamento.mensagem,
          codigoConfirmacao: codigo,
        });

        updateState({ cancelar: true });
      } catch (error) {
        console.error("Erro ao buscar agendamento:", error);
        handleError(
          (error as Error).message ||
            "Agendamento não encontrado ou código inválido"
        );
      } finally {
        updateState({ carregando: false });
      }
    },
    [updateFormData, updateState, handleError]
  );

  // Cancelar agendamento
  const cancelarAgendamento = useCallback(async () => {
    if (!formData.codigoConfirmacao) {
      handleError("Código de confirmação não encontrado.");
      return;
    }

    updateState({ carregando: true });

    try {
      const response = await fetch("/api/calendario/cancelar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo: formData.codigoConfirmacao }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cancelar agendamento");
      }

      updateState({ enviado: true });
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      handleError(
        (error as Error).message ||
          "Ocorreu um erro ao cancelar o agendamento. Por favor, tente novamente."
      );
    } finally {
      updateState({ carregando: false });
    }
  }, [formData.codigoConfirmacao, updateState, handleError]);

  // Getters computados
  const isFormValid = isStepValid(state.step);
  const canProceed = !state.carregando && isFormValid;
  const totalSteps = Object.keys(AppointmentStep).length / 2; // enum length
  const progress = ((state.step + 1) / totalSteps) * 100;

  return {
    // Estados
    formData,
    state,

    // Ações de formulário
    updateFormData,
    updateState,
    resetForm,

    // Navegação
    proximoPasso,
    passoAnterior,
    irParaStep,

    // Validação
    validateStep,
    isStepValid,
    isFormValid,

    // Submissão
    enviarFormulario,
    buscarAgendamento,
    cancelarAgendamento,

    // Utilitários
    handleError,
    canProceed,
    progress,

    // Estados computados
    isLoading: state.carregando,
    hasError: !!state.erro,
    errorMessage: state.erro,
    isSubmitted: state.enviado,
    isCancelling: state.cancelar,
  };
};
