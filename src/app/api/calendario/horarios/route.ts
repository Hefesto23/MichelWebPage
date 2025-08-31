import prisma from "@/lib/prisma";
import { APPOINTMENT } from "@/utils/constants";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// Configuração do cliente OAuth2
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || "{}"),
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

// Helper para gerar horários baseados nas configurações
async function generateTimeSlots(): Promise<string[]> {
  try {
    const settings = await prisma.settings.findMany({
      where: {
        key: {
          in: ["agendamento.start_time", "agendamento.end_time", "agendamento.session_duration"],
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

    const startTime = settingsMap["agendamento.start_time"] || "08:00";
    const endTime = settingsMap["agendamento.end_time"] || "21:00";
    const sessionDuration = settingsMap["agendamento.session_duration"] || 50;

    console.log("⚙️ Configurações encontradas:", { startTime, endTime, sessionDuration });

    // Converter para minutos
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    
    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = endHour * 60 + endMinute;

    console.log("🕐 Horários em minutos:", { startInMinutes, endInMinutes });

    // Gerar slots de horário (intervalos de 60 minutos independente da duração da sessão)
    const timeSlots: string[] = [];
    
    for (let minutes = startInMinutes; minutes < endInMinutes; minutes += 60) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      timeSlots.push(timeString);
    }

    console.log("⏰ Horários gerados:", timeSlots);
    return timeSlots;
  } catch (error) {
    console.error("Erro ao gerar horários:", error);
    // Fallback para horários padrão
    const fallbackSlots = [...APPOINTMENT.TIME_SLOTS];
    console.log("🔄 Usando fallback:", fallbackSlots);
    return fallbackSlots;
  }
}

// Helper para verificar se o dia está ativo
async function isDayAllowed(date: string): Promise<boolean> {
  try {
    const dayOfWeek = new Date(date).getDay(); // 0 = domingo, 1 = segunda, etc.
    console.log(`🗓️ Data: ${date}, Dia da semana: ${dayOfWeek} (0=Dom, 1=Seg...)`);
    
    const workingDaysSetting = await prisma.settings.findUnique({
      where: { key: "agendamento.working_days" },
    });

    console.log("⚙️ Configuração working_days:", workingDaysSetting?.value);

    if (!workingDaysSetting) {
      console.log("❌ Nenhuma configuração encontrada, usando fallback");
      // Fallback: Monday to Thursday only
      const allowed = dayOfWeek >= 1 && dayOfWeek <= 4;
      console.log(`🔄 Fallback resultado: ${allowed}`);
      return allowed;
    }

    const workingDays = JSON.parse(workingDaysSetting.value);
    console.log("📋 Working days parsed:", workingDays);
    
    const dayMapping = {
      1: "monday",
      2: "tuesday", 
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    };

    const dayKey = dayMapping[dayOfWeek as keyof typeof dayMapping];
    const isAllowed = dayKey ? workingDays[dayKey] === true : false;
    console.log(`✅ Dia ${dayKey} permitido: ${isAllowed}`);
    
    return isAllowed;
  } catch (error) {
    console.error("Erro ao verificar dia:", error);
    const dayOfWeek = new Date(date).getDay();
    // Fallback: Monday to Thursday only
    const allowed = dayOfWeek >= 1 && dayOfWeek <= 4;
    console.log(`🆘 Erro - usando fallback: ${allowed}`);
    return allowed;
  }
}

export async function GET(request: Request) {
  try {
    // Obter data da query string
    const { searchParams } = new URL(request.url);
    const data = searchParams.get("data");

    if (!data) {
      return NextResponse.json(
        { error: "Data não fornecida" },
        { status: 400 }
      );
    }

    // Verificar se o dia está permitido
    const isDayActive = await isDayAllowed(data);
    console.log(`📅 Verificando dia ${data}: ${isDayActive ? "PERMITIDO" : "BLOQUEADO"}`);
    
    if (!isDayActive) {
      return NextResponse.json({ 
        horariosDisponiveis: [],
        message: "Dia não disponível para agendamentos"
      });
    }

    const calendar = google.calendar({ version: "v3", auth });

    // Definir período para buscar eventos (dia inteiro)
    const dataInicio = new Date(data);
    dataInicio.setHours(0, 0, 0, 0);

    const dataFim = new Date(data);
    dataFim.setHours(23, 59, 59, 999);

    // Buscar eventos existentes
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: dataInicio.toISOString(),
      timeMax: dataFim.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const eventos = response.data.items || [];

    // Gerar horários baseados nas configurações
    const horariosPadrao = await generateTimeSlots();
    console.log("⚙️ Horários base gerados:", horariosPadrao);

    // Filtrar horários ocupados
    const horariosOcupados = eventos.map((evento) => {
      const inicio = new Date(evento.start?.dateTime || "");
      return inicio.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    });

    console.log("🚫 Horários ocupados:", horariosOcupados);

    const horariosDisponiveis = horariosPadrao.filter(
      (horario) => !horariosOcupados.includes(horario)
    );

    console.log("✅ Horários disponíveis finais:", horariosDisponiveis);

    return NextResponse.json({ horariosDisponiveis });
  } catch (error) {
    console.error("Erro ao buscar horários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar horários disponíveis" },
      { status: 500 }
    );
  }
}
