// ==========================================
// src/hooks/useAppointment.ts
// ==========================================
import { appointmentApi } from "@/services/api/client";
import type { Appointment, AppointmentFormData } from "@/types/appointment";
import { validateAppointmentForm } from "@/utils/validators";
import { useState } from "react";

interface UseAppointmentReturn {
  // Estados
  loading: boolean;
  error: string | null;
  formErrors: Record<string, string>;

  // Métodos
  createAppointment: (
    data: Partial<AppointmentFormData>
  ) => Promise<{ codigo: string }>;
  cancelAppointment: (codigo: string) => Promise<void>;
  findAppointment: (codigo: string) => Promise<Appointment>;
  getAvailableTimes: (date: string) => Promise<string[]>;
  validateForm: (data: Partial<AppointmentFormData>) => boolean;
  clearErrors: () => void;
}

export const useAppointment = (): UseAppointmentReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const clearErrors = () => {
    setError(null);
    setFormErrors({});
  };

  const validateForm = (data: Partial<AppointmentFormData>): boolean => {
    const errors = validateAppointmentForm({
      nome: data.nome || "",
      email: data.email || "",
      telefone: data.telefone || "",
      dataSelecionada: data.dataSelecionada || "",
      horarioSelecionado: data.horarioSelecionado || "",
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createAppointment = async (data: Partial<AppointmentFormData>) => {
    setLoading(true);
    clearErrors();

    try {
      if (!validateForm(data)) {
        throw new Error("Preencha todos os campos corretamente");
      }

      const response = await appointmentApi.post<{
        success: boolean;
        codigo: string;
      }>("/agendar", {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        data: data.dataSelecionada,
        horario: data.horarioSelecionado,
        modalidade: data.modalidade,
        mensagem: data.mensagem,
        primeiraConsulta: data.primeiraConsulta,
      });

      return { codigo: response.codigo };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao agendar consulta";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (codigo: string) => {
    setLoading(true);
    clearErrors();

    try {
      await appointmentApi.post("/cancelar", { codigo });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao cancelar agendamento";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const findAppointment = async (codigo: string) => {
    setLoading(true);
    clearErrors();

    try {
      const response = await appointmentApi.post<{ agendamento: Appointment }>(
        "/buscar",
        { codigo }
      );
      return response.agendamento;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Agendamento não encontrado";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableTimes = async (date: string) => {
    setLoading(true);
    clearErrors();

    try {
      const response = await appointmentApi.get<{
        horariosDisponiveis: string[];
      }>("/horarios", { data: date });
      return response.horariosDisponiveis;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao buscar horários";
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    formErrors,
    createAppointment,
    cancelAppointment,
    findAppointment,
    getAvailableTimes,
    validateForm,
    clearErrors,
  };
};
