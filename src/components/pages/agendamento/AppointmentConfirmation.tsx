// components/scheduling/AppointmentConfirmation/index.tsx
import { caveat } from "@/app/fonts";
import { ContactCard } from "@/components/shared/cards/BaseCard";
import { Button } from "@/components/shared/ui/button";
import { AppointmentFormData } from "@/types/appointment"; // ✅ ÚNICO TIPO ADICIONADO
import { cn } from "@/utils/utils";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

interface AppointmentConfirmationProps {
  formData: AppointmentFormData; // ✅ USANDO TIPO CENTRALIZADO
  cancelar: boolean;
}

export default function AppointmentConfirmation({
  formData,
  cancelar,
}: AppointmentConfirmationProps) {
  // Função para formatar a data com timezone correto
  const formatarData = (dataString: string): string => {
    // Adicionar hora meio-dia para evitar problemas de timezone
    const data = new Date(dataString + "T12:00:00");
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "America/Sao_Paulo",
    };
    return data.toLocaleDateString("pt-BR", options);
  };

  return (
    <ContactCard
      title={cancelar ? "Agendamento Cancelado" : "Agendamento Confirmado!"}
    >
      <div className="space-y-6 text-center">
        {cancelar ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center">
                <IoCloseCircle
                  size={32}
                  className="text-destructive-foreground"
                />
              </div>
            </div>
            <p className="text-foreground">
              Seu agendamento para o dia{" "}
              {formatarData(formData.dataSelecionada)} às{" "}
              {formData.horarioSelecionado} foi cancelado com sucesso.
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary-foreground flex items-center justify-center">
                <IoCheckmarkCircle size={32} className="text-foreground" />
              </div>
            </div>
            <p className="text-foreground">
              Seu agendamento para o dia{" "}
              {formatarData(formData.dataSelecionada)} às{" "}
              {formData.horarioSelecionado} foi confirmado com sucesso.
            </p>
            <div className={cn("text-center my-6", caveat.className)}>
              <p className="text-xl font-bold text-foreground mb-2">
                Seu código de confirmação:
              </p>
              <div className="bg-background border-2 border-primary-foreground rounded-lg py-3 px-6 inline-block">
                <span className="text-2xl font-bold text-foreground">
                  {formData.codigoAgendamento}
                </span>
              </div>
              <p className="text-sm text-foreground mt-2">
                Guarde este código para futuras consultas, cancelamentos ou
                remarcações.
              </p>
            </div>
            <p className="text-foreground">
              Enviamos um e-mail de confirmação para {formData.email} com todos
              os detalhes da sua consulta.
              {formData.modalidade === "online" &&
                " O link para a sessão online será enviado no dia da consulta."}
            </p>
          </>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={() => (window.location.href = "/contato")}>
            Entre em Contato
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="bg-background text-card-foreground border-2 border-card hover:bg-card hover:text-card-foreground hover:border-white hover:shadow-md dark:bg-secondary dark:text-secondary-foreground dark:hover:border-white dark:hover:shadow-md transition-all duration-200"
          >
            Voltar para Home
          </Button>
        </div>
      </div>
    </ContactCard>
  );
}
