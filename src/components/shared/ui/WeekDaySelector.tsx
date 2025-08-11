// src/components/shared/ui/WeekDaySelector.tsx
"use client";

import { WorkingDays } from "@/hooks/useSettings";

interface WeekDay {
  key: keyof WorkingDays;
  label: string;
  short: string;
}

const weekDays: WeekDay[] = [
  { key: "monday", label: "Segunda-feira", short: "SEG" },
  { key: "tuesday", label: "Terça-feira", short: "TER" },
  { key: "wednesday", label: "Quarta-feira", short: "QUA" },
  { key: "thursday", label: "Quinta-feira", short: "QUI" },
  { key: "friday", label: "Sexta-feira", short: "SEX" },
  { key: "saturday", label: "Sábado", short: "SAB" },
];

interface WeekDaySelectorProps {
  value: WorkingDays;
  onChange: (workingDays: WorkingDays) => void;
  disabled?: boolean;
}

export const WeekDaySelector = ({
  value,
  onChange,
  disabled = false,
}: WeekDaySelectorProps) => {
  const handleDayToggle = (dayKey: keyof WorkingDays) => {
    if (disabled) return;
    
    onChange({
      ...value,
      [dayKey]: !value[dayKey],
    });
  };

  // Helper para definir intervalos comuns
  const setPreset = (preset: "weekdays" | "all" | "none" | "monday-saturday") => {
    if (disabled) return;

    let newValue: WorkingDays;

    switch (preset) {
      case "weekdays":
        newValue = {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
        };
        break;
      case "monday-saturday":
        newValue = {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
        };
        break;
      case "all":
        newValue = {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
        };
        break;
      case "none":
        newValue = {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
        };
        break;
      default:
        return;
    }

    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      {/* Presets */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setPreset("weekdays")}
          disabled={disabled}
          className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Segunda à Sexta
        </button>
        <button
          type="button"
          onClick={() => setPreset("monday-saturday")}
          disabled={disabled}
          className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Segunda ao Sábado
        </button>
        <button
          type="button"
          onClick={() => setPreset("none")}
          disabled={disabled}
          className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Limpar
        </button>
      </div>

      {/* Individual Day Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {weekDays.map((day) => {
          const isSelected = value[day.key];
          
          return (
            <button
              key={day.key}
              type="button"
              onClick={() => handleDayToggle(day.key)}
              disabled={disabled}
              className={`p-3 rounded-lg border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                isSelected
                  ? "border-primary-foreground bg-primary-foreground text-white"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary-foreground hover:bg-primary-foreground/10"
              }`}
            >
              <div className="text-center">
                <div className="font-semibold text-sm">{day.short}</div>
                <div className="text-xs mt-1 opacity-75">{day.label}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="text-sm text-muted-foreground">
        <strong>Dias selecionados:</strong>{" "}
        {(() => {
          const selectedDays = weekDays.filter((day) => value[day.key]);
          
          if (selectedDays.length === 0) {
            return "Nenhum dia selecionado";
          }
          
          if (selectedDays.length === 1) {
            return selectedDays[0].label;
          }
          
          if (selectedDays.length === 2) {
            return selectedDays.map(d => d.label).join(" e ");
          }
          
          const lastDay = selectedDays.pop();
          return selectedDays.map(d => d.label).join(", ") + " e " + lastDay?.label;
        })()}
      </div>

      {/* Warning if no days selected */}
      {!Object.values(value).some(Boolean) && (
        <div className="text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-2 rounded-md">
          ⚠️ Atenção: Nenhum dia foi selecionado. Os pacientes não poderão agendar consultas.
        </div>
      )}
    </div>
  );
};