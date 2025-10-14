// src/app/api/calendario/buscar/route.ts

import { google } from "googleapis";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withRetry, TIMEOUT_CONFIGS } from "@/lib/timeout-utils";

export async function POST(request: Request) {
  const startTime = Date.now();
  console.log("🔍 Início da API de busca");

  try {
    const { codigo } = await request.json();

    if (!codigo) {
      return NextResponse.json(
        { error: "Código não fornecido" },
        { status: 400 }
      );
    }

    console.log("🔍 Buscando agendamento com código:", codigo);

    // 🚀 BUSCA OTIMIZADA NO BANCO COM TIMEOUT
    const dbStartTime = Date.now();
    const agendamentoDB = await withRetry(async () => {
      return await prisma.appointment.findUnique({
        where: {
          codigo: codigo
        }
      });
    }, TIMEOUT_CONFIGS.DATABASE);

    const dbTime = Date.now() - dbStartTime;
    console.log(`💾 Busca no BD: ${dbTime}ms`);

    if (agendamentoDB) {
      const totalTime = Date.now() - startTime;
      console.log(`✅ Encontrado no BD em ${totalTime}ms total`);
      
      // Formatar dados do banco
      const dadosAgendamento = {
        id: agendamentoDB.id.toString(),
        nome: agendamentoDB.nome,
        email: agendamentoDB.email,
        telefone: agendamentoDB.telefone,
        data: agendamentoDB.dataSelecionada.toISOString().split("T")[0],
        horario: agendamentoDB.horarioSelecionado,
        modalidade: agendamentoDB.modalidade,
        endereco: agendamentoDB.endereco || "", // ✅ ADICIONADO
        mensagem: agendamentoDB.mensagem || "",
        status: agendamentoDB.status,
      };

      return NextResponse.json({
        success: true,
        agendamento: dadosAgendamento,
        responseTime: totalTime,
        source: "database"
      });
    }

    console.log("⚠️ Agendamento não encontrado no BD, buscando no Google Calendar...");

    // 🚀 FALLBACK OTIMIZADO: Google Calendar com timeout e limite
    const gcalStartTime = Date.now();
    
    const eventos = await withRetry(async () => {
      const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || "{}"),
        scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
      });

      const calendar = google.calendar({ version: "v3", auth });

      // 🔧 FIX: Buscar apenas próximos 6 meses (limite realístico)
      const agora = new Date();
      const limiteMaximo = new Date();
      limiteMaximo.setMonth(limiteMaximo.getMonth() + 6);

      console.log("📅 Buscando eventos entre:", agora.toISOString(), "e", limiteMaximo.toISOString());

      return await calendar.events.list({
        calendarId: process.env.GOOGLE_CALENDAR_ID as string,
        timeMin: agora.toISOString(),
        timeMax: limiteMaximo.toISOString(), // 🔧 LIMITE DE 6 MESES
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 100, // 🔧 LIMITE DE 100 EVENTOS (vs infinito)
        q: codigo, // 🔧 BUSCA POR TEXTO (pode acelerar)
      });
    }, TIMEOUT_CONFIGS.GOOGLE_CALENDAR);

    const gcalTime = Date.now() - gcalStartTime;
    console.log(`📅 Busca no Google Calendar: ${gcalTime}ms (${eventos.data.items?.length || 0} eventos)`);;

    // Procurar o evento com o código de confirmação
    const evento = eventos.data.items?.find((evento) => {
      return evento.description?.includes(`Código: ${codigo}`);
    });

    if (!evento || !evento.id) {
      const totalTime = Date.now() - startTime;
      console.log(`❌ Agendamento não encontrado após ${totalTime}ms`);
      
      return NextResponse.json(
        {
          error: "Agendamento não encontrado",
          responseTime: totalTime,
        },
        { status: 404 }
      );
    }

    const processStartTime = Date.now();
    console.log("✅ Agendamento encontrado no Google Calendar, processando...");

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
      endereco: "", // ✅ ADICIONADO
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
        } else if (trimmed.startsWith("Endereço:")) { // ✅ ADICIONADO
          dadosEvento.endereco = trimmed.replace("Endereço:", "").trim();
        } else if (trimmed.startsWith("Mensagem:")) {
          dadosEvento.mensagem = trimmed.replace("Mensagem:", "").trim();
        }
      }
    }

    // ✅ ADICIONAR: Também extrair do campo location do evento
    if (evento.location && dadosEvento.modalidade === "presencial") {
      dadosEvento.endereco = evento.location;
    }

    const processTime = Date.now() - processStartTime;
    const totalTime = Date.now() - startTime;
    
    console.log(`🏁 Processamento concluído em ${processTime}ms`);
    console.log(`🚀 API finalizada em ${totalTime}ms total`);

    return NextResponse.json({
      success: true,
      agendamento: dadosEvento,
      responseTime: totalTime,
      source: "google_calendar",
      breakdown: {
        database: dbTime,
        googleCalendar: gcalTime,
        processing: processTime,
      }
    });
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`❌ Erro após ${errorTime}ms:`, error);
    
    return NextResponse.json(
      {
        error: "Erro ao buscar agendamento",
        responseTime: errorTime,
      },
      { status: 500 }
    );
  }
}
