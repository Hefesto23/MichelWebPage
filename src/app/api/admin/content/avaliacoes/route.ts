import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { validateAuthHeader } from "@/lib/auth";

export async function GET() {
  try {
    const content = await prisma.content.findMany({
      where: { page: "avaliacoes" },
    });

    if (!content.length) {
      // Retornar no formato que o PageEditor espera
      return NextResponse.json({ 
        content: {
          avaliacoes: {
            title: "Testes Psicológicos",
            description: "Instrumentos técnicos e científicos que auxiliam na compreensão de aspectos específicos da saúde mental e cognitiva. Cada teste oferece insights importantes sobre diferentes dimensões psicológicas.",
            testModalities: [
              {
                id: 1,
                title: "Teste de Ansiedade - Escala BAI",
                description: "A Escala de Ansiedade de Beck (BAI) é um instrumento de avaliação que ajuda a identificar e medir a severidade dos sintomas de ansiedade. Composta por 21 questões, permite uma análise rápida e objetiva do estado atual de ansiedade do indivíduo.",
                imageUrl: "/assets/terapias1.jpg",
                href: "https://kiai.med.br/test/teste-online-de-ansiedade-escala-de-beck-bai/",
                order: 1,
                active: true
              },
              {
                id: 2,
                title: "Teste de Inteligência WAIS III",
                description: "A Escala Wechsler de Inteligência (WAIS III) é um instrumento completo para avaliação cognitiva, composto por subtestes que analisam diferentes aspectos da inteligência, como compreensão verbal, raciocínio perceptual, memória de trabalho e velocidade de processamento.",
                imageUrl: "/assets/terapias1.jpg",
                href: "/wais-iii",
                order: 2,
                active: true
              }
            ]
          }
        }
      });
    }

    // Processar dados do banco para o formato esperado
    const contentMap: Record<string, Record<string, unknown>> = { avaliacoes: {} };
    const testModalities: unknown[] = [];

    content.forEach((item: { section: string; key: string; value: string }) => {
      if (item.section === "avaliacoes") {
        contentMap.avaliacoes[item.key] = item.value;
      } else if (item.section.startsWith("card_")) {
        try {
          const cardData = JSON.parse(item.value);
          testModalities.push(cardData);
        } catch (e) {
          console.error('Error parsing test modality data:', e);
        }
      }
    });

    if (testModalities.length > 0) {
      contentMap.avaliacoes.testModalities = testModalities;
    }

    console.log("📤 Dados enviados para o cliente (avaliacoes):", JSON.stringify(contentMap, null, 2));
    return NextResponse.json({ content: contentMap });
  } catch (error) {
    console.error("Error fetching avaliacoes content:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log("📡 API: POST request received for avaliacoes content");

    const authHeader = request.headers.get("authorization");
    console.log("🔑 API: Auth header present:", authHeader ? 'Sim' : 'Não');

    const payload = validateAuthHeader(authHeader);

    if (!payload) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }

    console.log("✅ API: Autenticação válida, payload:", payload);

    const data = await request.json();
    console.log("📥 Dados recebidos na API avaliacoes:", JSON.stringify(data, null, 2));

    // Preparar dados para salvar
    const contentEntries = [];

    // Verificar se os dados estão vindo via PageEditor (structure: data.content.avaliacoes)
    const avaliacoesData = data.content?.avaliacoes || data.avaliacoes || data;

    // Deletar todos os registros existentes (hard delete)
    await prisma.content.deleteMany({
      where: { page: "avaliacoes" }
    });
    
    if (avaliacoesData.title) {
      contentEntries.push({
        page: "avaliacoes",
        section: "avaliacoes",
        key: "title",
        type: "text",
        value: avaliacoesData.title
      });
    }
    
    if (avaliacoesData.description) {
      contentEntries.push({
        page: "avaliacoes",
        section: "avaliacoes", 
        key: "description",
        type: "text",
        value: avaliacoesData.description
      });
    }

    // Verificar ambas as estruturas: cards (nossa API) e testModalities (PageEditor)
    const tests = avaliacoesData.testModalities || avaliacoesData.cards;
    if (tests && Array.isArray(tests)) {
      tests.forEach((test: unknown, index: number) => {
        contentEntries.push({
          page: "avaliacoes",
          section: `card_${index + 1}`,
          key: "data",
          type: "json",
          value: JSON.stringify(test)
        });
      });
    }

    // Criar novos registros
    if (contentEntries.length > 0) {
      await prisma.content.createMany({
        data: contentEntries
      });
    }

    console.log("💾 Dados salvos no banco:", contentEntries);

    // Revalidar cache da página avaliacoes
    try {
      revalidateTag('avaliacoes-content');
      console.log("🔄 API: Cache revalidado com sucesso");
    } catch (revalidateError) {
      console.warn("⚠️ API: Erro ao revalidar cache:", revalidateError);
      // Não falhar a operação por causa do cache
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving avaliacoes content:", error);
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    console.log("📡 API: DELETE request received for avaliacoes content");

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
      console.log(`🔄 API: Resetando seção "${section}" da página Avaliações...`);

      // Deletar apenas a seção específica
      await prisma.content.deleteMany({
        where: {
          page: "avaliacoes",
          section: section
        }
      });

      console.log(`✅ API: Seção "${section}" resetada com sucesso`);
      return NextResponse.json({
        success: true,
        message: `Seção "${section}" resetada com sucesso`
      });
    } else {
      console.log("🔄 API: Resetando TODA a página Avaliações...");

      // Deletar todos os registros desta página (hard delete)
      await prisma.content.deleteMany({
        where: { page: "avaliacoes" }
      });

      console.log("✅ API: Página Avaliações resetada com sucesso");
    }

    // Revalidar cache da página avaliacoes
    try {
      revalidateTag('avaliacoes-content');
      console.log("🔄 API: Cache revalidado com sucesso");
    } catch (revalidateError) {
      console.warn("⚠️ API: Erro ao revalidar cache:", revalidateError);
      // Não falhar a operação por causa do cache
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting avaliacoes content:", error);
    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 }
    );
  }
}