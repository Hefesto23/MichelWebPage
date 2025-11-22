// components/scheduling/AppointmentLookup/index.tsx
import { ContactCard } from "@/components/shared/cards/BaseCard";
import { LoadingSpinner } from "@/components/shared/ui/LoadingSpinner";
import { AppointmentFormData } from "@/types/appointment"; // ✅ ÚNICO TIPO ADICIONADO
import formStyles from "./form.module.css";

interface AppointmentLookupProps {
  formData: AppointmentFormData; // ✅ USANDO TIPO CENTRALIZADO
  updateFormData: (data: Partial<AppointmentFormData>) => void;
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
  // Função para buscar agendamento - ✅ MANTIDA EXATAMENTE ORIGINAL
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
        endereco: agendamento.endereco || "", // ✅ ADICIONADO
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
            className="block text-foreground font-medium mb-2 text-sm sm:text-base md:text-lg"
          >
            Código de Confirmação
          </label>
          <input
            type="text"
            id="codigo"
            className="w-full p-3 border border-border rounded-md bg-background text-foreground text-sm sm:text-base md:text-lg"
            placeholder="Digite o código recebido no e-mail de confirmação"
            value={formData.codigoConfirmacao}
            onChange={(e) =>
              updateFormData({ codigoConfirmacao: e.target.value })
            }
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={carregando || !formData.codigoConfirmacao}
            className={`${formStyles.primaryButton} flex items-center gap-2 ${
              carregando || !formData.codigoConfirmacao
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {carregando && <LoadingSpinner size="sm" />}
            {carregando ? "Buscando..." : "Buscar Agendamento"}
          </button>
        </div>
      </form>
    </ContactCard>
  );
}
