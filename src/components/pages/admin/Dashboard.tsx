// ============================================
// src/components/pages/admin/Dashboard.tsx
// ============================================
"use client";

import { AdminCard, StatsCard } from "@/components/shared/cards/BaseCard";
import { Calendar, FileText, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardStats {
  totalAppointments: number;
  monthlyAppointments: number;
  newPatients: number;
  totalImages: number;
}

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    monthlyAppointments: 0,
    newPatients: 0,
    totalImages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Visão geral do consultório e estatísticas importantes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total de Agendamentos"
          value={stats.totalAppointments}
          change="+12% este mês"
          changeType="positive"
          icon={Calendar}
        />

        <StatsCard
          title="Agendamentos Mensais"
          value={stats.monthlyAppointments}
          change="+8% vs mês anterior"
          changeType="positive"
          icon={TrendingUp}
        />

        <StatsCard
          title="Novos Pacientes"
          value={stats.newPatients}
          change="+15% este mês"
          changeType="positive"
          icon={Users}
        />

        <StatsCard
          title="Imagens no Sistema"
          value={stats.totalImages}
          change="Estável"
          changeType="neutral"
          icon={FileText}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard title="Atividades Recentes">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Novo agendamento</p>
                <p className="text-sm text-muted-foreground">
                  João Silva - 15/03/2024 às 14:00
                </p>
              </div>
              <span className="text-green-600 text-sm">Confirmado</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Cancelamento</p>
                <p className="text-sm text-muted-foreground">
                  Maria Santos - 14/03/2024 às 16:00
                </p>
              </div>
              <span className="text-red-600 text-sm">Cancelado</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Upload de imagem</p>
                <p className="text-sm text-muted-foreground">
                  consultorio-foto-3.jpg
                </p>
              </div>
              <span className="text-blue-600 text-sm">Novo</span>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Próximos Agendamentos">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Ana Costa</p>
                <p className="text-sm text-muted-foreground">
                  Hoje às 15:00 - Presencial
                </p>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                Confirmado
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Carlos Silva</p>
                <p className="text-sm text-muted-foreground">
                  Amanhã às 10:00 - Online
                </p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                Pendente
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Paula Oliveira</p>
                <p className="text-sm text-muted-foreground">
                  16/03 às 14:30 - Presencial
                </p>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                Confirmado
              </span>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
};
