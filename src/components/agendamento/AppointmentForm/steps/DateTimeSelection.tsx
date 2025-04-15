// components/scheduling/AppointmentForm/Steps/DateTimeSelection.tsx
import { useEffect, useState } from "react";
import { ContactCard } from "@/components/ui/cards/ServiceCard";
import { Button } from "@/components/ui/button";

interface FormData {
  dataSelecionada: string;
  horarioSelecionado: string;
  modalidade: string;
  [key: string]: any;
}

interface DateTimeSelectionProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  proximoPasso: () => void;
  carregando: boolean;
  setCarregando: (status: boolean) => void;
  handleError: (message: string) => void;
}

export default function DateTimeSelection({
  formData,
  updateFormData,
  proximoPasso,
  carregando,
  setCarregando,
  handleError,
}: DateTimeSelectionProps) {
  // Estado para dias e horários disponíveis
  const [diasDisponiveis, setDiasDisponiveis] = useState<string[]>([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);

  // Efeito para carregar os dias disponíveis
  useEffect(() => {
    const fetchDiasDisponiveis = async () => {
      setCarregando(true);
      try {
        // Gerar próximos 14 dias úteis para verificação
        const hoje = new Date();
        const diasParaVerificar: string[] = [];

        for (let i = 1; i <= 30; i++) {
          const data = new Date(hoje);
          data.setDate(hoje.getDate() + i);

          // Excluir fins de semana (0 = Domingo, 6 = Sábado)
          if (data.getDay() !== 0 && data.getDay() !== 6) {
            diasParaVerificar.push(data.toISOString().split("T")[0]);

            // Parar quando tivermos 14 dias úteis
            if (diasParaVerificar.length >= 14) break;
          }
        }

        setDiasDisponiveis(diasParaVerificar);
      } catch (error) {
        console.error("Erro ao gerar dias disponíveis:", error);
        handleError("Não foi possível carregar os dias disponíveis.");
      } finally {
        setCarregando(false);
      }
    };

    fetchDiasDisponiveis();
  }, []);

  // Efeito para carregar os horários disponíveis quando uma data é selecionada
  useEffect(() => {
    if (formData.dataSelecionada) {
      const fetchHorariosDisponiveis = async () => {
        setCarregando(true);
        updateFormData({ horarioSelecionado: "" });

        try {
          const response = await fetch(
            `/api/calendario/horarios?data=${formData.dataSelecionada}`
          );

          if (!response.ok) {
            throw new Error("Erro ao buscar horários");
          }

          const data = await response.json();
          setHorariosDisponiveis(data.horariosDisponiveis);
        } catch (error) {
          console.error("Erro ao buscar horários:", error);
          handleError("Não foi possível carregar os horários disponíveis.");
        } finally {
          setCarregando(false);
        }
      };

      fetchHorariosDisponiveis();
    }
  }, [formData.dataSelecionada]);

  return (
    <ContactCard title="Selecione Data e Horário">
      <div className="space-y-6">
        <div>
          <label className="block text-foreground font-medium mb-3">
            Data da Consulta
          </label>
          {carregando && !formData.dataSelecionada ? (
            <div className="text-center py-4 text-foreground/70">
              Carregando datas disponíveis...
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {diasDisponiveis.map((dia) => (
                <button
                  key={dia}
                  type="button"
                  className={`p-3 rounded-md transition-colors ${
                    formData.dataSelecionada === dia
                      ? "bg-primary-foreground text-foreground shadow-md"
                      : "bg-background text-foreground border border-border hover:bg-secondary"
                  }`}
                  onClick={() => updateFormData({ dataSelecionada: dia })}
                >
                  {new Date(dia).toLocaleDateString("pt-BR", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </button>
              ))}
            </div>
          )}
        </div>

        {formData.dataSelecionada && (
          <div>
            <label className="block text-foreground font-medium mb-3">
              Horário da Consulta
            </label>
            {carregando ? (
              <div className="text-center py-4 text-foreground/70">
                Carregando horários disponíveis...
              </div>
            ) : horariosDisponiveis.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {horariosDisponiveis.map((horario) => (
                  <button
                    key={horario}
                    type="button"
                    className={`p-3 rounded-md transition-colors ${
                      formData.horarioSelecionado === horario
                        ? "bg-primary-foreground text-foreground shadow-md"
                        : "bg-background text-foreground border border-border hover:bg-secondary"
                    }`}
                    onClick={() =>
                      updateFormData({ horarioSelecionado: horario })
                    }
                  >
                    {horario}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-800 rounded-lg text-yellow-800 dark:text-yellow-300">
                Não há horários disponíveis para esta data. Por favor, selecione
                outra data.
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-foreground font-medium mb-3">
            Modalidade de Atendimento
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`p-3 rounded-md transition-colors ${
                formData.modalidade === "presencial"
                  ? "bg-primary-foreground text-foreground shadow-md"
                  : "bg-background text-foreground border border-border hover:bg-secondary"
              }`}
              onClick={() => updateFormData({ modalidade: "presencial" })}
            >
              Presencial
            </button>
            <button
              type="button"
              className={`p-3 rounded-md transition-colors ${
                formData.modalidade === "online"
                  ? "bg-primary-foreground text-foreground shadow-md"
                  : "bg-background text-foreground border border-border hover:bg-secondary"
              }`}
              onClick={() => updateFormData({ modalidade: "online" })}
            >
              Online
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={proximoPasso}
            disabled={
              !formData.dataSelecionada ||
              !formData.horarioSelecionado ||
              !formData.modalidade ||
              carregando
            }
          >
            Continuar
          </Button>
        </div>
      </div>
    </ContactCard>
  );
}
