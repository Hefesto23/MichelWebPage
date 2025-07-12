// src/app/admin/analytics/page.tsx

"use client";

import { AdminCard } from "@/components/admin/AdminCard";
import {
  BarChart2,
  Clock,
  Download,
  Eye,
  LineChart,
  PieChart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

// Types para dados de analytics
interface OverviewStats {
  totalViews: number;
  weeklyViews: number;
  monthlyViews: number;
  uniqueVisitors: number;
  averageVisitDuration: string;
  bounceRate: string;
  conversionRate: string;
}

interface PageViewData {
  path: string;
  title: string;
  views: number;
  uniqueVisitors: number;
  averageTime: string;
  bounceRate: string;
}

interface TimeSeriesData {
  date: string;
  views: number;
  visitors: number;
}

interface DeviceData {
  type: string;
  count: number;
  percentage: number;
}

interface SourceData {
  source: string;
  visits: number;
  percentage: number;
}

interface AnalyticsData {
  overview: OverviewStats;
  topPages: PageViewData[];
  timeData: TimeSeriesData[];
  deviceData: DeviceData[];
  sourceData: SourceData[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">(
    "30d"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setError(null);

      // Em produção, fazer chamada à API real
      // const token = localStorage.getItem('token');
      // const response = await fetch(`/api/admin/analytics?range=${dateRange}`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // const data = await response.json();

      // Simulando carregamento
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Dados simulados
      const mockData: AnalyticsData = {
        overview: {
          totalViews: 12458,
          weeklyViews: 2347,
          monthlyViews: 8956,
          uniqueVisitors: 3245,
          averageVisitDuration: "2m 34s",
          bounceRate: "42%",
          conversionRate: "3.8%",
        },
        topPages: [
          {
            path: "/",
            title: "Página Inicial",
            views: 5234,
            uniqueVisitors: 1823,
            averageTime: "1m 47s",
            bounceRate: "38%",
          },
          {
            path: "/about",
            title: "Sobre Mim",
            views: 2812,
            uniqueVisitors: 1256,
            averageTime: "2m 23s",
            bounceRate: "29%",
          },
          {
            path: "/services",
            title: "Terapias",
            views: 2378,
            uniqueVisitors: 987,
            averageTime: "3m 12s",
            bounceRate: "25%",
          },
          {
            path: "/agendamento",
            title: "Agendamento",
            views: 1856,
            uniqueVisitors: 854,
            averageTime: "4m56s",
            bounceRate: "19%",
          },
          {
            path: "/contact",
            title: "Contato",
            views: 923,
            uniqueVisitors: 782,
            averageTime: "1m 18s",
            bounceRate: "45%",
          },
        ],
        timeData: Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          const dateString = date.toISOString().split("T")[0];

          // Create some patterns in the data
          const baseViews = 300 + Math.sin(i / 3) * 150;
          const weekdayFactor = [0.8, 1.1, 1.2, 1.3, 1.4, 0.9, 0.7][
            date.getDay()
          ]; // Weekend drop

          const views = Math.round(
            baseViews * weekdayFactor * (0.9 + Math.random() * 0.2)
          );
          const visitors = Math.round(views * (0.3 + Math.random() * 0.15));

          return { date: dateString, views, visitors };
        }),
        deviceData: [
          { type: "Mobile", count: 6843, percentage: 54.9 },
          { type: "Desktop", count: 4728, percentage: 37.9 },
          { type: "Tablet", count: 887, percentage: 7.2 },
        ],
        sourceData: [
          { source: "Google", visits: 5837, percentage: 46.9 },
          { source: "Direto", visits: 2948, percentage: 23.7 },
          { source: "Instagram", visits: 1876, percentage: 15.1 },
          { source: "Facebook", visits: 892, percentage: 7.2 },
          { source: "Outros", visits: 905, percentage: 7.1 },
        ],
      };

      setData(mockData);
    } catch (error) {
      console.error("Erro ao carregar dados de analytics:", error);
      setError("Erro ao carregar estatísticas. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    if (!data) return;

    // Criar CSV
    const rows = [
      ["Data", "Visualizações", "Visitantes"],
      ...data.timeData.map((item) => [
        item.date,
        item.views.toString(),
        item.visitors.toString(),
      ]),
    ];

    const csvContent = rows.map((row) => row.join(",")).join("\n");

    // Criar arquivo para download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `analytics_${dateRange}_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simple bar chart component (in a real app, use a library like Recharts)
  const SimpleBarChart = ({
    data,
    dataKey,
    nameKey,
  }: {
    data: any[];
    dataKey: string;
    nameKey: string;
  }) => {
    const max = Math.max(...data.map((item) => item[dataKey]));

    return (
      <div className="space-y-3 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="w-28 text-sm truncate">{item[nameKey]}</span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
              <div
                className="h-full bg-primary-foreground rounded-full flex items-center justify-end px-2"
                style={{ width: `${(item[dataKey] / max) * 100}%` }}
              >
                <span className="text-xs text-white font-medium">
                  {item[dataKey]} ({item.percentage}%)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Simple line chart (in a real app, use a library like Recharts)
  const SimpleLineChart = ({ data }: { data: TimeSeriesData[] }) => {
    const maxViews = Math.max(...data.map((item) => item.views));
    const maxVisitors = Math.max(...data.map((item) => item.visitors));
    const chartHeight = 200;

    return (
      <div className="relative h-64 mt-4">
        <div className="absolute left-0 top-0 w-10 h-full flex flex-col justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>{Math.round(maxViews / 2)}</span>
          <span>{maxViews}</span>
        </div>

        <div className="absolute left-10 right-0 top-0 bottom-0">
          {/* Horizontal Grid Lines */}
          <div className="absolute w-full h-px bg-gray-200 dark:bg-gray-700 top-0"></div>
          <div className="absolute w-full h-px bg-gray-200 dark:bg-gray-700 top-1/2"></div>
          <div className="absolute w-full h-px bg-gray-200 dark:bg-gray-700 bottom-0"></div>

          {/* Data Points */}
          <svg
            className="w-full h-full"
            viewBox={`0 0 ${data.length} ${chartHeight}`}
          >
            {/* Line for Views */}
            <polyline
              points={data
                .map(
                  (item, index) =>
                    `${index},${
                      chartHeight - (item.views / maxViews) * chartHeight
                    }`
                )
                .join(" ")}
              fill="none"
              stroke="#FFBF9E"
              strokeWidth="2"
            />

            {/* Line for Visitors */}
            <polyline
              points={data
                .map(
                  (item, index) =>
                    `${index},${
                      chartHeight - (item.visitors / maxVisitors) * chartHeight
                    }`
                )
                .join(" ")}
              fill="none"
              stroke="#2E5597"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Legend */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-primary-foreground mr-1"></div>
            <span className="text-xs">Visualizações</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-foreground mr-1"></div>
            <span className="text-xs">Visitantes</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Estatísticas</h1>
        </div>

        <AdminCard title="Erro">
          <div className="py-8 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => {
                setLoading(true);
                fetchAnalyticsData();
              }}
              className="px-4 py-2 bg-primary-foreground text-white rounded-md"
            >
              Tentar Novamente
            </button>
          </div>
        </AdminCard>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Estatísticas</h1>
        </div>

        <AdminCard title="Sem Dados">
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Nenhum dado disponível.</p>
          </div>
        </AdminCard>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Estatísticas</h1>
          <p className="text-muted-foreground mt-2">
            Análise de tráfego e comportamento dos visitantes
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Date Range Selector */}
          <div>
            <select
              value={dateRange}
              onChange={(e) =>
                setDateRange(e.target.value as "7d" | "30d" | "90d" | "all")
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="all">Todo o período</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={exportData}
            className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AdminCard title="">
          <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-lg mr-4">
              <Eye className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total de Visualizações
              </p>
              <p className="text-2xl font-bold">
                {data.overview.totalViews.toLocaleString()}
              </p>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="">
          <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-lg mr-4">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Visitantes Únicos</p>
              <p className="text-2xl font-bold">
                {data.overview.uniqueVisitors.toLocaleString()}
              </p>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="">
          <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-lg mr-4">
              <Clock className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Tempo Médio na Página
              </p>
              <p className="text-2xl font-bold">
                {data.overview.averageVisitDuration}
              </p>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="">
          <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-lg mr-4">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
              <p className="text-2xl font-bold">
                {data.overview.conversionRate}
              </p>
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Charts and Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Visitors Over Time */}
        <AdminCard title="Visitantes ao Longo do Tempo">
          <SimpleLineChart data={data.timeData} />
        </AdminCard>

        {/* Device Distribution */}
        <AdminCard title="Distribuição por Dispositivo">
          <div className="flex items-center justify-around mb-6">
            {data.deviceData.map((device, index) => (
              <div key={index} className="text-center">
                <div className="p-3 bg-primary/10 rounded-full inline-flex items-center justify-center mb-2">
                  {device.type === "Mobile" && (
                    <svg
                      className="w-6 h-6 text-primary-foreground"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12" y2="18" />
                    </svg>
                  )}
                  {device.type === "Desktop" && (
                    <svg
                      className="w-6 h-6 text-primary-foreground"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  )}
                  {device.type === "Tablet" && (
                    <svg
                      className="w-6 h-6 text-primary-foreground"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12" y2="18" />
                    </svg>
                  )}
                </div>
                <p className="text-sm font-medium">{device.type}</p>
                <p className="text-lg font-bold">{device.percentage}%</p>
                <p className="text-xs text-muted-foreground">
                  {device.count.toLocaleString()} visitas
                </p>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <AdminCard title="Páginas Mais Visitadas">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 font-medium">Página</th>
                  <th className="text-right p-3 font-medium">Visualizações</th>
                  <th className="text-right p-3 font-medium hidden md:table-cell">
                    Tempo Médio
                  </th>
                  <th className="text-right p-3 font-medium hidden md:table-cell">
                    Taxa de Saída
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.topPages.map((page, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{page.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {page.path}
                        </p>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      {page.views.toLocaleString()}
                      <p className="text-xs text-muted-foreground">
                        {Math.round(
                          (page.views / data.overview.totalViews) * 100
                        )}
                        %
                      </p>
                    </td>
                    <td className="p-3 text-right hidden md:table-cell">
                      {page.averageTime}
                    </td>
                    <td className="p-3 text-right hidden md:table-cell">
                      {page.bounceRate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>

        {/* Traffic Sources */}
        <AdminCard title="Fontes de Tráfego">
          <SimpleBarChart
            data={data.sourceData}
            dataKey="visits"
            nameKey="source"
          />
        </AdminCard>
      </div>

      {/* Additional Info Section */}
      <div className="mt-8">
        <AdminCard title="Relatórios Avançados">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center mb-3">
                <BarChart2 className="w-5 h-5 text-primary-foreground mr-2" />
                <h3 className="font-medium">Análise de Comportamento</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Entenda como os visitantes interagem com seu site, quais páginas
                geram mais interesse e onde ocorrem abandonos.
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center mb-3">
                <LineChart className="w-5 h-5 text-primary-foreground mr-2" />
                <h3 className="font-medium">Tendências de Tráfego</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Visualize padrões de crescimento e sazonalidade para otimizar
                suas campanhas de marketing.
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center mb-3">
                <PieChart className="w-5 h-5 text-primary-foreground mr-2" />
                <h3 className="font-medium">Conversões por Origem</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Analise quais fontes de tráfego geram mais agendamentos e qual é
                o retorno sobre investimento.
              </p>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
