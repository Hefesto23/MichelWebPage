// ============================================
// src/components/shared/media/ImageGallery.tsx
// ============================================
"use client";

import styles from "@/styles/clinic-gallery.module.css";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState } from "react";
import type { SlideImage } from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

// Dynamic import for better performance - lightbox doesn't need to load initially
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});

// Dynamic import of CSS to avoid loading on server
if (typeof window !== "undefined") {
  import("yet-another-react-lightbox/styles.css");
}

// Image sizes for responsive loading
const imageSizes = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];
const deviceSizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

// Generate Next.js optimized image URL
function nextImageUrl(src: string, size: number, quality = 75): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${size}&q=${quality}`;
}

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

export const ImageGalleryComponent: React.FC<ImageGalleryProps> = ({ images }) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // Handle opening lightbox
  const openLightbox = (slideIndex: number) => {
    setIndex(slideIndex);
    setOpen(true);
    handleOpenChange(true);
  };

  // Handle closing lightbox
  const closeLightbox = () => {
    setOpen(false);
    handleOpenChange(false);
  };

  // Handle fullscreen state changes - hide problematic floating elements
  const handleOpenChange = (isOpen: boolean) => {
    const body = document.body;

    if (isOpen) {
      // Block page scroll
      body.style.overflow = "hidden";

      // Hide floating elements
      const whatsappButton = document.querySelector(
        'a[class*="fixed"][class*="bottom-6"][class*="left-6"]',
      );
      const navigationPill = document.querySelector('nav[class*="fixed"][class*="right-6"]');
      const divisorElements = document.querySelectorAll("div.relative.h-96.w-full.overflow-hidden");

      if (whatsappButton) {
        const el = whatsappButton as HTMLElement;
        el.style.visibility = "hidden";
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
      }

      if (navigationPill) {
        const el = navigationPill as HTMLElement;
        el.style.visibility = "hidden";
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
      }

      // Hide divisor elements
      divisorElements.forEach((element) => {
        const el = element as HTMLElement;
        const hasParallaxBg = el.querySelector(".parallax-bg");
        if (hasParallaxBg) {
          el.style.visibility = "hidden";
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
        }
      });
    } else {
      // Restore page scroll
      body.style.overflow = "";

      // Restore floating elements
      const whatsappButton = document.querySelector(
        'a[class*="fixed"][class*="bottom-6"][class*="left-6"]',
      );
      const navigationPill = document.querySelector('nav[class*="fixed"][class*="right-6"]');
      const divisorElements = document.querySelectorAll("div.relative.h-96.w-full.overflow-hidden");

      if (whatsappButton) {
        const el = whatsappButton as HTMLElement;
        el.style.removeProperty("visibility");
        el.style.removeProperty("opacity");
        el.style.removeProperty("pointer-events");
      }

      if (navigationPill) {
        const el = navigationPill as HTMLElement;
        el.style.removeProperty("visibility");
        el.style.removeProperty("opacity");
        el.style.removeProperty("pointer-events");
      }

      // Restore divisor elements
      divisorElements.forEach((element) => {
        const el = element as HTMLElement;
        const hasParallaxBg = el.querySelector(".parallax-bg");
        if (hasParallaxBg) {
          el.style.removeProperty("visibility");
          el.style.removeProperty("opacity");
          el.style.removeProperty("pointer-events");
        }
      });
    }
  };

  // Convert images to optimized lightbox format with srcSet
  const lightboxSlides = images.map((image) => {
    // Assume reasonable dimensions for optimization (can be improved with actual image dimensions)
    const assumedWidth = 1200;
    const assumedHeight = 800;

    // Generate srcSet with different sizes for responsive loading
    const srcSet = imageSizes
      .concat(...deviceSizes)
      .filter((size) => size <= assumedWidth)
      .map((size) => ({
        src: nextImageUrl(image.original, size, 90),
        width: size,
        height: Math.round((size * assumedHeight) / assumedWidth),
      }));

    return {
      src: nextImageUrl(image.original, assumedWidth, 90),
      alt: image.originalAlt || "Gallery image",
      width: assumedWidth,
      height: assumedHeight,
      srcSet,
      // Custom properties for title and description
      title: image.originalTitle,
      description: image.description,
    } as SlideImage & { title?: string; description?: string };
  });

  return (
    <>
      {/* Gallery Grid */}
      <div className={`${styles.galleryGrid} w-full`}>
        {images.map((image, idx) => (
          <div
            key={idx}
            className={`${styles.galleryItem} relative cursor-pointer group overflow-hidden rounded-lg`}
            onClick={() => openLightbox(idx)}
          >
            <Image
              src={image.original}
              alt={image.originalAlt || "Gallery image"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Overlay with title and description */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {image.originalTitle && (
                  <h3 className="text-white font-semibold text-lg mb-1">{image.originalTitle}</h3>
                )}
                {image.description && (
                  <p className="text-white/90 text-sm line-clamp-2">{image.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox with optimized configuration */}
      <div className={styles.lightboxWrapper}>
        <Lightbox
          open={open}
          close={closeLightbox}
          index={index}
          slides={lightboxSlides}
          plugins={[Zoom]}
          styles={{
            root: {
              "--yarl__color_backdrop": "rgba(0, 0, 0, 0.95)",
              "--yarl__color_button": "rgba(255, 255, 255, 0.8)",
              "--yarl__color_button_active": "rgba(255, 255, 255, 1)",
              "--yarl__color_button_disabled": "rgba(255, 255, 255, 0.4)",
            },
          }}
          carousel={{
            finite: false,
            spacing: 0,
          }}
          controller={{
            closeOnBackdropClick: true,
          }}
          zoom={{
            maxZoomPixelRatio: 3,
            zoomInMultiplier: 2,
            doubleTapDelay: 300,
            doubleClickDelay: 300,
            doubleClickMaxStops: 2,
            keyboardMoveDistance: 50,
            wheelZoomDistanceFactor: 100,
            pinchZoomDistanceFactor: 100,
            scrollToZoom: true,
          }}
          on={{
            view: ({ index: currentIndex }) => setIndex(currentIndex),
          }}
          render={{
            slide: ({ slide }) => {
              const customSlide = slide as SlideImage & { title?: string; description?: string };

              // Se não tem título nem descrição, deixa a biblioteca renderizar normalmente
              if (!customSlide.title && !customSlide.description) {
                return undefined;
              }

              return (
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  {/* Renderizar a imagem manualmente quando há caption */}
                  <div style={{ 
                    width: "100%", 
                    height: "100%", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center" 
                  }}>
                    <img
                      src={slide.src}
                      srcSet={slide.srcSet?.map((s) => `${s.src} ${s.width}w`).join(", ")}
                      sizes="100vw"
                      alt={slide.alt || "Gallery image"}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "90%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  
                  {/* Caption overlay fixo no bottom */}
                  <div className={styles.slideCaption}>
                    {customSlide.title && (
                      <h3 className="text-white font-semibold text-xl mb-2 text-center">
                        {customSlide.title}
                      </h3>
                    )}
                    {customSlide.description && (
                      <p className="text-white/90 text-lg text-center leading-relaxed max-w-4xl mx-auto">
                        {customSlide.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            },
          }}
        />
      </div>
    </>
  );
};

// Este array é apenas para referência - as imagens reais vêm do CMS via DEFAULT_CLINIC_CONTENT
export const clinicImages: GalleryImage[] = [];
