// src/app/api/admin/appointments/route.ts

import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticação
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Obter parâmetros de consulta
    const { searchParams } = new URL(req.url);
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

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Verificar autenticação
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID e status são obrigatórios" },
        { status: 400 }
      );
    }

    // Atualizar status do agendamento
    const appointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
