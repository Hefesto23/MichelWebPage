// src/app/api/admin/media/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import path from 'path';
import { UPLOAD_CONFIG } from '@/utils/upload-config';

interface ImageInfo {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl: string;
  size: number;
  uploadedAt: Date;
  dimensions?: { width: number; height: number };
}

async function getImageFiles(): Promise<ImageInfo[]> {
  try {
    // Verificar se o diretório existe
    const originalsDir = UPLOAD_CONFIG.originalsDir;
    const thumbnailsDir = UPLOAD_CONFIG.thumbnailsDir;
    
    let files: string[] = [];
    try {
      files = await readdir(originalsDir);
    } catch {
      // Se o diretório não existir, retornar array vazio
      return [];
    }
    
    const imageFiles = files.filter(file => 
      UPLOAD_CONFIG.allowedExtensions.includes(path.extname(file).toLowerCase())
    );
    
    const images: ImageInfo[] = [];
    
    for (const filename of imageFiles) {
      try {
        const filePath = path.join(originalsDir, filename);
        const thumbnailPath = path.join(thumbnailsDir, filename);
        
        const fileStat = await stat(filePath);
        
        // Verificar se thumbnail existe
        let hasThumbnail = false;
        try {
          await stat(thumbnailPath);
          hasThumbnail = true;
        } catch {
          // Thumbnail não existe, mas continua
        }
        
        images.push({
          id: filename.split('.')[0], // Usar filename sem extensão como ID
          filename,
          url: `/uploads/images/originals/${filename}`,
          thumbnailUrl: hasThumbnail 
            ? `/uploads/images/thumbnails/${filename}` 
            : `/uploads/images/originals/${filename}`,
          size: fileStat.size,
          uploadedAt: fileStat.mtime,
        });
      } catch (err) {
        console.error(`Erro ao processar arquivo ${filename}:`, err);
        continue;
      }
    }
    
    // Ordenar por data de upload (mais recente primeiro)
    images.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
    
    return images;
  } catch (error: unknown) {
    console.error('Erro ao listar imagens:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autenticação necessário' },
        { status: 401 }
      );
    }

    const images = await getImageFiles();
    
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