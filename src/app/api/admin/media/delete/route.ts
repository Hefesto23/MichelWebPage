// src/app/api/admin/media/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CloudinaryUploadService } from '@/lib/upload-cloudinary';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

const uploadService = new CloudinaryUploadService();

export async function DELETE(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Token de autenticação necessário' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const filename = searchParams.get('filename');
    
    if (!id && !filename) {
      return NextResponse.json(
        { error: 'ID ou filename do upload é obrigatório' },
        { status: 400 }
      );
    }
    
    // Buscar upload no banco de dados (por ID ou filename)
    let upload;
    if (id) {
      upload = await prisma.upload.findUnique({
        where: { id: parseInt(id) }
      });
    } else if (filename) {
      upload = await prisma.upload.findFirst({
        where: { 
          filename: filename,
          isActive: true 
        }
      });
    }
    
    if (!upload) {
      return NextResponse.json(
        { error: 'Upload não encontrado' },
        { status: 404 }
      );
    }
    
    try {
      // Deletar do Cloudinary usando o path (que contém o public_id)
      await uploadService.deleteImage(upload.path);
      console.log(`✅ Imagem deletada do Cloudinary: ${upload.path}`);
    } catch (error) {
      console.error(`❌ Erro ao deletar do Cloudinary:`, error);
      // Continuar mesmo se falhar no Cloudinary
    }
    
    // Marcar como inativo no banco (soft delete)
    await prisma.upload.update({
      where: { id: upload.id },
      data: { isActive: false }
    });
    
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