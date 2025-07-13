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
