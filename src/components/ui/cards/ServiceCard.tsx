// ==========================================
// EXEMPLO DE USO: ServiceCard Refatorado
// src/components/ui/cards/ServiceCard.tsx
// ==========================================
import { Card } from "@/components/base/Card";
import { Typography } from "@/components/base/Typography";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ServiceCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
}

// ServiceCard com ícone (mantendo o estilo original)
export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon: Icon,
  title,
  description,
  href,
}) => {
  return (
    <Link href={href} className="group">
      <Card variant="default">
        <Icon
          className="
            w-14 h-14 mb-6
            text-[var(--foreground)]
            group-hover:text-[var(--btn)]
            transition-all duration-500
            dark:text-[var(--foreground)]
            dark:group-hover:text-[var(--btn)]
          "
        />

        <Typography variant="h3" className="card">
          {title}
        </Typography>

        <Typography variant="body" className="card">
          {description}
        </Typography>
      </Card>
    </Link>
  );
};

interface ImageCardProps {
  imageUrl: string;
  title: string;
  description: string;
  href: string;
}

// ImageCard (mantendo o estilo original)
export const ImageCard: React.FC<ImageCardProps> = ({
  imageUrl,
  title,
  description,
  href,
}) => {
  return (
    <Link href={href} className="group">
      <Card variant="image">
        {/* Card Header com Imagem */}
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Card Content */}
        <div className="flex flex-col p-6">
          <Typography
            variant="h3"
            className={cn(
              "text-lg font-semibold mb-2",
              "text-gray-900 dark:text-white",
              "transition-colors duration-300"
            )}
          >
            {title}
          </Typography>

          <Typography
            variant="body"
            className={cn(
              "text-sm",
              "text-gray-600 dark:text-gray-300",
              "line-clamp-3"
            )}
          >
            {description}
          </Typography>
        </div>
      </Card>
    </Link>
  );
};

interface ContactCardProps {
  title: string;
  children: React.ReactNode;
}

// ContactCard (usando o componente base)
export const ContactCard: React.FC<ContactCardProps> = ({
  title,
  children,
}) => {
  return (
    <Card variant="contact" title={title}>
      {children}
    </Card>
  );
};
