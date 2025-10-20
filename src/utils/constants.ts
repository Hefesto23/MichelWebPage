// src/utils/constants.ts - VERSÃO REFATORADA COMPLETA

// ============================================
// 🚀 SISTEMA DE ROTAS
// ============================================
export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  SERVICES: "/terapias",
  AVALIACOES: "/avaliacoes",
  APPOINTMENT: "/agendamento",
  CONTACT: "/contato",
  ARTICLES: "/artigos",

  // Rotas específicas de serviços
  SERVICE: {
    ONLINE: "/online",
    IN_PERSON: "/presencial",
    EMERGENCY: "/plantao",
  },

  // Rotas de testes
  TEST: {
    WAIS: "/wais-iii",
    BAI: "https://kiai.med.br/test/teste-online-de-ansiedade-escala-de-beck-bai/",
  },

  ADMIN: {
    BASE: "/admin",
    LOGIN: "/admin/login",
    DASHBOARD: "/admin/dashboard",
    APPOINTMENTS: "/admin/appointments",
    ANALYTICS: "/admin/analytics",
    CONTENT: "/admin/content",
    MEDIA: "/admin/media",
    SETTINGS: "/admin/settings",
  },
} as const;

// ============================================
// 📅 SISTEMA DE AGENDAMENTO
// ============================================
export const APPOINTMENT = {
  STATUS: {
    SCHEDULED: "agendado",
    CONFIRMED: "confirmado",
    CANCELLED: "cancelado",
    COMPLETED: "realizado",
  },

  MODALITY: {
    IN_PERSON: "presencial",
    ONLINE: "online",
  },

  TIME_SLOTS: [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ],

  DURATION: {
    DEFAULT: 50,
    FIRST_APPOINTMENT: 60,
    OPTIONS: [30, 45, 50, 60, 90],
  },

  ADVANCE_DAYS: {
    DEFAULT: 60,
    OPTIONS: [30, 45, 60, 90],
  },

  BLOCKED_DAYS: ["Sexta", "Sábado", "Domingo"],

  MESSAGES: {
    CONFIRMATION: "Seu agendamento foi confirmado com sucesso!",
    CANCELLATION: "Seu agendamento foi cancelado com sucesso.",
    CODE_SENT: "Um e-mail de confirmação foi enviado com o código.",
    REMINDER: "Lembrete: Sua consulta é amanhã às",
  },
} as const;

// ============================================
// 🏢 INFORMAÇÕES DO CONSULTÓRIO
// ============================================
/**
 * ⚠️ DUPLICAÇÃO INTENCIONAL:
 * Este CLINIC_INFO serve como fallback de configurações do sistema
 * (usado quando settings não estão disponíveis ou como valores padrão).
 *
 * Há duplicação com DEFAULT_CONTACT_CONTENT em default-content.ts,
 * que serve como fallback do CMS (editável via admin).
 *
 * PROPÓSITO:
 * - constants.ts/CLINIC_INFO: Configurações fixas do sistema
 * - default-content.ts/DEFAULT_CONTACT_CONTENT: Conteúdo CMS editável
 *
 * USADO EM (6 arquivos):
 * - src/app/api/public/settings/route.ts (fallback de settings)
 * - src/components/layout/Footer.tsx (fallback dinâmico)
 * - src/components/pages/contact/ContactInfo.tsx
 * - src/components/pages/contact/ContactHours.tsx
 * - src/components/pages/contact/ContactMap.tsx
 * - src/utils/formatters.ts
 * - src/utils/validators.ts
 */
export const CLINIC_INFO = {
  NAME: "Consultório de Psicologia Michel de Camargo",

  PSYCHOLOGIST: {
    NAME: "Michel de Camargo",
    FULL_NAME: "Michel de Camargo",
    CRP: "CRP 06/174807",
    TITLE: "Psicólogo Clínico",
    SPECIALTIES: ["Ansiedade", "Depressão", "Análise do Comportamento"],
    APPROACH: "Análise do Comportamento",
    TESTS: ["WAIS III", "BAI"],
  },

  CONTACT: {
    WHATSAPP: "5515997646421",
    PHONE_DISPLAY: "+55 (15) 99764-6421",
    EMAIL: "michelcamargo.psi@gmail.com",
    SOCIAL: {
      INSTAGRAM: "@michelcamargo.psi",
      LINKEDIN: "michel-camargo-psi",
    },
  },

  ADDRESS: {
    STREET: "Rua Antônio Ferreira, 171",
    NEIGHBORHOOD: "Parque Campolim",
    CITY: "Sorocaba",
    STATE: "SP",
    ZIP: "18047-636",
    COUNTRY: "Brasil",
    COORDINATES: {
      LAT: -23.493335284719095,
      LNG: -47.47244788549275,
    },
  },

  HOURS: {
    WEEKDAYS: "Segunda à Sexta",
    START: "8:00",
    END: "21:00",
    TIMEZONE: "America/Sao_Paulo",
    CLOSED_DAYS: ["Sexta", "Sábado", "Domingo"],
    NOTE: "As consultas necessitam ser previamente agendadas.",
    AGE_RESTRICTION: "* Atendimentos a partir de 20 anos de idade",
  },
} as const;

