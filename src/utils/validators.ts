// src/utils/validators.ts

/**
 * Valida se um e-mail é válido
 * @param email - E-mail a ser validado
 * @returns true se for válido, false caso contrário
 */
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Valida se um telefone é válido (formato brasileiro)
 * @param phone - Telefone a ser validado (apenas dígitos)
 * @returns true se for válido, false caso contrário
 */
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10 || cleaned.length === 11;
};

/**
 * Valida se uma data é futura
 * @param date - Data em formato ISO ou string que o construtor Date aceita
 * @returns true se a data for futura, false caso contrário
 */
export const isFutureDate = (date: string | Date): boolean => {
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Remove a parte de hora para comparar apenas a data
  return inputDate >= today;
};

/**
 * Valida se uma hora está dentro do horário de funcionamento
 * @param time - Hora no formato HH:MM
 * @returns true se estiver dentro do horário, false caso contrário
 */
export const isValidAppointmentTime = (time: string): boolean => {
  const [hours] = time.split(":").map(Number);

  // Verifica se a hora está entre 8 e 21 (8:00 AM e 9:00 PM)
  return hours >= 8 && hours < 21;
};

/**
 * Valida o código de agendamento
 * @param code - Código a ser validado
 * @returns true se for válido, false caso contrário
 */
export const isValidAppointmentCode = (code: string): boolean => {
  return /^[A-Z0-9]{8}$/.test(code);
};

/**
 * Valida se um valor está dentro de um tamanho específico
 * @param value - Valor a ser validado
 * @param min - Tamanho mínimo
 * @param max - Tamanho máximo
 * @returns true se estiver dentro dos limites, false caso contrário
 */
export const isLengthValid = (
  value: string,
  min: number,
  max: number
): boolean => {
  return value.length >= min && value.length <= max;
};

/**
 * Valida se um arquivo é uma imagem
 * @param file - Objeto File
 * @returns true se for uma imagem, false caso contrário
 */
export const isImageFile = (file: File): boolean => {
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  return validTypes.includes(file.type);
};

/**
 * Valida o tamanho máximo de um arquivo
 * @param file - Objeto File
 * @param maxSizeMB - Tamanho máximo em MB
 * @returns true se estiver dentro do limite, false caso contrário
 */
export const isFileSizeValid = (file: File, maxSizeMB: number): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;
};
