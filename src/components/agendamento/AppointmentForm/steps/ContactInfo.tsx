// components/scheduling/AppointmentForm/Steps/ContactInfo.tsx
import { Button } from "@/components/ui/button";
import { ContactCard } from "@/components/ui/cards/ServiceCard";

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
  [key: string]: any;
}

interface ContactInfoProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  proximoPasso: () => void;
  passoAnterior: () => void;
  carregando: boolean;
}

export default function ContactInfo({
  formData,
  updateFormData,
  proximoPasso,
  passoAnterior,
  carregando,
}: ContactInfoProps) {
  // Função para formatar telefone
  const formatarTelefone = (valor: string): string => {
    const apenasNumeros = valor.replace(/\D/g, "");

    if (apenasNumeros.length <= 2) {
      return apenasNumeros;
    }
    if (apenasNumeros.length <= 6) {
      return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
    }
    if (apenasNumeros.length <= 10) {
      return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(
        2,
        6
      )}-${apenasNumeros.slice(6)}`;
    }
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(
      2,
      7
    )}-${apenasNumeros.slice(7, 11)}`;
  };

  return (
    <ContactCard title="Seus Dados de Contato">
      <div className="space-y-6">
        <div>
          <label
            htmlFor="nome"
            className="block text-foreground font-medium mb-2"
          >
            Nome Completo
          </label>
          <input
            type="text"
            id="nome"
            className="w-full p-3 border border-border rounded-md bg-background text-foreground"
            placeholder="Seu nome completo"
            value={formData.nome}
            onChange={(e) => updateFormData({ nome: e.target.value })}
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-foreground font-medium mb-2"
          >
            E-mail
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-3 border border-border rounded-md bg-background text-foreground"
            placeholder="seu.email@exemplo.com"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            required
          />
        </div>

        <div>
          <label
            htmlFor="telefone"
            className="block text-foreground font-medium mb-2"
          >
            Telefone (WhatsApp)
          </label>
          <input
            type="tel"
            id="telefone"
            className="w-full p-3 border border-border rounded-md bg-background text-foreground"
            placeholder="(00) 00000-0000"
            value={formData.telefone}
            onChange={(e) =>
              updateFormData({ telefone: formatarTelefone(e.target.value) })
            }
            required
          />
        </div>

        <div>
          <label
            htmlFor="mensagem"
            className="block text-foreground font-medium mb-2"
          >
            Mensagem (Opcional)
          </label>
          <textarea
            id="mensagem"
            rows={4}
            className="w-full p-3 border border-border rounded-md bg-background text-foreground"
            placeholder="Se desejar, compartilhe brevemente o que te traz à consulta"
            value={formData.mensagem}
            onChange={(e) => updateFormData({ mensagem: e.target.value })}
          ></textarea>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={passoAnterior}>
            Voltar
          </Button>
          <Button
            onClick={proximoPasso}
            disabled={
              !formData.nome ||
              !formData.email ||
              !formData.telefone ||
              carregando
            }
          >
            Revisar e Confirmar
          </Button>
        </div>
      </div>
    </ContactCard>
  );
}
