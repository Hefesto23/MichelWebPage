// src/types/appointment.ts - VERSÃO REFATORADA

import { BaseEntity } from "./common";

// ============================================
// 📅 TIPOS BASE DE AGENDAMENTO
// ============================================
export interface Appointment extends BaseEntity {
  nome: string;
  email: string;
  telefone: string;
  dataSelecionada: string; // YYYY-MM-DD
  horarioSelecionado: string; // HH:MM
  modalidade: AppointmentModality;
  endereco?: string; // Endereço selecionado (apenas para presencial)
  primeiraConsulta: boolean;
  mensagem?: string;
  codigo: string;
  status: AppointmentStatus;
  googleEventId?: string;
}

// ============================================
// 📝 TIPOS DE FORMULÁRIO
// ============================================
export interface AppointmentFormData {
  // Dados pessoais
  nome: string;
  email: string;
  telefone: string;

  // Dados do agendamento
  dataSelecionada: string;
  horarioSelecionado: string;
  modalidade: AppointmentModality;
  endereco?: string; // Endereço selecionado (apenas para presencial)
  primeiraConsulta: boolean;
  mensagem?: string;

  // Códigos
  codigoAgendamento?: string;
  codigoConfirmacao?: string;
}

export interface AppointmentFormState {
  step: AppointmentStep;
  enviado: boolean;
  cancelar: boolean;
  carregando: boolean;
  erro: string | null;
}

// ============================================
// 🔄 ENUMS
// ============================================
export enum AppointmentStep {
  LOOKUP = 0,
  DATE_TIME = 1,
  CONTACT_INFO = 2,
  CONFIRMATION = 3,
}

export enum AppointmentStatus {
  SCHEDULED = "agendado",
  CONFIRMED = "confirmado",
  CANCELLED = "cancelado",
  COMPLETED = "realizado",
}

export enum AppointmentModality {
  IN_PERSON = "presencial",
  ONLINE = "online",
}

// ============================================
// 📊 TIPOS DE DADOS
// ============================================
export interface AppointmentSlot {
  date: string;
  time: string;
  available: boolean;
  duration?: number;
}

export interface AppointmentDay {
  date: string;
  dayOfWeek: string;
  isBlocked: boolean;
  slots: AppointmentSlot[];
}

export interface AppointmentCalendar {
  month: number;
  year: number;
  days: AppointmentDay[];
}

// ============================================
// 🔍 TIPOS DE FILTRO E BUSCA
// ============================================
export interface AppointmentFilters {
  status?: AppointmentStatus;
  modality?: AppointmentModality;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  onlyFirstAppointments?: boolean;
}

export interface AppointmentSearchResult {
  appointment: Appointment;
  matchScore?: number;
}

// ============================================
// 📧 TIPOS DE NOTIFICAÇÃO
// ============================================
export interface AppointmentNotification {
  type: "confirmation" | "reminder" | "cancellation" | "rescheduling";
  appointment: Appointment;
  sendEmail: boolean;
  sendSMS: boolean;
  sendWhatsApp: boolean;
  scheduledFor?: string;
}

// ============================================
// 📊 TIPOS DE ESTATÍSTICA
// ============================================
export interface AppointmentStats {
  total: number;
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;

  byModality: {
    presencial: number;
    online: number;
  };

  byPeriod: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };

  averageDuration: number;
  cancellationRate: number;
  noShowRate: number;
  completionRate: number;
}

// ============================================
// 🗓️ TIPOS DO GOOGLE CALENDAR
// ============================================
export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: "needsAction" | "declined" | "tentative" | "accepted";
  }>;
  status: "confirmed" | "tentative" | "cancelled";
  colorId?: string;
}

// ============================================
// ✅ TIPOS DE VALIDAÇÃO
// ============================================
export interface ValidationErrors {
  nome?: string;
  email?: string;
  telefone?: string;
  dataSelecionada?: string;
  horarioSelecionado?: string;
  modalidade?: string;
  mensagem?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
}

// ============================================
// 🎯 TIPOS DE AÇÃO
// ============================================
export type AppointmentAction =
  | { type: "SET_STEP"; payload: AppointmentStep }
  | { type: "UPDATE_FORM"; payload: Partial<AppointmentFormData> }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SUBMITTED"; payload: boolean }
  | { type: "SET_CANCELLING"; payload: boolean }
  | { type: "RESET_FORM" };

// ============================================
// 🔧 TIPOS DE CONFIGURAÇÃO
// ============================================
export interface AppointmentConfig {
  allowWeekends: boolean;
  allowHolidays: boolean;
  minAdvanceDays: number;
  maxAdvanceDays: number;
  defaultDuration: number;
  firstAppointmentDuration: number;
  timeSlotInterval: number; // em minutos
  bufferTime: number; // tempo entre consultas
  cancellationDeadline: number; // horas antes
  reminderTime: number; // horas antes
}

// ============================================
// 📱 TIPOS DE COMPONENTE
// ============================================
export interface DateTimeSelectionProps {
  formData: AppointmentFormData;
  updateFormData: (data: Partial<AppointmentFormData>) => void;
  proximoPasso: () => void;
  carregando: boolean;
  setCarregando: (status: boolean) => void;
  handleError: (message: string) => void;
}

export interface ContactInfoProps {
  formData: AppointmentFormData;
  updateFormData: (data: Partial<AppointmentFormData>) => void;
  proximoPasso: () => void;
  passoAnterior: () => void;
  carregando: boolean;
}

export interface ConfirmationProps {
  formData: AppointmentFormData;
  passoAnterior: () => void;
  enviarFormulario: (e: React.FormEvent) => void;
  carregando: boolean;
}

export interface AppointmentDetailsProps {
  formData: AppointmentFormData;
  setCancelar: (status: boolean) => void;
  setEnviado: (status: boolean) => void;
  carregando: boolean;
  setCarregando: (status: boolean) => void;
  handleError: (message: string) => void;
}

export interface AppointmentLookupProps {
  formData: AppointmentFormData;
  updateFormData: (data: Partial<AppointmentFormData>) => void;
  setCarregando: (status: boolean) => void;
  setCancelar: (status: boolean) => void;
  handleError: (message: string) => void;
  carregando: boolean;
}

// ============================================
// 🔄 TIPOS DE RESPOSTA
// ============================================
export interface AppointmentResponse {
  success: boolean;
  appointment?: Appointment;
  message?: string;
  code?: string;
}

export interface AvailableSlotsResponse {
  date: string;
  slots: Array<{
    time: string;
    available: boolean;
  }>;
}

export interface AppointmentListResponse {
  appointments: Appointment[];
  total: number;
  page: number;
  pageSize: number;
}

// Type guards
export const isAppointmentStatus = (
  value: unknown
): value is AppointmentStatus => {
  return Object.values(AppointmentStatus).includes(value as AppointmentStatus);
};

export const isAppointmentModality = (
  value: unknown
): value is AppointmentModality => {
  return Object.values(AppointmentModality).includes(
    value as AppointmentModality
  );
};
