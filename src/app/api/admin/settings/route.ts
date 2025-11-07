// src/app/api/admin/settings/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { validateAuthHeader } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// GET - Buscar todas as configurações
export async function GET(request: NextRequest) {
  try {

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

// DELETE - Restaurar configurações padrão (seção específica ou todas)
export async function DELETE(request: NextRequest) {
  try {

    const authHeader = request.headers.get("authorization");
    const payload = validateAuthHeader(authHeader);

    if (!payload) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }

    console.log("✅ API: Autenticação válida");

    // Verificar se tem query param de seção específica
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    // Configurações padrão
    const defaultSettings = {
      agendamento: {
        working_days: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: false,
          saturday: false,
        },
        start_time: "08:00",
        end_time: "21:00",
        session_duration: 50,
        first_session_duration: 60,
        advance_days: 60,
        email_notifications: true,
        whatsapp_notifications: true,
      },
      geral: {
        site_title: "Michel de Camargo - Psicólogo Clínico",
        phone_number: "(15) 99764-6421",
        contact_email: "michelcamargo.psi@gmail.com",
      },
      clinica: {
        psychologist_name: "Michel de Camargo",
        crp_number: "CRP 06/174807",
        age_disclaimer: "* Atendimentos a partir de 20 anos de idade",
        appointment_note: "As consultas necessitam ser previamente agendadas.",
        additional_notes: "",
      },
      endereco: {
        street: "Rua Antônio Ferreira, 171",
        neighborhood: "Parque Campolim",
        city: "Sorocaba",
        state: "SP",
        zip_code: "18047-636",
        latitude: "-23.493335284719095",
        longitude: "-47.47244788549275",
        street2: "",
        neighborhood2: "",
        city2: "",
        state2: "",
        zip_code2: "",
      },
      notificacoes: {
        email_notifications: true,
        whatsapp_notifications: false,
      },
    };

    if (section) {
      console.log(`🔄 API: Restaurando seção "${section}" para o padrão...`);

      // Verificar se a seção existe nas configurações padrão
      if (!defaultSettings[section as keyof typeof defaultSettings]) {
        return NextResponse.json(
          { error: `Seção "${section}" não encontrada` },
          { status: 400 }
        );
      }

      // Deletar todas as configurações da seção
      await prisma.settings.deleteMany({
        where: { section }
      });

      // Recriar com valores padrão
      const sectionDefaults = defaultSettings[section as keyof typeof defaultSettings];
      for (const [key, value] of Object.entries(sectionDefaults)) {
        await prisma.settings.create({
          data: {
            key: `${section}.${key}`,
            value: JSON.stringify(value),
            section,
          },
        });
      }

      console.log(`✅ API: Seção "${section}" restaurada com sucesso`);

      // Revalidar cache
      try {
        revalidateTag('settings-content');
        console.log("🔄 API: Cache revalidado com sucesso");
      } catch (revalidateError) {
        console.warn("⚠️ API: Erro ao revalidar cache:", revalidateError);
      }

      return NextResponse.json({
        success: true,
        message: `Seção "${section}" restaurada com sucesso`
      });
    } else {
      console.log("🔄 API: Restaurando TODAS as configurações para o padrão...");

      // Deletar todas as configurações
      await prisma.settings.deleteMany({});

      // Recriar todas com valores padrão
      for (const [sectionName, sectionSettings] of Object.entries(defaultSettings)) {
        for (const [key, value] of Object.entries(sectionSettings)) {
          await prisma.settings.create({
            data: {
              key: `${sectionName}.${key}`,
              value: JSON.stringify(value),
              section: sectionName,
            },
          });
        }
      }

      console.log("✅ API: Todas as configurações restauradas com sucesso");

      // Revalidar cache
      try {
        revalidateTag('settings-content');
        console.log("🔄 API: Cache revalidado com sucesso");
      } catch (revalidateError) {
        console.warn("⚠️ API: Erro ao revalidar cache:", revalidateError);
      }

      return NextResponse.json({
        success: true,
        message: "Todas as configurações restauradas com sucesso"
      });
    }
  } catch (error) {
    console.error("Erro ao restaurar configurações:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}