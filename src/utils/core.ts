// Core utilities mais usados no projeto

import { APPOINTMENT } from "./constants";

/**
 * Formata data para formato brasileiro
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
 * Formata hora HH:MM
 */
export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};

/**
 * Formata telefone brasileiro
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  
  if (cleaned.length === 11) {
    return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  } else if (cleaned.length === 10) {
    return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  }
  
  return phone;
};

/**
 * Formata status de agendamento
 */
export const formatAppointmentStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    [APPOINTMENT.STATUS.SCHEDULED]: "Agendado",
    [APPOINTMENT.STATUS.CONFIRMED]: "Confirmado", 
    [APPOINTMENT.STATUS.CANCELLED]: "Cancelado",
    [APPOINTMENT.STATUS.COMPLETED]: "Realizado",
  };
  
  return statusMap[status] || status;
};

/**
 * Capitaliza primeira letra
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Trunca texto com reticências
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Gera iniciais do nome
 */
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .filter((word) => word.length > 0)
    .map((word) => word[0].toUpperCase())
    .slice(0, 2)
    .join("");
};

/**
 * Sanitiza input do usuário
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "");
};