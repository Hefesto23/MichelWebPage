// src/app/api/public/settings/route.ts
import prisma from "@/lib/prisma";
import { CLINIC_INFO } from "@/utils/constants";
import { NextResponse } from "next/server";

// Force dynamic rendering but allow cache revalidation
export const dynamic = 'force-dynamic';

// GET - Buscar configurações públicas (sem autenticação)
export async function GET() {
  try {
    console.log("📡 API Public Settings: Buscando configurações...");

    const settings = await prisma.settings.findMany();
    
    // Converter para formato organizado
    const settingsMap: Record<string, any> = {};
    
    settings.forEach((setting: any) => {
      try {
        settingsMap[setting.key] = JSON.parse(setting.value);
      } catch {
        settingsMap[setting.key] = setting.value;
      }
    });

    // Dados públicos com fallbacks para valores padrão
    const publicSettings = {
      working_days: settingsMap["agendamento.working_days"] || {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: false,
        saturday: false,
      },
      start_time: settingsMap["agendamento.start_time"] || CLINIC_INFO.HOURS.START,
      end_time: settingsMap["agendamento.end_time"] || CLINIC_INFO.HOURS.END,
      phone_number: settingsMap["geral.phone_number"] || CLINIC_INFO.CONTACT.PHONE_DISPLAY,
      contact_email: settingsMap["geral.contact_email"] || CLINIC_INFO.CONTACT.EMAIL,
      session_duration: settingsMap["agendamento.session_duration"] || 50,
      first_session_duration: settingsMap["agendamento.first_session_duration"] || 60,
      advance_days: settingsMap["agendamento.advance_days"] || 60,
      // Informações da Clínica
      psychologist_name: settingsMap["clinica.psychologist_name"] || CLINIC_INFO.PSYCHOLOGIST.NAME,
      crp_number: settingsMap["clinica.crp_number"] || CLINIC_INFO.PSYCHOLOGIST.CRP,
      minimum_age: settingsMap["clinica.minimum_age"] || 20,
      appointment_note: settingsMap["clinica.appointment_note"] || CLINIC_INFO.HOURS.NOTE,
      additional_notes: settingsMap["clinica.additional_notes"] || "",
      // Endereço principal
      street: settingsMap["endereco.street"] || CLINIC_INFO.ADDRESS.STREET,
      neighborhood: settingsMap["endereco.neighborhood"] || CLINIC_INFO.ADDRESS.NEIGHBORHOOD,
      city: settingsMap["endereco.city"] || CLINIC_INFO.ADDRESS.CITY,
      state: settingsMap["endereco.state"] || CLINIC_INFO.ADDRESS.STATE,
      zip_code: settingsMap["endereco.zip_code"] || CLINIC_INFO.ADDRESS.ZIP,
      latitude: settingsMap["endereco.latitude"] || CLINIC_INFO.ADDRESS.COORDINATES.LAT.toString(),
      longitude: settingsMap["endereco.longitude"] || CLINIC_INFO.ADDRESS.COORDINATES.LNG.toString(),
      // Segundo endereço (opcional)
      street2: settingsMap["endereco.street2"] || "",
      neighborhood2: settingsMap["endereco.neighborhood2"] || "",
      city2: settingsMap["endereco.city2"] || "",
      state2: settingsMap["endereco.state2"] || "",
      zip_code2: settingsMap["endereco.zip_code2"] || "",
    };

    console.log("✅ API Public Settings: Configurações retornadas");

    const response = NextResponse.json({
      success: true,
      data: publicSettings,
    });

    // Adicionar cache headers com tag para revalidation
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300');
    response.headers.set('Cache-Tag', 'settings-content');

    return response;
  } catch (error) {
    console.error("Erro ao buscar configurações públicas:", error);
    
    // Retornar configurações padrão em caso de erro
    const defaultSettings = {
      working_days: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: false,
        saturday: false,
      },
      start_time: CLINIC_INFO.HOURS.START,
      end_time: CLINIC_INFO.HOURS.END,
      phone_number: CLINIC_INFO.CONTACT.PHONE_DISPLAY,
      contact_email: CLINIC_INFO.CONTACT.EMAIL,
      session_duration: 50,
      first_session_duration: 60,
      advance_days: 60,
      // Informações da Clínica
      psychologist_name: CLINIC_INFO.PSYCHOLOGIST.NAME,
      crp_number: CLINIC_INFO.PSYCHOLOGIST.CRP,
      minimum_age: 20,
      appointment_note: CLINIC_INFO.HOURS.NOTE,
      additional_notes: "",
      // Endereço principal
      street: CLINIC_INFO.ADDRESS.STREET,
      neighborhood: CLINIC_INFO.ADDRESS.NEIGHBORHOOD,
      city: CLINIC_INFO.ADDRESS.CITY,
      state: CLINIC_INFO.ADDRESS.STATE,
      zip_code: CLINIC_INFO.ADDRESS.ZIP,
      latitude: CLINIC_INFO.ADDRESS.COORDINATES.LAT.toString(),
      longitude: CLINIC_INFO.ADDRESS.COORDINATES.LNG.toString(),
      // Segundo endereço (opcional)
      street2: "",
      neighborhood2: "",
      city2: "",
      state2: "",
      zip_code2: "",
    };

    return NextResponse.json({
      success: true,
      data: defaultSettings,
    });
  }
}