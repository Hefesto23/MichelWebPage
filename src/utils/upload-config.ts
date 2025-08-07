// src/utils/upload-config.ts
import path from 'path';

export const UPLOAD_CONFIG = {
  // Tamanho máximo: 5MB
  maxFileSize: 5 * 1024 * 1024,
  
  // Tipos permitidos
  allowedMimeTypes: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp'
  ],
  
  // Extensões permitidas
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  
  // Diretórios
  uploadDir: path.join(process.cwd(), 'public', 'uploads', 'images'),
  originalsDir: path.join(process.cwd(), 'public', 'uploads', 'images', 'originals'),
  thumbnailsDir: path.join(process.cwd(), 'public', 'uploads', 'images', 'thumbnails'),
  
  // Configurações de thumbnail
  thumbnail: {
    width: 300,
    height: 200,
    quality: 80
  },
  
  // Configurações de compressão para originais
  compression: {
    quality: 90,
    progressive: true
  }
};

// Função para gerar nome único de arquivo
export const generateUniqueFilename = (originalName: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = path.extname(originalName).toLowerCase();
  const baseName = path.basename(originalName, extension)
    .replace(/[^a-zA-Z0-9]/g, '_')
    .substring(0, 20);
  
  return `${timestamp}_${random}_${baseName}${extension}`;
};

// Função para validar tipo de arquivo
export const isValidImageFile = (file: { mimetype: string; originalname: string }): boolean => {
  const mimeTypeValid = UPLOAD_CONFIG.allowedMimeTypes.includes(file.mimetype);
  const extensionValid = UPLOAD_CONFIG.allowedExtensions.includes(
    path.extname(file.originalname).toLowerCase()
  );
  
  return mimeTypeValid && extensionValid;
};

// Função para validar tamanho
export const isValidFileSize = (size: number): boolean => {
  return size <= UPLOAD_CONFIG.maxFileSize;
};