// Core utilities (most used)  
export * from "./core";
export * from "./utils";
export * from "./constants";
export * from "./default-content";

// Advanced utilities - specific exports to avoid conflicts
export {
  formatShortDate,
  formatDateTime, 
  formatWeekday,
  formatCPF,
  formatCEP,
  formatAppointmentModality,
  formatFileSize,
  formatDuration,
  formatCurrency,
  formatNumber,
  formatPercentage,
  capitalizeWords,
  formatName,
  formatFullAddress,
  calculateAge,
  formatRelativeTime,
} from "./formatters";

export {
  isValidEmail,
  isValidPhone,
  isValidCPF,
  validateRequired,
} from "./validators";

export {
  checkTimeSlotAvailability,
  generateAppointmentConfirmationMessage,
  generateEmailTemplate,
  generateBreadcrumbs,
  isProtectedRoute,
  generatePageTitle,
  calculateAppointmentStats,
  maskSensitiveData,
} from "./helpers";
