// src/types/appointment.ts

export interface Appointment {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  dataSelecionada: string; // Formato ISO: YYYY-MM-DD
  horarioSelecionado: string; // Formato HH:MM
  modalidade: "presencial" | "online";
  primeiraConsulta: boolean;
  mensagem?: string;
  codigo: string;
  status: "agendado" | "confirmado" | "cancelado" | "realizado";
  googleEventId?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

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

export interface AppointmentSlot {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  available: boolean;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  status: string;
}

export interface AppointmentConfirmation {
  nome: string;
  email: string;
  data: string;
  horario: string;
  modalidade: "presencial" | "online";
  codigo: string;
}

// ============================================
// 📱 PROPS ESPECÍFICAS POR COMPONENT
// ============================================

// Para AppointmentForm principal
export interface AppointmentFormProps {
  step: number;
  setStep: (step: number) => void;
  formData: AppointmentFormData;
  updateFormData: (data: Partial<AppointmentFormData>) => void;
  setEnviado: (status: boolean) => void;
  carregando: boolean;
  setCarregando: (status: boolean) => void;
  handleError: (message: string) => void;
}

// Para DateTimeSelection step
export interface DateTimeSelectionProps {
  formData: AppointmentFormData;
  updateFormData: (data: Partial<AppointmentFormData>) => void;
  proximoPasso: () => void;
  carregando: boolean;
  setCarregando: (status: boolean) => void;
  handleError: (message: string) => void;
}

// Para ContactInfo step
export interface ContactInfoProps {
  formData: AppointmentFormData;
  updateFormData: (data: Partial<AppointmentFormData>) => void;
  proximoPasso: () => void;
  passoAnterior: () => void;
  carregando: boolean;
}

// Para Confirmation step
export interface ConfirmationProps {
  formData: AppointmentFormData;
  passoAnterior: () => void;
  enviarFormulario: (e: React.FormEvent) => void;
  carregando: boolean;
}

// Para AppointmentConfirmation
export interface AppointmentConfirmationProps {
  formData: AppointmentFormData;
  cancelar: boolean;
}

// Para AppointmentDetails
export interface AppointmentDetailsProps {
  formData: AppointmentFormData;
  setCancelar: (status: boolean) => void;
  setEnviado: (status: boolean) => void;
  carregando: boolean;
  setCarregando: (status: boolean) => void;
  handleError: (message: string) => void;
}

// Para AppointmentLookup
export interface AppointmentLookupProps {
  formData: AppointmentFormData;
  updateFormData: (data: Partial<AppointmentFormData>) => void;
  setCarregando: (status: boolean) => void;
  setCancelar: (status: boolean) => void;
  handleError: (message: string) => void;
  carregando: boolean;
}

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

// Para estados do formulário
export interface AppointmentFormState {
  step: number;
  enviado: boolean;
  cancelar: boolean;
  carregando: boolean;
  erro: string | null;
}

// Para slots de horário
export interface TimeSlot {
  time: string;
  available: boolean;
  blocked?: boolean;
}

// Para validações
export interface ValidationErrors {
  nome?: string;
  email?: string;
  telefone?: string;
  dataSelecionada?: string;
  horarioSelecionado?: string;
  modalidade?: string;
}

export enum AppointmentStep {
  LOOKUP = 0,
  DATE_TIME = 1,
  CONTACT_INFO = 2,
  CONFIRMATION = 3,
}

export enum AppointmentModality {
  PRESENCIAL = "presencial",
  ONLINE = "online",
}

export enum AppointmentStatus {
  AGENDADO = "agendado",
  CONFIRMADO = "confirmado",
  CANCELADO = "cancelado",
  REALIZADO = "realizado",
}
