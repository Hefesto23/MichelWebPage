// ==========================================
// src/utils/formatters.ts
// ==========================================
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Formata uma data para exibição em português
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

/**
 * Formata uma data com dia da semana
 */
export const formatDateWithWeekday = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

/**
 * Formata uma data curta
 */
export const formatShortDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "dd/MM/yyyy", { locale: ptBR });
};

/**
 * Formata horário
 */
export const formatTime = (time: string): string => {
  return time.padEnd(5, ":00");
};

/**
 * Formata telefone brasileiro
 */
export const formatPhone = (phone: string): string => {
  // Remove tudo que não é número
  const cleaned = phone.replace(/\D/g, "");

  // Aplica a máscara
  if (cleaned.length === 13) {
    // +55 15 99764-6421
    return cleaned.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "+$1 ($2) $3-$4");
  } else if (cleaned.length === 11) {
    // (15) 99764-6421
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  return phone;
};

/**
 * Formata CEP
 */
export const formatZipCode = (zip: string): string => {
  const cleaned = zip.replace(/\D/g, "");
  return cleaned.replace(/(\d{5})(\d{3})/, "$1-$2");
};

/**
 * Formata tamanho de arquivo
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Formata moeda brasileira
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

/**
 * Formata porcentagem
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formata nome (primeira letra maiúscula)
 */
export const formatName = (name: string): string => {
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Formata status do agendamento
 */
export const formatAppointmentStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    agendado: "Agendado",
    confirmado: "Confirmado",
    cancelado: "Cancelado",
    realizado: "Realizado",
  };

  return statusMap[status] || status;
};

/**
 * Formata modalidade
 */
export const formatModality = (modality: string): string => {
  const modalityMap: Record<string, string> = {
    presencial: "Presencial",
    online: "Online",
  };

  return modalityMap[modality] || modality;
};

/**
 * Trunca texto
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Formata duração em minutos para exibição
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
};
