import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { validateAuthHeader } from "@/lib/auth";

export async function GET() {
  try {
    const content = await prisma.content.findMany({
      where: { page: "terapias" },
    });

    if (!content.length) {
      // Retornar no formato que o PageEditor espera
      return NextResponse.json({ 
        content: {
          terapias: {
            title: "Modalidades de Atendimentos",
            description: "Os atendimentos são realizados dentro da visão teórica da Análise do Comportamento, buscando compreender e transformar comportamentos para uma melhor qualidade de vida.",
            therapyModalities: [
              {
                id: 1,
                title: "Psicoterapia individual - Presencial",
                description: "Modalidade de atendimento de um paciente através de técnicas personalizadas em encontros presenciais no consultório.",
                imageUrl: "/assets/terapias1.jpg",
                href: "/presencial",
                order: 1,
                active: true
              },
              {
                id: 2,
                title: "Psicoterapia individual - On-line",
                description: "Modalidade de terapia que permite o atendimento feito à distância, com todo o conforto e privacidade que você precisa.",
                imageUrl: "/assets/terapias1.jpg",
                href: "/online",
                order: 2,
                active: true
              },
              {
                id: 3,
                title: "Plantão Psicológico",
                description: "Serviço de atendimento rápido e pontual, oferecido para pessoas que precisam de suporte emocional imediato e urgente.",
                imageUrl: "/assets/terapias1.jpg",
                href: "/plantao",
                order: 3,
                active: true
              }
            ]
          }
        }
      });
    }

    // Processar dados do banco para o formato esperado
    const contentMap: Record<string, Record<string, unknown>> = { terapias: {} };
    const therapyModalities: unknown[] = [];

    content.forEach((item: { section: string; key: string; value: string }) => {
      if (item.section === "terapias") {
        contentMap.terapias[item.key] = item.value;
      } else if (item.section.startsWith("card_")) {
        try {
          const cardData = JSON.parse(item.value);
          therapyModalities.push(cardData);
        } catch (e) {
          console.error('Error parsing therapy modality data:', e);
        }
      }
    });

    if (therapyModalities.length > 0) {
      contentMap.terapias.therapyModalities = therapyModalities;
    }

    console.log("📤 Dados enviados para o cliente (terapias):", JSON.stringify(contentMap, null, 2));
    return NextResponse.json({ content: contentMap });
  } catch (error) {
    console.error("Error fetching terapias content:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log("📡 API: POST request received for terapias content");

    const authHeader = request.headers.get("authorization");
    console.log("🔑 API: Auth header present:", authHeader ? 'Sim' : 'Não');

    const payload = validateAuthHeader(authHeader);

    if (!payload) {
      console.log("❌ API: Token inválido ou ausente");
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }

    console.log("✅ API: Autenticação válida, payload:", payload);
    console.log("🚀 API Terapias POST: Iniciando processamento");

    const data = await request.json();
    console.log("📥 Dados recebidos na API terapias:", JSON.stringify(data, null, 2));
    
    console.log("🔍 Estrutura dos dados:", {
      hasTerapias: !!data.terapias,
      hasTherapyModalities: !!(data.terapias?.therapyModalities),
      modalitiesCount: data.terapias?.therapyModalities?.length || 0,
      keys: Object.keys(data)
    });
    
    await prisma.content.deleteMany({
      where: { page: "terapias" }
    });

    const contentEntries = [];
    
    // Verificar se os dados estão vindo via PageEditor (structure: data.content.terapias)
    const terapiasData = data.content?.terapias || data.terapias || data;
    
    if (terapiasData.title) {
      contentEntries.push({
        page: "terapias",
        section: "terapias",
        key: "title",
        type: "text",
        value: terapiasData.title
      });
    }
    
    if (terapiasData.description) {
      contentEntries.push({
        page: "terapias",
        section: "terapias", 
        key: "description",
        type: "text",
        value: terapiasData.description
      });
    }

    // Verificar ambas as estruturas: cards (nossa API) e therapyModalities (PageEditor)
    const modalities = terapiasData.therapyModalities || terapiasData.cards;
    if (modalities && Array.isArray(modalities)) {
      modalities.forEach((modality: unknown, index: number) => {
        contentEntries.push({
          page: "terapias",
          section: `card_${index + 1}`,
          key: "data",
          type: "json",
          value: JSON.stringify(modality)
        });
      });
    }

    if (contentEntries.length > 0) {
      await prisma.content.createMany({
        data: contentEntries
      });
    }

    console.log("💾 Dados salvos no banco:", contentEntries);

    // Revalidar cache da página terapias
    try {
      revalidateTag('terapias-content');
      console.log("🔄 API: Cache revalidado com sucesso");
    } catch (revalidateError) {
      console.warn("⚠️ API: Erro ao revalidar cache:", revalidateError);
      // Não falhar a operação por causa do cache
    }

    console.log("✅ API Terapias: Save concluído com sucesso");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("💥 ERRO na API Terapias:", error);
    console.error("💥 Stack trace:", error instanceof Error ? error.stack : 'No stack available');
    return NextResponse.json(
      { 
        error: "Failed to save content",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    console.log("📡 API: DELETE request received for terapias content");

    const authHeader = request.headers.get("authorization");
    const payload = validateAuthHeader(authHeader);

    if (!payload) {
      console.log("❌ API: Token inválido ou ausente");
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }

    await prisma.content.deleteMany({
      where: { page: "terapias" }
    });

    // Revalidar cache da página terapias
    try {
      revalidateTag('terapias-content');
      console.log("🔄 API: Cache revalidado com sucesso");
    } catch (revalidateError) {
      console.warn("⚠️ API: Erro ao revalidar cache:", revalidateError);
      // Não falhar a operação por causa do cache
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting terapias content:", error);
    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 }
    );
  }
}