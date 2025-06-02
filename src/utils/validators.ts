// ==========================================
// src/utils/validators.ts
// ==========================================

/**
 * Valida email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida telefone brasileiro
 */
export const isValidPhone = (phone: string): boolean => {
  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, "");

  // Verifica se tem 10 ou 11 dígitos (com DDD)
  return cleaned.length === 10 || cleaned.length === 11;
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
  let remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(9))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(10))) return false;

  return true;
};

/**
 * Valida CEP
 */
export const isValidZipCode = (zip: string): boolean => {
  const cleaned = zip.replace(/\D/g, "");
  return cleaned.length === 8;
};

/**
 * Valida senha (mínimo 6 caracteres)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Valida se a data está no futuro
 */
export const isFutureDate = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj > new Date();
};

/**
 * Valida se a data está dentro do intervalo permitido para agendamento
 */
export const isValidAppointmentDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2); // 2 meses no futuro

  return date >= today && date <= maxDate;
};

/**
 * Valida se é dia útil (segunda a quinta)
 */
export const isWorkingDay = (date: Date): boolean => {
  const dayOfWeek = date.getDay();
  // 0 = domingo, 5 = sexta, 6 = sábado
  return dayOfWeek >= 1 && dayOfWeek <= 4;
};

/**
 * Valida horário de atendimento
 */
export const isValidAppointmentTime = (time: string): boolean => {
  const validTimes = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];

  return validTimes.includes(time);
};

/**
 * Valida código de agendamento
 */
export const isValidAppointmentCode = (code: string): boolean => {
  // Código deve ter 8 caracteres alfanuméricos
  return /^[A-Z0-9]{8}$/.test(code);
};

/**
 * Valida tamanho máximo de arquivo (em bytes)
 */
export const isValidFileSize = (
  size: number,
  maxSizeInMB: number = 5
): boolean => {
  const maxBytes = maxSizeInMB * 1024 * 1024;
  return size <= maxBytes;
};

/**
 * Valida tipo de arquivo de imagem
 */
export const isValidImageType = (mimeType: string): boolean => {
  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  return validTypes.includes(mimeType);
};

/**
 * Valida nome (sem números ou caracteres especiais)
 */
export const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  return nameRegex.test(name) && name.length >= 3;
};

/**
 * Valida idade mínima (20 anos)
 */
export const isValidAge = (birthDate: Date): boolean => {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    return age - 1 >= 20;
  }

  return age >= 20;
};

/**
 * Validação de formulário de agendamento
 */
export interface AppointmentFormErrors {
  nome?: string;
  email?: string;
  telefone?: string;
  data?: string;
  horario?: string;
}

export const validateAppointmentForm = (data: {
  nome: string;
  email: string;
  telefone: string;
  dataSelecionada: string;
  horarioSelecionado: string;
}): AppointmentFormErrors => {
  const errors: AppointmentFormErrors = {};

  if (!data.nome || !isValidName(data.nome)) {
    errors.nome = "Nome completo é obrigatório (mínimo 3 caracteres)";
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.email = "Email válido é obrigatório";
  }

  if (!data.telefone || !isValidPhone(data.telefone)) {
    errors.telefone = "Telefone válido é obrigatório";
  }

  if (!data.dataSelecionada) {
    errors.data = "Data é obrigatória";
  } else if (!isValidAppointmentDate(new Date(data.dataSelecionada))) {
    errors.data = "Data deve estar dentro dos próximos 2 meses";
  } else if (!isWorkingDay(new Date(data.dataSelecionada))) {
    errors.data = "Atendimento apenas de segunda a quinta";
  }

  if (
    !data.horarioSelecionado ||
    !isValidAppointmentTime(data.horarioSelecionado)
  ) {
    errors.horario = "Horário válido é obrigatório";
  }

  return errors;
};
