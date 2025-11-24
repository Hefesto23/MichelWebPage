// src/components/shared/ui/LocationScheduleEditor.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import type {
  LocationBasedWorkingDays
} from "@/types/location-schedule";
import {
  isLegacyWorkingDays,
  isLocationBasedWorkingDays,
  migrateLegacyToLocationBased,
  LOCATION_OPTIONS
} from "@/types/location-schedule";

interface LocationScheduleEditorProps {
  value: LocationBasedWorkingDays | Record<string, boolean>;
  onChange: (value: LocationBasedWorkingDays) => void;
  hasSecondAddress?: boolean; // Se tem segundo endereço configurado
}

interface DayConfig {
  key: keyof LocationBasedWorkingDays;
  label: string;
  shortLabel: string;
}

const DAYS: DayConfig[] = [
  { key: 'monday', label: 'Segunda-feira', shortLabel: 'Seg' },
  { key: 'tuesday', label: 'Terça-feira', shortLabel: 'Ter' },
  { key: 'wednesday', label: 'Quarta-feira', shortLabel: 'Qua' },
  { key: 'thursday', label: 'Quinta-feira', shortLabel: 'Qui' },
  { key: 'friday', label: 'Sexta-feira', shortLabel: 'Sex' },
  { key: 'saturday', label: 'Sábado', shortLabel: 'Sáb' },
  { key: 'sunday', label: 'Domingo', shortLabel: 'Dom' },
];

export const LocationScheduleEditor = ({
  value,
  onChange,
  hasSecondAddress = false
}: LocationScheduleEditorProps) => {
  const [workingDays, setWorkingDays] = useState<LocationBasedWorkingDays>(() => {
    // Convert legacy format to new format if needed
    if (isLegacyWorkingDays(value)) {
      return migrateLegacyToLocationBased(
        value as { monday: boolean; tuesday: boolean; wednesday: boolean; thursday: boolean; friday: boolean; saturday: boolean },
        null
      );
    }
    if (isLocationBasedWorkingDays(value)) {
      return value as LocationBasedWorkingDays;
    }
    // Default empty state
    return {
      monday: { enabled: false, location: null },
      tuesday: { enabled: false, location: null },
      wednesday: { enabled: false, location: null },
      thursday: { enabled: false, location: null },
      friday: { enabled: false, location: null },
      saturday: { enabled: false, location: null },
      sunday: { enabled: false, location: null }
    };
  });

  // Use ref to keep latest onChange without causing re-renders
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Update parent when workingDays changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('📅 LocationScheduleEditor: Enviando working_days para parent:', workingDays);
      onChangeRef.current(workingDays);
    }, 100);

    return () => clearTimeout(timer);
  }, [workingDays]);

  const handleDayToggle = (day: keyof LocationBasedWorkingDays) => {
    setWorkingDays(prev => {
      const currentDay = prev[day];
      if (!currentDay) {
        return prev;
      }
      return {
        ...prev,
        [day]: {
          enabled: !currentDay.enabled,
          // If disabling, reset location to null
          location: !currentDay.enabled ? null : currentDay.location
        }
      };
    });
  };

  const handleLocationChange = (
    day: keyof LocationBasedWorkingDays,
    location: 1 | 2 | null
  ) => {
    setWorkingDays(prev => {
      const currentDay = prev[day];
      if (!currentDay) {
        return prev;
      }
      return {
        ...prev,
        [day]: {
          enabled: currentDay.enabled,
          location
        }
      };
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        {hasSecondAddress ? (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              📍 Múltiplas localidades configuradas
            </p>
            <p className="text-blue-800 dark:text-blue-200">
              Para cada dia, você pode escolher em qual localidade o atendimento acontece.
            </p>
          </div>
        ) : (
          <p>Selecione os dias de atendimento:</p>
        )}
      </div>

      <div className="grid gap-3">
        {DAYS.map(day => {
          const dayConfig = workingDays[day.key];
          if (!dayConfig) return null;

          return (
            <div
              key={day.key}
              className={`
                p-4 rounded-lg border-2 transition-all
                ${dayConfig.enabled
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-border bg-background hover:border-primary/50'
                }
              `}
            >
              {/* Day checkbox */}
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dayConfig.enabled}
                    onChange={() => handleDayToggle(day.key)}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary mr-3"
                  />
                  <div>
                    <span className="font-medium text-base">{day.label}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({day.shortLabel})
                    </span>
                  </div>
                </label>
              </div>

              {/* Location selector (only if day is enabled and has second address) */}
              {dayConfig.enabled && hasSecondAddress && (
                <div className="ml-8 mt-2 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Localidade:
                  </p>
                  <div className="space-y-2">
                    {LOCATION_OPTIONS.map(option => (
                      <label
                        key={String(option.value)}
                        className="flex items-center cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name={`location-${day.key}`}
                          checked={dayConfig.location === option.value}
                          onChange={() => handleLocationChange(day.key, option.value)}
                          className="w-4 h-4 text-primary focus:ring-primary mr-2"
                        />
                        <span className="text-sm group-hover:text-primary transition-colors">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Show message if no second address but day is enabled */}
              {dayConfig.enabled && !hasSecondAddress && (
                <div className="ml-8 mt-2 text-sm text-muted-foreground italic">
                  Atendimento no endereço principal
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="font-medium mb-2">Resumo:</h4>
        <div className="text-sm space-y-1">
          {DAYS.filter(day => workingDays[day.key]?.enabled).length === 0 ? (
            <p className="text-muted-foreground italic">
              Nenhum dia selecionado
            </p>
          ) : (
            DAYS.filter(day => workingDays[day.key]?.enabled).map(day => {
              const config = workingDays[day.key];
              if (!config) return null;

              const locationText = hasSecondAddress
                ? config.location === 1
                  ? ' (Localidade Principal)'
                  : config.location === 2
                  ? ' (Localidade Secundária)'
                  : ' (Ambas localidades)'
                : '';

              return (
                <p key={day.key} className="text-foreground">
                  ✓ {day.label}{locationText}
                </p>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
