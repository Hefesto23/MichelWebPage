// src/app/api/admin/stats/route.ts - API para estatísticas do dashboard
import { withAuth } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - Buscar estatísticas do dashboard
export const GET = withAuth(async (_req: NextRequest) => {
  try {
    console.log("📊 Buscando estatísticas do dashboard...");
    
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const currentWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 1. Total de agendamentos
    const totalAppointments = await prisma.appointment.count();
    console.log("📋 Total appointments:", totalAppointments);

    // 2. Agendamentos deste mês
    const monthlyAppointments = await prisma.appointment.count({
      where: {
        dataSelecionada: {
          gte: currentMonth
        }
      }
    });

    // 3. Agendamentos do mês anterior para comparação
    const previousMonthAppointments = await prisma.appointment.count({
      where: {
        dataSelecionada: {
          gte: previousMonth,
          lt: currentMonth
        }
      }
    });

    // 4. Agendamentos por status
    const appointmentsByStatus = await prisma.appointment.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });
    
    const statusCounts = appointmentsByStatus.reduce((acc, item) => {
      acc[item.status.toLowerCase()] = item._count.status;
      return acc;
    }, {} as Record<string, number>);

    // 5. Primeiras consultas
    const firstTimePatients = await prisma.appointment.count({
      where: {
        primeiraConsulta: true
      }
    });

    // 6. Agendamentos desta semana
    const weeklyAppointments = await prisma.appointment.count({
      where: {
        createdAt: {
          gte: currentWeek
        }
      }
    });

    // 7. Analytics de página (se existir)
    const pageViews = await prisma.analytics.count({
      where: {
        event: 'page_view',
        timestamp: {
          gte: currentMonth
        }
      }
    }).catch(() => 0); // Fallback se a tabela analytics não existir

    // 8. Uploads (se existir)
    const totalImages = await prisma.upload.count().catch(() => 0);

    // 9. Horários mais populares
    const popularTimes = await prisma.appointment.groupBy({
      by: ['horarioSelecionado'],
      _count: {
        horarioSelecionado: true
      },
      orderBy: {
        _count: {
          horarioSelecionado: 'desc'
        }
      },
      take: 5
    });

    // 10. Agendamentos por modalidade
    const modalityStats = await prisma.appointment.groupBy({
      by: ['modalidade'],
      _count: {
        modalidade: true
      }
    });

    // Calcular crescimento mensal
    const monthlyGrowth = previousMonthAppointments > 0 
      ? ((monthlyAppointments - previousMonthAppointments) / previousMonthAppointments * 100)
      : 0;

    // 11. Métricas de performance e analytics adicionais
    // Performance tracking variables (currently unused but available for future enhancements)
    
    // Taxa de conversão: agendamentos vs visualizações
    const conversionRate = pageViews > 0 ? ((totalAppointments / pageViews) * 100) : 0;
    
    // Taxa de cancelamento
    const cancellationRate = totalAppointments > 0 
      ? ((statusCounts.cancelado || 0) / totalAppointments * 100)
      : 0;
      
    // Taxa de comparecimento (realizados + confirmados vs total)
    const attendanceRate = totalAppointments > 0
      ? (((statusCounts.realizado || 0) + (statusCounts.confirmado || 0)) / totalAppointments * 100)
      : 0;
    
    // Média de agendamentos por dia (últimos 30 dias)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last30DaysAppointments = await prisma.appointment.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });
    const avgAppointmentsPerDay = last30DaysAppointments / 30;
    
    // Agendamentos por dia da semana
    const appointmentsByWeekday = await prisma.appointment.groupBy({
      by: ['dataSelecionada'],
      _count: { dataSelecionada: true }
    });
    
    const weekdayStats = appointmentsByWeekday.reduce((acc, item) => {
      const date = new Date(item.dataSelecionada);
      const weekday = date.getDay(); // 0=domingo, 1=segunda, etc
      const weekdayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      const weekdayName = weekdayNames[weekday];
      
      if (!acc[weekdayName]) acc[weekdayName] = 0;
      acc[weekdayName] += item._count.dataSelecionada;
      return acc;
    }, {} as Record<string, number>);
    
    // Crescimento semanal baseado em dados reais
    const previousWeek = new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
    const previousWeekAppointments = await prisma.appointment.count({
      where: {
        createdAt: {
          gte: previousWeek,
          lt: currentWeek
        }
      }
    });
    
    const weeklyGrowth = previousWeekAppointments > 0 
      ? ((weeklyAppointments - previousWeekAppointments) / previousWeekAppointments * 100)
      : weeklyAppointments > 0 ? 100 : 0;

    const stats = {
      totalAppointments,
      monthlyAppointments,
      pageViews: pageViews || Math.floor(totalAppointments * 8.5), // Estimativa baseada em appointments
      newPatients: firstTimePatients,
      pendingAppointments: statusCounts.agendado || 0,
      completedAppointments: statusCounts.realizado || 0,
      confirmedAppointments: statusCounts.confirmado || 0,
      cancelledAppointments: statusCounts.cancelado || 0,
      totalImages,
      weeklyGrowth,
      monthlyGrowth,
      // Métricas de performance
      conversionRate: Math.round(conversionRate * 100) / 100,
      cancellationRate: Math.round(cancellationRate * 100) / 100,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
      avgAppointmentsPerDay: Math.round(avgAppointmentsPerDay * 100) / 100,
      // Analytics por dia da semana
      weekdayStats,
      popularTimes: popularTimes.map(item => ({
        time: item.horarioSelecionado,
        count: item._count.horarioSelecionado,
        percentage: Math.round((item._count.horarioSelecionado / totalAppointments) * 100)
      })),
      modalityStats: modalityStats.map(item => ({
        type: item.modalidade,
        count: item._count.modalidade,
        percentage: Math.round((item._count.modalidade / totalAppointments) * 100)
      }))
    };

    console.log("📊 Estatísticas calculadas:", stats);

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error("❌ Erro ao buscar estatísticas:", error);
    return NextResponse.json({
      success: false,
      error: "Erro ao carregar estatísticas"
    }, { status: 500 });
  }
});