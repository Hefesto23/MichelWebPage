// src/app/api/config/cloudinary/route.ts
import { NextResponse } from 'next/server';
import { CLOUDINARY_CONFIG } from '@/lib/env';

/**
 * Endpoint público para configuração do Cloudinary
 * Retorna apenas informações necessárias para upload client-side
 */
export async function GET() {
  try {
    return NextResponse.json({
      cloudName: CLOUDINARY_CONFIG.CLOUD_NAME,
      folder: CLOUDINARY_CONFIG.getFolder(),
    });
  } catch {
    return NextResponse.json(
      { error: 'Erro ao buscar configuração' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
