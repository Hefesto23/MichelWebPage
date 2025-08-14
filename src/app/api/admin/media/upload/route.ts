// src/app/api/admin/media/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ProductionUploadService } from '@/lib/upload-production';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

const uploadService = new ProductionUploadService();

export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }
    
    const results = [];
    const errors = [];
    
    // Verificar qual serviço está sendo usado
    const serviceInfo = uploadService.getServiceInfo();
    console.log(`🔄 Upload usando: ${serviceInfo.service.toUpperCase()} (Production: ${serviceInfo.isProduction})`);
    
    for (const file of files) {
      try {
        // Upload usando o serviço de produção (Cloudinary ou local)
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
      message: `${results.length} arquivo(s) enviado(s) com sucesso via ${serviceInfo.service.toUpperCase()}`,
      service: serviceInfo
    });
    
  } catch (error: any) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Configurações do Next.js para upload
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';