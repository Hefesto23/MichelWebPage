// src/lib/upload-cloudinary.ts
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import crypto from 'crypto';
import sharp from 'sharp';

interface UploadResult {
  filename: string;
  originalName: string;
  path: string;
  url: string;
  thumbnailUrl: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  publicId: string;
}

export class CloudinaryUploadService {
  private maxSize = 5 * 1024 * 1024; // 5MB
  private allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  constructor() {
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary credentials not found');
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: File): Promise<UploadResult> {
    // Validações
    if (!this.allowedTypes.includes(file.type)) {
      throw new Error('Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.');
    }

    if (file.size > this.maxSize) {
      throw new Error('Arquivo muito grande. Máximo 5MB.');
    }

    try {
      // Converter File para Buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Otimizar imagem com Sharp (pré-processamento)
      const optimizedBuffer = await sharp(buffer)
        .resize(1920, 1080, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({
          quality: 90, // Cloudinary vai otimizar mais
          progressive: true,
        })
        .toBuffer();

      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const randomId = crypto.randomUUID().slice(0, 8);
      const filename = `${timestamp}_${randomId}`;
      
      // Pasta organizada por data
      const date = new Date();
      const folder = `michel-psi/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`;

      // Upload para Cloudinary
      const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: folder,
            public_id: filename,
            transformation: [
              {
                quality: 'auto:good',
                fetch_format: 'auto'
              }
            ],
            eager: [
              {
                width: 300,
                height: 300,
                crop: 'fill',
                quality: 'auto:good',
                fetch_format: 'auto'
              }
            ],
            eager_async: false,
            resource_type: 'image',
          },
          (error: any, result: any) => {
            if (error) reject(error);
            else if (result) resolve(result);
            else reject(new Error('Upload failed'));
          }
        ).end(optimizedBuffer);
      });

      // URL do thumbnail (primeira transformação eager)
      const thumbnailUrl = uploadResult.eager && uploadResult.eager[0] 
        ? uploadResult.eager[0].secure_url 
        : this.generateThumbnailUrl(uploadResult.secure_url);

      return {
        filename: `${filename}.jpg`,
        originalName: file.name,
        path: `${folder}/${filename}`,
        url: uploadResult.secure_url,
        thumbnailUrl: thumbnailUrl,
        mimeType: 'image/jpeg',
        size: uploadResult.bytes,
        width: uploadResult.width,
        height: uploadResult.height,
        publicId: uploadResult.public_id,
      };

    } catch (error) {
      console.error('Erro no upload Cloudinary:', error);
      throw new Error(`Erro no upload: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      
      if (result.result !== 'ok') {
        console.warn(`Aviso ao deletar ${publicId}:`, result);
      }
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      throw new Error(`Erro ao deletar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async listImages(folder: string = 'michel-psi', limit: number = 50): Promise<any[]> {
    try {
      const result = await cloudinary.search
        .expression(`folder:${folder}/*`)
        .sort_by('created_at', 'desc')
        .max_results(limit)
        .execute();

      return result.resources || [];
    } catch (error) {
      console.error('Erro ao listar imagens:', error);
      throw new Error(`Erro ao listar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  // Gerar URL de thumbnail usando transformações Cloudinary
  generateThumbnailUrl(originalUrl: string): string {
    return originalUrl.replace('/upload/', '/upload/w_300,h_300,c_fill,q_auto,f_auto/');
  }

  // Gerar URL otimizada com transformações dinâmicas
  getOptimizedUrl(publicId: string, options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
    crop?: string;
  } = {}): string {
    const {
      width = 800,
      height = 600,
      quality = 'auto:good',
      format = 'auto',
      crop = 'fit'
    } = options;

    return cloudinary.url(publicId, {
      width,
      height,
      crop,
      quality,
      fetch_format: format,
      secure: true
    });
  }

  // Para múltiplos uploads simultâneos
  async uploadMultipleImages(files: File[]): Promise<UploadResult[]> {
    const uploadPromises = files.map(file => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  // Estatísticas de uso
  async getUsageStats(): Promise<any> {
    try {
      const result = await cloudinary.api.usage();
      return {
        storage: result.storage,
        bandwidth: result.bandwidth,
        transformations: result.transformations,
        credits: result.credits
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return null;
    }
  }
}