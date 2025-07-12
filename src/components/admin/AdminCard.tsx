// src/components/admin/AdminCard.tsx

import { cn } from "@/lib/utils";

interface AdminCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const AdminCard: React.FC<AdminCardProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl",
        "border-2 border-gray-200 dark:border-gray-700",
        "shadow-[rgba(0,_0,_0,_0.15)_0px_0px_4px,rgba(0,_0,_0,_0.15)_0px_8px_16px_-2px,rgba(0,_0,_0,_0.15)_0px_16px_24px_-4px,rgba(0,_0,_0,_0.15)_0px_24px_32px_-8px]",
        "dark:shadow-[rgba(0,_0,_0,_0.4)_0px_0px_4px,rgba(0,_0,_0,_0.4)_0px_8px_16px_-2px,rgba(0,_0,_0,_0.4)_0px_16px_24px_-4px,rgba(0,_0,_0,_0.4)_0px_24px_32px_-8px]",
        "transition-all duration-500 ease-out",
        "hover:-translate-y-1",
        "p-6",
        className
      )}
    >
      {title && (
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-3 text-foreground">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};
