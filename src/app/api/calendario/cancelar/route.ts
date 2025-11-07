// src/app/api/calendario/cancelar/route.ts

import { enviarEmailCancelamento } from "@/lib/email";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { codigo } = await request.json();

    if (!codigo) {
      return NextResponse.json(
        { error: "Código não fornecido" },
        { status: 400 }
      );
    }

    // Configuração do cliente OAuth2
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || "{}"),
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    // Buscar eventos futuros
    const agora = new Date();

    const eventos = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID as string,
      timeMin: agora.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    // Procurar o evento com o código de confirmação
    const evento = eventos.data.items?.find((evento) => {
      return evento.description?.includes(`Código: ${codigo}`);
    });

    if (!evento || !evento.id) {
      return NextResponse.json(
        {
          error: "Agendamento não encontrado ou já cancelado",
        },
        { status: 404 }
      );
    }

    // Extrair informações para o email
    const nome = evento.summary?.replace("Consulta: ", "") || "";
    const dataHora = new Date(evento.start?.dateTime || "");
    const email =
      evento.description
        ?.split("\n")
        .find((linha) => linha.trim().startsWith("Email:"))
        ?.replace("Email:", "")
        .trim() || "";

    const horario = dataHora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const data = dataHora.toISOString().split("T")[0];

    // Extrair a modalidade (se disponível)
    let modalidade = "presencial"; // valor padrão

    if (evento.description) {
      const linhaModalidade = evento.description
        .split("\n")
        .find((linha) => linha.trim().startsWith("Modalidade:"));

      if (linhaModalidade) {
        modalidade = linhaModalidade.replace("Modalidade:", "").trim();
      }
    }

    // Cancelar o evento
    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID as string,
      eventId: evento.id,
    });

    // Enviar confirmação por e-mail usando o serviço SendGrid
    if (email) {
      await enviarEmailCancelamento({
        to: email,
        nome,
        data,
        horario,
        modalidade,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Agendamento cancelado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao cancelar agendamento:", error);
    return NextResponse.json(
      {
        error: "Erro ao cancelar agendamento",
      },
      { status: 500 }
    );
  }
}
