// src/types/blocked-slot.ts

export enum BlockType {
  RECURRING = 'RECURRING',
  ONE_TIME = 'ONE_TIME'
}

export interface BlockedSlot {
  id: string;
  blockType: BlockType;
  dayOfWeek?: number; // 1-7 (ISO: 1=Segunda, 7=Domingo)
  timeSlot: string; // "09:00"
  specificDate?: Date | string;
  reason?: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  createdBy: string;
}

export interface CreateBlockedSlotDTO {
  blockType: BlockType;
  dayOfWeek?: number;
  timeSlot: string;
  specificDate?: string; // YYYY-MM-DD format
  reason?: string;
}

export interface UpdateBlockedSlotDTO {
  isActive?: boolean;
  reason?: string;
}

// Helper para mapear dia da semana (número → nome)
export const DAY_OF_WEEK_MAP: Record<number, string> = {
  1: 'Segunda-feira',
  2: 'Terça-feira',
  3: 'Quarta-feira',
  4: 'Quinta-feira',
  5: 'Sexta-feira',
  6: 'Sábado',
  7: 'Domingo'
};

// Helper para mapear nome → número (para forms)
export const DAY_NAME_TO_NUMBER: Record<string, number> = {
  'Segunda-feira': 1,
  'Terça-feira': 2,
  'Quarta-feira': 3,
  'Quinta-feira': 4,
  'Sexta-feira': 5,
  'Sábado': 6,
  'Domingo': 7
};
