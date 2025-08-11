// src/app/api/admin/appointments/route.ts - REFATORADO
import { apiResponse, getSearchParams, withAuth } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// 📋 BUSCAR AGENDAMENTOS
// ============================================
export const GET = withAuth(async (req: NextRequest) => {
  const searchParams = getSearchParams(req);
  const status = searchParams.get("status");
  const date = searchParams.get("date");
  const search = searchParams.get("search");

  // Construir filtros
  const where: Prisma.AppointmentWhereInput = {};

  if (status && status !== "todos") {
    where.status = status;
  }

  if (date) {
    where.dataSelecionada = date;
  }

  if (search) {
    where.OR = [
      { nome: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { codigo: { contains: search, mode: "insensitive" } },
    ];
  }

  // Buscar agendamentos
  const appointments = await prisma.appointment.findMany({
    where,
    orderBy: { dataSelecionada: "desc" },
  });

  console.log("📋 API Appointments - Total encontrados:", appointments.length);
  console.log("📋 API Appointments - Filtros aplicados:", { status, date, search });
  console.log("📋 API Appointments - Primeiros 3 resultados:", appointments.slice(0, 3).map(a => ({
    id: a.id,
    nome: a.nome,
    dataSelecionada: a.dataSelecionada,
    status: a.status
  })));

  // Normalizar dados antes de retornar
  const normalizedAppointments = appointments.map(apt => ({
    ...apt,
    status: apt.status.toLowerCase(), // Normalizar para minúsculas
    // Garantir que dataSelecionada seja uma string no formato YYYY-MM-DD
    dataSelecionada: apt.dataSelecionada instanceof Date 
      ? apt.dataSelecionada.toISOString().split('T')[0]
      : new Date(apt.dataSelecionada).toISOString().split('T')[0]
  }));

  return NextResponse.json({
    success: true,
    data: normalizedAppointments
  });
});

// ============================================
// ✏️ ATUALIZAR STATUS DO AGENDAMENTO
// ============================================
export const PUT = withAuth(async (req: NextRequest) => {
  const body = await req.json();

  if (!body) {
    return apiResponse.error("Dados inválidos");
  }

  const { id, status } = body;

  if (!id || !status) {
    return apiResponse.error("ID e status são obrigatórios");
  }

  // Validar status permitidos
  const allowedStatuses = ["agendado", "confirmado", "cancelado", "realizado"];
  if (!allowedStatuses.includes(status)) {
    return apiResponse.error("Status inválido");
  }

  try {
    // Atualizar status do agendamento
    const appointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { 
        status,
        updatedAt: new Date()
      },
    });

    return NextResponse.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    return apiResponse.error("Erro ao atualizar agendamento");
  }
});

// ============================================
// 🗑️ DELETAR AGENDAMENTO
// ============================================
export const DELETE = withAuth(async (req: NextRequest) => {
  const searchParams = getSearchParams(req);
  const id = searchParams.get("id");

  if (!id) {
    return apiResponse.error("ID não fornecido");
  }

  // Soft delete
  const appointment = await prisma.appointment.update({
    where: { id: parseInt(id) },
    data: {
      status: "cancelado",
      updatedAt: new Date(),
    },
  });

  return NextResponse.json({
    success: true,
    data: appointment
  });
});
