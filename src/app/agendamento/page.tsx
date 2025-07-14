// src/app/agendamento/page.tsx - REFATORADO
"use client";

import AppointmentConfirmation from "@/components/agendamento/AppointmentConfirmation";
import AppointmentDetails from "@/components/agendamento/AppointmentDetails";
import AppointmentForm from "@/components/agendamento/AppointmentForm";
import AppointmentLookup from "@/components/agendamento/AppointmentLookup";
import InfoCards from "@/components/agendamento/InfoCards";
import Divisor from "@/components/ui/divisor";
import { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";

export default function Agendamento() {
  const [step, setStep] = useState(1);
  const [enviado, setEnviado] = useState(false);
  const [cancelar, setCancelar] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    dataSelecionada: "",
    horarioSelecionado: "",
    modalidade: "presencial",
    mensagem: "",
    codigoAgendamento: "",
    codigoConfirmacao: "",
    primeiraConsulta: false,
  });

  const updateFormData = (newData: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleError = (errorMessage: string) => {
    setErro(errorMessage);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <section className="appointment-section">
        <div className="content-container">
          <div className="z-content">
            <h1 className="section-title">Agendamento de Consultas</h1>

            {/* Mensagem de erro */}
            {erro && (
              <div className="form-error">
                <p className="flex items-center">
                  <IoCloseCircle className="mr-2" size={20} />
                  {erro}
                </p>
              </div>
            )}

            {!enviado ? (
              <>
                {/* Abas */}
                <div className="appointment-tabs">
                  <button
                    className={
                      step !== 0
                        ? "appointment-tab-active"
                        : "appointment-tab-inactive"
                    }
                    onClick={() => setStep(1)}
                  >
                    Novo Agendamento
                  </button>
                  <button
                    className={
                      step === 0
                        ? "appointment-tab-active"
                        : "appointment-tab-inactive"
                    }
                    onClick={() => setStep(0)}
                  >
                    Meus Agendamentos
                  </button>
                </div>

                {step === 0 ? (
                  <AppointmentLookup
                    formData={formData}
                    updateFormData={updateFormData}
                    setCarregando={setCarregando}
                    setCancelar={setCancelar}
                    handleError={handleError}
                    carregando={carregando}
                  />
                ) : (
                  <AppointmentForm
                    step={step}
                    setStep={setStep}
                    formData={formData}
                    updateFormData={updateFormData}
                    setEnviado={setEnviado}
                    carregando={carregando}
                    setCarregando={setCarregando}
                    handleError={handleError}
                  />
                )}

                {cancelar && (
                  <AppointmentDetails
                    formData={formData}
                    setCancelar={setCancelar}
                    setEnviado={setEnviado}
                    carregando={carregando}
                    setCarregando={setCarregando}
                    handleError={handleError}
                  />
                )}
              </>
            ) : (
              <AppointmentConfirmation
                formData={formData}
                cancelar={cancelar}
              />
            )}

            {/* Informações adicionais */}
            {!enviado && <InfoCards />}
          </div>
        </div>
      </section>
      <Divisor index={5} />
    </div>
  );
}
