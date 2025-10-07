import prisma from "@/lib/prisma";
import { APPOINTMENT } from "@/utils/constants";
import { google } from "googleapis";
import { NextResponse } from "next/server";
import { unstable_cache } from 'next/cache';
import { eachDayOfInterval, format } from "date-fns";

export const dynamic = 'force-dynamic';

// Configuração do cliente OAuth2
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || "{}"),
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

// ✅ Cache de settings no servidor (1 hora de TTL)
const getCachedSettings = unstable_cache(
  async () => {
    console.log("🔄 Buscando settings do banco (cache miss)");
    const settings = await prisma.settings.findMany({
      where: {
        key: {
          in: [
            "agendamento.start_time",
            "agendamento.end_time",
            "agendamento.session_duration",
            "agendamento.working_days"
          ],
        },
      },
    });

    const settingsMap: Record<string, any> = {};
    settings.forEach((setting: any) => {
      try {
        settingsMap[setting.key] = JSON.parse(setting.value);
      } catch {
        settingsMap[setting.key] = setting.value;
      }
    });

    return settingsMap;
  },
  ['appointment-settings'],
  {
    revalidate: 3600, // 1 hora
    tags: ['appointment-settings']
  }
);

// Helper para gerar horários baseados nas configurações (usando cache)
async function generateTimeSlots(): Promise<string[]> {
  try {
    const settingsMap = await getCachedSettings();

    const startTime = settingsMap["agendamento.start_time"] || "08:00";
    const endTime = settingsMap["agendamento.end_time"] || "21:00";

    // Converter para minutos
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = endHour * 60 + endMinute;

    // Gerar slots de horário (intervalos de 60 minutos)
    const timeSlots: string[] = [];

    for (let minutes = startInMinutes; minutes < endInMinutes; minutes += 60) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      timeSlots.push(timeString);
    }

    return timeSlots;
  } catch (error) {
    console.error("Erro ao gerar horários:", error);
    return [...APPOINTMENT.TIME_SLOTS];
  }
}

// Helper para verificar se o dia está ativo (usando cache)
async function isDayAllowed(date: string): Promise<boolean> {
  try {
    const dayOfWeek = new Date(date + 'T12:00:00').getDay();
    const settingsMap = await getCachedSettings();
    const workingDays = settingsMap["agendamento.working_days"];

    if (!workingDays) {
      const allowed = dayOfWeek >= 1 && dayOfWeek <= 4;
      return allowed;
    }

    const dayMapping = {
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    };

    const dayKey = dayMapping[dayOfWeek as keyof typeof dayMapping];
    return dayKey ? workingDays[dayKey] === true : false;
  } catch (error) {
    console.error("Erro ao verificar dia:", error);
    const dayOfWeek = new Date(date + 'T12:00:00').getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 4;
  }
}

// 🚀 OTIMIZAÇÃO: Buscar todos os eventos do Google Calendar de uma vez
async function fetchAllGoogleEvents(startDate: string, endDate: string) {
  try {
    const calendar = google.calendar({ version: "v3", auth });

    const dataInicio = new Date(startDate + 'T00:00:00');
    const dataFim = new Date(endDate + 'T23:59:59');

    console.log(`📅 Buscando eventos do Google Calendar: ${startDate} até ${endDate}`);

    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: dataInicio.toISOString(),
      timeMax: dataFim.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      fields: "items(start,end)", // Apenas campos necessários
    });

    console.log(`✅ ${response.data.items?.length || 0} eventos encontrados`);
    return response.data.items || [];
  } catch (error) {
    console.error("Erro ao buscar eventos do Google Calendar:", error);
    return [];
  }
}

// Helper para filtrar eventos por data
function filterEventsByDate(events: any[], targetDate: string): string[] {
  const occupied: string[] = [];

  events.forEach((evento) => {
    const eventDate = evento.start?.dateTime || "";
    if (!eventDate) return;

    const eventDateStr = format(new Date(eventDate), "yyyy-MM-dd");

    if (eventDateStr === targetDate) {
      const inicio = new Date(eventDate);
      const horario = inicio.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      occupied.push(horario);
    }
  });

  return occupied;
}

// 🚀 ENDPOINT BATCH: Retorna horários para múltiplas datas
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "startDate e endDate são obrigatórios" },
        { status: 400 }
      );
    }

    console.log(`🚀 BATCH REQUEST: ${startDate} até ${endDate}`);

    // Gerar array de todas as datas no intervalo
    const dates = eachDayOfInterval({
      start: new Date(startDate + 'T12:00:00'),
      end: new Date(endDate + 'T12:00:00'),
    });

    console.log(`📊 Total de datas a processar: ${dates.length}`);

    // 🚀 PARALELIZAR: Buscar settings + eventos em paralelo
    const [timeSlots, allEvents] = await Promise.all([
      generateTimeSlots(),
      fetchAllGoogleEvents(startDate, endDate),
    ]);

    console.log(`⚙️ Time slots gerados:`, timeSlots);

    // 🚀 PARALELIZAR: Processar todas as datas em paralelo
    const results = await Promise.all(
      dates.map(async (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const isDayActive = await isDayAllowed(dateStr);

        if (!isDayActive) {
          return [dateStr, []];
        }

        const occupiedSlots = filterEventsByDate(allEvents, dateStr);
        const availableSlots = timeSlots.filter(
          (slot) => !occupiedSlots.includes(slot)
        );

        return [dateStr, availableSlots];
      })
    );

    const horariosMap = Object.fromEntries(results);

    console.log(`✅ BATCH COMPLETO: ${Object.keys(horariosMap).length} datas processadas`);

    return NextResponse.json(horariosMap);
  } catch (error) {
    console.error("Erro no batch de horários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar horários em lote" },
      { status: 500 }
    );
  }
}
