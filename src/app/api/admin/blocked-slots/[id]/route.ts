// src/app/api/admin/blocked-slots/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

// PATCH - Atualizar bloqueio (ativar/desativar ou atualizar motivo)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { isActive, reason } = body;

    // Verificar se o bloqueio existe
    const existing = await prisma.blockedSlot.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Bloqueio não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar bloqueio
    const updated = await prisma.blockedSlot.update({
      where: { id },
      data: {
        ...(isActive !== undefined ? { isActive } : {}),
        ...(reason !== undefined ? { reason } : {})
      }
    });

    // Revalidar cache de horários
    revalidateTag('appointment-settings');

    console.log(`✅ Bloqueio atualizado: ${id} - isActive: ${updated.isActive}`);

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar bloqueio:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar bloqueio' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar bloqueio permanentemente
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = params;

    // Verificar se o bloqueio existe
    const existing = await prisma.blockedSlot.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Bloqueio não encontrado' },
        { status: 404 }
      );
    }

    // Deletar bloqueio
    await prisma.blockedSlot.delete({
      where: { id }
    });

    // Revalidar cache de horários
    revalidateTag('appointment-settings');

    console.log(`✅ Bloqueio deletado: ${id}`);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Erro ao deletar bloqueio:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar bloqueio' },
      { status: 500 }
    );
  }
}
