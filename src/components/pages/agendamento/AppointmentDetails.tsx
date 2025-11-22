// components/agendamento/AppointmentDetails.tsx
import { ContactCard } from "@/components/shared/cards/BaseCard";
import { Button } from "@/components/shared/ui/button";
import { LoadingSpinner } from "@/components/shared/ui/LoadingSpinner";
import { AppointmentFormData } from "@/types/appointment"; // ✅ ÚNICO TIPO ADICIONADO
import { formatarDataBrasil } from "@/utils/utils";
import { Calendar, Clock, MapPin, Mail, Phone, User } from "lucide-react";

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
                  <p className="text-foreground/70 text-xs sm:text-sm md:text-base mb-1">Data</p>
                  <p className="text-foreground text-sm sm:text-base md:text-lg">
                    {formatarDataBrasil(formData.dataSelecionada)}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="mr-3 mt-1 text-foreground" size={20} />
                <div>
                  <p className="text-foreground/70 text-xs sm:text-sm md:text-base mb-1">Horário</p>
                  <p className="text-foreground text-sm sm:text-base md:text-lg">
                    {formData.horarioSelecionado}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div
                  className={`mr-3 mt-1 rounded-full p-1 flex-shrink-0 ${
                    formData.modalidade === "presencial"
                      ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    {formData.modalidade === "presencial" ? (
                      <MapPin size={16} />
                    ) : (
                      <VideoIcon size={16} />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-foreground/70 text-xs sm:text-sm md:text-base mb-1">Modalidade</p>
                  <p className="text-foreground text-sm sm:text-base md:text-lg capitalize">
                    {formData.modalidade}
                  </p>
                </div>
              </div>

              {/* ✅ ADICIONADO: Endereço (apenas se presencial) */}
              {formData.modalidade === "presencial" && formData.endereco && (
                <div className="flex items-start md:col-span-2">
                  <MapPin
                    className="mr-3 mt-1 text-foreground flex-shrink-0"
                    size={20}
                  />
                  <div className="flex-1">
                    <p className="text-foreground/70 text-xs sm:text-sm md:text-base mb-1">Local do Atendimento</p>
                    <p className="text-foreground text-sm sm:text-base md:text-lg font-medium">
                      {formData.endereco}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <User className="mr-3 mt-1 text-foreground" size={20} />
                <div>
                  <p className="text-foreground/70 text-xs sm:text-sm md:text-base mb-1">Nome</p>
                  <p className="text-foreground text-sm sm:text-base md:text-lg">{formData.nome}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="mr-3 mt-1 text-foreground" size={20} />
                <div>
                  <p className="text-foreground/70 text-xs sm:text-sm md:text-base mb-1">E-mail</p>
                  <p className="text-foreground text-sm sm:text-base md:text-lg">{formData.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="mr-3 mt-1 text-foreground" size={20} />
                <div>
                  <p className="text-foreground/70 text-xs sm:text-sm md:text-base mb-1">Telefone</p>
                  <p className="text-foreground text-sm sm:text-base md:text-lg">{formData.telefone}</p>
                </div>
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

// Componente de VideoIcon para reutilização
function VideoIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z" />
      <rect x="3" y="6" width="12" height="12" rx="2" ry="2" />
    </svg>
  );
}
