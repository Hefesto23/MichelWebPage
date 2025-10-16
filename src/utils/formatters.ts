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
