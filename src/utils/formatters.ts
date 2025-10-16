// src/utils/formatters.ts - VERSÃO LIMPA (apenas funções utilizadas)

import { CLINIC_INFO } from "./constants";

/**
 * Formata o tamanho de um arquivo
 * Usado em: MediaManager, ImageSelector, MediaUpload, ImageUpload
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
 * Formata endereço completo da clínica
 * Usado em: ContactMap
 */
export const formatFullAddress = (): string => {
  const { STREET, NEIGHBORHOOD, CITY, STATE, ZIP } = CLINIC_INFO.ADDRESS;
  return `${STREET} - ${NEIGHBORHOOD}, ${CITY} - ${STATE}, ${ZIP}`;
};

/**
 * Formata data no formato brasileiro (DD/MM/YYYY)
 * Usado em: AppointmentsManager
 */
export const formatDate = (date: string): string => {
  const d = new Date(date + 'T00:00:00'); // Add time to avoid timezone issues
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Formata número de telefone
 * Usado em: AppointmentsManager
 */
export const formatPhone = (phone: string): string => {
  // Remove tudo que não é número
  const cleaned = phone.replace(/\D/g, '');

  // Formata no padrão brasileiro (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }

  return phone; // Retorna original se não estiver no formato esperado
};
