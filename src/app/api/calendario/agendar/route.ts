import crypto from "crypto";
import { google } from "googleapis";
import { NextResponse } from "next/server";
import { enviarEmailConfirmacaoGmail } from "@/lib/email-gmail";

export async function POST(request: Request) {
  try {
    const { nome, email, telefone, data, horario, modalidade, mensagem } =
      await request.json();

    // Validar dados
    if (!nome || !email || !telefone || !data || !horario || !modalidade) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // Configuração do cliente OAuth2
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || "{}"),
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    // Debug: log dos dados recebidos
    console.log("🔍 Dados recebidos:", { data, horario });
    
    // Forçar interpretação como horário brasileiro (UTC-3)
    const dataHoraInicioString = `${data}T${horario}:00-03:00`;
    console.log("📅 String da data com timezone:", dataHoraInicioString);
    
    // Criar data com timezone brasileiro explícito
    const dataHoraInicio = new Date(dataHoraInicioString);
    console.log("⏰ Data criada com timezone:", dataHoraInicio.toISOString());
    console.log("📍 Data no Brasil:", dataHoraInicio.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }));
    
    const dataHoraFim = new Date(dataHoraInicio);
    dataHoraFim.setMinutes(dataHoraFim.getMinutes() + 50); // Consulta de 50 minutos

    // Gerar código de agendamento
    const codigo = crypto.randomBytes(4).toString("hex").toUpperCase();

    // Criar evento no Google Calendar
    const evento = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: `Consulta: ${nome}`,
        description: `
          Nome: ${nome}
          Email: ${email}
          Telefone: ${telefone}
          Modalidade: ${modalidade}
          Código: ${codigo}
          
          Mensagem: ${mensagem || "Não informada"}
        `,
        start: {
          dateTime: dataHoraInicio.toISOString(),
          timeZone: "America/Sao_Paulo",
        },
        end: {
          dateTime: dataHoraFim.toISOString(),
          timeZone: "America/Sao_Paulo",
        },
        colorId: modalidade === "presencial" ? "1" : "2", // Cores diferentes para cada modalidade
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 60 },
            { method: "popup", minutes: 24 * 60 },
          ],
        },
      },
    });

    // Enviar email de confirmação usando Gmail SMTP
    console.log("📧 Enviando emails de confirmação (Gmail SMTP)...");
    
    const emailEnviado = await enviarEmailConfirmacaoGmail({
      to: email,
      nome,
      data,
      horario,
      modalidade,
      codigo,
      telefone,
    });

    if (!emailEnviado) {
      console.log("⚠️  Falha no envio de email, mas agendamento criado com sucesso");
    }

    // Responder com sucesso
    return NextResponse.json({
      success: true,
      codigo,
      eventoId: evento.data.id,
    });
  } catch (error) {
    console.error("Erro ao agendar consulta:", error);
    return NextResponse.json(
      { error: "Erro ao agendar consulta" },
      { status: 500 }
    );
  }
}
