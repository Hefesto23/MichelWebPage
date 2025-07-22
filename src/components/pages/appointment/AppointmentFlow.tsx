// ============================================
// src/components/pages/appointment/AppointmentFlow.tsx
// ============================================
import { ContactCard } from "@/components/shared/cards/BaseCard";
import { useState } from "react";

// Importa seus componentes atuais (SEM ALTERAR NADA!)
import AppointmentConfirmation from "@/components/agendamento/AppointmentConfirmation";
import AppointmentDetails from "@/components/agendamento/AppointmentDetails";
import Confirmation from "@/components/agendamento/AppointmentForm/steps/Confirmation";
import ContactInfo from "@/components/agendamento/AppointmentForm/steps/ContactInfo";
import DateTimeSelection from "@/components/agendamento/AppointmentForm/steps/DateTimeSelection";
import AppointmentLookup from "@/components/agendamento/AppointmentLookup";

interface AppointmentFormData {
  nome: string;
  email: string;
  telefone: string;
  dataSelecionada: string;
  horarioSelecionado: string;
  modalidade: string;
  mensagem: string;
  codigoAgendamento: string;
  codigoConfirmacao: string;
  primeiraConsulta: boolean;
}

interface AppointmentFlowProps {
  mode?: "schedule" | "manage";
}

export const AppointmentFlow: React.FC<AppointmentFlowProps> = ({
  mode = "schedule",
}) => {
  const [step, setStep] = useState(mode === "manage" ? 0 : 1);
  const [enviado, setEnviado] = useState(false);
  const [cancelar, setCancelar] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const [formData, setFormData] = useState<AppointmentFormData>({
    nome: "",
    email: "",
    telefone: "",
    dataSelecionada: "",
    horarioSelecionado: "",
    modalidade: "",
    mensagem: "",
    codigoAgendamento: "",
    codigoConfirmacao: "",
    primeiraConsulta: false,
  });

  const updateFormData = (data: Partial<AppointmentFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleError = (message: string) => {
    setErro(message);
    setTimeout(() => setErro(""), 5000);
  };

  const proximoPasso = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const passoAnterior = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const enviarFormulario = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const response = await fetch("/api/calendario/agendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const renderTabNavigation = () => {
    if (mode === "schedule") return null;

    return (
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => {
            setStep(0);
            setCancelar(false);
          }}
          className={`py-3 px-6 rounded-lg font-medium transition-colors ${
            step === 0
              ? "bg-primary-foreground text-btnFg shadow-md"
              : "border-2 border-border hover:bg-secondary"
          }`}
        >
          Buscar Agendamento
        </button>
        <button
          onClick={() => {
            setStep(1);
            setCancelar(false);
          }}
          className={`py-3 px-6 rounded-lg font-medium transition-colors ${
            step >= 1 && !cancelar
              ? "bg-primary-foreground text-btnFg shadow-md"
              : "border-2 border-border hover:bg-secondary"
          }`}
        >
          Novo Agendamento
        </button>
      </div>
    );
  };

  const renderCurrentStep = () => {
    if (erro) {
      return (
        <ContactCard title="Erro">
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300">
            {erro}
          </div>
          <button
            onClick={() => setErro("")}
            className="py-3 px-6 rounded-lg font-bold bg-primary-foreground text-btnFg shadow-md"
          >
            Tentar Novamente
          </button>
        </ContactCard>
      );
    }

    if (enviado) {
      return (
        <AppointmentConfirmation formData={formData} cancelar={cancelar} />
      );
    }

    if (cancelar && step > 0) {
      return (
        <AppointmentDetails
          formData={formData}
          setCancelar={setCancelar}
          setEnviado={setEnviado}
          carregando={carregando}
          setCarregando={setCarregando}
          handleError={handleError}
        />
      );
    }

    switch (step) {
      case 0:
        return (
          <AppointmentLookup
            formData={formData}
            updateFormData={updateFormData}
            setCarregando={setCarregando}
            setCancelar={setCancelar}
            handleError={handleError}
            carregando={carregando}
          />
        );

      case 1:
        return (
          <DateTimeSelection
            formData={formData}
            updateFormData={updateFormData}
            proximoPasso={proximoPasso}
            carregando={carregando}
            setCarregando={setCarregando}
            handleError={handleError}
          />
        );

      case 2:
        return (
          <ContactInfo
            formData={formData}
            updateFormData={updateFormData}
            proximoPasso={proximoPasso}
            passoAnterior={passoAnterior}
            carregando={carregando}
          />
        );

      case 3:
        return (
          <Confirmation
            formData={formData}
            passoAnterior={passoAnterior}
            enviarFormulario={enviarFormulario}
            carregando={carregando}
          />
        );

      default:
        return (
          <ContactCard title="Erro">
            <p>Passo inválido. Por favor, recarregue a página.</p>
          </ContactCard>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {renderTabNavigation()}
      {renderCurrentStep()}
    </div>
  );
};
