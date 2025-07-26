// src/utils/validators.ts - VERSÃO REFATORADA

import { APPOINTMENT, CLINIC_INFO, MEDIA, MESSAGES } from "./constants";

// ============================================
// 📧 VALIDADORES DE EMAIL
// ============================================
/**
 * Valida se um e-mail é válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Valida domínio de e-mail corporativo
 */
export const isValidCorporateEmail = (email: string): boolean => {
  const invalidDomains = [
    "gmail.com",
    "hotmail.com",
    "yahoo.com",
    "outlook.com",
  ];
  const domain = email.split("@")[1]?.toLowerCase();
  return isValidEmail(email) && !invalidDomains.includes(domain);
};

// ============================================
// 📱 VALIDADORES DE TELEFONE
// ============================================
/**
 * Valida se um telefone é válido (formato brasileiro)
 */
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10 || cleaned.length === 11;
};

/**
 * Valida se é celular (começa com 9)
 */
export const isValidMobilePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 11 && cleaned[2] === "9";
};

/**
 * Valida DDD brasileiro
 */
export const isValidDDD = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, "");
  const ddd = parseInt(cleaned.substring(0, 2));
  return ddd >= 11 && ddd <= 99;
};

// ============================================
// 📅 VALIDADORES DE DATA E HORA
// ============================================
/**
 * Valida se uma data é futura
 */
export const isFutureDate = (date: string | Date): boolean => {
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate >= today;
};

/**
 * Valida se uma data está dentro do período permitido
 */
export const isDateInAllowedRange = (date: string | Date): boolean => {
  const inputDate = new Date(date);
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + APPOINTMENT.ADVANCE_DAYS.DEFAULT);

  return inputDate >= today && inputDate <= maxDate;
};

/**
 * Valida se o dia não está bloqueado
 */
export const isValidAppointmentDay = (date: string | Date): boolean => {
  const inputDate = new Date(date);
  const dayName = inputDate.toLocaleDateString("pt-BR", { weekday: "long" });
  const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);

  return !APPOINTMENT.BLOCKED_DAYS.includes(
    capitalizedDay as (typeof APPOINTMENT.BLOCKED_DAYS)[number]
  );
};

/**
 * Valida se uma hora está dentro do horário de funcionamento
 */
export const isValidAppointmentTime = (time: string): boolean => {
  const [hours, minutes] = time.split(":").map(Number);
  const [startHour] = CLINIC_INFO.HOURS.START.split(":").map(Number);
  const [endHour] = CLINIC_INFO.HOURS.END.split(":").map(Number);

  return hours >= startHour && hours < endHour && minutes % 30 === 0;
};

/**
 * Valida se o horário está disponível nos slots
 */
export const isTimeSlotAvailable = (
  time: (typeof APPOINTMENT.TIME_SLOTS)[number]
): boolean => {
  return APPOINTMENT.TIME_SLOTS.includes(time);
};

// ============================================
// 📝 VALIDADORES DE TEXTO
// ============================================
/**
 * Valida comprimento de texto
 */
export const isLengthValid = (
  value: string,
  min: number,
  max: number
): boolean => {
  const length = value.trim().length;
  return length >= min && length <= max;
};

/**
 * Valida se contém apenas letras
 */
export const isOnlyLetters = (text: string): boolean => {
  return /^[a-zA-ZÀ-ÿ\s]+$/.test(text);
};

/**
 * Valida se contém apenas números
 */
export const isOnlyNumbers = (text: string): boolean => {
  return /^\d+$/.test(text);
};

/**
 * Valida CPF
 */
export const isValidCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, "");

  if (cleaned.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (parseInt(cleaned.charAt(9)) !== digit) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (parseInt(cleaned.charAt(10)) !== digit) return false;

  return true;
};

/**
 * Valida CEP
 */
export const isValidCEP = (cep: string): boolean => {
  const cleaned = cep.replace(/\D/g, "");
  return cleaned.length === 8 && isOnlyNumbers(cleaned);
};

// ============================================
// 🔐 VALIDADORES DE CÓDIGO E SENHA
// ============================================
/**
 * Valida o código de agendamento
 */
export const isValidAppointmentCode = (code: string): boolean => {
  return /^[A-Z0-9]{8}$/.test(code.toUpperCase());
};

/**
 * Valida força da senha
 */
export const isValidPassword = (
  password: string
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("A senha deve ter pelo menos 8 caracteres");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra maiúscula");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra minúscula");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("A senha deve conter pelo menos um número");
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("A senha deve conter pelo menos um caractere especial");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ============================================
// 📁 VALIDADORES DE ARQUIVO
// ============================================
/**
 * Valida se um arquivo é uma imagem
 */
