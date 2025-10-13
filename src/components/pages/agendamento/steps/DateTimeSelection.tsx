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
  startOfDay,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useBatchHorarios } from "@/hooks/useBatchHorarios";
import formStyles from "../form.module.css";

const MODALITY = AppointmentModality; // ✅ ÚNICA MUDANÇA: usar constants
interface DateTimeSelectionProps {
  formData: AppointmentFormData;
  updateFormData: (data: Partial<AppointmentFormData>) => void;
  proximoPasso: () => void;
  carregando: boolean;
  handleError: (message: string) => void;
}

const DateTimeSelection = React.memo<DateTimeSelectionProps>(function DateTimeSelection({
  formData,
  updateFormData,
  proximoPasso,
  carregando,
  handleError,
}: DateTimeSelectionProps) {
  // Hook para configurações públicas
  const { settings, loading: settingsLoading, formatWorkingDays, getActiveDaysAsNumbers } = usePublicSettings();

  // Estado para os horários disponíveis
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [date, setDate] = useState<Date | undefined>(
    formData.dataSelecionada ? new Date(formData.dataSelecionada + "T12:00:00") : undefined
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [loadingHorarios, setLoadingHorarios] = useState(false);

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

  // 🚀 OTIMIZAÇÃO: Batch prefetch incremental (30 dias iniciais)
  const {
    loading: batchLoading,
    loadingMore,
    error: batchError,
    progress,
    getHorariosForDate,
    loadMoreDates,
    hasDateRange,
    refetch,
    loadedRange
  } = useBatchHorarios(hoje, 30);

  // 🚀 Pré-carregar próximo mês quando usuário navega
  useEffect(() => {
    // Calcular range do mês atual + próximo mês
    const monthStart = startOfMonth(currentMonth);
    const nextMonthEnd = endOfMonth(addMonths(currentMonth, 1));

    // Se ainda não temos esses dados, carregar
    if (!batchLoading && !hasDateRange(monthStart, nextMonthEnd)) {
      console.log(`🔄 Pré-carregando: ${format(monthStart, 'MMM/yyyy')} + próximo mês`);
      loadMoreDates(monthStart, nextMonthEnd);
    }
  }, [currentMonth, batchLoading, hasDateRange, loadMoreDates]);

  // 🏠 Auto-selecionar primeiro local quando modalidade presencial for escolhida
  useEffect(() => {
    // Condições:
    // 1. Modalidade presencial selecionada
    // 2. Nenhum endereço selecionado ainda
    // 3. Settings carregados com endereço disponível
    if (
      formData.modalidade === MODALITY.IN_PERSON &&
      !formData.endereco &&
      settings?.street
    ) {
      const primeiroEndereco = `${settings.street}, ${settings.neighborhood} - ${settings.city}/${settings.state}`;
      console.log('🏠 Auto-selecionando primeiro local:', primeiroEndereco);
      updateFormData({ endereco: primeiroEndereco });
    }
  }, [formData.modalidade, formData.endereco, settings, updateFormData]);

  // Função memoizada para verificar se um dia é desabilitado baseado nas configurações
  const isDiaDesabilitado = useCallback((data: Date) => {
    const dayOfWeek = data.getDay(); // 0 = domingo, 1 = segunda, etc.

    return (
      !isAfter(data, hoje) ||  // Desabilita hoje + datas passadas (só permite amanhã em diante)
      isAfter(data, fimPeriodo) ||
      !activeDays.includes(dayOfWeek) // Só permite dias configurados no admin
    );
  }, [hoje, fimPeriodo, activeDays]);

  // 🚀 Função de seleção de data com feedback visual
  const handleDateChange = useCallback((selectedDate: Date | undefined) => {
    if (
      !selectedDate ||
      (formData.dataSelecionada &&
        selectedDate.toISOString().split("T")[0] === formData.dataSelecionada)
    ) {
      return;
    }

    const dataFormatada = format(selectedDate, "yyyy-MM-dd");

    console.log("⚡ Data selecionada:", dataFormatada);

    // ✅ Atualizar UI IMEDIATAMENTE
    setDate(selectedDate);
    updateFormData({
      dataSelecionada: dataFormatada,
      horarioSelecionado: "",
    });

    // Mostrar loading enquanto busca horários
    setLoadingHorarios(true);

    // Simular pequeno delay para feedback visual (dados já estão em memória)
    setTimeout(() => {
      const horariosParaData = getHorariosForDate(dataFormatada);
      console.log(`✅ Horários disponíveis: ${horariosParaData.length} slots`);

      setHorariosDisponiveis(horariosParaData);
      setLoadingHorarios(false);
    }, 150); // 150ms para feedback visual suave
  }, [formData.dataSelecionada, getHorariosForDate, updateFormData]);

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

    if (formData.modalidade === MODALITY.IN_PERSON && !formData.endereco) {
      handleError("Por favor, selecione o local do atendimento presencial.");
      return;
    }

    proximoPasso();
  }, [formData.dataSelecionada, formData.horarioSelecionado, formData.modalidade, formData.endereco, handleError, proximoPasso]);

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
              onClick={() => updateFormData({ modalidade: MODALITY.ONLINE, endereco: "" })}
            >
              Online
            </button>
          </div>
        </div>

        {/* Seleção de endereço (apenas se presencial) */}
        {formData.modalidade === MODALITY.IN_PERSON && (
          <div>
            <label className={formStyles.formLabel}>Escolha o Local do Atendimento</label>
            <div className="space-y-3">
              {settings?.street && (
                <button
                  type="button"
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    formData.endereco === `${settings.street}, ${settings.neighborhood} - ${settings.city}/${settings.state}`
                      ? "border-primary-foreground dark:border-btn bg-primary-foreground/10 dark:bg-btn/10"
                      : "border-border hover:border-primary-foreground/50 dark:hover:border-btn/50"
                  }`}
                  onClick={() => updateFormData({ endereco: `${settings.street}, ${settings.neighborhood} - ${settings.city}/${settings.state}` })}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.endereco === `${settings.street}, ${settings.neighborhood} - ${settings.city}/${settings.state}`
                        ? "border-primary-foreground dark:border-btn"
                        : "border-border"
                    }`}>
                      {formData.endereco === `${settings.street}, ${settings.neighborhood} - ${settings.city}/${settings.state}` && (
                        <div className="w-3 h-3 rounded-full bg-primary-foreground dark:bg-btn"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{settings.city}/{settings.state}</p>
                      <p className="text-sm text-muted-foreground mt-1">{settings.street}</p>
                      <p className="text-sm text-muted-foreground">{settings.neighborhood}</p>
                    </div>
                  </div>
                </button>
              )}

              {settings?.street2 && settings?.city2 && (
                <button
                  type="button"
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    formData.endereco === `${settings.street2}, ${settings.neighborhood2} - ${settings.city2}/${settings.state2}`
                      ? "border-primary-foreground dark:border-btn bg-primary-foreground/10 dark:bg-btn/10"
                      : "border-border hover:border-primary-foreground/50 dark:hover:border-btn/50"
                  }`}
                  onClick={() => updateFormData({ endereco: `${settings.street2}, ${settings.neighborhood2} - ${settings.city2}/${settings.state2}` })}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.endereco === `${settings.street2}, ${settings.neighborhood2} - ${settings.city2}/${settings.state2}`
                        ? "border-primary-foreground dark:border-btn"
                        : "border-border"
                    }`}>
                      {formData.endereco === `${settings.street2}, ${settings.neighborhood2} - ${settings.city2}/${settings.state2}` && (
                        <div className="w-3 h-3 rounded-full bg-primary-foreground dark:bg-btn"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{settings.city2}/{settings.state2}</p>
                      <p className="text-sm text-muted-foreground mt-1">{settings.street2}</p>
                      <p className="text-sm text-muted-foreground">{settings.neighborhood2}</p>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

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

        {/* Calendário com overlay de loading */}
        <label className={formStyles.formLabel}>
          Selecione uma data para a consulta
        </label>
        <div className="relative">
          <div className="w-full max-w-xl mx-auto bg-black/15 rounded-[0.5rem] p-2 sm:p-4 border-2 border-border overflow-x-auto" data-testid="calendar">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              onMonthChange={setCurrentMonth}
              disabled={batchLoading || isDiaDesabilitado}
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

                  {/* Status de carregamento incremental no footer */}
                  {loadingMore && (
                    <div className="mt-2 flex items-center justify-center gap-2 text-sm animate-in fade-in duration-300">
                      <svg className="animate-spin h-3 w-3 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="text-blue-700 dark:text-blue-300 font-medium">
                        Carregando próximo mês...
                      </span>
                    </div>
                  )}
                </div>
              }
            />
          </div>

          {/* Overlay de loading inicial */}
          {batchLoading && (
            <div className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-[0.5rem] flex items-center justify-center z-10 animate-in fade-in duration-300">
              <div className="bg-card border-2 border-primary/20 rounded-xl p-8 shadow-2xl max-w-sm mx-4 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <svg className="animate-spin h-10 w-10 text-primary" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2">
                  Preparando calendário
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Carregando horários disponíveis para os próximos{' '}
                  <span className="font-bold text-foreground">30 dias</span>
                </p>

                {/* Barra de progresso */}
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-500"
                    style={{ width: `${progress || 60}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Toast discreto para loading incremental (canto superior direito) */}
          {loadingMore && !batchLoading && (
            <div className="absolute top-2 right-2 z-20 bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-xl px-4 py-2.5 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="relative">
                <svg className="animate-spin h-4 w-4 text-primary" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-foreground">
                Carregando mais datas...
              </span>
            </div>
          )}
        </div>

        {/* Badge de status e período carregado */}
        {!batchLoading && loadedRange.minDate && loadedRange.maxDate && (
          <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>
                Horários carregados:{' '}
                <span className="font-bold text-foreground">
                  {format(new Date(loadedRange.minDate + 'T12:00:00'), 'dd/MMM')} - {format(new Date(loadedRange.maxDate + 'T12:00:00'), 'dd/MMM/yyyy')}
                </span>
              </span>
            </div>

            {!loadingMore && (
              <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Atualizado</span>
              </div>
            )}
          </div>
        )}

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

        {/* Banner de erro se houver */}
        {batchError && !batchLoading && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>

              <div className="flex-1">
                <p className="text-red-900 dark:text-red-100 font-semibold mb-1">
                  Erro ao carregar horários
                </p>
                <p className="text-red-700 dark:text-red-300 text-sm mb-3">
                  {batchError || 'Não foi possível buscar os horários disponíveis. Verifique sua conexão.'}
                </p>

                <button
                  onClick={refetch}
                  className="text-sm font-medium text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 underline"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Seleção de horário com skeleton e estado vazio melhorado */}
        {formData.dataSelecionada && (
          <div className="mt-6">
            <label className={formStyles.formLabel}>Selecione um Horário</label>

            {/* Loading state com skeleton */}
            {loadingHorarios ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-muted animate-pulse rounded-lg"
                  ></div>
                ))}
              </div>
            ) : horariosDisponiveis.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {horariosDisponiveis.map((horario) => (
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
                ))}
              </div>
            ) : (
              /* Estado vazio melhorado */
              <div className="text-center py-8 px-4 bg-muted/50 rounded-lg">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mb-3">
                  <svg className="w-6 h-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-foreground mb-1">
                  Nenhum horário disponível
                </p>
                <p className="text-sm text-muted-foreground">
                  Todos os horários desta data já estão ocupados.<br />
                  Por favor, tente outra data.
                </p>
              </div>
            )}
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
              !formData.modalidade ||
              (formData.modalidade === MODALITY.IN_PERSON && !formData.endereco)
            }
            className={`${formStyles.primaryButton} ${
              carregando ||
              !formData.dataSelecionada ||
              !formData.horarioSelecionado ||
              !formData.modalidade ||
              (formData.modalidade === MODALITY.IN_PERSON && !formData.endereco)
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
