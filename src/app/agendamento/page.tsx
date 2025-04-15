"use client";

import AppointmentConfirmation from "@/components/agendamento/AppointmentConfirmation";
import AppointmentDetails from "@/components/agendamento/AppointmentDetails";
import AppointmentForm from "@/components/agendamento/AppointmentForm";
import AppointmentLookup from "@/components/agendamento/AppointmentLookup";
import InfoCards from "@/components/agendamento/InfoCards";
import Divisor from "@/components/ui/divisor";
import styles from "@/styles/pages/agendamento.module.css";
import { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";

export default function Agendamento() {
  // Estados principais
  const [step, setStep] = useState(1);
  const [enviado, setEnviado] = useState(false);
  const [cancelar, setCancelar] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  // Estados de dados do agendamento
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
  });

  // Função para atualizar os dados do formulário
  const updateFormData = (newData: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  // Função para lidar com erros
  const handleError = (errorMessage: string) => {
    setErro(errorMessage);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <section className={styles.schedulingSection}>
        <div className="content-container">
          <div className={styles.container}>
            <h1 className={styles.title}>Agendamento de Consultas</h1>

            {/* Mensagem de erro */}
            {erro && (
              <div className={styles.errorMessage}>
                <p className={styles.errorText}>
                  <IoCloseCircle className="mr-2" size={20} />
                  {erro}
                </p>
              </div>
            )}

            {!enviado ? (
              <>
                {/* Abas para Novo Agendamento ou Meus Agendamentos */}
                <div className={styles.tabs}>
                  <button
                    className={`${styles.tab} ${
                      step !== 0 ? styles.activeTab : styles.inactiveTab
                    }`}
                    onClick={() => setStep(1)}
                  >
                    Novo Agendamento
                  </button>
                  <button
                    className={`${styles.tab} ${
                      step === 0 ? styles.activeTab : styles.inactiveTab
                    }`}
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
