// src/app/api/admin/media/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CloudinaryUploadService } from '@/lib/upload-cloudinary';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

const uploadService = new CloudinaryUploadService();

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Token de autenticação necessário' },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      );
    }
    
    const results = [];
    const errors = [];
    
    console.log('🔄 Upload usando: CLOUDINARY');
    
    for (const file of files) {
      try {
        // Upload direto para Cloudinary
        const uploadResult = await uploadService.uploadImage(file);
        
        // Salvar no banco de dados
        const uploadRecord = await prisma.upload.create({
          data: {
            filename: uploadResult.filename,
            originalName: uploadResult.originalName,
            path: uploadResult.url, // URL completa do Cloudinary
            mimeType: uploadResult.mimeType,
            size: uploadResult.size,
            width: uploadResult.width || null,
            height: uploadResult.height || null,
            isActive: true
          }
        });
        
        console.log(`✅ Arquivo salvo no banco: ${uploadRecord.filename} (ID: ${uploadRecord.id})`);
        
        results.push({
          id: uploadRecord.id.toString(),
          filename: uploadResult.filename,
          originalName: uploadResult.originalName,
          mimeType: uploadResult.mimeType,
          size: uploadResult.size,
          url: uploadResult.url,
          thumbnailUrl: uploadResult.thumbnailUrl,
          dimensions: {
            width: uploadResult.width || 0,
            height: uploadResult.height || 0
          },
          uploadedAt: uploadRecord.createdAt.toISOString()
        });
        
      } catch (error: any) {
        console.error(`Erro ao processar ${file.name}:`, error);
        errors.push(`${file.name}: ${error.message || 'Erro interno ao processar arquivo'}`);
      }
    }
    
    return NextResponse.json({
      success: true,
      uploaded: results,
      errors: errors.length > 0 ? errors : null,
      message: `${results.length} arquivo(s) enviado(s) com sucesso via CLOUDINARY`
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
    
  } catch (error: any) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  }
}

// Configurações do Next.js para upload
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Headers CORS para Vercel
export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}