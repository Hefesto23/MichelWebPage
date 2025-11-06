// src/app/api/admin/media/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '@/lib/prisma';
import { CLOUDINARY_CONFIG } from '@/lib/env';

// Configurar Cloudinary
if (!cloudinary.config().cloud_name) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CONFIG.CLOUD_NAME,
    api_key: CLOUDINARY_CONFIG.API_KEY,
    api_secret: CLOUDINARY_CONFIG.API_SECRET,
  });
}

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
    const publicId = searchParams.get('publicId');
    const filename = searchParams.get('filename');
    
    console.log('🗑️ Tentando deletar:', { publicId, filename });
    
    // Se temos o publicId, deletar diretamente do Cloudinary
    if (publicId) {
      try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`✅ Resultado do delete no Cloudinary:`, result);
        
        if (result.result === 'ok' || result.result === 'not found') {
          // Também tentar remover do banco se existir
          if (filename) {
            await prisma.upload.updateMany({
              where: { 
                filename: filename,
                isActive: true 
              },
              data: { isActive: false }
            });
          }
          
          return NextResponse.json({
            success: true,
            message: 'Arquivo deletado com sucesso'
          });
        }
      } catch (cloudinaryError) {
        console.error('❌ Erro ao deletar do Cloudinary:', cloudinaryError);
        return NextResponse.json(
          { error: 'Erro ao deletar arquivo do Cloudinary' },
          { status: 500 }
        );
      }
    }
    
    // Fallback: tentar deletar pelo filename se não tiver publicId
    if (filename) {
      // Construir o public_id baseado no padrão do ambiente atual
      const folder = CLOUDINARY_CONFIG.getFolder();
      const inferredPublicId = `${folder}/${filename.replace(/\.[^/.]+$/, '')}`;

      console.log(`🔍 Tentando deletar com public_id inferido: ${inferredPublicId}`);

      try {
        const result = await cloudinary.uploader.destroy(inferredPublicId);
        console.log(`✅ Resultado do delete (inferido):`, result);
        
        // Marcar como inativo no banco
        await prisma.upload.updateMany({
          where: { 
            filename: filename,
            isActive: true 
          },
          data: { isActive: false }
        });
        
        return NextResponse.json({
          success: true,
          message: 'Arquivo deletado com sucesso'
        });
      } catch (error) {
        console.error('❌ Erro ao deletar (inferido):', error);
      }
    }
    
    return NextResponse.json(
      { error: 'Não foi possível identificar o arquivo para deletar' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';