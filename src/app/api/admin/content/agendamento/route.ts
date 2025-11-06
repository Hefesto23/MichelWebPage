import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { validateAuthHeader } from "@/lib/auth";

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
    const cardsData: Record<number, { id: number; title?: string; content?: string; order: number }> = {};

    content.forEach((item: { section: string; key: string; value: string }) => {
      if (item.section === "agendamento") {
        // Check if it's a card field (card_1_title, card_1_content, etc)
        const cardMatch = item.key.match(/card_(\d+)_(title|content)/);
        if (cardMatch) {
          const cardId = parseInt(cardMatch[1]);
          const field = cardMatch[2] as 'title' | 'content';

          if (!cardsData[cardId]) {
            cardsData[cardId] = { id: cardId, order: cardId };
          }
          cardsData[cardId][field] = item.value;
        } else {
          // Regular fields (title, description)
          contentMap.agendamento[item.key] = item.value;
        }
      }
    });

    // Convert cardsData object to array
    const infoCards = Object.values(cardsData).sort((a, b) => a.order - b.order);

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
    console.log("📡 API: POST request received for agendamento content");

    const authHeader = request.headers.get("authorization");
    const payload = validateAuthHeader(authHeader);

    if (!payload) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }

    console.log("✅ API: Autenticação válida");

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

    // Processar info cards - agora salvando individualmente como fields
    const cards = agendamentoData.infoCards;
    if (cards && Array.isArray(cards)) {
      cards.forEach((card: any) => {
        // Salvar título e conteúdo de cada card como campos separados
        contentEntries.push({
          page: "agendamento",
          section: "agendamento",
          key: `card_${card.id}_title`,
          type: "text",
          value: card.title
        });
        contentEntries.push({
          page: "agendamento",
          section: "agendamento",
          key: `card_${card.id}_content`,
          type: "text",
          value: card.content
        });
      });
    }

    if (contentEntries.length > 0) {
      await prisma.content.createMany({
        data: contentEntries
      });
    }

    // Revalidar cache
    try {
      revalidateTag('agendamento-content');
      console.log("🔄 API: Cache revalidado com sucesso");
    } catch (revalidateError) {
      console.warn("⚠️ API: Erro ao revalidar cache:", revalidateError);
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

export async function DELETE(request: Request) {
  try {
    console.log("📡 API: DELETE request received for agendamento content");

    const authHeader = request.headers.get("authorization");
    const payload = validateAuthHeader(authHeader);

    if (!payload) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }

    // Verificar se tem query param de seção específica
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    if (section) {
      console.log(`🔄 API: Resetando seção "${section}" da página Agendamento...`);

      // Deletar apenas a seção específica
      await prisma.content.deleteMany({
        where: {
          page: "agendamento",
          section: section
        }
      });

      console.log(`✅ API: Seção "${section}" resetada com sucesso`);
      return NextResponse.json({
        success: true,
        message: `Seção "${section}" resetada com sucesso`
      });
    } else {
      console.log("🔄 API: Resetando TODA a página Agendamento...");

      // Deletar todos os registros desta página
      await prisma.content.deleteMany({
        where: { page: "agendamento" }
      });

      console.log("✅ API: Página Agendamento resetada com sucesso");
    }

    // Revalidar cache
    try {
      revalidateTag('agendamento-content');
      console.log("🔄 API: Cache revalidado com sucesso");
    } catch (revalidateError) {
      console.warn("⚠️ API: Erro ao revalidar cache:", revalidateError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting agendamento content:", error);
    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 }
    );
  }
}