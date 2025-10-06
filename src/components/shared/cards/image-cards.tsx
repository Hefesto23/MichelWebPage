import { cn } from "@/utils/utils";
import { Card } from "@/components/shared/ui/card";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

interface ImageCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  imageUrl: string;
  href?: string;
  size?: "normal" | "large";
}

export const ImageCard = React.forwardRef<HTMLDivElement, ImageCardProps>(
  ({ className, title, description, imageUrl, href, size = "normal", ...props }, ref) => {
    const imageHeight = size === "large" ? "h-48" : "h-24";
    const padding = size === "large" ? "p-6" : "p-3";
    const titleSize = size === "large" ? "text-xl" : "text-lg";
    const descriptionSize = size === "large" ? "text-base" : "text-sm";

    const CardContent = () => (
      <div className="flex flex-col w-full h-full overflow-hidden">
        <div className={cn("relative w-full flex-shrink-0 overflow-hidden rounded-t-xl", imageHeight)}>
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className={cn("flex flex-col flex-grow justify-between", padding)}>
          <div>
            <h3 className={cn("font-semibold mb-2 text-foreground transition-colors duration-300 leading-tight", titleSize)}>
              {title}
            </h3>
            <p className={cn("font-bold text-muted-foreground leading-relaxed", descriptionSize, size === "normal" && "line-clamp-3")}>
              {description}
            </p>
          </div>
        </div>
      </div>
    );

    if (href) {
      return (
        <Card ref={ref} className={cn("h-full hover:-translate-y-1", className)} {...props}>
          <Link href={href} className="group flex flex-col h-full">
            <CardContent />
          </Link>
        </Card>
      );
    }

    return (
      <Card ref={ref} className={cn("h-full", className)} {...props}>
        <CardContent />
      </Card>
    );
  }
);
ImageCard.displayName = "ImageCard";

export const ImageLargeCard = React.forwardRef<HTMLDivElement, Omit<ImageCardProps, "size">>(
  (props, ref) => <ImageCard ref={ref} size="large" {...props} />
);
ImageLargeCard.displayName = "ImageLargeCard";