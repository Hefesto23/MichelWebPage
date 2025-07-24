import React from "react";
import Confirmation from "../../pages/agendamento/steps/Confirmation";
import ContactInfo from "../../pages/agendamento/steps/ContactInfo";
import DateTimeSelection from "../../pages/agendamento/steps/DateTimeSelection";
import { AppointmentFormData } from "@/types/appointment"; // ✅ ÚNICO TIPO ADICIONADO

interface AppointmentFormProps {
  step: number;
  setStep: (step: number) => void;
  formData: AppointmentFormData; // ✅ USANDO TIPO CENTRALIZADO
  updateFormData: (data: Partial<AppointmentFormData>) => void;
  setEnviado: (status: boolean) => void;
  carregando: boolean;
  setCarregando: (status: boolean) => void;
  handleError: (message: string) => void;
}

export default function AppointmentForm({
  step,
  setStep,
  formData,
  updateFormData,
  setEnviado,
  carregando,
  setCarregando,
  handleError,
}: AppointmentFormProps) {
  // Função para avançar ao próximo passo - ✅ MANTIDA EXATAMENTE ORIGINAL
  const proximoPasso = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  // Função para voltar ao passo anterior - ✅ MANTIDA EXATAMENTE ORIGINAL
  const passoAnterior = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  // Função para enviar o formulário - ✅ MANTIDA EXATAMENTE ORIGINAL
  const enviarFormulario = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const response = await fetch("/api/calendario/agendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          data: formData.dataSelecionada,
          horario: formData.horarioSelecionado,
          modalidade: formData.modalidade,
          mensagem: formData.mensagem,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao agendar consulta");
      }

      updateFormData({ codigoAgendamento: data.codigo });
      setEnviado(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
      handleError(
        (error as Error).message ||
          "Ocorreu um erro ao agendar sua consulta. Por favor, tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  };

  // Renderizar o passo atual - ✅ MANTIDA EXATAMENTE ORIGINAL
  return (
    <>
      {step === 1 && (
        <DateTimeSelection
          formData={formData}
          updateFormData={updateFormData}
          proximoPasso={proximoPasso}
          carregando={carregando}
          setCarregando={setCarregando}
          handleError={handleError}
        />
      )}

      {step === 2 && (
        <ContactInfo
          formData={formData}
          updateFormData={updateFormData}
          proximoPasso={proximoPasso}
          passoAnterior={passoAnterior}
          carregando={carregando}
        />
      )}

      {step === 3 && (
        <Confirmation
          formData={formData}
          passoAnterior={passoAnterior}
          enviarFormulario={enviarFormulario}
          carregando={carregando}
        />
      )}
    </>
  );
}
