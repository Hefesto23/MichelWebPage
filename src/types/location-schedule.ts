// src/types/location-schedule.ts
// Type definitions for location-based working days scheduling

/**
 * Configuração de dia de trabalho com suporte a múltiplas localidades
 */
export interface WorkingDayConfig {
  enabled: boolean;
  location: 1 | 2 | null; // 1 = Principal, 2 = Secundário, null = Ambos
}

/**
 * Estrutura completa de dias de trabalho baseada em localização
 */
export interface LocationBasedWorkingDays {
  monday: WorkingDayConfig;
  tuesday: WorkingDayConfig;
  wednesday: WorkingDayConfig;
  thursday: WorkingDayConfig;
  friday: WorkingDayConfig;
  saturday: WorkingDayConfig;
  sunday?: WorkingDayConfig; // Opcional para compatibilidade
}

/**
 * Estrutura antiga de working_days (para migração)
 */
export interface LegacyWorkingDays {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday?: boolean;
}

/**
 * Informações de agendamento para exibição por localidade
 */
export interface LocationScheduleDisplay {
  locationName: string;
  locationNumber: 1 | 2;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  days: string[]; // Ex: ["Segunda-feira", "Quarta-feira"]
  hours: string; // Ex: "das 08:00 às 19:00"
}

/**
 * Mapeamento de dias da semana para português
 */
export const DAY_LABELS: Record<keyof LocationBasedWorkingDays, string> = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo'
};

/**
 * Mapeamento de dias da semana abreviados
 */
export const DAY_LABELS_SHORT: Record<keyof LocationBasedWorkingDays, string> = {
  monday: 'Seg',
  tuesday: 'Ter',
  wednesday: 'Qua',
  thursday: 'Qui',
  friday: 'Sex',
  saturday: 'Sáb',
  sunday: 'Dom'
};

/**
 * Opções de localidade para seleção
 */
export const LOCATION_OPTIONS = [
  { value: null, label: 'Ambas as localidades' },
  { value: 1 as const, label: 'Localidade Principal' },
  { value: 2 as const, label: 'Localidade Secundária' }
] as const;

/**
 * Helper type guards
 */
export function isLegacyWorkingDays(
  data: unknown
): data is LegacyWorkingDays {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;

  // Check if at least one day is a boolean (legacy format)
  return typeof obj.monday === 'boolean';
}

export function isLocationBasedWorkingDays(
  data: unknown
): data is LocationBasedWorkingDays {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;

  // Check if at least one day is an object with enabled/location (new format)
  if (typeof obj.monday === 'object' && obj.monday !== null) {
    const monday = obj.monday as Record<string, unknown>;
    return typeof monday.enabled === 'boolean';
  }

  return false;
}

/**
 * Convert legacy format to new format
 */
export function migrateLegacyToLocationBased(
  legacy: LegacyWorkingDays,
  defaultLocation: 1 | 2 | null = null
): LocationBasedWorkingDays {
  return {
    monday: { enabled: legacy.monday, location: defaultLocation },
    tuesday: { enabled: legacy.tuesday, location: defaultLocation },
    wednesday: { enabled: legacy.wednesday, location: defaultLocation },
    thursday: { enabled: legacy.thursday, location: defaultLocation },
    friday: { enabled: legacy.friday, location: defaultLocation },
    saturday: { enabled: legacy.saturday, location: defaultLocation },
    ...(legacy.sunday !== undefined && {
      sunday: { enabled: legacy.sunday, location: defaultLocation }
    })
  };
}

/**
 * Get default working days structure
 */
export function getDefaultWorkingDays(): LocationBasedWorkingDays {
  return {
    monday: { enabled: false, location: null },
    tuesday: { enabled: false, location: null },
    wednesday: { enabled: false, location: null },
    thursday: { enabled: false, location: null },
    friday: { enabled: false, location: null },
    saturday: { enabled: false, location: null },
    sunday: { enabled: false, location: null }
  };
}
