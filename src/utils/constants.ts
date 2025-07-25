// src/utils/constants.ts - VERSÃO MÍNIMA ESTENDIDA

// ✅ MANTIDO ORIGINAL
export const APPOINTMENT_STATUS = {
  SCHEDULED: "agendado",
  CONFIRMED: "confirmado",
  CANCELLED: "cancelado",
  COMPLETED: "realizado",
} as const;

// ✅ MANTIDO ORIGINAL
export const MODALITY = {
  IN_PERSON: "presencial",
  ONLINE: "online",
} as const;

// ✅ MANTIDO ORIGINAL
export const WORKING_HOURS = {
  START: 8, // 8:00 AM
  END: 21, // 9:00 PM
  DURATION: 50, // 50 minutos
  FIRST_APPOINTMENT_DURATION: 60, // 60 minutos para primeira consulta
};

// ✅ ADICIONADO: Rotas do sistema (para substituir strings hardcoded)
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
} as const;

// ✅ MANTIDO ORIGINAL
export const MEDIA_CATEGORIES = {
  PROFILE: "profile",
  SERVICES: "services",
  GALLERY: "gallery",
  HERO: "hero",
  TESTIMONIALS: "testimonials",
} as const;

// ✅ MANTIDO ORIGINAL
export const CONTENT_TYPES = {
  TEXT: "text",
  TITLE: "title",
  DESCRIPTION: "description",
  IMAGE: "image",
  HTML: "html",
} as const;

// ✅ MANTIDO ORIGINAL
export const EMAIL_CONFIG = {
  FROM: "michelcamargo.psi@gmail.com",
  CONFIRMATION_TEMPLATE_ID: "d-1234567890", // ID do template no SendGrid
} as const;

// ✅ NOVA ADIÇÃO: Informações de contato para o Footer
export const CONTACT_INFO = {
  WHATSAPP_NUMBER: "5515997646421",
  PHONE_DISPLAY: "+55 (15) 99764-6421",
  CRP: "CRP 06/174807",
  COMPANY_NAME: "Consultório de Psicologia",
  PSYCHOLOGIST_NAME: "Michel de Camargo",
} as const;
