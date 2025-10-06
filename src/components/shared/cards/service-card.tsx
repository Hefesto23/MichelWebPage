import Link from "next/link";
import * as React from "react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  className?: string;
}

export const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(
  ({ className, title, description, icon: Icon, href, ...props }, ref) => {
    const CardContent = () => (
      <div className="group flex flex-col items-center p-8 rounded-2xl bg-[var(--card)] border-2 border-[var(--card-foreground)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
        
        <Icon className="w-14 h-14 mb-6 text-[var(--foreground)] group-hover:text-[var(--btn)] transition-all duration-500 dark:text-[var(--foreground)] dark:group-hover:text-[var(--btn)]" />
        
        <h3 className="text-xl font-bold mb-4 text-[var(--card-foreground)] group-hover:text-[var(--btn)] transition-colors duration-500 dark:text-[var(--card-foreground)] dark:group-hover:text-[var(--btn)]">
          {title}
        </h3>
        
        <p className="text-base font-bold text-center text-[var(--secondary-foreground)] dark:text-[var(--foreground)] opacity-85 group-hover:opacity-100 transition-all duration-500 line-height-relaxed px-4">
          {description}
        </p>
      </div>
    );

    if (href) {
      return (
        <div ref={ref} className={className} {...props}>
          <Link href={href}>
            <CardContent />
          </Link>
        </div>
      );
    }

    return (
      <div ref={ref} className={className} {...props}>
        <CardContent />
      </div>
    );
  }
);
ServiceCard.displayName = "ServiceCard";