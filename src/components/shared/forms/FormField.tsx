// ============================================
// src/components/shared/forms/FormField.tsx
// ============================================
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  id: string;
  type?: "text" | "email" | "tel" | "textarea" | "select";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  error,
  options,
  rows = 4,
  className,
}) => {
  const baseInputClasses = cn(
    "w-full p-3 border border-border rounded-md bg-background text-foreground",
    "focus:ring-2 focus:ring-primary-foreground focus:border-transparent",
    "transition-all duration-200",
    error && "border-red-500 focus:ring-red-500",
    className
  );

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            id={id}
            rows={rows}
            className={cn(baseInputClasses, "resize-vertical min-h-[120px]")}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
          />
        );

      case "select":
        return (
          <select
            id={id}
            className={baseInputClasses}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
          >
            <option value="">{placeholder || "Selecione..."}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type={type}
            id={id}
            className={baseInputClasses}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-xl font-bold text-foreground block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {renderInput()}

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};
