import { cn } from "@/utils/utils";
import { Card } from "@/components/shared/ui/card";
import * as React from "react";

// Contact/Admin Card simples
interface SimpleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children?: React.ReactNode;
}

export const ContactCard = React.forwardRef<HTMLDivElement, SimpleCardProps>(
  ({ className, title, children, ...props }, ref) => (
    <Card ref={ref} className={className} {...props}>
      <div className="p-6">
        {title && (
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-3 text-foreground">
            {title}
          </h2>
        )}
        {children}
      </div>
    </Card>
  )
);
ContactCard.displayName = "ContactCard";

export const AdminCard = ContactCard;

// Stats Card
interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ComponentType<{ className?: string }>;
}

export const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ className, title, value, change, changeType = "neutral", icon: Icon, ...props }, ref) => (
    <Card ref={ref} className={className} {...props}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {change && (
              <p
                className={cn(
                  "text-sm mt-2 font-medium",
                  changeType === "positive" && "text-green-600 dark:text-green-400",
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
    </Card>
  )
);
StatsCard.displayName = "StatsCard";