// components/shared/filters/FilterBar.tsx
import { cn } from "@/utils";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  filters: Array<{
    id: string;
    label: string;
    type: "select" | "date" | "search";
    value: string;
    onChange: (value: string) => void;
    options?: FilterOption[];
    placeholder?: string;
  }>;
  onClear?: () => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onClear,
  className,
}) => {
  const hasActiveFilters = filters.some((f) => f.value);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filters.map((filter) => (
          <div key={filter.id}>
            <label className="block text-sm font-medium text-foreground mb-2">
              {filter.label}
            </label>
            {filter.type === "select" && (
              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                <option value="">{filter.placeholder || "Todos"}</option>
                {filter.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            {filter.type === "date" && (
              <input
                type="date"
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              />
            )}
            {filter.type === "search" && (
              <input
                type="text"
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                placeholder={filter.placeholder}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              />
            )}
          </div>
        ))}
      </div>

      {hasActiveFilters && onClear && (
        <div className="text-right">
          <button
            onClick={onClear}
            className="text-sm text-primary-foreground hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
};
