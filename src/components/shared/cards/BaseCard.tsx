// src/components/shared/cards/BaseCard.tsx
import { cn } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";

// Tipos simples
interface BaseCardProps {
  variant?: "contact" | "admin" | "stats" | "image" | "image-large" | "service";
  title?: string;
  children?: React.ReactNode;
  className?: string;

  // Props específicas para cada variant
  // Stats Card
  value?: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ComponentType<{ className?: string }>;

  // Image Card
  imageUrl?: string;
  description?: string;
  href?: string;

  // Service Card
  interactive?: boolean;
}

export const BaseCard: React.FC<BaseCardProps> = ({
  variant = "contact",
  title,
  children,
  className,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  imageUrl,
  description,
  href,
  interactive = false,
  ...props
}) => {
  // Classes base (seus estilos atuais do globals.css)
  const baseClasses = cn(
    "bg-white dark:bg-gray-800 rounded-xl",
    "border-2 border-gray-200 dark:border-gray-700",
    "shadow-[rgba(0,_0,_0,_0.15)_0px_0px_4px,rgba(0,_0,_0,_0.15)_0px_8px_16px_-2px,rgba(0,_0,_0,_0.15)_0px_16px_24px_-4px,rgba(0,_0,_0,_0.15)_0px_24px_32px_-8px]",
    "dark:shadow-[rgba(0,_0,_0,_0.4)_0px_0px_4px,rgba(0,_0,_0,_0.4)_0px_8px_16px_-2px,rgba(0,_0,_0,_0.4)_0px_16px_24px_-4px,rgba(0,_0,_0,_0.4)_0px_24px_32px_-8px]",
    "transition-all duration-500 ease-out",
    interactive && "hover:-translate-y-1",
    className
  );

  // Renderização condicional baseada no variant
  const renderContent = () => {
    switch (variant) {
      case "stats":
        return (
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  {title}
                </p>
                <p className="text-3xl font-bold text-foreground">{value}</p>
                {change && (
                  <p
                    className={cn(
                      "text-sm mt-2 font-medium",
                      changeType === "positive" &&
                        "text-green-600 dark:text-green-400",
                      changeType === "negative" &&
                        "text-red-600 dark:text-red-400",
                      changeType === "neutral" &&
                        "text-gray-600 dark:text-gray-400"
                    )}
                  >
                    {change}
                  </p>
                )}
              </div>
              {Icon && <Icon className="w-8 h-8 text-muted-foreground" />}
            </div>
          </div>
        );

      case "image":
        const ImageCardContent = () => (
          <div className="flex flex-col w-full h-full overflow-hidden">
            <div className="relative w-full h-24 flex-shrink-0 overflow-hidden rounded-t-xl">
              <Image
                src={imageUrl!}
                alt={title!}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col flex-grow p-3 justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground transition-colors duration-300 leading-tight">
                  {title}
                </h3>
                <p className="text-sm font-bold text-muted-foreground leading-relaxed line-clamp-3">
                  {description}
                </p>
              </div>
            </div>
          </div>
        );

        return href ? (
          <Link href={href} className="group flex flex-col h-full">
            <ImageCardContent />
          </Link>
        ) : (
          <div className="h-full">
            <ImageCardContent />
          </div>
        );

      case "image-large":
        const ImageLargeCardContent = () => (
          <div className="flex flex-col w-full h-full overflow-hidden">
            <div className="relative w-full h-48 flex-shrink-0 overflow-hidden rounded-t-xl">
              <Image
                src={imageUrl!}
                alt={title!}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col flex-grow p-6 justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-foreground transition-colors duration-300 leading-tight">
                  {title}
                </h3>
                <p className="text-base font-bold text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          </div>
        );

        return href ? (
          <Link href={href} className="group flex flex-col h-full">
            <ImageLargeCardContent />
          </Link>
        ) : (
          <div className="h-full">
            <ImageLargeCardContent />
          </div>
        );

      case "service":
        const ServiceCardContent = () => (
          <div className="group flex flex-col items-center p-8 rounded-2xl bg-[var(--card)] border-2 border-[var(--card-foreground)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500" />

            {Icon && (
              <Icon className="w-14 h-14 mb-6 text-[var(--foreground)] group-hover:text-[var(--btn)] transition-all duration-500 dark:text-[var(--foreground)] dark:group-hover:text-[var(--btn)]" />
            )}

            <h3 className="text-xl font-bold mb-4 text-[var(--card-foreground)] group-hover:text-[var(--btn)] transition-colors duration-500 dark:text-[var(--card-foreground)] dark:group-hover:text-[var(--btn)]">
              {title}
            </h3>

            <p className="text-base font-bold text-center text-[var(--secondary-foreground)] dark:text-[var(--foreground)] opacity-85 group-hover:opacity-100 transition-all duration-500 line-height-relaxed px-4">
              {description}
            </p>
          </div>
        );

        return href ? (
          <Link href={href}>
            <ServiceCardContent />
          </Link>
        ) : (
          <ServiceCardContent />
        );

      case "admin":
      case "contact":
      default:
        return (
          <div className="p-6">
            {title && (
              <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-3 text-foreground">
                {title}
              </h2>
            )}
            {children}
          </div>
        );
    }
  };

  // Para service cards, retorna o conteúdo direto (já tem wrapper)
  if (variant === "service") {
    return <div className={className}>{renderContent()}</div>;
  }

  return (
    <div className={cn(baseClasses, (variant === "image" || variant === "image-large") && "h-full")} {...props}>
      {renderContent()}
    </div>
  );
};

// Export com nomes familiares para facilitar migração
export const ContactCard: React.FC<Omit<BaseCardProps, "variant">> = (
  props
) => <BaseCard variant="contact" {...props} />;

export const AdminCard: React.FC<Omit<BaseCardProps, "variant">> = (props) => (
  <BaseCard variant="admin" {...props} />
);

export const StatsCard: React.FC<
  Omit<BaseCardProps, "variant"> & {
    value: string | number;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
    icon?: React.ComponentType<{ className?: string }>;
  }
> = (props) => <BaseCard variant="stats" {...props} />;

export const ImageCard: React.FC<
  Omit<BaseCardProps, "variant"> & {
    imageUrl: string;
    description: string;
    href: string;
  }
> = (props) => <BaseCard variant="image" interactive {...props} />;

export const ImageLargeCard: React.FC<
  Omit<BaseCardProps, "variant"> & {
    imageUrl: string;
    description: string;
    href: string;
  }
> = (props) => <BaseCard variant="image-large" interactive {...props} />;

export const ServiceCard: React.FC<
  Omit<BaseCardProps, "variant"> & {
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    href: string;
  }
> = (props) => <BaseCard variant="service" {...props} />;
