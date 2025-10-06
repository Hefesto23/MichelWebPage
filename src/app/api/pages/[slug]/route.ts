// src/app/api/pages/[slug]/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const page = await prisma.dynamicPage.findUnique({
      where: {
        slug,
        isActive: true,
      },
    });

    if (!page) {
      return NextResponse.json(
        { error: "Página não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: page },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Erro ao buscar página:", error);
    return NextResponse.json(
      { error: "Erro ao buscar página" },
      { status: 500 }
    );
  }
}
