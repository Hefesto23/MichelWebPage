// src/app/api/admin/blocked-slots/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

// GET - Listar todos os bloqueios
export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const blockType = searchParams.get('type'); // RECURRING ou ONE_TIME
    const isActive = searchParams.get('active'); // true, false, ou null (todos)

    const blockedSlots = await prisma.blockedSlot.findMany({
      where: {
        ...(blockType ? { blockType: blockType as any } : {}),
        ...(isActive !== null ? { isActive: isActive === 'true' } : {})
      },
      orderBy: [
        { blockType: 'asc' },
        { dayOfWeek: 'asc' },
        { specificDate: 'asc' },
        { timeSlot: 'asc' }
      ]
    });

    return NextResponse.json(blockedSlots);
  } catch (error) {
    console.error('Erro ao listar bloqueios:', error);
    return NextResponse.json(
      { error: 'Erro ao listar bloqueios' },
      { status: 500 }
    );
  }
}

// POST - Criar novo bloqueio
export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { blockType, dayOfWeek, timeSlot, specificDate, reason } = body;

    // Validações
    if (!blockType || !timeSlot) {
      return NextResponse.json(
        { error: 'blockType e timeSlot são obrigatórios' },
        { status: 400 }
      );
    }

    if (blockType === 'RECURRING') {
      if (!dayOfWeek || dayOfWeek < 1 || dayOfWeek > 7) {
        return NextResponse.json(
          { error: 'dayOfWeek inválido (1-7) para bloqueio RECURRING' },
          { status: 400 }
        );
      }
    }

    if (blockType === 'ONE_TIME' && !specificDate) {
      return NextResponse.json(
        { error: 'specificDate obrigatório para bloqueio ONE_TIME' },
        { status: 400 }
      );
    }

    // Verificar se já existe um bloqueio idêntico ativo
    const existing = await prisma.blockedSlot.findFirst({
      where: {
        blockType,
        timeSlot,
        isActive: true,
        ...(blockType === 'RECURRING' ? { dayOfWeek } : {}),
        ...(blockType === 'ONE_TIME' ? {
          specificDate: {
            gte: new Date(specificDate + 'T00:00:00'),
            lte: new Date(specificDate + 'T23:59:59')
          }
        } : {})
      }
    });

    if (existing) {
      const description = blockType === 'RECURRING'
        ? `${getDayName(dayOfWeek)} às ${timeSlot}`
        : `${specificDate} às ${timeSlot}`;
      return NextResponse.json(
        { error: `Já existe um bloqueio ativo para ${description}` },
        { status: 409 }
      );
    }

    // Criar bloqueio
    const blockedSlot = await prisma.blockedSlot.create({
      data: {
        blockType,
        dayOfWeek: blockType === 'RECURRING' ? dayOfWeek : null,
        specificDate: blockType === 'ONE_TIME' ? new Date(specificDate + 'T00:00:00') : null,
        timeSlot,
        reason: reason || null,
        createdBy: payload.email || 'admin'
      }
    });

    // Revalidar cache de horários
    revalidateTag('appointment-settings');

    console.log(`✅ Bloqueio criado: ${blockType} - ${timeSlot}`);

    return NextResponse.json(blockedSlot, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar bloqueio:', error);
    return NextResponse.json(
      { error: 'Erro ao criar bloqueio' },
      { status: 500 }
    );
  }
}

// Helper para obter nome do dia
function getDayName(dayNumber: number): string {
  const days: Record<number, string> = {
    1: 'Segunda-feira',
    2: 'Terça-feira',
    3: 'Quarta-feira',
    4: 'Quinta-feira',
    5: 'Sexta-feira',
    6: 'Sábado',
    7: 'Domingo'
  };
  return days[dayNumber] || 'Dia inválido';
}
