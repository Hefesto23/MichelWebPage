// src/app/api/admin/appointments/route.ts - REFATORADO
import { apiResponse, getSearchParams, withAuth } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

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

  return apiResponse.success(appointments);
});

// ============================================
// ✏️ ATUALIZAR STATUS DO AGENDAMENTO
// ============================================
// export const PUT = withAuth(async (req: NextRequest) => {
//   const body = await parseJsonBody(req);

//   if (!body) {
//     return apiResponse.error("Dados inválidos");
//   }

//   const { id, status } = body;

//   // Validar campos obrigatórios
//   const validationError = validateRequiredFields(id, ["id", "status"]);
//   if (validationError) {
//     return apiResponse.error(validationError);
//   }

//   // Atualizar status do agendamento
//   const appointment = await prisma.appointment.update({
//     where: { id: parseInt(id) },
//     data: { status },
//   });

//   return apiResponse.success(appointment);
// });

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

  return apiResponse.success(appointment);
});
