import crypto from "crypto";
import { google } from "googleapis";
import { NextResponse } from "next/server";
import { enviarEmailConfirmacaoGmail } from "@/lib/email-gmail";
import { PrismaClient } from "@prisma/client";
import { withRetry, TIMEOUT_CONFIGS } from "@/lib/timeout-utils";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const startTime = Date.now();
  console.log("🚀 Início da API de agendamento");

  try {
    const { nome, email, telefone, data, horario, modalidade, endereco, mensagem } =
      await request.json();

    // Validar dados
    if (!nome || !email || !telefone || !data || !horario || !modalidade) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // Validar endereço se modalidade for presencial
    if (modalidade === "presencial" && !endereco) {
      return NextResponse.json({ error: "Endereço é obrigatório para atendimento presencial" }, { status: 400 });
    }

    // Gerar código de agendamento antecipadamente
    const codigo = crypto.randomBytes(4).toString("hex").toUpperCase();

    // Debug: log dos dados recebidos
    console.log("🔍 Dados recebidos:", { data, horario, codigo });
    
    // Forçar interpretação como horário brasileiro (UTC-3)
    const dataHoraInicioString = `${data}T${horario}:00-03:00`;
    const dataHoraInicio = new Date(dataHoraInicioString);
    const dataHoraFim = new Date(dataHoraInicio);
    dataHoraFim.setMinutes(dataHoraFim.getMinutes() + 50);

    console.log("⏰ Data processada:", dataHoraInicio.toISOString());

    // 🚀 OPERAÇÕES CRÍTICAS EM PARALELO (Google Calendar + Database)
    console.log("⚡ Executando operações críticas em paralelo...");
    
    const [evento, agendamentoDB] = await Promise.all([
      // Google Calendar com timeout e retry
      withRetry(async () => {
        const auth = new google.auth.GoogleAuth({
          credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || "{}"),
          scopes: ["https://www.googleapis.com/auth/calendar"],
        });

        const calendar = google.calendar({ version: "v3", auth });
        
        return await calendar.events.insert({
          calendarId: process.env.GOOGLE_CALENDAR_ID,
          requestBody: {
            summary: `Consulta: ${nome}`,
            description: `
              Nome: ${nome}
              Email: ${email}
              Telefone: ${telefone}
              Modalidade: ${modalidade}
              ${modalidade === "presencial" && endereco ? `Endereço: ${endereco}` : ""}
              Código: ${codigo}

              Mensagem: ${mensagem || "Não informada"}
            `,
            location: modalidade === "presencial" && endereco ? endereco : undefined,
            start: {
              dateTime: dataHoraInicio.toISOString(),
              timeZone: "America/Sao_Paulo",
            },
            end: {
              dateTime: dataHoraFim.toISOString(),
              timeZone: "America/Sao_Paulo",
            },
            colorId: modalidade === "presencial" ? "1" : "2",
            reminders: {
              useDefault: false,
              overrides: [
                { method: "email", minutes: 60 },
                { method: "popup", minutes: 24 * 60 },
              ],
            },
          },
        });
      }, TIMEOUT_CONFIGS.GOOGLE_CALENDAR),

      // Database com timeout e retry
      withRetry(async () => {
        return await prisma.appointment.create({
          data: {
            nome,
            email,
            telefone,
            dataSelecionada: new Date(dataHoraInicio),
            horarioSelecionado: horario,
            modalidade,
            endereco: endereco || null,
            primeiraConsulta: true,
            mensagem: mensagem || null,
            codigo,
            status: "CONFIRMADO",
            googleEventId: null, // Será atualizado após o Google Calendar
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        });
      }, TIMEOUT_CONFIGS.DATABASE)
    ]);

    // Atualizar com Google Event ID (com timeout)
    if (evento.data.id) {
      try {
        await withRetry(async () => {
          return await prisma.appointment.update({
            where: { id: agendamentoDB.id },
            data: { googleEventId: evento.data.id }
          });
        }, TIMEOUT_CONFIGS.DATABASE);
      } catch (updateError) {
        console.error("⚠️ Falha ao atualizar Google Event ID:", updateError);
        // Não falha a API por causa disso
      }
    }

    const criticalTime = Date.now();
    console.log(`⚡ Operações críticas concluídas em: ${criticalTime - startTime}ms`);

    // 📧 EMAIL EM BACKGROUND (não bloqueia resposta)
    console.log("📧 Disparando emails em background...");
    
    // Não aguardar (fire-and-forget)
    enviarEmailConfirmacaoGmail({
      to: email,
      nome,
      data,
      horario,
      modalidade,
      codigo,
      telefone,
    }).then(success => {
      console.log(`📧 Email resultado: ${success ? "✅ Sucesso" : "❌ Falha"}`);
    }).catch(error => {
      console.error("📧 Erro em background:", error);
    });

    // ✅ RESPOSTA RÁPIDA (sem aguardar email)
    const totalTime = Date.now() - startTime;
    console.log(`🏁 API finalizada em: ${totalTime}ms`);
    
    return NextResponse.json({
      success: true,
      codigo,
      eventoId: evento.data.id,
      appointmentId: agendamentoDB.id,
      responseTime: totalTime,
    });

  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`❌ Erro após ${errorTime}ms:`, error);
    
    return NextResponse.json(
      { error: "Erro ao agendar consulta" },
      { status: 500 }
    );
  }
}
