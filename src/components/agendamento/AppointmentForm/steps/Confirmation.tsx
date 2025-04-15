// components/scheduling/AppointmentForm/Steps/Confirmation.tsx
import { Button } from "@/components/ui/button";
import { ContactCard } from "@/components/ui/cards/ServiceCard";
import { Calendar, Clock } from "lucide-react";

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  dataSelecionada: string;
  horarioSelecionado: string;
  modalidade: string;
  mensagem: string;
  [key: string]: any;
}

interface ConfirmationProps {
  formData: FormData;
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
  // Função para formatar a data
  const formatarData = (dataString: string): string => {
    const data = new Date(dataString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return data.toLocaleDateString("pt-BR", options);
  };

  return (
    <ContactCard title="Confirmar Agendamento">
      <div className="space-y-6">
        <div className="bg-background p-6 rounded-lg border border-border">
          <h3 className="text-xl font-bold mb-4 text-foreground">
            Detalhes da Consulta
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <Calendar className="mr-3 mt-1 text-foreground" size={20} />
              <div>
                <p className="text-foreground/70 text-sm mb-1">Data</p>
                <p className="text-foreground">
                  {formatarData(formData.dataSelecionada)}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="mr-3 mt-1 text-foreground" size={20} />
              <div>
                <p className="text-foreground/70 text-sm mb-1">Horário</p>
                <p className="text-foreground">{formData.horarioSelecionado}</p>
              </div>
            </div>

            <div>
              <p className="text-foreground/70 text-sm mb-1">Modalidade</p>
              <p className="text-foreground capitalize">
                {formData.modalidade}
              </p>
            </div>

            <div>
              <p className="text-foreground/70 text-sm mb-1">Duração</p>
              <p className="text-foreground">50 minutos</p>
            </div>
          </div>

          <hr className="my-4 border-border" />

          <h3 className="text-xl font-bold mb-4 text-foreground">Seus Dados</h3>

          <div className="grid grid-cols-1 gap-2">
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

            {formData.mensagem && (
              <div>
                <p className="text-foreground/70 text-sm mb-1">Mensagem</p>
                <p className="text-foreground">{formData.mensagem}</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-secondary rounded-lg">
          <p className="text-foreground text-sm">
            Ao confirmar este agendamento, você concorda com os{" "}
            <a href="#" className="underline">
              termos de serviço
            </a>{" "}
            e{" "}
            <a href="#" className="underline">
              política de cancelamento
            </a>
            . Uma notificação será enviada para seu e-mail e WhatsApp.
          </p>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={passoAnterior}>
            Voltar
          </Button>
          <Button onClick={enviarFormulario} disabled={carregando}>
            {carregando ? "Processando..." : "Confirmar Agendamento"}
          </Button>
        </div>
      </div>
    </ContactCard>
  );
}
