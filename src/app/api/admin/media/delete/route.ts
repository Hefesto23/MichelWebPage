// src/app/api/admin/media/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import { UPLOAD_CONFIG } from '@/utils/upload-config';

export async function DELETE(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autenticação necessário' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    
    if (!filename) {
      return NextResponse.json(
        { error: 'Nome do arquivo é obrigatório' },
        { status: 400 }
      );
    }
    
    // Validar nome do arquivo (segurança)
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json(
        { error: 'Nome de arquivo inválido' },
        { status: 400 }
      );
    }
    
    const originalPath = path.join(UPLOAD_CONFIG.originalsDir, filename);
    const thumbnailPath = path.join(UPLOAD_CONFIG.thumbnailsDir, filename);
    
    const errors = [];
    
    // Tentar deletar arquivo original
    try {
      await unlink(originalPath);
    } catch (error) {
      console.error(`Erro ao deletar original ${filename}:`, error);
      errors.push('Erro ao deletar arquivo original');
    }
    
    // Tentar deletar thumbnail
    try {
      await unlink(thumbnailPath);
    } catch (error) {
      console.error(`Erro ao deletar thumbnail ${filename}:`, error);
      // Não adicionar ao array de erros se for só o thumbnail
    }
    
    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Arquivo deletado com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';