// ============================================
// 📝 MENSAGENS DO SISTEMA
// ============================================
export const MESSAGES = {
  // Mensagens de Agendamento
  APPOINTMENT: {
    SUCCESS: "Agendamento realizado com sucesso!",
    ERROR: "Erro ao processar agendamento. Tente novamente.",
    CANCELLED: "Agendamento cancelado com sucesso.",
    NOT_FOUND: "Agendamento não encontrado.",
    CONFIRMATION_EMAIL: "Um e-mail de confirmação foi enviado.",
    ALREADY_EXISTS: "Já existe um agendamento para este horário.",
    INVALID_CODE: "Código de confirmação inválido.",
  },

  // Mensagens de Validação
  VALIDATION: {
    REQUIRED_FIELD: "Este campo é obrigatório",
    INVALID_EMAIL: "E-mail inválido",
    INVALID_PHONE: "Telefone inválido",
    INVALID_DATE: "Selecione uma data válida",
    INVALID_TIME: "Selecione um horário",
    INVALID_MODALITY: "Selecione a modalidade da consulta",
    MIN_LENGTH: (field: string, min: number) =>
      `${field} deve ter pelo menos ${min} caracteres`,
    MAX_LENGTH: (field: string, max: number) =>
      `${field} deve ter no máximo ${max} caracteres`,
    DATE_PAST: "A data deve ser futura",
    TIME_UNAVAILABLE: "Este horário não está disponível",
  },

  // Mensagens de Erro
  ERROR: {
    GENERIC: "Ocorreu um erro. Tente novamente.",
    NETWORK: "Erro de conexão. Verifique sua internet.",
    UNAUTHORIZED: "Acesso não autorizado.",
    FORBIDDEN: "Você não tem permissão para acessar este recurso.",
    NOT_FOUND: "Recurso não encontrado.",
    SERVER: "Erro no servidor. Tente novamente mais tarde.",
    TIMEOUT: "A requisição demorou muito. Tente novamente.",
  },

  // Mensagens de Loading
  LOADING: {
    DEFAULT: "Carregando...",
    APPOINTMENTS: "Buscando agendamentos...",
    SAVING: "Salvando...",
    PROCESSING: "Processando...",
    SENDING: "Enviando...",
    UPLOADING: "Fazendo upload...",
    DELETING: "Excluindo...",
  },

  // Mensagens de Sucesso
  SUCCESS: {
    SAVED: "Salvo com sucesso!",
    UPDATED: "Atualizado com sucesso!",
    DELETED: "Excluído com sucesso!",
    SENT: "Enviado com sucesso!",
    UPLOADED: "Upload realizado com sucesso!",
  },

  // Mensagens de Confirmação
  CONFIRM: {
    DELETE: "Tem certeza que deseja excluir?",
    CANCEL: "Tem certeza que deseja cancelar?",
    SAVE: "Deseja salvar as alterações?",
    LEAVE: "Existem alterações não salvas. Deseja sair?",
  },
} as const;

// ============================================
// 🎨 CONFIGURAÇÕES DE MÍDIA
// ============================================
export const MEDIA = {
  CATEGORIES: {
    ALL: "all",
    PROFILE: "profile",
    SERVICES: "services",
    GALLERY: "gallery",
    HERO: "hero",
    TESTIMONIALS: "testimonials",
  },

  UPLOAD: {
    MAX_SIZE_MB: 5,
    MAX_SIZE_BYTES: 5 * 1024 * 1024,
    ACCEPTED_TYPES: ["image/jpeg", "image/png", "image/webp"],
    ACCEPTED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp"],
    MAX_FILES: 5,
    MAX_DIMENSIONS: {
      WIDTH: 4096,
      HEIGHT: 4096,
    },
  },

  PLACEHOLDER: {
    THERAPY: "/assets/terapias1.jpg",
    PROFILE: "/assets/michel1.svg",
    PROFILE_PHOTO: "/assets/michel2.png",
    HERO: "/assets/horizonte.jpg",
    CLINIC: "https://picsum.photos/800/600",
    DEFAULT: "/assets/placeholder.jpg",
  },

  LOGOS: {
    MAIN: "/logo.svg",
    DARK: "/logo2.svg",
    ICON: "/PsiLogo.svg",
    ICON_ALT: "/PsiLogo2.svg",
  },
} as const;

// ============================================
// 🔧 TYPE HELPERS
// ============================================
export type AppointmentStatus = keyof typeof APPOINTMENT.STATUS;
export type AppointmentModality = keyof typeof APPOINTMENT.MODALITY;
export type MediaCategory = keyof typeof MEDIA.CATEGORIES;
export type RouteKey = keyof typeof ROUTES;
export type AdminRouteKey = keyof typeof ROUTES.ADMIN;
