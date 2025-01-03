import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ServiceCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon: Icon,
  title,
  description,
  href,
}) => {
  return (
    <Link
      href={href}
      className="
      group
      flex flex-col items-center
      p-8
      rounded-2xl
      bg-[var(--card)]
      border-2 border-[var(--card-foreground)]
      shadow-md
      hover:shadow-xl
      transition-all duration-500
      hover:-translate-y-1
      dark:bg-[var(--card)]
      dark:border-[var(--btn-border)]
      relative
      overflow-hidden
    "
    >
      <div
        className="
      absolute inset-0 
      bg-gradient-to-r from-[var(--primary)] to-transparent 
      opacity-0 group-hover:opacity-10 
      transition-opacity duration-500
    "
      />

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

      <h3
        className="
        text-xl font-bold mb-4
        text-[var(--card-foreground)]
        group-hover:text-[var(--btn)]
        transition-colors duration-500
        dark:text-[var(--card-foreground)]
        dark:group-hover:text-[var(--btn)]
      "
      >
        {title}
      </h3>

      <p
        className="
        text-base text-center
        text-[var(--secondary-foreground)]
        dark:text-[var(--foreground)]
        opacity-85
        group-hover:opacity-100
        transition-all duration-500
        line-height-relaxed
        px-4
      "
      >
        {description}
      </p>
    </Link>
  );
};

interface ImageCardProps {
  imageUrl: string;
  title: string;
  description: string;
  href: string;
}

const ImageCard: React.FC<ImageCardProps> = ({
  imageUrl,
  title,
  description,
  href,
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col",
        "w-full max-w-sm overflow-hidden",
        "bg-white dark:bg-gray-800 rounded-xl transition-all duration-300",
        "border-2 border-gray-200 dark:border-gray-700",
        "shadow-[rgba(0,_0,_0,_0.15)_0px_0px_4px,rgba(0,_0,_0,_0.15)_0px_8px_16px_-2px,rgba(0,_0,_0,_0.15)_0px_16px_24px_-4px,rgba(0,_0,_0,_0.15)_0px_24px_32px_-8px]",
        "dark:shadow-[rgba(0,_0,_0,_0.4)_0px_0px_4px,rgba(0,_0,_0,_0.4)_0px_8px_16px_-2px,rgba(0,_0,_0,_0.4)_0px_16px_24px_-4px,rgba(0,_0,_0,_0.4)_0px_24px_32px_-8px]",
        "relative",
        "transform-gpu",
        "translate-y-0",
        "isolate",
        "after:absolute",
        "after:inset-0",
        "after:rounded-xl",
        "after:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]",
        "after:-z-[1]"
      )}
    >
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
        <h3
          className={cn(
            "text-lg font-semibold mb-2",
            "text-gray-900 dark:text-white",
            "transition-colors duration-300"
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "text-sm",
            "text-gray-600 dark:text-gray-300",
            "line-clamp-3"
          )}
        >
          {description}
        </p>
      </div>
    </Link>
  );
};

export { ImageCard, ServiceCard };
