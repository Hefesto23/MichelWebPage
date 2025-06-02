// ==========================================
// src/types/appointment.ts
// ==========================================
/**
 * Interface principal para um agendamento
 */
export interface Appointment {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  dataSelecionada: string;
  horarioSelecionado: string;
  modalidade: "presencial" | "online";
  primeiraConsulta: boolean;
  mensagem?: string;
  codigo: string;
  status: "agendado" | "confirmado" | "cancelado" | "realizado";
  googleEventId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Dados do formulário de agendamento
 */
export interface AppointmentFormData {
  nome: string;
  email: string;
  telefone: string;
  dataSelecionada: string;
  horarioSelecionado: string;
  modalidade: "presencial" | "online";
  primeiraConsulta: boolean;
  mensagem?: string;
  codigoAgendamento?: string;
  codigoConfirmacao?: string;
}

/**
 * Tipos para status e modalidade
 */
export type AppointmentStatus =
  | "agendado"
  | "confirmado"
  | "cancelado"
  | "realizado";
export type AppointmentModality = "presencial" | "online";

/**
 * Resposta da API ao criar agendamento
 */
export interface CreateAppointmentResponse {
  success: boolean;
  codigo: string;
  eventoId?: string;
}

/**
 * Resposta da API ao buscar agendamento
 */
export interface FindAppointmentResponse {
  success: boolean;
  agendamento: Appointment;
}

/**
 * Horários disponíveis
 */
export interface AvailableTimesResponse {
  horariosDisponiveis: string[];
}
