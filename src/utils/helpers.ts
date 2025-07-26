// src/utils/helpers.ts - NOVO ARQUIVO

import { APPOINTMENT, CLINIC_INFO } from "./constants";
import { formatDate, formatTime } from "./formatters";

// ============================================
// 📅 HELPERS DE AGENDAMENTO
// ============================================
/**
 * Verifica se um horário está disponível
 */
export const checkTimeSlotAvailability = async (
  date: string,
  time: string
): Promise<{ available: boolean; reason?: string }> => {
  // Em produção, faria chamada à API
  // Simulação de lógica

  const dayOfWeek = new Date(date).toLocaleDateString("pt-BR", {
    weekday: "long",
  });
  const capitalizedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

  if (
    APPOINTMENT.BLOCKED_DAYS.includes(
      capitalizedDay as (typeof APPOINTMENT.BLOCKED_DAYS)[number]
    )
  ) {
    return {
      available: false,
      reason: `Não atendemos às ${capitalizedDay.toLowerCase()}s`,
    };
  }

  if (
    !APPOINTMENT.TIME_SLOTS.includes(
      time as (typeof APPOINTMENT.TIME_SLOTS)[number]
    )
  ) {
    return {
      available: false,
      reason: "Horário fora do expediente",
    };
  }

  // Simular alguns horários ocupados
  const occupied = Math.random() > 0.7;

  return {
    available: !occupied,
    reason: occupied ? "Horário já reservado" : undefined,
  };
};

/**
 * Gera mensagem de confirmação de agendamento
 */
export const generateAppointmentConfirmationMessage = (data: {
  name: string;
  date: string;
  time: string;
  modality: string;
  code: string;
}): string => {
  const formattedDate = formatDate(data.date);
  const formattedTime = formatTime(data.time);
  const modalityText =
    data.modality === APPOINTMENT.MODALITY.ONLINE ? "online" : "presencial";

  return (
    `Olá ${data.name},\n\n` +
    `Sua consulta foi agendada com sucesso!\n\n` +
    `📅 Data: ${formattedDate}\n` +
    `⏰ Horário: ${formattedTime}\n` +
    `📍 Modalidade: ${modalityText}\n` +
    `🔑 Código: ${data.code}\n\n` +
    `${CLINIC_INFO.PSYCHOLOGIST.NAME}\n` +
    `${CLINIC_INFO.PSYCHOLOGIST.CRP}`
  );
};

/**
 * Calcula duração da consulta baseado no tipo
 */
export const getAppointmentDuration = (isFirstAppointment: boolean): number => {
  return isFirstAppointment
    ? APPOINTMENT.DURATION.FIRST_APPOINTMENT
    : APPOINTMENT.DURATION.DEFAULT;
};

/**
 * Gera próximos horários disponíveis
 */
export const getNextAvailableSlots = (
  currentDate: Date,
  count: number = 5
): Array<{ date: string; time: string }> => {
  const slots: Array<{ date: string; time: string }> = [];
  const checkDate = new Date(currentDate);

  while (slots.length < count) {
    const dayName = checkDate.toLocaleDateString("pt-BR", { weekday: "long" });
    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);

    if (
      !APPOINTMENT.BLOCKED_DAYS.includes(
        capitalizedDay as (typeof APPOINTMENT.BLOCKED_DAYS)[number]
      )
    ) {
      for (const time of APPOINTMENT.TIME_SLOTS) {
        if (slots.length < count) {
          slots.push({
            date: checkDate.toISOString().split("T")[0],
            time,
          });
        }
      }
    }

    checkDate.setDate(checkDate.getDate() + 1);
  }

  return slots;
};

// ============================================
// 📧 HELPERS DE EMAIL
// ============================================
/**
 * Gera template de email
 */
export const generateEmailTemplate = (
  type: "confirmation" | "reminder" | "cancellation",
  data: {
    name: string;
    date: string | Date;
    time: string;
    modality: string;
    code: string;
  }
): { subject: string; body: string } => {
  const templates = {
    confirmation: {
      subject: `Confirmação de Agendamento - ${CLINIC_INFO.NAME}`,
      body: generateAppointmentConfirmationMessage(
        data as {
          name: string;
          date: string;
          time: string;
          modality: string;
          code: string;
        }
      ),
    },
    reminder: {
      subject: `Lembrete de Consulta - ${CLINIC_INFO.NAME}`,
      body:
        `Olá ${data.name},\n\n` +
        `Este é um lembrete de sua consulta amanhã:\n\n` +
        `📅 Data: ${formatDate(data.date)}\n` +
        `⏰ Horário: ${formatTime(data.time)}\n\n` +
        `Atenciosamente,\n${CLINIC_INFO.PSYCHOLOGIST.NAME}`,
    },
    cancellation: {
      subject: `Cancelamento de Consulta - ${CLINIC_INFO.NAME}`,
      body:
        `Olá ${data.name},\n\n` +
        `Sua consulta foi cancelada conforme solicitado.\n\n` +
        `Para reagendar, acesse nosso site ou entre em contato.\n\n` +
        `Atenciosamente,\n${CLINIC_INFO.PSYCHOLOGIST.NAME}`,
    },
  };

  return templates[type];
};

