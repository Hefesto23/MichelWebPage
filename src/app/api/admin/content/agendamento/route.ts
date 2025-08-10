import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const content = await prisma.content.findMany({
      where: { page: "agendamento" },
    });

    if (!content.length) {
      // Retornar conteúdo padrão da página de agendamento
      return NextResponse.json({ 
        content: {
          agendamento: {
            title: "Agendamento de Consultas",
            description: "Agende sua consulta de forma rápida e segura. Escolha entre atendimento presencial ou online.",
            infoCards: [
              {
                id: 1,
                title: "Preparando-se para sua consulta",
                content: "Para a primeira consulta, recomendo chegar 10 minutos antes do horário marcado. Traga suas dúvidas e expectativas para conversarmos.",
                order: 1
              },
              {
                id: 2,
                title: "Política de Cancelamento",
                content: "Cancelamentos devem ser feitos com pelo menos 24 horas de antecedência. Caso contrário, a sessão será cobrada integralmente.",
                order: 2
              },
              {
                id: 3,
                title: "Consulta Online",
                content: "Para consultas online, utilize um local tranquilo e privado. Verifique sua conexão com a internet antes da sessão.",
                order: 3
              }
            ]
          }
        }
      });
    }

    // Processar dados do banco para o formato esperado
    const contentMap: Record<string, Record<string, unknown>> = { agendamento: {} };
    const infoCards: unknown[] = [];

    content.forEach((item: { section: string; key: string; value: string }) => {
      if (item.section === "agendamento") {
        contentMap.agendamento[item.key] = item.value;
      } else if (item.section.startsWith("card_")) {
        try {
          const cardData = JSON.parse(item.value);
          infoCards.push(cardData);
        } catch (e) {
          console.error('Error parsing info card data:', e);
        }
      }
    });

    if (infoCards.length > 0) {
      contentMap.agendamento.infoCards = infoCards;
    }

    console.log("📤 Dados enviados para o cliente (agendamento):", JSON.stringify(contentMap, null, 2));
    return NextResponse.json({ content: contentMap });
  } catch (error) {
    console.error("Error fetching agendamento content:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("📥 Dados recebidos na API agendamento:", JSON.stringify(data, null, 2));
    
    await prisma.content.deleteMany({
      where: { page: "agendamento" }
    });

    const contentEntries = [];
    
    // Verificar se os dados estão vindo via PageEditor (structure: data.content.agendamento)
    const agendamentoData = data.content?.agendamento || data.agendamento || data;
    
    if (agendamentoData.title) {
      contentEntries.push({
        page: "agendamento",
        section: "agendamento",
        key: "title",
        type: "text",
        value: agendamentoData.title
      });
    }
    
    if (agendamentoData.description) {
      contentEntries.push({
        page: "agendamento",
        section: "agendamento", 
        key: "description",
        type: "text",
        value: agendamentoData.description
      });
    }

    // Processar info cards
    const cards = agendamentoData.infoCards;
    if (cards && Array.isArray(cards)) {
      cards.forEach((card: unknown, index: number) => {
        contentEntries.push({
          page: "agendamento",
          section: `card_${index + 1}`,
          key: "data",
          type: "json",
          value: JSON.stringify(card)
        });
      });
    }

    if (contentEntries.length > 0) {
      await prisma.content.createMany({
        data: contentEntries
      });
    }

    console.log("💾 Dados salvos no banco:", contentEntries);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving agendamento content:", error);
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await prisma.content.deleteMany({
      where: { page: "agendamento" }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting agendamento content:", error);
    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 }
    );
  }
}