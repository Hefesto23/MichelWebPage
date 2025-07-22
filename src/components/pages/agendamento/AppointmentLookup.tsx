// components/scheduling/AppointmentLookup/index.tsx
import { ContactCard } from "@/components/shared/cards/BaseCard";
import { Button } from "@/components/ui/button";

interface FormData {
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

interface AppointmentLookupProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  setCarregando: (status: boolean) => void;
  setCancelar: (status: boolean) => void;
  handleError: (message: string) => void;
  carregando: boolean;
}

export default function AppointmentLookup({
  formData,
  updateFormData,
  setCarregando,
  setCancelar,
  handleError,
  carregando,
}: AppointmentLookupProps) {
  // Função para buscar agendamento
  const buscarAgendamento = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const response = await fetch("/api/calendario/buscar", {
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
        throw new Error(data.error || "Agendamento não encontrado");
      }

      const { agendamento } = data;

      // Preencher os dados do agendamento
      updateFormData({
        nome: agendamento.nome,
        email: agendamento.email,
        telefone: agendamento.telefone,
        dataSelecionada: agendamento.data,
        horarioSelecionado: agendamento.horario,
        modalidade: agendamento.modalidade,
        mensagem: agendamento.mensagem,
      });

      setCancelar(true);
    } catch (error) {
      console.error("Erro ao buscar agendamento:", error);
      handleError(
        (error as Error).message ||
          "Agendamento não encontrado ou código inválido"
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ContactCard title="Buscar Agendamento Existente">
      <form onSubmit={buscarAgendamento} className="space-y-6">
        <div>
          <label
            htmlFor="codigo"
            className="block text-foreground font-medium mb-2"
          >
            Código de Confirmação
          </label>
          <input
            type="text"
            id="codigo"
            className="w-full p-3 border border-border rounded-md bg-background text-foreground"
            placeholder="Digite o código recebido no e-mail de confirmação"
            value={formData.codigoConfirmacao}
            onChange={(e) =>
              updateFormData({ codigoConfirmacao: e.target.value })
            }
            required
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={carregando || !formData.codigoConfirmacao}
          >
            {carregando ? "Buscando..." : "Buscar Agendamento"}
          </Button>
        </div>
      </form>
    </ContactCard>
  );
}
