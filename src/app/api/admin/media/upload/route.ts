// src/app/api/admin/media/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { 
  UPLOAD_CONFIG, 
  generateUniqueFilename, 
  isValidImageFile, 
  isValidFileSize 
} from '@/utils/upload-config';

// Verificar se os diretórios existem, criar se necessário
async function ensureDirectoriesExist() {
  try {
    await mkdir(UPLOAD_CONFIG.originalsDir, { recursive: true });
    await mkdir(UPLOAD_CONFIG.thumbnailsDir, { recursive: true });
  } catch (error) {
    console.error('Erro ao criar diretórios:', error);
  }
}

// Função para processar e salvar imagem
async function processAndSaveImage(
  buffer: Buffer, 
  filename: string
): Promise<{
  url: string;
  thumbnailUrl: string;
  dimensions: { width: number; height: number };
}> {
  const originalPath = path.join(UPLOAD_CONFIG.originalsDir, filename);
  const thumbnailPath = path.join(UPLOAD_CONFIG.thumbnailsDir, filename);
  
  // Processar e salvar imagem original (com compressão)
  const processedImage = sharp(buffer);
  const metadata = await processedImage.metadata();
  
  // Salvar original otimizado
  await processedImage
    .jpeg({ 
      quality: UPLOAD_CONFIG.compression.quality,
      progressive: UPLOAD_CONFIG.compression.progressive 
    })
    .toFile(originalPath);
  
  // Gerar e salvar thumbnail
  await processedImage
    .resize(
      UPLOAD_CONFIG.thumbnail.width, 
      UPLOAD_CONFIG.thumbnail.height, 
      { 
        fit: 'cover',
        position: 'center'
      }
    )
    .jpeg({ quality: UPLOAD_CONFIG.thumbnail.quality })
    .toFile(thumbnailPath);
  
  return {
    url: `/uploads/images/originals/${filename}`,
    thumbnailUrl: `/uploads/images/thumbnails/${filename}`,
    dimensions: {
      width: metadata.width || 0,
      height: metadata.height || 0
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autenticação necessário' },
        { status: 401 }
      );
    }

    // Criar diretórios se não existirem
    await ensureDirectoriesExist();
    
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
    
    for (const file of files) {
      try {
        // Validações
        if (!isValidImageFile({ mimetype: file.type, originalname: file.name })) {
          errors.push(`${file.name}: Tipo de arquivo não suportado`);
          continue;
        }
        
        if (!isValidFileSize(file.size)) {
          errors.push(`${file.name}: Arquivo muito grande (máximo ${UPLOAD_CONFIG.maxFileSize / 1024 / 1024}MB)`);
          continue;
        }
        
        // Converter para buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Gerar nome único
        const uniqueFilename = generateUniqueFilename(file.name);
        
        // Processar e salvar
        const { url, thumbnailUrl, dimensions } = await processAndSaveImage(
          buffer, 
          uniqueFilename
        );
        
        results.push({
          id: uniqueFilename.split('.')[0], // Usar filename sem extensão como ID
          filename: uniqueFilename,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          url,
          thumbnailUrl,
          dimensions,
          uploadedAt: new Date().toISOString()
        });
        
      } catch (error) {
        console.error(`Erro ao processar ${file.name}:`, error);
        errors.push(`${file.name}: Erro interno ao processar arquivo`);
      }
    }
    
    return NextResponse.json({
      success: true,
      uploaded: results,
      errors: errors.length > 0 ? errors : null,
      message: `${results.length} arquivo(s) enviado(s) com sucesso`
    });
    
  } catch (error) {
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