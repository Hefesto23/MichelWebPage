// src/components/pages/admin/Appointments.tsx
"use client";

import { AdminCard } from "@/components/shared/cards/BaseCard";
import { fetchWithAuth } from "@/lib/auth";
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
import { useEffect, useState, useCallback } from "react";

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

export const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    // Inicializar com mês atual (YYYY-MM)
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [updating, setUpdating] = useState<number | null>(null);
  const itemsPerPage = 10;

  const applyFilters = useCallback(() => {
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

    // Filtrar por data específica
    if (selectedDate) {
      filtered = filtered.filter((apt) => apt.dataSelecionada === selectedDate);
    }
    // Filtrar por mês quando não há data específica selecionada
    else if (selectedMonth) {
      filtered = filtered.filter((apt) => {
        // Extrair ano-mês diretamente da string da data (formato YYYY-MM-DD)
        const appointmentMonth = apt.dataSelecionada.substring(0, 7); // "2024-08"
        console.log(`🔍 Filtro mês - Appointment: ${apt.nome}, Data: ${apt.dataSelecionada}, Mês extraído: ${appointmentMonth}, Filtro: ${selectedMonth}`);
        return appointmentMonth === selectedMonth;
      });
    }

    // Ordenar por data (mais recentes primeiro)
    filtered.sort(
      (a, b) =>
        new Date(b.dataSelecionada).getTime() -
        new Date(a.dataSelecionada).getTime()
    );

    setFilteredAppointments(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [appointments, filterStatus, searchTerm, selectedDate, selectedMonth]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [appointments, filterStatus, searchTerm, selectedDate, selectedMonth, applyFilters]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log("🔄 Iniciando busca de appointments...");
      
      const response = await fetchWithAuth("/api/admin/appointments");
      console.log("📡 Response status:", response.status);
      
      if (!response.ok) {
        console.error("❌ Response não OK:", response.status, response.statusText);
        throw new Error("Erro ao buscar agendamentos");
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log("📥 Dados recebidos da API:", data.data.length, "appointments");
        console.log("📥 Primeiros 3 appointments:", data.data.slice(0, 3));
        
        // Os dados já vêm formatados da API
        const formattedAppointments: Appointment[] = data.data;
        
        console.log("🔄 Appointments formatados:", formattedAppointments.slice(0, 3));
        
        setAppointments(formattedAppointments);
      } else {
        throw new Error(data.message || "Erro ao carregar agendamentos");
      }
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
      // Em caso de erro, manter lista vazia
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: number, status: string) => {
    try {
      setUpdating(id);
      
      const response = await fetchWithAuth("/api/admin/appointments", {
        method: "PUT",
        body: JSON.stringify({ id, status }),
      });
      
      if (!response.ok) {
        throw new Error("Erro ao atualizar agendamento");
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Atualizar o appointment na lista local
        setAppointments(prev => 
          prev.map(apt => 
            apt.id === id 
              ? { 
                  ...apt, 
                  status: status as "agendado" | "confirmado" | "cancelado" | "realizado"
                }
              : apt
          )
        );
      } else {
        throw new Error(data.message || "Erro ao atualizar agendamento");
      }
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      alert("Erro ao atualizar agendamento. Tente novamente.");
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString: string) => {
    // Usar a data diretamente sem conversões de timezone para evitar problemas
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // Month é 0-indexed em JS
    return format(date, "dd 'de' MMMM 'de' yyyy", {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* Month Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Mês/Ano
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setSelectedDate(""); // Limpar data específica quando mudar mês
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            />
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Data Específica
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              placeholder="Opcional - sobrepõe o filtro de mês"
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
              // Resetar para mês atual ao limpar filtros
              const now = new Date();
              setSelectedMonth(`${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`);
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
          <div className="mb-4">
            {selectedMonth && !selectedDate && (
              <span className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-md">
                Filtro: {(() => {
                  const [year, month] = selectedMonth.split('-').map(Number);
                  const date = new Date(year, month - 1, 15); // 15º dia do mês para evitar problemas de timezone
                  return format(date, "MMMM 'de' yyyy", { locale: ptBR });
                })()}
              </span>
            )}
            {selectedDate && (
              <span className="text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-md">
                Filtro: {formatDate(selectedDate)}
              </span>
            )}
          </div>
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
                    {appointment.status === "agendado" && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, "confirmado")}
                        disabled={updating === appointment.id}
                        className="px-3 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updating === appointment.id ? "Atualizando..." : "Confirmar"}
                      </button>
                    )}

                    {(appointment.status === "agendado" ||
                      appointment.status === "confirmado") && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, "cancelado")}
                        disabled={updating === appointment.id}
                        className="px-3 py-1 text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updating === appointment.id ? "Atualizando..." : "Cancelar"}
                      </button>
                    )}

                    {appointment.status === "confirmado" && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, "realizado")}
                        disabled={updating === appointment.id}
                        className="px-3 py-1 text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-md hover:bg-purple-200 dark:hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updating === appointment.id ? "Atualizando..." : "Marcar Realizada"}
                      </button>
                    )}

                    {appointment.status === "agendado" && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, "realizado")}
                        disabled={updating === appointment.id}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updating === appointment.id ? "Atualizando..." : "Finalizar Direto"}
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
};