export const isImageFile = (file: File): boolean => {
  return MEDIA.UPLOAD.ACCEPTED_TYPES.includes(
    file.type as (typeof MEDIA.UPLOAD.ACCEPTED_TYPES)[number]
  );
};

/**
 * Valida o tamanho do arquivo
 */
export const isFileSizeValid = (
  file: File,
  maxSizeMB: number = MEDIA.UPLOAD.MAX_SIZE_MB
): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

/**
 * Valida dimensões de imagem
 */
export const validateImageDimensions = async (
  file: File
): Promise<{
  isValid: boolean;
  width?: number;
  height?: number;
  error?: string;
}> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const { width, height } = img;
      const maxWidth = MEDIA.UPLOAD.MAX_DIMENSIONS.WIDTH;
      const maxHeight = MEDIA.UPLOAD.MAX_DIMENSIONS.HEIGHT;

      if (width > maxWidth || height > maxHeight) {
        resolve({
          isValid: false,
          width,
          height,
          error: `A imagem deve ter no máximo ${maxWidth}x${maxHeight} pixels`,
        });
      } else {
        resolve({ isValid: true, width, height });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ isValid: false, error: "Erro ao carregar imagem" });
    };

    img.src = url;
  });
};

/**
 * Valida múltiplos arquivos
 */
export const validateMultipleFiles = (
  files: FileList
): { valid: File[]; errors: Array<{ file: File; error: string }> } => {
  const valid: File[] = [];
  const errors: Array<{ file: File; error: string }> = [];

  Array.from(files).forEach((file) => {
    if (!isImageFile(file)) {
      errors.push({ file, error: "Tipo de arquivo não permitido" });
    } else if (!isFileSizeValid(file)) {
      errors.push({
        file,
        error: `Arquivo muito grande (máximo ${MEDIA.UPLOAD.MAX_SIZE_MB}MB)`,
      });
    } else {
      valid.push(file);
    }
  });

  return { valid, errors };
};

// ============================================
// 🏷️ VALIDADORES DE FORMULÁRIO
// ============================================
/**
 * Valida campos obrigatórios
 */
export const validateRequired = (
  value: unknown,
  fieldName: string
): string | null => {
  if (!value || (typeof value === "string" && !value.trim())) {
    return `${fieldName} ${MESSAGES.VALIDATION.REQUIRED_FIELD}`;
  }
  return null;
};

/**
 * Valida múltiplos campos de uma vez
 */
export const validateForm = <T extends Record<string, unknown>>(
  values: T,
  rules: Partial<Record<keyof T, (value: unknown) => string | null>>
): Partial<Record<keyof T, string>> => {
  const errors: Partial<Record<keyof T, string>> = {};

  Object.keys(rules).forEach((key) => {
    const rule = rules[key as keyof T];
    const value = values[key as keyof T];

    if (rule) {
      const error = rule(value);
      if (error) {
        errors[key as keyof T] = error;
      }
    }
  });

  return errors;
};

// ============================================
// 🔍 VALIDADORES COMPOSTOS
// ============================================
/**
 * Valida dados completos de agendamento
 */
export const validateAppointmentData = (data: {
  date: string;
  time: string;
  modality: string;
  name: string;
  email: string;
  phone: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Valida data
  if (!data.date) {
    errors.date = MESSAGES.VALIDATION.INVALID_DATE;
  } else if (!isFutureDate(data.date)) {
    errors.date = MESSAGES.VALIDATION.DATE_PAST;
  } else if (!isValidAppointmentDay(data.date)) {
    errors.date = "Data não disponível para agendamento";
  } else if (!isDateInAllowedRange(data.date)) {
    errors.date = `Agendamentos permitidos até ${APPOINTMENT.ADVANCE_DAYS.DEFAULT} dias`;
  }

  // Valida horário
  if (!data.time) {
    errors.time = MESSAGES.VALIDATION.INVALID_TIME;
  } else if (
    !isTimeSlotAvailable(data.time as (typeof APPOINTMENT.TIME_SLOTS)[number])
  ) {
    errors.time = MESSAGES.VALIDATION.TIME_UNAVAILABLE;
  }

  // Valida modalidade
  if (
    !data.modality ||
    !Object.values(APPOINTMENT.MODALITY).includes(
      data.modality as (typeof APPOINTMENT.MODALITY)[keyof typeof APPOINTMENT.MODALITY]
    )
  ) {
    errors.modality = MESSAGES.VALIDATION.INVALID_MODALITY;
  }

  // Valida nome
  if (!data.name || data.name.trim().length < 2) {
    errors.name = MESSAGES.VALIDATION.MIN_LENGTH("Nome", 2);
  }

  // Valida email
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = MESSAGES.VALIDATION.INVALID_EMAIL;
  }

  // Valida telefone
  if (!data.phone || !isValidPhone(data.phone)) {
    errors.phone = MESSAGES.VALIDATION.INVALID_PHONE;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
