// components/ui/Calendar.tsx
"use client";

import * as React from "react";
import {
  DayPicker,
  NextMonthButton as DefaultNext,
  PreviousMonthButton as DefaultPrev,
} from "react-day-picker";
import "react-day-picker/style.css";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({ className, classNames, ...props }: CalendarProps) {
  return (
    <DayPicker
      // garante que o .rdp-root fique presente para as variáveis CSS
      className={cn("rdp-root p-3", className)}
      // começa com as classes default e só sobrescreve o que quiser
      classNames={{
        //...getDefaultClassNames(), // pega todas as classes padrão
        // exemplo de override minimal para botões de nav
        // button_previous: "mr-auto",
        // button_next: "ml-auto",
        // você pode adicionar outros overrides aqui...
        ...classNames,
      }}
      components={{
        PreviousMonthButton: (props) => (
          <DefaultPrev {...props} className={cn(props.className)} />
        ),
        NextMonthButton: (props) => (
          <DefaultNext {...props} className={cn(props.className)} />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";
