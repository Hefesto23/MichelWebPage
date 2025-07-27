// components/shared/ui/ErrorState.tsx
import { cn } from "@/utils/utils";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  error: string | Error;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  className,
}) => {
  const errorMessage = typeof error === "string" ? error : error.message;

  return (
    <div className={cn("text-center py-8", className)}>
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <p className="text-red-600 dark:text-red-400 mb-4">{errorMessage}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary-foreground text-white rounded-md hover:opacity-90"
        >
          Tentar Novamente
        </button>
      )}
    </div>
  );
};
