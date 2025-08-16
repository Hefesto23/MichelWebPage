// src/components/shared/CloudinaryImage.tsx
"use client";

import { CldImage } from 'next-cloudinary';
import Image from 'next/image';

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
 * e usa o componente apropriado
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
  
  // Extrair public_id da URL do Cloudinary se necessário
  const getPublicId = (url: string): string => {
    if (!isCloudinaryUrl) return url;
    
    // Debug
    console.log('🖼️ Processing Cloudinary URL:', url);
    
    // Padrão: .../upload/v123/michel-psi/filename.ext
    // ou: .../upload/michel-psi/filename.ext
    
    // Método simplificado: pegar tudo entre /upload/ (ou /vXXX/) e a extensão final
    const patterns = [
      /\/v\d+\/(.+)\.[a-z]+$/i,  // Com versão
      /\/upload\/(.+)\.[a-z]+$/i  // Sem versão
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        console.log('✅ Extracted public_id:', match[1]);
        return match[1]; // Retorna: michel-psi/filename
      }
    }
    
    console.log('⚠️ Could not extract public_id, using full URL');
    return url;
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