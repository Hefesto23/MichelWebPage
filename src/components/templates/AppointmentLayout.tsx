// ============================================
// src/components/templates/AppointmentLayout.tsx
// ============================================
"use client";

import { PublicLayout } from "./PublicLayout";

interface AppointmentLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  step?: number;
  totalSteps?: number;
  className?: string;
}

export const AppointmentLayout: React.FC<AppointmentLayoutProps> = ({
  children,
  title = "Agendamento de Consulta",
  subtitle = "Escolha a melhor data e horário para sua consulta",
  step,
  totalSteps,
  className,
}) => {
  return (
    <PublicLayout className={className}>
      <div className="min-h-screen bg-background py-16">
        <div className="content-container">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-foreground">{title}</h1>
            <p className="text-xl text-muted-foreground">{subtitle}</p>

            {/* Progress indicator */}
            {step && totalSteps && (
              <div className="mt-8 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Passo {step} de {totalSteps}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((step / totalSteps) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-foreground h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto">{children}</div>
        </div>
      </div>
    </PublicLayout>
  );
};
