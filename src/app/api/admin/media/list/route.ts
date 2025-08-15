// src/app/api/admin/media/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface ImageInfo {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl: string;
  size: number;
  uploadedAt: string;
  dimensions?: { width: number; height: number };
}

export async function GET(request: NextRequest) {
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

    // Buscar uploads no banco de dados
    const uploads = await prisma.upload.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Converter para formato esperado pelo frontend (agora só Cloudinary)
    const images: ImageInfo[] = uploads.map(upload => ({
      id: upload.id.toString(),
      filename: upload.filename,
      url: upload.path, // upload.path já contém a URL completa do Cloudinary
      thumbnailUrl: upload.path.replace('/upload/', '/upload/w_300,h_300,c_fill,q_auto,f_auto/'),
      size: upload.size,
      uploadedAt: upload.createdAt.toISOString(),
      dimensions: upload.width && upload.height ? {
        width: upload.width,
        height: upload.height
      } : undefined
    }));
    
    console.log(`📁 Encontrados ${images.length} arquivos no banco de dados`);
    
    return NextResponse.json({
      success: true,
      images,
      count: images.length
    });
    
  } catch (error: unknown) {
    console.error('Erro ao listar imagens:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';