// ============================================
// 🎯 HELPERS DE NAVEGAÇÃO
// ============================================
/**
 * Gera breadcrumbs baseado na rota
 */
export const generateBreadcrumbs = (
  pathname: string
): Array<{ label: string; href: string }> => {
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbs: Array<{ label: string; href: string }> = [
    { label: "Home", href: "/" },
  ];

  const routeLabels: Record<string, string> = {
    about: "Sobre",
    terapias: "Terapias",
    avaliacoes: "Avaliações",
    agendamento: "Agendamento",
    contato: "Contato",
    admin: "Admin",
    dashboard: "Dashboard",
    appointments: "Agendamentos",
    analytics: "Estatísticas",
    content: "Conteúdo",
    media: "Mídia",
    settings: "Configurações",
  };

  paths.forEach((path, index) => {
    const href = "/" + paths.slice(0, index + 1).join("/");
    const label =
      routeLabels[path] || path.charAt(0).toUpperCase() + path.slice(1);
    breadcrumbs.push({ label, href });
  });

  return breadcrumbs;
};

/**
 * Verifica se rota é protegida
 */
export const isProtectedRoute = (pathname: string): boolean => {
  return pathname.startsWith("/admin") && pathname !== "/admin/login";
};

/**
 * Gera título da página baseado na rota
 */
export const generatePageTitle = (pathname: string): string => {
  const baseTitle = CLINIC_INFO.NAME;

  if (pathname === "/") return baseTitle;

  const paths = pathname.split("/").filter(Boolean);
  const pageName = paths[paths.length - 1];

  const titles: Record<string, string> = {
    about: "Sobre",
    terapias: "Terapias",
    avaliacoes: "Avaliações",
    agendamento: "Agendamento",
    contato: "Contato",
  };

  const pageTitle =
    titles[pageName] || pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return `${pageTitle} | ${baseTitle}`;
};

// ============================================
// 📊 HELPERS DE ESTATÍSTICAS
// ============================================
/**
 * Calcula estatísticas de agendamentos
 */
export const calculateAppointmentStats = (
  appointments: Array<{ status: string; date: string }>
): {
  total: number;
  completed: number;
  cancelled: number;
  pending: number;
  completionRate: number;
} => {
  const total = appointments.length;
  const completed = appointments.filter(
    (a) => a.status === APPOINTMENT.STATUS.COMPLETED
  ).length;
  const cancelled = appointments.filter(
    (a) => a.status === APPOINTMENT.STATUS.CANCELLED
  ).length;
  const pending = appointments.filter(
    (a) =>
      a.status === APPOINTMENT.STATUS.SCHEDULED ||
      a.status === APPOINTMENT.STATUS.CONFIRMED
  ).length;

  const completionRate =
    total > 0 ? (completed / (total - cancelled)) * 100 : 0;

  return {
    total,
    completed,
    cancelled,
    pending,
    completionRate: Math.round(completionRate),
  };
};

/**
 * Agrupa agendamentos por período
 */
export const groupAppointmentsByPeriod = (
  appointments: Array<{ date: string; [key: string]: unknown }>,
  period: "day" | "week" | "month" | "year"
): Record<string, typeof appointments> => {
  return appointments.reduce((groups, appointment) => {
    const date = new Date(appointment.date);
    let key: string;

    switch (period) {
      case "day":
        key = date.toISOString().split("T")[0];
        break;
      case "week":
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split("T")[0];
        break;
      case "month":
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
        break;
      case "year":
        key = String(date.getFullYear());
        break;
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(appointment);

    return groups;
  }, {} as Record<string, typeof appointments>);
};

// ============================================
// 🔐 HELPERS DE SEGURANÇA
// ============================================
/**
 * Sanitiza input do usuário
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "");
};

/**
 * Mascara informações sensíveis
 */
export const maskSensitiveData = (
  data: string,
  type: "email" | "phone" | "cpf"
): string => {
  switch (type) {
    case "email":
      const [username, domain] = data.split("@");
      const maskedUsername = username.substring(0, 3) + "***";
      return `${maskedUsername}@${domain}`;

    case "phone":
      return data.replace(/(\d{2})(\d{5})(\d{4})/, "($1) •••••-$3");

    case "cpf":
      return data.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.***.$3-**");

    default:
      return data;
  }
};
