// src/app/api/calendario/buscar/route.ts

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
      scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
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
          error: "Agendamento não encontrado",
        },
        { status: 404 }
      );
    }

    // Extrair informações do evento
    const dadosEvento = {
      id: evento.id,
      nome: evento.summary?.replace("Consulta: ", "") || "",
      data: new Date(evento.start?.dateTime || "").toISOString().split("T")[0],
      horario: new Date(evento.start?.dateTime || "").toLocaleTimeString(
        "pt-BR",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
      email: "",
      telefone: "",
      modalidade: "",
      mensagem: "",
    };

    // Extrair dados adicionais da descrição
    if (evento.description) {
      const linhas = evento.description.split("\n");

      for (const linha of linhas) {
        const trimmed = linha.trim();

        if (trimmed.startsWith("Email:")) {
          dadosEvento.email = trimmed.replace("Email:", "").trim();
        } else if (trimmed.startsWith("Telefone:")) {
          dadosEvento.telefone = trimmed.replace("Telefone:", "").trim();
        } else if (trimmed.startsWith("Modalidade:")) {
          dadosEvento.modalidade = trimmed.replace("Modalidade:", "").trim();
        } else if (trimmed.startsWith("Mensagem:")) {
          dadosEvento.mensagem = trimmed.replace("Mensagem:", "").trim();
        }
      }
    }

    return NextResponse.json({
      success: true,
      agendamento: dadosEvento,
    });
  } catch (error) {
    console.error("Erro ao buscar agendamento:", error);
    return NextResponse.json(
      {
        error: "Erro ao buscar agendamento",
      },
      { status: 500 }
    );
  }
}
