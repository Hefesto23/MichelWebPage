// ============================================
// src/components/pages/admin/Dashboard.tsx
// ============================================
"use client";

import { AdminCard, StatsCard } from "@/components/shared/cards/BaseCard";
import { fetchWithAuth } from "@/lib/auth";
import {
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Image as ImageIcon,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardStats {
  totalAppointments: number;
  monthlyAppointments: number;
  pageViews: number;
  newPatients: number;
  pendingAppointments: number;
  completedAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
  totalImages: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
  // Métricas de performance
  conversionRate: number;
  cancellationRate: number;
  attendanceRate: number;
  avgAppointmentsPerDay: number;
  weekdayStats: Record<string, number>;
  popularTimes: Array<{
    time: string;
    count: number;
    percentage: number;
  }>;
  modalityStats: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
}

interface RecentActivity {
  action: string;
  user: string;
  time: string;
  type: "appointment" | "upload" | "content" | "analytics";
  details?: string;
}

// Componente removido - usando dados reais no dashboard

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    monthlyAppointments: 0,
    pageViews: 0,
    newPatients: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    confirmedAppointments: 0,
    cancelledAppointments: 0,
    totalImages: 0,
    weeklyGrowth: 0,
    monthlyGrowth: 0,
    // Métricas de performance
    conversionRate: 0,
    cancellationRate: 0,
    attendanceRate: 0,
    avgAppointmentsPerDay: 0,
    weekdayStats: {},
    popularTimes: [],
    modalityStats: [],
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("📊 Carregando dados do dashboard...");

      // Buscar estatísticas e atividades em paralelo
      const [statsResponse, activitiesResponse] = await Promise.all([
        fetchWithAuth("/api/admin/stats"),
        fetchWithAuth("/api/admin/activities")
      ]);

      if (!statsResponse.ok) {
        throw new Error("Erro ao carregar estatísticas");
      }

      if (!activitiesResponse.ok) {
        console.warn("Erro ao carregar atividades, usando fallback");
      }

      const statsData = await statsResponse.json();
      const activitiesData = activitiesResponse.ok ? await activitiesResponse.json() : { success: false };

      if (statsData.success) {
        setStats(statsData.data);
        console.log("📊 Estatísticas carregadas:", statsData.data);
      } else {
        throw new Error(statsData.error || "Erro ao carregar estatísticas");
      }

      if (activitiesData.success) {
        setRecentActivities(activitiesData.data);
        console.log("📋 Atividades carregadas:", activitiesData.data.length);
      } else {
        // Fallback para atividades se a API falhar
        setRecentActivities([
          {
            action: "Sistema iniciado",
            user: "Sistema",
            time: "há poucos minutos",
            type: "analytics",
            details: "Dashboard carregado com dados reais"
          }
        ]);
      }

    } catch (error) {
      console.error("❌ Erro ao carregar dados do dashboard:", error);
      setError("Erro ao carregar estatísticas. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <AdminCard title="Erro">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchDashboardData();
            }}
            className="mt-4 px-4 py-2 bg-primary-foreground text-white rounded-md hover:bg-primary-foreground/90"
          >
            Tentar Novamente
          </button>
        </AdminCard>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Visão geral do consultório e atividades recentes
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total de Consultas"
          value={stats.totalAppointments}
          change={`${stats.totalAppointments} consultas registradas`}
          changeType="positive"
          icon={Calendar}
        />

        <StatsCard
          title="Consultas Este Mês"
          value={stats.monthlyAppointments}
          change={`+${Math.round(stats.monthlyGrowth)}% em relação ao mês anterior`}
          changeType={stats.monthlyGrowth >= 0 ? "positive" : "negative"}
          icon={Clock}
        />

        <StatsCard
          title="Visualizações do Site"
          value={stats.pageViews.toLocaleString()}
          change={`+${Math.round(stats.weeklyGrowth)}% esta semana`}
          changeType="positive"
          icon={Eye}
        />

        <StatsCard
          title="Novos Pacientes"
          value={stats.newPatients}
          change="18% são primeiras consultas"
          changeType="neutral"
          icon={Users}
        />

        <StatsCard
          title="Consultas Pendentes"
          value={stats.pendingAppointments}
          change="Para os próximos 7 dias"
          changeType="neutral"
          icon={TrendingUp}
        />

        <StatsCard
          title="Consultas Realizadas"
          value={stats.completedAppointments}
          change="94% taxa de comparecimento"
          changeType="positive"
          icon={CheckCircle}
        />

        <StatsCard
          title="Imagens no Sistema"
          value={stats.totalImages}
          change={`${stats.totalImages} imagens no sistema`}
          changeType="positive"
          icon={ImageIcon}
        />

        <StatsCard
          title="Taxa de Conversão"
          value={`${stats.pageViews > 0 ? ((stats.newPatients / stats.pageViews) * 100).toFixed(1) : '0.0'}%`}
          change="Visitantes para pacientes"
          changeType="neutral"
          icon={TrendingUp}
        />
      </div>

      {/* Gráficos e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AdminCard title="Agendamentos por Dia da Semana">
          <div className="space-y-3">
            {Object.entries(stats.weekdayStats).length > 0 ? (
              Object.entries(stats.weekdayStats)
                .sort(([,a], [,b]) => b - a)
                .map(([day, count]) => {
                  const maxCount = Math.max(...Object.values(stats.weekdayStats));
                  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  return (
                    <div key={day} className="flex items-center space-x-4">
                      <span className="w-20 text-sm font-medium">{day}</span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">
                        {count}
                      </span>
                    </div>
                  );
                })
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Nenhum dado encontrado
              </div>
            )}
          </div>
        </AdminCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard title="Métricas de Performance">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-foreground">
                {stats.conversionRate.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Taxa de Conversão
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.attendanceRate.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Taxa de Comparecimento
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.cancellationRate.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Taxa de Cancelamento
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.avgAppointmentsPerDay.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                Média/Dia (últ. 30d)
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Consultas por Modalidade">
          <div className="space-y-4">
            {stats.modalityStats.length > 0 ? (
              stats.modalityStats.map((modality) => (
                <div key={modality.type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-primary-foreground rounded-full"></div>
                    <span className="text-sm font-medium capitalize">
                      {modality.type === "presencial" ? "Presencial" : "Online"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">{modality.count}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({modality.percentage}%)
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Nenhuma modalidade encontrada
              </div>
            )}
          </div>
        </AdminCard>

        <AdminCard title="Horários Mais Procurados">
          <div className="space-y-4">
            {stats.popularTimes.length > 0 ? (
              stats.popularTimes.map((slot) => (
                <div key={slot.time} className="flex items-center space-x-4">
                  <span className="w-16 text-sm font-medium">{slot.time}</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-foreground h-2 rounded-full"
                      style={{ width: `${slot.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {slot.count}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Nenhum horário encontrado
              </div>
            )}
          </div>
        </AdminCard>

        <AdminCard title="Atividades Recentes">
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
};
