// components/agendamento/AppointmentDetails.tsx
import { ContactCard } from "@/components/shared/cards/BaseCard";
import { Button } from "@/components/shared/ui/button";
import { LoadingSpinner } from "@/components/shared/ui/LoadingSpinner";
import { AppointmentFormData } from "@/types/appointment"; // ✅ ÚNICO TIPO ADICIONADO
import { formatarDataBrasil } from "@/utils/utils";
import { Calendar, Clock } from "lucide-react";

interface AppointmentDetailsProps {
  formData: AppointmentFormData; // ✅ USANDO TIPO CENTRALIZADO
  setCancelar: (status: boolean) => void;
  setEnviado: (status: boolean) => void;
  carregando: boolean;
  setCarregando: (status: boolean) => void;
  handleError: (message: string) => void;
}

export default function AppointmentDetails({
  formData,
  setCancelar,
  setEnviado,
  carregando,
  setCarregando,
  handleError,
}: AppointmentDetailsProps) {
  // Função para formatar a data usando utilitário centralizado

  // Função para confirmar cancelamento - ✅ MANTIDA EXATAMENTE ORIGINAL
  const confirmarCancelamento = async () => {
    setCarregando(true);

    try {
      const response = await fetch("/api/calendario/cancelar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigo: formData.codigoConfirmacao,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cancelar agendamento");
      }

      setEnviado(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      handleError(
        (error as Error).message ||
          "Ocorreu um erro ao cancelar o agendamento. Por favor, tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="mt-12">
      <ContactCard title="Detalhes do Agendamento">
        <div className="space-y-6">
          <div className="bg-background p-6 rounded-lg border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <Calendar className="mr-3 mt-1 text-foreground" size={20} />
                <div>
                  <p className="text-foreground/70 text-sm mb-1">Data</p>
                  <p className="text-foreground">
                    {formatarDataBrasil(formData.dataSelecionada)}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="mr-3 mt-1 text-foreground" size={20} />
                <div>
                  <p className="text-foreground/70 text-sm mb-1">Horário</p>
                  <p className="text-foreground">
                    {formData.horarioSelecionado}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-foreground/70 text-sm mb-1">Modalidade</p>
                <p className="text-foreground capitalize">
                  {formData.modalidade}
                </p>
              </div>

              <div>
                <p className="text-foreground/70 text-sm mb-1">Nome</p>
                <p className="text-foreground">{formData.nome}</p>
              </div>

              <div>
                <p className="text-foreground/70 text-sm mb-1">E-mail</p>
                <p className="text-foreground">{formData.email}</p>
              </div>

              <div>
                <p className="text-foreground/70 text-sm mb-1">Telefone</p>
                <p className="text-foreground">{formData.telefone}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="secondary"
              onClick={() => setCancelar(false)}
              size="lg"
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmarCancelamento}
              disabled={carregando}
              size="lg"
              className="flex items-center gap-2"
            >
              {carregando && <LoadingSpinner size="sm" />}
              {carregando ? "Cancelando..." : "Cancelar Agendamento"}
            </Button>
          </div>
        </div>
      </ContactCard>
    </div>
  );
}
