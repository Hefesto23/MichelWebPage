// src/app/admin/appointments/page.tsx

"use client";

import { AdminCard } from "@/components/admin/AdminCard";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertTriangle,
  Calendar,
  Check,
  Clock,
  Mail,
  Phone,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Appointment {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  dataSelecionada: string;
  horarioSelecionado: string;
  modalidade: string;
  primeiraConsulta: boolean;
  mensagem?: string;
  codigo: string;
  status: "agendado" | "confirmado" | "cancelado" | "realizado";
  createdAt: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [appointments, filterStatus, searchTerm, selectedDate]);

  const fetchAppointments = async () => {
    try {
      // Em produção, fazer chamada à API real
      // const token = localStorage.getItem('token');
      // const response = await fetch('/api/admin/appointments', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // const data = await response.json();

      // Dados simulados para desenvolvimento
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
        modalidade: Math.random() > 0.5 ? "presencial" : "online",
        primeiraConsulta: Math.random() > 0.7,
        mensagem:
          Math.random() > 0.6
            ? "Preciso discutir sobre ansiedade e estresse no trabalho."
            : undefined,
        codigo: `AGD${Math.floor(Math.random() * 10000)}`,
        status: ["agendado", "confirmado", "cancelado", "realizado"][
          Math.floor(Math.random() * 4)
        ] as "agendado" | "confirmado" | "cancelado" | "realizado",
        createdAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      }));

      setAppointments(mockData);
      setFilteredAppointments(mockData);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

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
    setCurrentPage(1); // Reset to first page when filters change
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", {
      locale: ptBR,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "agendado":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "confirmado":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cancelado":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "realizado":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "agendado":
        return <Clock className="w-4 h-4" />;
      case "confirmado":
        return <Check className="w-4 h-4" />;
      case "cancelado":
        return <X className="w-4 h-4" />;
      case "realizado":
        return <Check className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAppointments = filteredAppointments.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Agendamentos</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie todas as consultas agendadas
        </p>
      </div>

      {/* Filters */}
      <AdminCard title="Filtros">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="todos">Todos os status</option>
              <option value="agendado">Agendado</option>
              <option value="confirmado">Confirmado</option>
              <option value="cancelado">Cancelado</option>
              <option value="realizado">Realizado</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Data da Consulta
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            />
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Nome, email ou código"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="mt-4 text-right">
          <button
            onClick={() => {
              setFilterStatus("todos");
              setSearchTerm("");
              setSelectedDate("");
            }}
            className="text-sm text-primary-foreground hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      </AdminCard>

      {/* Appointments List */}
      <div className="mt-8">
        <AdminCard title={`Consultas (${filteredAppointments.length})`}>
          {filteredAppointments.length > 0 ? (
            <div className="space-y-4">
              {currentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-foreground transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    {/* Patient Info */}
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center">
                        <User className="w-5 h-5 mr-2 text-foreground" />
                        <h3 className="text-lg font-medium">
                          {appointment.nome}
                        </h3>

                        {/* Status Badge */}
                        <div
                          className={`ml-4 px-3 py-1 rounded-full flex items-center text-xs font-medium ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1 capitalize">
                            {appointment.status}
                          </span>
                        </div>

                        {/* First Appointment Badge */}
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
                          {appointment.telefone}
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-center text-sm font-medium">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(appointment.dataSelecionada)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {appointment.horarioSelecionado} -{" "}
                        {appointment.modalidade === "presencial"
                          ? "Presencial"
                          : "Online"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Código: {appointment.codigo}
                      </div>
                    </div>
                  </div>

                  {/* Message (if any) */}
                  {appointment.mensagem && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Mensagem:</span>{" "}
                        {appointment.mensagem}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
                    <button className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800">
                      Ver Detalhes
                    </button>

                    {appointment.status === "agendado" && (
                      <button className="px-3 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-800">
                        Confirmar
                      </button>
                    )}

                    {(appointment.status === "agendado" ||
                      appointment.status === "confirmado") && (
                      <button className="px-3 py-1 text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800">
                        Cancelar
                      </button>
                    )}

                    {appointment.status === "confirmado" && (
                      <button className="px-3 py-1 text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-md hover:bg-purple-200 dark:hover:bg-purple-800">
                        Marcar Realizada
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                  >
                    Anterior
                  </button>

                  <span className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-16 text-center">
              <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-muted-foreground">
                {filterStatus !== "todos" || searchTerm || selectedDate
                  ? "Tente ajustar os filtros para ver mais resultados."
                  : "Não há agendamentos cadastrados no sistema."}
              </p>
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
