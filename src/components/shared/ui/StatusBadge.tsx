// components/shared/ui/StatusBadge.tsx
import { cn } from "@/utils/utils";
import { LucideIcon } from "lucide-react";

interface StatusBadgeProps {
  status:
    | keyof (typeof statusStyles)["appointment"]
    | keyof (typeof statusStyles)["default"];
  variant?: "appointment" | "default";
  icon?: LucideIcon;
  className?: string;
}

const statusStyles = {
  appointment: {
    agendado: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    confirmado:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    cancelado: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    realizado:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  default: {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = "default",
  icon: Icon,
  className,
}) => {
  const styles =
    (statusStyles[variant] as Record<string, string>)[status] ||
    statusStyles.default.inactive;

  return (
    <div
      className={cn(
        "px-3 py-1 rounded-full flex items-center text-xs font-medium",
        styles,
        className
      )}
    >
      {Icon && <Icon className="w-3 h-3 mr-1" />}
      <span className="capitalize">{status}</span>
    </div>
  );
};
