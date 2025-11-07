// src/components/shared/CloudinaryImage.tsx
"use client";

import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import { CLOUDINARY_CONFIG } from '@/lib/env';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}

/**
 * Componente wrapper para exibir imagens
 * Detecta automaticamente se é uma URL do Cloudinary ou externa
 * e usa o componente apropriado com normalização de folder por ambiente
 */
export const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  style
}) => {
  // Verificar se é uma URL do Cloudinary
  const isCloudinaryUrl = src?.includes('cloudinary.com') || src?.includes('res.cloudinary.com');

  /**
   * Normaliza o public_id usando o sistema centralizado de ambiente
   * Garante que imagens sempre apontem para o folder correto (prod/staging/dev)
   */
  const getPublicId = (url: string): string => {
    if (!isCloudinaryUrl) return url;

    try {
      // Usar função centralizada que detecta ambiente automaticamente
      const normalizedId = CLOUDINARY_CONFIG.normalizePublicId(url);

      console.log('🖼️ CloudinaryImage normalized:', {
        original: url.substring(0, 100) + '...',
        normalized: normalizedId,
        environment: CLOUDINARY_CONFIG.getFolder()
      });

      return normalizedId;
    } catch (error) {
      console.error('❌ Error normalizing public_id:', error);
      return url;
    }
  };

  // Se for Cloudinary, usar CldImage para otimização automática
  if (isCloudinaryUrl) {
    const publicId = getPublicId(src);
    
    if (fill) {
      return (
        <CldImage
          src={publicId}
          alt={alt}
          fill
          sizes={sizes || "100vw"}
          className={className}
          priority={priority}
          style={style}
        />
      );
    }

    return (
      <CldImage
        src={publicId}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes || `(max-width: ${width}px) 100vw, ${width}px`}
        className={className}
        priority={priority}
        style={style}
        crop="fill"
        gravity="auto"
        format="auto"
        quality="auto"
        removeBackground={false} // Manter fundo para PNGs com transparência
        preserveTransformations={true}
      />
    );
  }

  // Para URLs externas ou locais, usar Next/Image padrão
  if (fill) {
    return (
      <Image
        src={src || '/assets/placeholder.jpg'}
        alt={alt}
        fill
        sizes={sizes || "100vw"}
        className={className}
        priority={priority}
        style={style}
      />
    );
  }

  return (
    <Image
      src={src || '/assets/placeholder.jpg'}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      style={style}
    />
  );
};