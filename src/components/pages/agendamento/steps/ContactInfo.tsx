// components/agendamento/AppointmentForm/steps/ContactInfo.tsx
import { ContactCard } from "@/components/shared/cards/BaseCard"; // ✅ MANTIDO ORIGINAL
import { AppointmentFormData } from "@/types/appointment"; // ✅ ÚNICO TIPO ADICIONADO
import React, { useCallback } from "react";
import appointmentStyles from "../form.module.css"; // ✅ MANTIDO ORIGINAL

interface ContactInfoProps {
  formData: AppointmentFormData; // ✅ USANDO TIPO CENTRALIZADO
  updateFormData: (data: Partial<AppointmentFormData>) => void;
  proximoPasso: () => void;
  passoAnterior: () => void;
  carregando: boolean;
}

const ContactInfo = React.memo<ContactInfoProps>(function ContactInfo({
  formData,
  updateFormData,
  proximoPasso,
  passoAnterior,
  carregando,
}: ContactInfoProps) {
  // Validar os campos (memoizada)
  const validarCampos = useCallback(() => {
    if (!formData.nome || !formData.email || !formData.telefone) {
      return false;
    }
    return true;
  }, [formData.nome, formData.email, formData.telefone]);

  // Submeter o formulário
  const submeterFormulario = (e: React.FormEvent) => {
    e.preventDefault();
    if (validarCampos()) {
      proximoPasso();
    }
  };

  return (
    <ContactCard title="Informações de Contato">
      <form onSubmit={submeterFormulario} className="space-y-6">
        <div>
          <label htmlFor="nome" className={appointmentStyles.formLabel}>
            Nome Completo
          </label>
          <input
            type="text"
            id="nome"
            className={appointmentStyles.inputField}
            placeholder="Seu nome completo"
            value={formData.nome}
            onChange={(e) => updateFormData({ nome: e.target.value })}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className={appointmentStyles.formLabel}>
            E-mail
          </label>
          <input
            type="email"
            id="email"
            className={appointmentStyles.inputField}
            placeholder="seu.email@exemplo.com"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            required
          />
        </div>

        <div>
          <label htmlFor="telefone" className={appointmentStyles.formLabel}>
            Telefone
          </label>
          <input
            type="tel"
            id="telefone"
            className={appointmentStyles.inputField}
            placeholder="(00) 00000-0000"
            value={formData.telefone}
            onChange={(e) => updateFormData({ telefone: e.target.value })}
            required
          />
        </div>

        <div>
          <label htmlFor="mensagem" className={appointmentStyles.formLabel}>
            Mensagem (opcional)
          </label>
          <textarea
            id="mensagem"
            rows={4}
            className={appointmentStyles.inputField}
            placeholder="Alguma informação adicional que gostaria de compartilhar?"
            value={formData.mensagem}
            onChange={(e) => updateFormData({ mensagem: e.target.value })}
          ></textarea>
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={passoAnterior}
            className={appointmentStyles.secondaryButton}
          >
            Voltar
          </button>
          <button
            type="submit"
            disabled={carregando}
            className={`${appointmentStyles.primaryButton} ${
              carregando ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Próximo
          </button>
        </div>
      </form>
    </ContactCard>
  );
});

export default ContactInfo;
