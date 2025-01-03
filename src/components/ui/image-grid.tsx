"use client";

import Image from "next/image";
import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "./gallery-styles.css";

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

const ImageGalleryComponent: React.FC<ImageGalleryProps> = ({ images }) => {
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
          <h3 className="image-title text-white">{item.originalTitle}</h3>
          <p className="image-text text-white">{item.description}</p>
        </div>
      </div>
    );
  };
  return (
    <div className="image-gallery-container">
      <ImageGallery
        items={images}
        showThumbnails={true}
        showFullscreenButton={true}
        showPlayButton={false}
        autoPlay={false}
        lazyLoad={true}
        renderItem={(item) => renderCustomItem(item)}
        additionalClass="custom-gallery bg-black"
      />
    </div>
  );
};

export default ImageGalleryComponent;

const clinicImages: GalleryImage[] = [
  {
    original: "https://picsum.photos/800/600",
    thumbnail: "https://picsum.photos/800/600",
    originalAlt: "Espaço de Consultório - Área de Acolhimento",
    originalTitle: "Espaço de Consultório",
    description:
      "Ambiente acolhedor e tranquilo projetado para proporcionar conforto e segurança.",
  },
  {
    original: "https://picsum.photos/800/600",
    thumbnail: "https://picsum.photos/800/600",
    originalAlt: "Espaço de Consultório - Sala de Terapia",
    originalTitle: "Sala de Terapia",
    description:
      "Sala de terapia com iluminação natural e design minimalista para promover relaxamento.",
  },
];

export { clinicImages, ImageGalleryComponent };
