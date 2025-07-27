// components/pages/admin/AppointmentsManager.tsx
"use client";

import {
  AdminCard,
  Button,
  EmptyState,
  FilterBar,
  LoadingState,
  Modal,
  PageHeader,
  Pagination,
  StatusBadge,
} from "@/components/shared";
import {
  Appointment,
  AppointmentModality,
  AppointmentStatus,
} from "@/types/appointment";
import { formatDate, formatPhone } from "@/utils/formatters";
import { Calendar, Clock, Mail, MapPin, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";

interface AppointmentAction {
  appointment: Appointment;
  action: "confirm" | "cancel" | "complete" | "view";
}

export default function AppointmentsManager() {
  // Estados principais
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de filtros
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Estados de modal/ações
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [actionModal, setActionModal] = useState<AppointmentAction | null>(
    null
  );

  // Efeitos
  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [appointments, filterStatus, searchTerm, selectedDate]);

  // Buscar agendamentos
  const fetchAppointments = async () => {
    try {
      setError(null);

      // Em produção, fazer chamada à API real
      // const token = localStorage.getItem('token');
      // const response = await fetch('/api/admin/appointments', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // const data = await response.json();

      // Simulando dados para desenvolvimento
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockData: Appointment[] = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        nome: `Paciente ${i + 1}`,
        email: `paciente${i + 1}@example.com`,
        telefone: `(15) 9${Math.floor(Math.random() * 10000)}-${Math.floor(
          Math.random() * 10000
        )}`,
        dataSelecionada: new Date(Date.now() + (i % 14) * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        horarioSelecionado: `${Math.floor(Math.random() * 12) + 8}:00`,
        modalidade:
          Math.random() > 0.5
            ? ("presencial" as AppointmentModality)
            : ("online" as AppointmentModality),
        primeiraConsulta: Math.random() > 0.7,
        mensagem:
          Math.random() > 0.6
            ? "Preciso discutir sobre ansiedade e estresse no trabalho."
            : undefined,
        codigo: `AGD${Math.floor(Math.random() * 10000)}`,
        status: ["agendado", "confirmado", "cancelado", "realizado"][
          Math.floor(Math.random() * 4)
        ] as AppointmentStatus,
        createdAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      setAppointments(mockData);
      setFilteredAppointments(mockData);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
      setError("Erro ao carregar agendamentos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros
  const applyFilters = () => {
    let filtered = [...appointments];

    // Filtrar por status
    if (filterStatus !== "todos") {
      filtered = filtered.filter((apt) => apt.status === filterStatus);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.nome.toLowerCase().includes(term) ||
          apt.email.toLowerCase().includes(term) ||
          apt.codigo.toLowerCase().includes(term)
      );
    }

    // Filtrar por data
    if (selectedDate) {
      filtered = filtered.filter((apt) => apt.dataSelecionada === selectedDate);
    }

    // Ordenar por data (mais recentes primeiro)
    filtered.sort(
      (a, b) =>
        new Date(b.dataSelecionada).getTime() -
        new Date(a.dataSelecionada).getTime()
    );

    setFilteredAppointments(filtered);
    setCurrentPage(1); // Reset para primeira página quando filtros mudam
  };

  // Ações de agendamento
  const handleAppointmentAction = (
    appointment: Appointment,
    action: AppointmentAction["action"]
  ) => {
    setActionModal({ appointment, action });
  };

  const confirmAction = async () => {
    if (!actionModal) return;

    try {
      // Em produção, fazer chamada à API
      // const token = localStorage.getItem('token');
      // const response = await fetch(`/api/admin/appointments/${actionModal.appointment.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ status: newStatus })
      // });

      // Simular atualização
      const updatedAppointments = appointments.map((apt) => {
        if (apt.id === actionModal.appointment.id) {
          let newStatus: AppointmentStatus = apt.status;

          switch (actionModal.action) {
            case "confirm":
              newStatus = AppointmentStatus.CONFIRMED;
              break;
            case "cancel":
              newStatus = AppointmentStatus.CANCELLED;
              break;
            case "complete":
              newStatus = AppointmentStatus.COMPLETED;
              break;
          }

          return { ...apt, status: newStatus };
        }
        return apt;
      });

      setAppointments(updatedAppointments);
      setActionModal(null);
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      setError("Erro ao atualizar agendamento.");
    }
  };

  // Configuração dos filtros
  const filters = [
    {
      id: "status",
      label: "Status",
      type: "select" as const,
      value: filterStatus,
      onChange: setFilterStatus,
      options: [
        { value: "todos", label: "Todos os status" },
        { value: "agendado", label: "Agendado" },
        { value: "confirmado", label: "Confirmado" },
        { value: "cancelado", label: "Cancelado" },
        { value: "realizado", label: "Realizado" },
      ],
    },
    {
      id: "date",
      label: "Data da Consulta",
      type: "date" as const,
      value: selectedDate,
      onChange: setSelectedDate,
    },
    {
      id: "search",
      label: "Buscar",
      type: "search" as const,
      value: searchTerm,
      onChange: setSearchTerm,
      placeholder: "Nome, email ou código",
    },
  ];

  const clearFilters = () => {
    setFilterStatus("todos");
    setSearchTerm("");
    setSelectedDate("");
  };

  // Paginação
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAppointments = filteredAppointments.slice(startIndex, endIndex);

  // Renderização condicional para loading
  if (loading) {
    return (
      <div className="p-8">
        <PageHeader
          title="Agendamentos"
          description="Gerencie todas as consultas agendadas"
        />
        <LoadingState message="Carregando agendamentos..." fullScreen={false} />
      </div>
    );
  }

  // Renderização condicional para erro
  if (error && appointments.length === 0) {
    return (
      <div className="p-8">
        <PageHeader
          title="Agendamentos"
          description="Gerencie todas as consultas agendadas"
        />
        <AdminCard>
          <EmptyState
            title="Erro ao carregar agendamentos"
            description={error}
            action={{
              label: "Tentar Novamente",
              onClick: () => {
                setLoading(true);
                fetchAppointments();
              },
            }}
          />
        </AdminCard>
      </div>
    );
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Agendamentos"
        description="Gerencie todas as consultas agendadas"
      />

      {/* Filtros */}
      <AdminCard title="Filtros">
        <FilterBar filters={filters} onClear={clearFilters} />
      </AdminCard>

      {/* Lista de Agendamentos */}
      <div className="mt-8">
        <AdminCard title={`Consultas (${filteredAppointments.length})`}>
          {filteredAppointments.length > 0 ? (
            <div className="space-y-4">
              {currentAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onAction={handleAppointmentAction}
                />
              ))}

              {/* Paginação */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="Nenhum agendamento encontrado"
              description={
                filterStatus !== "todos" || searchTerm || selectedDate
                  ? "Tente ajustar os filtros para ver mais resultados."
                  : "Não há agendamentos cadastrados no sistema."
              }
            />
          )}
        </AdminCard>
      </div>

      {/* Modal de Detalhes */}
      {selectedAppointment && (
        <Modal
          isOpen={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          title="Detalhes do Agendamento"
          size="lg"
        >
          <AppointmentDetails
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
          />
        </Modal>
      )}

      {/* Modal de Confirmação de Ação */}
      {actionModal && (
        <Modal
          isOpen={!!actionModal}
          onClose={() => setActionModal(null)}
          title={getActionTitle(actionModal.action)}
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-foreground">
              {getActionMessage(
                actionModal.action,
                actionModal.appointment.nome
              )}
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setActionModal(null)}>
                Cancelar
              </Button>
              <Button
                variant={
                  actionModal.action === "cancel" ? "destructive" : "default"
                }
                onClick={confirmAction}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Componente de Card de Agendamento
interface AppointmentCardProps {
  appointment: Appointment;
  onAction: (
    appointment: Appointment,
    action: AppointmentAction["action"]
  ) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onAction,
}) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-foreground transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        {/* Informações do Paciente */}
        <div className="mb-4 md:mb-0">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2 text-foreground" />
            <h3 className="text-lg font-medium">{appointment.nome}</h3>

            <StatusBadge
              status={appointment.status}
              variant="appointment"
              className="ml-4"
            />

            {appointment.primeiraConsulta && (
              <div className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 rounded-full text-xs">
                Primeira Consulta
              </div>
            )}
          </div>

          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="w-4 h-4 mr-2" />
              {appointment.email}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="w-4 h-4 mr-2" />
              {formatPhone(appointment.telefone)}
            </div>
          </div>
        </div>

        {/* Detalhes do Agendamento */}
        <div className="flex flex-col items-end">
          <div className="flex items-center text-sm font-medium">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(appointment.dataSelecionada)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {appointment.horarioSelecionado} -{" "}
            {appointment.modalidade === "presencial" ? (
              <span className="inline-flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                Presencial
              </span>
            ) : (
              <span className="inline-flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Online
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Código: {appointment.codigo}
          </div>
        </div>
      </div>

      {/* Mensagem (se houver) */}
      {appointment.mensagem && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Mensagem:</span>{" "}
            {appointment.mensagem}
          </p>
        </div>
      )}

      {/* Botões de Ação */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAction(appointment, "view")}
        >
          Ver Detalhes
        </Button>

        {appointment.status === AppointmentStatus.SCHEDULED && (
          <Button
            size="sm"
            variant="default"
            onClick={() => onAction(appointment, "confirm")}
          >
            Confirmar
          </Button>
        )}

        {(appointment.status === AppointmentStatus.SCHEDULED ||
          appointment.status === AppointmentStatus.CONFIRMED) && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onAction(appointment, "cancel")}
          >
            Cancelar
          </Button>
        )}

        {appointment.status === AppointmentStatus.CONFIRMED && (
          <Button
            size="sm"
            variant="default"
            onClick={() => onAction(appointment, "complete")}
          >
            Marcar Realizada
          </Button>
        )}
      </div>
    </div>
  );
};

// Componente de Detalhes do Agendamento
interface AppointmentDetailsProps {
  appointment: Appointment;
  onClose: () => void;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  appointment,
  onClose,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-foreground mb-2">
            Informações do Paciente
          </h4>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="text-muted-foreground">Nome:</span>{" "}
              {appointment.nome}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">E-mail:</span>{" "}
              {appointment.email}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Telefone:</span>{" "}
              {formatPhone(appointment.telefone)}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Primeira Consulta:</span>{" "}
              {appointment.primeiraConsulta ? "Sim" : "Não"}
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-foreground mb-2">
            Detalhes da Consulta
          </h4>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="text-muted-foreground">Data:</span>{" "}
              {formatDate(appointment.dataSelecionada)}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Horário:</span>{" "}
              {appointment.horarioSelecionado}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Modalidade:</span>{" "}
              <span className="capitalize">{appointment.modalidade}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Status:</span>{" "}
              <StatusBadge status={appointment.status} variant="appointment" />
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Código:</span>{" "}
              {appointment.codigo}
            </p>
          </div>
        </div>
      </div>

      {appointment.mensagem && (
        <div>
          <h4 className="font-medium text-foreground mb-2">
            Mensagem do Paciente
          </h4>
          <p className="text-sm text-muted-foreground bg-gray-50 dark:bg-gray-900 p-3 rounded">
            {appointment.mensagem}
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={onClose}>Fechar</Button>
      </div>
    </div>
  );
};

// Funções auxiliares
function getActionTitle(action: AppointmentAction["action"]): string {
  switch (action) {
    case "confirm":
      return "Confirmar Agendamento";
    case "cancel":
      return "Cancelar Agendamento";
    case "complete":
      return "Marcar como Realizada";
    case "view":
      return "Detalhes do Agendamento";
    default:
      return "";
  }
}

function getActionMessage(
  action: AppointmentAction["action"],
  nome: string
): string {
  switch (action) {
    case "confirm":
      return `Tem certeza que deseja confirmar o agendamento de ${nome}?`;
    case "cancel":
      return `Tem certeza que deseja cancelar o agendamento de ${nome}? Esta ação não pode ser desfeita.`;
    case "complete":
      return `Tem certeza que deseja marcar a consulta de ${nome} como realizada?`;
    default:
      return "";
  }
}
