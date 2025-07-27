// components/shared/ui/LoadingState.tsx
import { cn } from "@/utils";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Carregando...",
  size = "md",
  fullScreen = false,
  className,
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const containerClasses = cn(
    "flex flex-col items-center justify-center",
    fullScreen && "min-h-screen",
    className
  );

  return (
    <div className={containerClasses}>
      <div
        className={cn(
          "animate-spin rounded-full border-b-2 border-primary-foreground",
          sizeClasses[size]
        )}
      />
      {message && (
        <p className="mt-4 text-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  );
};

// Skeleton loader para listas
export const SkeletonLoader: React.FC<{
  rows?: number;
  className?: string;
}> = ({ rows = 5, className }) => {
  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-300 rounded-xl" />
      ))}
    </div>
  );
};
