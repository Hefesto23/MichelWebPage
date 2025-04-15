import crypto from "crypto";
import { google } from "googleapis";
import { NextResponse } from "next/server";
import { enviarEmailConfirmacao } from "@/lib/email";

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

    // Criar data e hora de início e fim
    const dataHoraInicio = new Date(`${data}T${horario}`);
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

    // Aqui você poderia adicionar código para enviar e-mail/WhatsApp de confirmação
    await enviarEmailConfirmacao({
      to: email,
      nome,
      data,
      horario,
      modalidade,
      codigo,
    });

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
