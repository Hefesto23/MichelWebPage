// ==========================================
// src/services/upload/uploadService.ts
// ==========================================
import { UPLOAD_CONFIG } from "@/utils/constants";
import { isValidFileSize, isValidImageType } from "@/utils/validators";
import crypto from "crypto";
import fs from "fs";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

export interface UploadResult {
  filename: string;
  originalName: string;
  path: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  thumbnails?: {
    thumb?: string;
    medium?: string;
    large?: string;
  };
}

export interface UploadOptions {
  generateThumbnails?: boolean;
  category?: string;
  quality?: number;
}

/**
 * Serviço para gerenciar uploads de imagens
 */
export class UploadService {
  private uploadDir = path.join(process.cwd(), "public/uploads");
  private maxSize = UPLOAD_CONFIG.MAX_SIZE_MB * 1024 * 1024;
  private allowedTypes = UPLOAD_CONFIG.ALLOWED_TYPES;

  /**
   * Faz upload e otimização de uma imagem
   */
  async uploadImage(
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    // Validações
    this.validateFile(file);

    // Gerar nome único
    const filename = this.generateFilename(file.name);

    // Criar estrutura de pastas
    const { uploadPath, relativePath } = await this.createUploadPath(
      options.category
    );

    // Converter File para Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Otimizar imagem principal
    const optimizedBuffer = await this.optimizeImage(buffer, options.quality);

    // Salvar arquivo principal
    const filePath = path.join(uploadPath, filename);
    await writeFile(filePath, optimizedBuffer);

    // Obter metadados
    const metadata = await sharp(optimizedBuffer).metadata();

    // Gerar thumbnails se solicitado
    let thumbnails;
    if (options.generateThumbnails) {
      thumbnails = await this.createThumbnails(buffer, filename, uploadPath);
    }

    return {
      filename,
      originalName: file.name,
      path: path.join(relativePath, filename).replace(/\\/g, "/"),
      url: `/uploads/${relativePath}/${filename}`.replace(/\\/g, "/"),
      mimeType: "image/jpeg", // sempre JPEG após otimização
      size: optimizedBuffer.length,
      width: metadata.width,
      height: metadata.height,
      thumbnails,
    };
  }

  /**
   * Faz upload de múltiplas imagens
   */
  async uploadMultiple(
    files: File[],
    options: UploadOptions = {}
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];

    for (const file of files) {
      try {
        const result = await this.uploadImage(file, options);
        results.push(result);
      } catch (error) {
        console.error(`Erro ao fazer upload de ${file.name}:`, error);
        // Continua com os próximos arquivos
      }
    }

    return results;
  }

  /**
   * Valida o arquivo antes do upload
   */
  private validateFile(file: File): void {
    if (!isValidImageType(file.type)) {
      throw new Error(
        `Tipo de arquivo não permitido. Use: ${this.allowedTypes.join(", ")}`
      );
    }

    if (!isValidFileSize(file.size, UPLOAD_CONFIG.MAX_SIZE_MB)) {
      throw new Error(
        `Arquivo muito grande. Máximo ${UPLOAD_CONFIG.MAX_SIZE_MB}MB`
      );
    }
  }

  /**
   * Gera nome único para o arquivo
   */
  private generateFilename(originalName: string): string {
    const ext = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, ext);
    const sanitizedName = nameWithoutExt
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .substring(0, 20);
    const uniqueId = crypto.randomBytes(4).toString("hex");

    // Sempre salva como JPEG após otimização
    return `${sanitizedName}-${uniqueId}.jpg`;
  }

  /**
   * Cria estrutura de diretórios
   */
  private async createUploadPath(category?: string): Promise<{
    uploadPath: string;
    relativePath: string;
  }> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    // Estrutura: uploads/[category]/2024/05/
    const pathSegments = ["uploads"];
    if (category) pathSegments.push(category);
    pathSegments.push(year.toString(), month);

    const relativePath = pathSegments.slice(1).join("/");
    const uploadPath = path.join(process.cwd(), "public", ...pathSegments);

    await mkdir(uploadPath, { recursive: true });

    return { uploadPath, relativePath };
  }

  /**
   * Otimiza a imagem principal
   */
  private async optimizeImage(
    buffer: Buffer,
    quality: number = 85
  ): Promise<Buffer> {
    return sharp(buffer)
      .resize(1920, 1080, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality,
        progressive: true,
      })
      .toBuffer();
  }

  /**
   * Cria thumbnails em diferentes tamanhos
   */
  private async createThumbnails(
    buffer: Buffer,
    filename: string,
    uploadPath: string
  ): Promise<Record<string, string>> {
    const thumbnails: Record<string, string> = {};
    const name = path.parse(filename).name;

    for (const [sizeName, dimensions] of Object.entries(UPLOAD_CONFIG.SIZES)) {
      const thumbFilename = `${name}_${sizeName}.jpg`;
      const thumbPath = path.join(uploadPath, thumbFilename);

      await sharp(buffer)
        .resize(dimensions.width, dimensions.height, {
          fit: "cover",
          position: "center",
        })
        .jpeg({ quality: 85 })
        .toFile(thumbPath);

      thumbnails[sizeName.toLowerCase()] = thumbFilename;
    }

    return thumbnails;
  }

  /**
   * Deleta uma imagem e seus thumbnails
   */
  async deleteImage(imagePath: string): Promise<void> {
    const fullPath = path.join(this.uploadDir, imagePath);

    try {
      // Deletar arquivo principal
      await fs.promises.unlink(fullPath);

      // Tentar deletar thumbnails
      const dir = path.dirname(fullPath);
      const name = path.parse(fullPath).name;

      for (const size of ["thumb", "medium", "large"]) {
        const thumbPath = path.join(dir, `${name}_${size}.jpg`);
        try {
          await fs.promises.unlink(thumbPath);
        } catch {
          // Ignora se thumbnail não existir
        }
      }
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error);
      throw new Error("Erro ao deletar imagem");
    }
  }

  /**
   * Obtém informações sobre uma imagem
   */
  async getImageInfo(imagePath: string): Promise<{
    exists: boolean;
    size?: number;
    dimensions?: { width: number; height: number };
  }> {
    const fullPath = path.join(this.uploadDir, imagePath);

    try {
      const stats = await fs.promises.stat(fullPath);
      const metadata = await sharp(fullPath).metadata();

      return {
        exists: true,
        size: stats.size,
        dimensions: {
          width: metadata.width || 0,
          height: metadata.height || 0,
        },
      };
    } catch {
      return { exists: false };
    }
  }

  /**
   * Lista arquivos em uma categoria
   */
  async listFiles(
    category?: string,
    year?: number,
    month?: number
  ): Promise<string[]> {
    const pathSegments = [this.uploadDir];
    if (category) pathSegments.push(category);
    if (year) pathSegments.push(year.toString());
    if (month) pathSegments.push(month.toString().padStart(2, "0"));

    const targetPath = path.join(...pathSegments);

    try {
      const files = await fs.promises.readdir(targetPath);
      // Filtrar apenas imagens
      return files.filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file));
    } catch {
      return [];
    }
  }
}

// Exportar instância única do serviço
export const uploadService = new UploadService();
