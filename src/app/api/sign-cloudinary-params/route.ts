// src/app/api/sign-cloudinary-params/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { verifyToken } from '@/lib/auth';
import { CLOUDINARY_CONFIG } from '@/lib/env';

// Configurar Cloudinary (compatível com next-cloudinary)
if (!cloudinary.config().cloud_name) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CONFIG.CLOUD_NAME,
    api_key: CLOUDINARY_CONFIG.API_KEY,
    api_secret: CLOUDINARY_CONFIG.API_SECRET,
  });
}

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
    const { paramsToSign } = body;

    if (!paramsToSign) {
      return NextResponse.json(
        { error: 'Parâmetros para assinatura são obrigatórios' },
        { status: 400 }
      );
    }

    // Gerar assinatura usando Cloudinary
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      CLOUDINARY_CONFIG.API_SECRET
    );

    console.log('✅ Assinatura gerada para upload Cloudinary');
    console.log('📁 Upload será para o folder:', CLOUDINARY_CONFIG.getFolder());

    return NextResponse.json({
      signature,
      timestamp: paramsToSign.timestamp,
      cloudname: CLOUDINARY_CONFIG.CLOUD_NAME,
      apikey: CLOUDINARY_CONFIG.API_KEY,
      folder: CLOUDINARY_CONFIG.getFolder(), // Incluir folder correto
    });

  } catch (error) {
    console.error('❌ Erro ao gerar assinatura:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';