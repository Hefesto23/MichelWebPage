// src/lib/upload.ts

import crypto from "crypto";
import fs from "fs";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

interface UploadResult {
  filename: string;
  originalName: string;
  path: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
}

export class UploadService {
  private uploadDir = path.join(process.cwd(), "public/uploads");
  private maxSize = 5 * 1024 * 1024; // 5MB
  private allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  async uploadImage(file: File): Promise<UploadResult> {
    // Validações
    if (!this.allowedTypes.includes(file.type)) {
      throw new Error("Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.");
    }

    if (file.size > this.maxSize) {
      throw new Error("Arquivo muito grande. Máximo 5MB.");
    }

    // Gerar nome único
    // const ext = path.extname(file.name);
    const filename = crypto.randomUUID() + ".jpg"; // sempre salva como JPEG otimizado

    // Criar estrutura de pastas por data
    const date = new Date();
    const yearMonth = `${date.getFullYear()}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    const uploadPath = path.join(this.uploadDir, yearMonth);

    // Criar diretório se não existir
    await mkdir(uploadPath, { recursive: true });

    // Converter File para Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Otimizar imagem com Sharp
    const optimizedBuffer = await sharp(buffer)
      .resize(1920, 1080, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 85,
        progressive: true,
      })
      .toBuffer();

    // Salvar arquivo
    const filePath = path.join(uploadPath, filename);
    await writeFile(filePath, optimizedBuffer);

    // Obter dimensões da imagem
    const metadata = await sharp(optimizedBuffer).metadata();

    return {
      filename,
      originalName: file.name,
      path: path.join(yearMonth, filename).replace(/\\/g, "/"),
      url: `/uploads/${yearMonth}/${filename}`,
      mimeType: "image/jpeg", // sempre JPEG após otimização
      size: optimizedBuffer.length,
      width: metadata.width,
      height: metadata.height,
    };
  }

  async deleteImage(filepath: string): Promise<void> {
    const fullPath = path.join(this.uploadDir, filepath);
    try {
      await fs.promises.unlink(fullPath);
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error);
    }
  }

  // Para múltiplos tamanhos (thumbnail, medium, large)
  async createThumbnails(buffer: Buffer, filename: string, uploadPath: string) {
    const sizes = [
      { name: "thumb", width: 150, height: 150 },
      { name: "medium", width: 500, height: 500 },
      { name: "large", width: 1200, height: 1200 },
    ];

    const thumbnails: { [key: string]: string } = {};

    for (const size of sizes) {
      const name = path.parse(filename).name;
      const ext = path.parse(filename).ext;
      const thumbFilename = `${name}_${size.name}${ext}`;
      const thumbPath = path.join(uploadPath, thumbFilename);

      await sharp(buffer)
        .resize(size.width, size.height, {
          fit: "cover",
          position: "center",
        })
        .jpeg({ quality: 85 })
        .toFile(thumbPath);

      thumbnails[size.name] = thumbFilename;
    }

    return thumbnails;
  }
}
