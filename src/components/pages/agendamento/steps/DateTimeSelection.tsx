// components/agendamento/AppointmentForm/steps/DateTimeSelection.tsx
import { ContactCard } from "@/components/shared/cards/BaseCard";
import { Button } from "@/components/shared/ui/button";
import { Calendar } from "@/components/shared/ui/calendar";
import { usePublicSettings } from "@/hooks/usePublicSettings";
import { AppointmentFormData, AppointmentModality } from "@/types/appointment";
import {
  addMonths,
  format,
  isAfter,
  isBefore,
  startOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useHorariosCache } from "@/hooks/useHorariosCache";
import formStyles from "../form.module.css";

const MODALITY = AppointmentModality; // ✅ ÚNICA MUDANÇA: usar constants
interface DateTimeSelectionProps {
  formData: AppointmentFormData;
  updateFormData: (data: Partial<AppointmentFormData>) => void;
  proximoPasso: () => void;
  carregando: boolean;
  setCarregando: (status: boolean) => void;
  handleError: (message: string) => void;
}

const DateTimeSelection = React.memo<DateTimeSelectionProps>(function DateTimeSelection({
  formData,
  updateFormData,
  proximoPasso,
  carregando,
  setCarregando,
  handleError,
}: DateTimeSelectionProps) {
  // Hook para configurações públicas
  const { settings, loading: settingsLoading, formatWorkingDays, getActiveDaysAsNumbers } = usePublicSettings();
  
  // Hook de cache para horários
  const { fetchHorarios, getCachedData } = useHorariosCache();
  
  // Estado para os horários disponíveis
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [date, setDate] = useState<Date | undefined>(
    formData.dataSelecionada ? new Date(formData.dataSelecionada + "T12:00:00") : undefined
  );

  // Limpar estado local quando dados do formulário são resetados
  useEffect(() => {
    if (!formData.dataSelecionada) {
      setDate(undefined);
      setHorariosDisponiveis([]);
    }
  }, [formData.dataSelecionada]);

  // Valores memoizados para cálculos pesados
  const hoje = useMemo(() => startOfDay(new Date()), []);
  const advanceDays = useMemo(() => settings?.advance_days || 60, [settings?.advance_days]);
  const fimPeriodo = useMemo(() => addMonths(hoje, Math.ceil(advanceDays / 30)), [hoje, advanceDays]);
  const activeDays = useMemo(() => getActiveDaysAsNumbers(), [getActiveDaysAsNumbers]);

  // Função memoizada para verificar se um dia é desabilitado baseado nas configurações
  const isDiaDesabilitado = useCallback((data: Date) => {
    const dayOfWeek = data.getDay(); // 0 = domingo, 1 = segunda, etc.
    
    return (
      isBefore(data, hoje) ||
      isAfter(data, fimPeriodo) ||
      !activeDays.includes(dayOfWeek) // Só permite dias configurados no admin
    );
  }, [hoje, fimPeriodo, activeDays]);

  // Função otimizada com cache para lidar com a mudança de data
  const handleDateChange = useCallback(async (selectedDate: Date | undefined) => {
    if (
      !selectedDate ||
      (formData.dataSelecionada &&
        selectedDate.toISOString().split("T")[0] === formData.dataSelecionada)
    ) {
      return;
    }

    setDate(selectedDate);
    const dataFormatada = format(selectedDate, "yyyy-MM-dd");
    
    // Verificar se já tem dados em cache
    const cachedData = getCachedData(dataFormatada);
    if (cachedData) {
      setHorariosDisponiveis(cachedData.horariosDisponiveis || []);
      updateFormData({
        dataSelecionada: dataFormatada,
        horarioSelecionado: "",
      });
      return;
    }

    setCarregando(true);

    try {
      console.log("📅 Frontend - Data selecionada:", selectedDate);
      console.log("📄 Frontend - Data formatada:", dataFormatada);

      // Usar cache para buscar horários
      const data = await fetchHorarios(dataFormatada);
      setHorariosDisponiveis(data.horariosDisponiveis || []);
      
      updateFormData({
        dataSelecionada: dataFormatada,
        horarioSelecionado: "",
      });
    } catch (error: unknown) {
      console.error("Erro ao carregar horários:", error);
      handleError("Erro ao carregar horários disponíveis. Tente novamente.");
      setHorariosDisponiveis([]);
    } finally {
      setCarregando(false);
    }
  }, [formData.dataSelecionada, fetchHorarios, getCachedData, updateFormData, handleError, setCarregando]);

  // Função memoizada para selecionar um horário
  const selecionarHorario = useCallback((horario: string) => {
    updateFormData({ horarioSelecionado: horario });
  }, [updateFormData]);

  // Função memoizada para alternar o estado de primeira consulta
  const togglePrimeiraConsulta = useCallback(() => {
    updateFormData({ primeiraConsulta: !formData.primeiraConsulta });
  }, [updateFormData, formData.primeiraConsulta]);

  // Função memoizada para validar e avançar para o próximo passo
  const validarEAvancar = useCallback(() => {
    if (!formData.dataSelecionada) {
      handleError("Por favor, selecione uma data para a consulta.");
      return;
    }

    if (!formData.horarioSelecionado) {
      handleError("Por favor, selecione um horário para a consulta.");
      return;
    }

    if (!formData.modalidade) {
      handleError("Por favor, selecione a modalidade da consulta.");
      return;
    }

    proximoPasso();
  }, [formData.dataSelecionada, formData.horarioSelecionado, formData.modalidade, handleError, proximoPasso]);

  // Formatar a data em português para exibição (memoizada)
  const dataFormatada = useMemo(() => {
    if (!formData.dataSelecionada) return "";
    
    return format(
      new Date(formData.dataSelecionada + "T12:00:00"),
      "EEEE, dd 'de' MMMM 'de' yyyy",
      { locale: ptBR }
    );
  }, [formData.dataSelecionada]);

  return (
    <ContactCard title="Escolha a Data e Horário">
      <div className="space-y-6">
        {/* Seleção de modalidade - ✅ USANDO CONSTANTS */}
        <div>
          <label className={formStyles.formLabel}>Modalidade da Consulta</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              className={`${
                formData.modalidade === MODALITY.IN_PERSON
                  ? formStyles.primaryButton
                  : formStyles.secondaryButton
              }`}
              onClick={() => updateFormData({ modalidade: MODALITY.IN_PERSON })}
            >
              Presencial
            </button>
            <button
              type="button"
              className={`${
                formData.modalidade === MODALITY.ONLINE
                  ? formStyles.primaryButton
                  : formStyles.secondaryButton
              }`}
              onClick={() => updateFormData({ modalidade: MODALITY.ONLINE })}
            >
              Online
            </button>
          </div>
        </div>

        {/* Opção de Primeira Consulta com Toggle */}
        <div>
          <label className={formStyles.formLabel}>Primeira Consulta?</label>
          <div className="flex items-center p-4">
            <div className="flex items-center">
              <div className="relative inline-block w-12 mr-4 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-primeira-consulta"
                  checked={formData.primeiraConsulta}
                  onChange={togglePrimeiraConsulta}
                  className="absolute block w-6 h-6 rounded-full bg-foreground dark:bg-foreground border-4 border-foreground dark:border-foreground appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                  style={{
                    transform: formData.primeiraConsulta
                      ? "translateX(100%)"
                      : "translateX(0)",
                  }}
                />
                <label
                  htmlFor="toggle-primeira-consulta"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                    formData.primeiraConsulta
                      ? "bg-black/30 dark:bg-white/30"
                      : "bg-black/30 dark:bg-white/30"
                  }`}
                ></label>
              </div>
              <span className="font-bold text-lg">
                {formData.primeiraConsulta ? "Sim" : "Não"}
              </span>
            </div>
          </div>
        </div>

        {/* Calendário */}
        <label className={formStyles.formLabel}>
          Selecione uma data para a consulta
        </label>
        <div className="w-full max-w-xl mx-auto bg-black/15 rounded-[0.5rem] p-2 sm:p-4 border-2 border-border overflow-x-auto" data-testid="calendar">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            disabled={isDiaDesabilitado}
            startMonth={hoje}
            endMonth={fimPeriodo}
            timeZone="America/Sao_Paulo"
            locale={ptBR}
            classNames={{
              month_caption:
                "flex w-full pb-6 border-b border-border items-baseline justify-center",
              caption_label: "text-3xl font-bold capitalize text-center",
              nav: "flex justify-between w-full",
              nav_button:
                "flex items-center justify-center focus:outline-none focus:ring-0",
              nav_button_previous: "absolute left-0",
              nav_button_next: "absolute right-0",
              chevron:
                "fill-foreground dark:fill-blue-700 w-10 h-10 inline-block align-baseline",

              weekday: "font-extrabold text-xl text-center h-16",
              months: "w-full",
              month: "grid grid-cols-1",
              day: "h-14 w-14 text-center",
              day_button: "font-extrabold text-xl",
              today: "border-b-4 border-primary-foreground",
              selected:
                "flex mx-auto justify-center items-center bg-btn dark:bg-background text-btn-foreground dark:text-white dark:hover:bg-blue-700 rounded-full border-2 border-foreground dark:border-white",
            }}
            footer={
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-md text-muted-foreground text-center font-bold">
                  {settingsLoading ? (
                    "Carregando horários..."
                  ) : (
                    <>
                      Atendimento disponível{" "}
                      <span className="font-extrabold capitalize">
                        {formatWorkingDays().toLowerCase()}
                      </span>
                      {settings && (
                        <>
                          {" "}das{" "}
                          <span className="font-extrabold">
                            {settings.start_time}
                          </span>
                          {" às "}
                          <span className="font-extrabold">
                            {settings.end_time}
                          </span>
                        </>
                      )}
                    </>
                  )}
                </p>
              </div>
            }
          />
        </div>

        {/* Exibir data selecionada */}
        {formData.dataSelecionada && (
          <div className={formStyles.dataDisplay}>
            <p
              className={`${formStyles.formText} flex items-center justify-center`}
              data-testid="selected-date"
            >
              <span className="mr-2">Data selecionada:</span>
              <strong className="capitalize">{dataFormatada}</strong>
            </p>
          </div>
        )}

        {/* Seleção de horário */}
        {formData.dataSelecionada && (
          <div className="mt-6">
            <label className={formStyles.formLabel}>Selecione um Horário</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {carregando ? (
                <div className="col-span-full flex justify-center py-8">
                  <svg
                    className="animate-spin h-6 w-6 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : horariosDisponiveis.length > 0 ? (
                horariosDisponiveis.map((horario) => (
                  <button
                    key={horario}
                    type="button"
                    className={`${
                      formData.horarioSelecionado === horario
                        ? formStyles.primaryButton
                        : formStyles.secondaryButton
                    }`}
                    onClick={() => selecionarHorario(horario)}
                    data-testid="time-slot"
                  >
                    {horario}
                  </button>
                ))
              ) : (
                <p className="col-span-full text-center py-4 text-destructive">
                  Nenhum horário disponível para esta data
                </p>
              )}
            </div>
          </div>
        )}

        {/* Botão para avançar */}
        <div className="flex justify-end mt-8">
          <Button
            onClick={validarEAvancar}
            disabled={
              carregando ||
              !formData.dataSelecionada ||
              !formData.horarioSelecionado ||
              !formData.modalidade
            }
            className={`${formStyles.primaryButton} ${
              carregando ||
              !formData.dataSelecionada ||
              !formData.horarioSelecionado ||
              !formData.modalidade
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Próximo
          </Button>
        </div>
      </div>
    </ContactCard>
  );
});

export default DateTimeSelection;
