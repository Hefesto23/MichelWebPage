import { google } from "googleapis";
import { NextResponse } from "next/server";

// Configuração do cliente OAuth2
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || "{}"),
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

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

    // Horários padrão
    const horariosPadrao = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
    ];

    // Filtrar horários ocupados
    const horariosOcupados = eventos.map((evento) => {
      const inicio = new Date(evento.start?.dateTime || "");
      return inicio.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    });

    const horariosDisponiveis = horariosPadrao.filter(
      (horario) => !horariosOcupados.includes(horario)
    );

    return NextResponse.json({ horariosDisponiveis });
  } catch (error) {
    console.error("Erro ao buscar horários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar horários disponíveis" },
      { status: 500 }
    );
  }
}
