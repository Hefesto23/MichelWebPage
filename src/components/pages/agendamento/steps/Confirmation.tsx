// components/agendamento/AppointmentForm/steps/Confirmation.tsx
import { ContactCard } from "@/components/shared/cards/BaseCard"; // ✅ MANTIDO ORIGINAL
import { AppointmentFormData } from "@/types/appointment"; // ✅ ÚNICO TIPO ADICIONADO
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  User,
} from "lucide-react";
import appointmentStyles from "../form.module.css"; // ✅ MANTIDO ORIGINAL

interface ConfirmationProps {
  formData: AppointmentFormData; // ✅ USANDO TIPO CENTRALIZADO
  passoAnterior: () => void;
  enviarFormulario: (e: React.FormEvent) => void;
  carregando: boolean;
}

export default function Confirmation({
  formData,
  passoAnterior,
  enviarFormulario,
  carregando,
}: ConfirmationProps) {
  // Formatar a data em português para exibição com timezone correto
  const dataFormatada = formData.dataSelecionada
    ? format(
        new Date(formData.dataSelecionada + "T12:00:00"),
        "EEEE, dd 'de' MMMM 'de' yyyy",
        {
          locale: ptBR,
        }
      )
    : "";

  return (
    <ContactCard title="Confirme seus Dados">
      <div className="space-y-6">
        <h3 className={appointmentStyles.sectionSubtitle}>
          Revise as informações do agendamento
        </h3>

        <div className="bg-background p-6 rounded-lg border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <Calendar
                className="mr-3 mt-1 text-foreground flex-shrink-0"
                size={20}
              />
              <div>
                <p className={appointmentStyles.infoText}>Data</p>
                <p className="text-foreground font-medium">{dataFormatada}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock
                className="mr-3 mt-1 text-foreground flex-shrink-0"
                size={20}
              />
              <div>
                <p className={appointmentStyles.infoText}>Horário</p>
                <p className="text-foreground font-medium">
                  {formData.horarioSelecionado}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <User
                className="mr-3 mt-1 text-foreground flex-shrink-0"
                size={20}
              />
              <div>
                <p className={appointmentStyles.infoText}>Nome</p>
                <p className="text-foreground font-medium">{formData.nome}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Mail
                className="mr-3 mt-1 text-foreground flex-shrink-0"
                size={20}
              />
              <div>
                <p className={appointmentStyles.infoText}>E-mail</p>
                <p className="text-foreground font-medium">{formData.email}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone
                className="mr-3 mt-1 text-foreground flex-shrink-0"
                size={20}
              />
              <div>
                <p className={appointmentStyles.infoText}>Telefone</p>
                <p className="text-foreground font-medium">
                  {formData.telefone}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div
                className={`mr-3 mt-1 rounded-full p-1 flex-shrink-0 ${
                  formData.modalidade === "presencial"
                    ? "bg-green-100 text-green-600"
                    : "bg-blue-100 text-blue-600"
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
                <p className={appointmentStyles.infoText}>Modalidade</p>
                <p className="text-foreground font-medium capitalize">
                  {formData.modalidade}
                </p>
              </div>
            </div>
          </div>

          <div className="flex mt-6 items-start">
            <div
              className={`mr-3 mt-1 rounded-full p-1 flex-shrink-0 ${
                formData.primeiraConsulta
                  ? "bg-purple-100 text-purple-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12h20M12 2v20" />
                </svg>
              </div>
            </div>
            <div>
              <p className={appointmentStyles.infoText}>Primeira Consulta?</p>
              <p className="text-foreground font-medium">
                {formData.primeiraConsulta ? "Sim" : "Não"}
              </p>
            </div>
          </div>

          {formData.mensagem && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-start">
                <MessageSquare
                  className="mr-3 mt-1 text-foreground flex-shrink-0"
                  size={20}
                />
                <div>
                  <p className={appointmentStyles.infoText}>Mensagem</p>
                  <p className="text-foreground">{formData.mensagem}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md border border-amber-200 dark:border-amber-800">
          <p className="text-amber-800 dark:text-amber-300 text-sm">
            Ao confirmar, você receberá um e-mail com o código de confirmação e
            detalhes da consulta. Use este código para cancelar ou reagendar se
            necessário.
          </p>
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
            type="button"
            onClick={enviarFormulario}
            disabled={carregando}
            className={`${appointmentStyles.primaryButton} ${
              carregando ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {carregando ? "Processando..." : "Confirmar Agendamento"}
          </button>
        </div>
      </div>
    </ContactCard>
  );
}

// Componente de VideoIcon para reutilização - ✅ MANTIDO ORIGINAL
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
