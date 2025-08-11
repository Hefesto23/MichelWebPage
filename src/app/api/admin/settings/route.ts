// src/app/api/admin/settings/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - Buscar todas as configurações
export async function GET() {
  try {
    const settings = await prisma.settings.findMany();
    
    // Converter para formato organizado por seção
    const settingsBySection: Record<string, Record<string, any>> = {};
    
    settings.forEach((setting: any) => {
      if (!settingsBySection[setting.section]) {
        settingsBySection[setting.section] = {};
      }
      
      try {
        settingsBySection[setting.section][setting.key] = JSON.parse(setting.value);
      } catch {
        settingsBySection[setting.section][setting.key] = setting.value;
      }
    });

    return NextResponse.json({
      success: true,
      data: settingsBySection,
    });
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Salvar configurações
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, settings } = body;

    if (!section || !settings) {
      return NextResponse.json(
        { error: "Seção e configurações são obrigatórias" },
        { status: 400 }
      );
    }

    // Salvar cada configuração
    for (const [key, value] of Object.entries(settings)) {
      await prisma.settings.upsert({
        where: { key: `${section}.${key}` },
        update: {
          value: JSON.stringify(value),
          section,
        },
        create: {
          key: `${section}.${key}`,
          value: JSON.stringify(value),
          section,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Configurações salvas com sucesso",
    });
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar uma configuração específica
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value, section } = body;

    if (!key || value === undefined || !section) {
      return NextResponse.json(
        { error: "Key, value e section são obrigatórios" },
        { status: 400 }
      );
    }

    const fullKey = `${section}.${key}`;

    await prisma.settings.upsert({
      where: { key: fullKey },
      update: {
        value: JSON.stringify(value),
        section,
      },
      create: {
        key: fullKey,
        value: JSON.stringify(value),
        section,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Configuração atualizada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar configuração:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}