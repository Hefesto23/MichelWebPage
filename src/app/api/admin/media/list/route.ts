// src/app/api/admin/media/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '@/lib/prisma';

// Configurar Cloudinary
if (!cloudinary.config().cloud_name) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

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

    let images: ImageInfo[] = [];

    // Buscar imagens diretamente do Cloudinary
    try {
      const cloudinaryResult = await cloudinary.search
        .expression('folder:michel-psi')
        .sort_by('created_at', 'desc')
        .max_results(100) // Ajuste conforme necessário
        .execute();

      console.log(`🔍 Imagens encontradas no Cloudinary:`, cloudinaryResult.resources.length);

      // Converter recursos do Cloudinary para formato esperado pelo frontend
      images = cloudinaryResult.resources.map((resource: any) => ({
        id: resource.public_id, // Usar public_id como ID único
        filename: resource.public_id.split('/').pop() + '.' + resource.format,
        url: resource.secure_url,
        thumbnailUrl: resource.secure_url.replace('/upload/', '/upload/w_300,h_300,c_fill,q_auto,f_auto/'),
        size: resource.bytes || 0,
        uploadedAt: resource.created_at,
        dimensions: resource.width && resource.height ? {
          width: resource.width,
          height: resource.height
        } : undefined
      }));
    } catch (cloudinaryError) {
      console.error('❌ Erro ao buscar do Cloudinary:', cloudinaryError);
      
      // Fallback: buscar do banco se Cloudinary falhar
      console.log('⚠️ Usando fallback do banco de dados...');
      const uploads = await prisma.upload.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });

      images = uploads.map(upload => ({
        id: upload.id.toString(),
        filename: upload.filename,
        url: upload.path,
        thumbnailUrl: upload.path.replace('/upload/', '/upload/w_300,h_300,c_fill,q_auto,f_auto/'),
        size: upload.size,
        uploadedAt: upload.createdAt.toISOString(),
        dimensions: upload.width && upload.height ? {
          width: upload.width,
          height: upload.height
        } : undefined
      }));
    }
    
    console.log(`📁 Total de imagens:`, images.length);
    
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