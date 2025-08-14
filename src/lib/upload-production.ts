// src/lib/upload-production.ts
// Service que detecta automaticamente o ambiente e usa o serviço apropriado

import { CloudinaryUploadService } from './upload-cloudinary';
import { UploadService } from './upload'; // Serviço local original

interface UploadResult {
  filename: string;
  originalName: string;
  path: string;
  url: string;
  thumbnailUrl?: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  publicId?: string;
}

export class ProductionUploadService {
  private cloudinaryService?: CloudinaryUploadService;
  private localService?: UploadService;
  private isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production' || 
                       process.env.VERCEL_ENV === 'production' ||
                       !!process.env.CLOUDINARY_CLOUD_NAME;

    if (this.isProduction) {
      try {
        this.cloudinaryService = new CloudinaryUploadService();
        console.log('🌤️  Using Cloudinary for image uploads');
      } catch (_error) {
        console.warn('⚠️  Cloudinary not configured, falling back to local storage');
        this.localService = new UploadService();
        this.isProduction = false;
      }
    } else {
      this.localService = new UploadService();
      console.log('💻 Using local storage for image uploads');
    }
  }

  async uploadImage(file: File): Promise<UploadResult> {
    if (this.isProduction && this.cloudinaryService) {
      const result = await this.cloudinaryService.uploadImage(file);
      return {
        ...result,
        thumbnailUrl: result.thumbnailUrl || this.generateLocalThumbnailUrl(result.url)
      };
    } else if (this.localService) {
      const result = await this.localService.uploadImage(file);
      return {
        ...result,
        thumbnailUrl: this.generateLocalThumbnailUrl(result.url),
        publicId: result.path // Para compatibilidade
      };
    } else {
      throw new Error('No upload service available');
    }
  }

  async deleteImage(pathOrPublicId: string): Promise<void> {
    if (this.isProduction && this.cloudinaryService) {
      await this.cloudinaryService.deleteImage(pathOrPublicId);
    } else if (this.localService) {
      await this.localService.deleteImage(pathOrPublicId);
    }
  }

  async listImages(folder?: string): Promise<any[]> {
    if (this.isProduction && this.cloudinaryService) {
      return await this.cloudinaryService.listImages(folder);
    } else {
      // Para local, retornar lista vazia ou implementar listagem local
      return [];
    }
  }

  getOptimizedUrl(originalUrl: string, options: {
    width?: number;
    height?: number;
    quality?: string;
  } = {}): string {
    if (this.isProduction && this.cloudinaryService) {
      // Extrair public_id da URL para usar transformações
      const publicId = this.extractPublicIdFromUrl(originalUrl);
      if (publicId) {
        return this.cloudinaryService.getOptimizedUrl(publicId, options);
      }
    }
    
    // Fallback para URL original
    return originalUrl;
  }

  private generateLocalThumbnailUrl(originalUrl: string): string {
    // Para URLs locais, assumir estrutura de thumbnails
    return originalUrl.replace('/uploads/', '/uploads/thumbnails/');
  }

  private extractPublicIdFromUrl(url: string): string | null {
    try {
      // Extrair public_id de URLs Cloudinary
      const match = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|webp)/i);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  // Método para saber qual serviço está sendo usado
  getServiceInfo(): { service: 'cloudinary' | 'local'; isProduction: boolean } {
    return {
      service: this.isProduction ? 'cloudinary' : 'local',
      isProduction: this.isProduction
    };
  }

  // Upload múltiplo
  async uploadMultipleImages(files: File[]): Promise<UploadResult[]> {
    if (this.isProduction && this.cloudinaryService) {
      return await this.cloudinaryService.uploadMultipleImages(files);
    } else {
      // Para local, fazer uploads sequenciais
      const results: UploadResult[] = [];
      for (const file of files) {
        const result = await this.uploadImage(file);
        results.push(result);
      }
      return results;
    }
  }

  // Estatísticas (só Cloudinary)
  async getUsageStats(): Promise<any> {
    if (this.isProduction && this.cloudinaryService) {
      return await this.cloudinaryService.getUsageStats();
    }
    return null;
  }
}

// Export singleton para uso global
export const uploadService = new ProductionUploadService();