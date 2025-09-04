// ============================================
// src/components/shared/media/ImageGallery.tsx
// ============================================
"use client";

import Image from "next/image";
import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import styles from "@/styles/clinic-gallery.module.css";

interface GalleryImage {
  original: string;
  thumbnail?: string;
  originalAlt?: string;
  originalTitle?: string;
  description?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
}

export const ImageGalleryComponent: React.FC<ImageGalleryProps> = ({
  images,
}) => {
  const renderCustomItem = (item: GalleryImage) => {
    return (
      <div className="custom-gallery-item relative w-full h-[calc(100vh-16rem)]">
        <Image
          src={item.original}
          alt={item.originalAlt || "Image"}
          fill
          sizes="90vw"
          className="object-cover w-full h-full rounded-md"
        />
        <div className="image-description absolute bottom-0 w-full bg-black bg-opacity-50 left-1/2 transform -translate-x-1/2">
          <h3 className="image-title text-white break-words hyphens-auto">{item.originalTitle}</h3>
          <p className="image-text text-white break-words hyphens-auto whitespace-normal">{item.description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="image-gallery-container w-full flex justify-center items-center">
      <div className="w-full max-w-full mx-auto">
        <ImageGallery
          items={images.map(item => ({
            ...item,
            thumbnail: item.original // Force thumbnail = original for unified system
          }))}
          showThumbnails={true}
          showFullscreenButton={true}
          showPlayButton={false}
          autoPlay={false}
          lazyLoad={true}
          renderItem={(item) => renderCustomItem(item)}
          additionalClass={`${styles.customGallery} bg-black w-full`}
          thumbnailPosition="bottom"
          useBrowserFullscreen={false}
        />
      </div>
    </div>
  );
};

// Este array é apenas para referência - as imagens reais vêm do CMS via DEFAULT_CLINIC_CONTENT
export const clinicImages: GalleryImage[] = [];
