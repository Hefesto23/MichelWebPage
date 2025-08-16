// src/app/api/admin/media/save/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

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

    const body = await request.json();
    const {
      public_id,
      secure_url,
      width,
      height,
      format,
      bytes,
      original_filename
    } = body;

    if (!public_id || !secure_url) {
      return NextResponse.json(
        { error: 'Dados do upload são obrigatórios' },
        { status: 400 }
      );
    }

    // Gerar filename baseado no public_id
    const filename = `${public_id.split('/').pop()}.${format}`;

    // Salvar no banco de dados
    const uploadRecord = await prisma.upload.create({
      data: {
        filename: filename,
        originalName: original_filename || 'image',
        path: secure_url, // URL completa do Cloudinary
        mimeType: `image/${format}`,
        size: bytes || 0,
        width: width || null,
        height: height || null,
        isActive: true
      }
    });

    console.log(`✅ Upload salvo no banco: ${uploadRecord.filename} (ID: ${uploadRecord.id})`);

    return NextResponse.json({
      success: true,
      id: uploadRecord.id.toString(),
      filename: uploadRecord.filename,
      url: uploadRecord.path,
      message: 'Upload salvo com sucesso no banco de dados'
    });

  } catch (error: any) {
    console.error('❌ Erro ao salvar upload no banco:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';