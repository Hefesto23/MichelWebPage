// ==========================================
// src/utils/constants.ts
// ==========================================

// Status de agendamento
export const APPOINTMENT_STATUS = {
  SCHEDULED: "agendado",
  CONFIRMED: "confirmado",
  CANCELLED: "cancelado",
  COMPLETED: "realizado",
} as const;

// Modalidades
export const MODALITY = {
  IN_PERSON: "presencial",
  ONLINE: "online",
} as const;

// Horários de trabalho
export const WORKING_HOURS = {
  START: 8,
  END: 21,
  DURATION: 50,
  FIRST_APPOINTMENT_DURATION: 60,
  SLOTS: [
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
  ],
  BLOCKED_DAYS: ["friday", "saturday", "sunday"], // sexta, sábado, domingo
} as const;

// Rotas da aplicação
export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  SERVICES: "/terapias",
  ASSESSMENT: "/avaliacoes",
  APPOINTMENT: "/agendamento",
  CONTACT: "/contato",
  ADMIN: {
    LOGIN: "/admin/login",
    DASHBOARD: "/admin/dashboard",
    APPOINTMENTS: "/admin/appointments",
    ANALYTICS: "/admin/analytics",
    CONTENT: "/admin/content",
    MEDIA: "/admin/media",
    SETTINGS: "/admin/settings",
  },
} as const;

// Informações de contato
export const CONTACT_INFO = {
  PHONE: "+55 (15) 99764-6421",
  PHONE_CLEAN: "5515997646421",
  EMAIL: "michelcamargo.psi@gmail.com",
  CRP: "06/174807",
  ADDRESS: {
    STREET: "Rua Antônio Ferreira, 171",
    NEIGHBORHOOD: "Parque Campolim",
    CITY: "Sorocaba",
    STATE: "SP",
    ZIP: "18047-636",
    COUNTRY: "Brasil",
  },
  WORKING_HOURS: {
    WEEKDAYS: "Segunda à Sexta",
    TIME: "das 8:00 as 21:00",
    NOTE: "Obs: As consultas necessitam ser previamente agendadas.",
    AGE_NOTE: "* Atendimentos a partir de 20 anos de idade",
  },
  GOOGLE_MAPS: {
    EMBED_URL:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.5088240408087!2d-47.47244788549275!3d-23.493335284719095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c5d9d6e9e5d7a7%3A0x9fdc74c22ed20a13!2sRua%20Ant%C3%B4nio%20Ferreira%2C%20171%20-%20Parque%20Campolim%2C%20Sorocaba%20-%20SP%2C%2018047-636%2C%20Brasil!5e0!3m2!1sen!2sus!4v1696692299380!5m2!1sen!2sus",
  },
} as const;

// Informações da empresa
export const COMPANY_INFO = {
  NAME: "Consultório de Psicologia",
  PSYCHOLOGIST: "Michel de Camargo",
  CRP: "06/174807",
  SPECIALTIES: [
    "Ansiedade",
    "Depressão",
    "Análise do Comportamento",
    "Avaliação Cognitiva WAIS III",
  ],
  MIN_AGE: 20,
} as const;

// Configurações de upload
export const UPLOAD_CONFIG = {
  MAX_SIZE_MB: 5,
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"],
  SIZES: {
    THUMB: { width: 150, height: 150 },
    MEDIUM: { width: 500, height: 500 },
    LARGE: { width: 1200, height: 1200 },
  },
} as const;

// Mensagens padrão
export const DEFAULT_MESSAGES = {
  WHATSAPP: "Olá! Gostaria de agendar uma consulta.",
  ERROR: {
    GENERIC: "Ocorreu um erro. Por favor, tente novamente.",
    NETWORK: "Erro de conexão. Verifique sua internet.",
    UNAUTHORIZED: "Sessão expirada. Faça login novamente.",
  },
  SUCCESS: {
    APPOINTMENT_CREATED: "Agendamento realizado com sucesso!",
    APPOINTMENT_CANCELLED: "Agendamento cancelado com sucesso.",
    SAVED: "Alterações salvas com sucesso!",
  },
} as const;

// Textos das seções principais
export const SECTION_TEXTS = {
  HERO: {
    TITLE: "Transforme sua vida com apoio profissional",
    SUBTITLE: "Psicologia clínica especializada em transtornos emocionais",
    CTA: "Agende sua Consulta",
    MAIN_TEXT:
      "Já pensou em como seria ter uma vida mais tranquila e leve, com menos ansiedade? Lidar com isso pode ser difícil, mas você não precisa enfrentar tudo sozinho. Como psicólogo, estou aqui para te ouvir, acolher e ajudar a encontrar caminhos que tragam mais calma e equilíbrio ao seu dia a dia. Cada passo nessa jornada é importante, e eu estarei ao seu lado para apoiar você em cada um deles!",
  },
  WELCOME: {
    TITLE: "Seja Bem-Vindo!",
    SUBTITLE: "Psicólogo Clínico",
  },
} as const;
