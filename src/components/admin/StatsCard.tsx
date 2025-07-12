// src/components/admin/StatsCard.tsx

import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
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
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {change && (
            <p
              className={cn(
                "text-sm mt-2 font-medium",
                changeType === "positive" &&
                  "text-green-600 dark:text-green-400",
                changeType === "negative" && "text-red-600 dark:text-red-400",
                changeType === "neutral" && "text-gray-600 dark:text-gray-400"
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
};
