"use client";
// components/scheduling/AppointmentConfirmation/index.tsx

import { robotoSlab } from "@/app/fonts";
import { ContactCard } from "@/components/shared/cards/BaseCard";
import { Button } from "@/components/shared/ui/button";
import { AppointmentFormData } from "@/types/appointment"; // ✅ ÚNICO TIPO ADICIONADO
import { cn } from "@/utils/utils";
import { useState } from "react";
import {
  IoCheckmark,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoCopy,
} from "react-icons/io5";

interface AppointmentConfirmationProps {
  formData: AppointmentFormData; // ✅ USANDO TIPO CENTRALIZADO
  cancelar: boolean;
}

export default function AppointmentConfirmation({
  formData,
  cancelar,
}: AppointmentConfirmationProps) {
  const [copiado, setCopiado] = useState(false);

  // Função para copiar código para clipboard
  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(formData.codigoAgendamento!);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000); // Reset após 2 segundos
    } catch (error) {
      console.error("Erro ao copiar código:", error);
      // Fallback para browsers mais antigos
      const textArea = document.createElement("textarea");
      textArea.value = formData.codigoAgendamento!;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

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
              <div className="w-14 h-14 rounded-full bg-card border-2 border-card flex items-center justify-center shadow-lg">
                <IoCheckmarkCircle size={28} className="text-card-foreground" />
              </div>
            </div>
            <p className="text-foreground">
              Seu agendamento para o dia{" "}
              <b>
                {formatarData(formData.dataSelecionada)} às{" "}
                {formData.horarioSelecionado}
              </b>{" "}
              foi confirmado com sucesso.
            </p>
            <div className="text-center my-6">
              <p className="text-md font-bold text-foreground mb-4">
                Seu código de confirmação:
              </p>
              <div className="bg-background border-2 border-card rounded-lg py-4 px-6 inline-block group relative">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-3xl font-bold text-card-foreground tracking-wider",
                      robotoSlab.className
                    )}
                  >
                    {formData.codigoAgendamento}
                  </span>
                  <button
                    onClick={copiarCodigo}
                    className="p-2 rounded-md transition-all duration-200 hover:bg-card hover:text-card-foreground bg-background border border-card"
                    title={copiado ? "Copiado!" : "Copiar código"}
                  >
                    {copiado ? (
                      <IoCheckmark size={18} className="text-green-600" />
                    ) : (
                      <IoCopy size={18} className="text-card-foreground" />
                    )}
                  </button>
                </div>
                {copiado && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-2 py-1 rounded text-xs">
                    Código copiado!
                  </div>
                )}
              </div>
              <p className="text-md font-bold text-muted-foreground mt-4">
                !!! Importante - Guarde este código para futuras consultas,
                cancelamentos ou remarcações.
              </p>
            </div>
            <p className="text-foreground">
              Enviamos um e-mail de confirmação para <b>{formData.email}</b> com
              todos os detalhes da sua consulta.
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
