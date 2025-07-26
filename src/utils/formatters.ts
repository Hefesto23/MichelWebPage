// src/utils/formatters.ts - VERSÃO REFATORADA

import { APPOINTMENT, CLINIC_INFO, CONFIG } from "./constants";

/**
 * Formata uma data para o formato brasileiro completo
 */
export const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(CONFIG.DATES.DEFAULT_LOCALE, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

/**
 * Formata uma data curta (DD/MM/AAAA)
 */
export const formatShortDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(CONFIG.DATES.DEFAULT_LOCALE);
};

/**
 * Formata data e hora completos
 */
export const formatDateTime = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return date.toLocaleString(CONFIG.DATES.DEFAULT_LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Formata dia da semana por extenso
 */
export const formatWeekday = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(CONFIG.DATES.DEFAULT_LOCALE, {
    weekday: "long",
  });
};

/**
 * Formata a hora para o formato HH:MM
 */
export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};

/**
 * Formata um número de telefone para o formato brasileiro
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");

  // Formato: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
  if (cleaned.length === 11) {
    return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  } else if (cleaned.length === 10) {
    return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  }

  return phone;
};

/**
 * Remove formatação do telefone
 */
export const unformatPhone = (phone: string): string => {
  return phone.replace(/\D/g, "");
};

/**
 * Formata o CPF (XXX.XXX.XXX-XX)
 */
export const formatCPF = (cpf: string): string => {
  const cleaned = cpf.replace(/\D/g, "");
  return cleaned.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
};

/**
 * Formata o CEP (XXXXX-XXX)
 */
export const formatCEP = (cep: string): string => {
  const cleaned = cep.replace(/\D/g, "");
  return cleaned.replace(/^(\d{5})(\d{3})$/, "$1-$2");
};

/**
 * Formata o status do agendamento para exibição
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
 * Formata a modalidade do agendamento
 */
export const formatAppointmentModality = (modality: string): string => {
  const modalityMap: Record<string, string> = {
    [APPOINTMENT.MODALITY.IN_PERSON]: "Presencial",
    [APPOINTMENT.MODALITY.ONLINE]: "Online",
  };

  return modalityMap[modality] || modality;
};

/**
 * Formata o tamanho de um arquivo
 */
export const formatFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(size < 10 && unitIndex > 0 ? 1 : 0)} ${
    units[unitIndex]
  }`;
};

/**
 * Formata a duração da consulta
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} minuto${minutes !== 1 ? "s" : ""}`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours} hora${hours !== 1 ? "s" : ""}`;
  }

  return `${hours}h${mins.toString().padStart(2, "0")}min`;
};

/**
 * Formata valores monetários
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat(CONFIG.DATES.DEFAULT_LOCALE, {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

/**
 * Formata números com separadores de milhar
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat(CONFIG.DATES.DEFAULT_LOCALE).format(value);
};

/**
 * Formata porcentagem
 */
export const formatPercentage = (
  value: number,
  decimals: number = 0
): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Trunca texto com reticências
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitaliza a primeira letra
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Capitaliza cada palavra
 */
export const capitalizeWords = (text: string): string => {
  return text
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
};

/**
 * Formata nome completo (primeira e última palavra capitalizadas)
 */
export const formatName = (name: string): string => {
  const words = name.trim().split(" ");
  if (words.length === 0) return "";

  const formatted = words.map((word, index) => {
    // Preposições em minúsculo
    if (
      ["de", "da", "do", "das", "dos"].includes(word.toLowerCase()) &&
      index !== 0
    ) {
      return word.toLowerCase();
    }
    return capitalize(word);
  });

  return formatted.join(" ");
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
 * Formata endereço completo
 */
export const formatFullAddress = (): string => {
  const { STREET, NEIGHBORHOOD, CITY, STATE, ZIP } = CLINIC_INFO.ADDRESS;
  return `${STREET} - ${NEIGHBORHOOD}, ${CITY} - ${STATE}, ${ZIP}`;
};

/**
 * Calcula idade a partir da data de nascimento
 */
export const calculateAge = (birthDate: string | Date): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

/**
 * Formata tempo relativo (há X minutos/horas/dias)
 */
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 7) {
    return formatShortDate(date);
  } else if (diffDays > 0) {
    return `há ${diffDays} dia${diffDays !== 1 ? "s" : ""}`;
  } else if (diffHours > 0) {
    return `há ${diffHours} hora${diffHours !== 1 ? "s" : ""}`;
  } else if (diffMins > 0) {
    return `há ${diffMins} minuto${diffMins !== 1 ? "s" : ""}`;
  } else {
    return "agora mesmo";
  }
};
