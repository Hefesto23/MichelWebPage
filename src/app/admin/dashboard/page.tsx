// src/app/admin/dashboard/page.tsx

"use client";

import { AdminCard } from "@/components/admin/AdminCard";
import { StatsCard } from "@/components/admin/StatsCard";
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
  totalImages: number;
  weeklyGrowth: number;
}

interface RecentActivity {
  action: string;
  user: string;
  time: string;
  type: "appointment" | "upload" | "content" | "analytics";
}

// Componente simples de gráfico (você pode substituir por Recharts)
const SimpleChart = ({ title, data }: { title: string; data: any[] }) => {
  return (
    <div className="h-64 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground text-lg font-medium">{title}</p>
        <p className="text-sm text-muted-foreground mt-2">
          {data.length} registros encontrados
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          (Integração com Recharts recomendada)
        </p>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    monthlyAppointments: 0,
    pageViews: 0,
    newPatients: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    totalImages: 0,
    weeklyGrowth: 0,
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
      // const token = localStorage.getItem("token");

      // Em um ambiente real, você deve fazer chamadas para API
      // Exemplo: const response = await fetch('/api/admin/stats', {...});

      // Simular dados
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStats({
        totalAppointments: 147,
        monthlyAppointments: 23,
        pageViews: 1234,
        newPatients: 45,
        pendingAppointments: 8,
        completedAppointments: 139,
        totalImages: 67,
        weeklyGrowth: 12.5,
      });

      setRecentActivities([
        {
          action: "Nova consulta agendada",
          user: "Maria Silva",
          time: "há 2 min",
          type: "appointment",
        },
        {
          action: "Imagem de perfil atualizada",
          user: "Admin",
          time: "há 15 min",
          type: "upload",
        },
        {
          action: "Consulta confirmada",
          user: "João Santos",
          time: "há 30 min",
          type: "appointment",
        },
        {
          action: "Conteúdo da página sobre editado",
          user: "Admin",
          time: "há 1 hora",
          type: "content",
        },
        {
          action: "Nova avaliação recebida",
          user: "Ana Costa",
          time: "há 2 horas",
          type: "analytics",
        },
      ]);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
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
          change="+12% em relação ao mês anterior"
          changeType="positive"
          icon={Calendar}
        />

        <StatsCard
          title="Consultas Este Mês"
          value={stats.monthlyAppointments}
          change="+5 novas esta semana"
          changeType="positive"
          icon={Clock}
        />

        <StatsCard
          title="Visualizações do Site"
          value={stats.pageViews.toLocaleString()}
          change={`+${stats.weeklyGrowth}% esta semana`}
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
          change="3 adicionadas esta semana"
          changeType="positive"
          icon={ImageIcon}
        />

        <StatsCard
          title="Taxa de Conversão"
          value={`${((stats.newPatients / stats.pageViews) * 100).toFixed(1)}%`}
          change="Visitantes para pacientes"
          changeType="neutral"
          icon={TrendingUp}
        />
      </div>

      {/* Gráficos e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard title="Agendamentos por Mês">
          <SimpleChart title="Evolução de Agendamentos" data={[]} />
        </AdminCard>

        <AdminCard title="Consultas por Modalidade">
          <SimpleChart title="Presencial vs. Online" data={[]} />
        </AdminCard>

        <AdminCard title="Horários Mais Procurados">
          <div className="space-y-4">
            {[
              { time: "14:00", count: 23, percentage: 85 },
              { time: "15:00", count: 21, percentage: 78 },
              { time: "16:00", count: 19, percentage: 70 },
              { time: "10:00", count: 17, percentage: 63 },
              { time: "09:00", count: 15, percentage: 56 },
            ].map((slot) => (
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
            ))}
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
}
