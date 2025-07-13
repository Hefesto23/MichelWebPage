// src/utils/formatters.ts

import { APPOINTMENT_STATUS } from "./constants";

/**
 * Formata uma data para o formato brasileiro
 * @param dateString - Data em formato ISO ou string que o construtor Date aceita
 * @returns Data formatada (ex: "01 de Janeiro de 2023")
 */
export const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

/**
 * Formata a hora para o formato HH:MM
 * @param timeString - Hora no formato HH:MM (pode ou não ter os segundos)
 * @returns Hora formatada (ex: "08:00")
 */
export const formatTime = (timeString: string): string => {
  // Garante que o formato seja HH:MM
  const [hours, minutes] = timeString.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};

/**
 * Formata um número de telefone para o formato brasileiro
 * @param phone - Número de telefone (apenas dígitos)
 * @returns Telefone formatado (ex: "(15) 99764-6421")
 */
export const formatPhone = (phone: string): string => {
  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, "");

  // Aplica a formatação
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phone; // Retorna o original se não puder formatar
};

/**
 * Formata o status do agendamento para exibição
 * @param status - Status do agendamento (um dos valores de APPOINTMENT_STATUS)
 * @returns Status formatado para exibição
 */
export const formatAppointmentStatus = (status: string): string => {
  switch (status) {
    case APPOINTMENT_STATUS.SCHEDULED:
      return "Agendado";
    case APPOINTMENT_STATUS.CONFIRMED:
      return "Confirmado";
    case APPOINTMENT_STATUS.CANCELLED:
      return "Cancelado";
    case APPOINTMENT_STATUS.COMPLETED:
      return "Realizado";
    default:
      return status;
  }
};

/**
 * Formata o tamanho de um arquivo para unidade legível
 * @param bytes - Tamanho em bytes
 * @returns String formatada (ex: "2.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} Bytes`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${(bytes / 1073741824).toFixed(1)} GB`;
};

/**
 * Formata a duração da consulta para exibição
 * @param minutes - Duração em minutos
 * @returns String formatada (ex: "50 minutos")
 */
export const formatDuration = (minutes: number): string => {
  return `${minutes} minuto${minutes !== 1 ? "s" : ""}`;
};
