// src/app/api/admin/settings/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { validateAuthHeader } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// GET - Buscar todas as configurações
export async function GET(request: NextRequest) {
  try {
    console.log("📡 API: GET request received for admin settings");

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
    console.log("🔄 API: Buscando configurações...");

    const settings = await prisma.settings.findMany();
    
    // Converter para formato organizado por seção
    const settingsBySection: Record<string, Record<string, any>> = {};
    
    settings.forEach((setting: any) => {
      if (!settingsBySection[setting.section]) {
        settingsBySection[setting.section] = {};
      }

      // Extrair apenas a parte da chave após o ponto (ex: "endereco.city2" -> "city2")
      const keyParts = setting.key.split('.');
      const actualKey = keyParts.length > 1 ? keyParts.slice(1).join('.') : setting.key;

      try {
        settingsBySection[setting.section][actualKey] = JSON.parse(setting.value);
      } catch {
        settingsBySection[setting.section][actualKey] = setting.value;
      }
    });

    console.log(`📥 API: ${settings.length} configurações encontradas`);

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
    console.log("📡 API: POST request received for admin settings");

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

    // Revalidar cache das configurações públicas
    try {
      revalidateTag('settings-content');
      console.log("🔄 API: Cache revalidado com sucesso");
    } catch (revalidateError) {
      console.warn("⚠️ API: Erro ao revalidar cache:", revalidateError);
      // Não falhar a operação por causa do cache
    }

    console.log("✅ API: Configurações salvas com sucesso");
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
    console.log("📡 API: PUT request received for admin settings");

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

    // Revalidar cache das configurações públicas
    try {
      revalidateTag('settings-content');
      console.log("🔄 API: Cache revalidado com sucesso");
    } catch (revalidateError) {
      console.warn("⚠️ API: Erro ao revalidar cache:", revalidateError);
      // Não falhar a operação por causa do cache
    }

    console.log("✅ API: Configuração atualizada com sucesso");
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