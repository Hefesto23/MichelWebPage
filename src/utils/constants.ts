// src/utils/constants.ts

// Status de agendamento
export const APPOINTMENT_STATUS = {
  SCHEDULED: "agendado",
  CONFIRMED: "confirmado",
  CANCELLED: "cancelado",
  COMPLETED: "realizado",
} as const;

// Modalidades de consulta
export const MODALITY = {
  IN_PERSON: "presencial",
  ONLINE: "online",
} as const;

// Horários de funcionamento
export const WORKING_HOURS = {
  START: 8, // 8:00 AM
  END: 21, // 9:00 PM
  DURATION: 50, // 50 minutos
  FIRST_APPOINTMENT_DURATION: 60, // 60 minutos para primeira consulta
};

// Rotas do sistema
export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  SERVICES: "/terapias",
  APPOINTMENT: "/agendamento",
  CONTACT: "/contato",
  ADMIN: {
    LOGIN: "/admin/login",
    DASHBOARD: "/admin/dashboard",
    APPOINTMENTS: "/admin/appointments",
    CONTENT: "/admin/content",
    MEDIA: "/admin/media",
    SETTINGS: "/admin/settings",
  },
};

// Categorias de mídia
export const MEDIA_CATEGORIES = {
  PROFILE: "profile",
  SERVICES: "services",
  GALLERY: "gallery",
  HERO: "hero",
  TESTIMONIALS: "testimonials",
} as const;

// Tipos de conteúdo CMS
export const CONTENT_TYPES = {
  TEXT: "text",
  TITLE: "title",
  DESCRIPTION: "description",
  IMAGE: "image",
  HTML: "html",
} as const;

// Configurações de e-mail
export const EMAIL_CONFIG = {
  FROM: "michelcamargo.psi@gmail.com",
  CONFIRMATION_TEMPLATE_ID: "d-1234567890", // ID do template no SendGrid
};
