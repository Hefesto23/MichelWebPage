import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatar data string YYYY-MM-DD considerando timezone do Brasil
 * @param dataString - String no formato YYYY-MM-DD (ex: "2025-09-10")
 * @returns String formatada em português brasileiro
 */
export function formatarDataBrasil(dataString: string): string {
  // Adicionar hora meio-dia para evitar problemas de timezone
  const data = new Date(dataString + "T12:00:00");
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long", 
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  };
  return data.toLocaleDateString("pt-BR", options);
}
