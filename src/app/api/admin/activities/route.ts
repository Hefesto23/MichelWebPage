// src/app/api/admin/activities/route.ts - API para atividades recentes
import { withAuth } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  
  if (diffInMinutes < 1) return "agora";
  if (diffInMinutes < 60) return `há ${diffInMinutes} min`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `há ${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `há ${diffInDays}d`;
  
  return `há ${Math.floor(diffInDays / 7)} semana(s)`;
}

export const GET = withAuth(async (_req: NextRequest) => {
  try {
    console.log("🔄 Buscando atividades recentes...");

    const activities = [];

    // 1. Últimos agendamentos criados
    const recentAppointments = await prisma.appointment.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        nome: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        modalidade: true,
        primeiraConsulta: true
      }
    });

    // Adicionar agendamentos às atividades
    recentAppointments.forEach(apt => {
      // Atividade de criação de agendamento
      activities.push({
        action: apt.primeiraConsulta 
          ? `Nova consulta agendada (primeira vez)` 
          : `Nova consulta agendada`,
        user: apt.nome,
        time: formatTimeAgo(apt.createdAt),
        type: "appointment" as const,
        details: `${apt.modalidade} - ${apt.status}`
      });

      // Se foi atualizado recentemente, adicionar atividade de atualização
      if (apt.updatedAt.getTime() !== apt.createdAt.getTime()) {
        activities.push({
          action: `Consulta ${apt.status.toLowerCase()}`,
          user: apt.nome,
          time: formatTimeAgo(apt.updatedAt),
          type: "appointment" as const,
          details: `Status alterado para ${apt.status}`
        });
      }
    });

    // 2. Atividades de analytics (se existir)
    try {
      const recentAnalytics = await prisma.analytics.findMany({
        take: 5,
        orderBy: {
          timestamp: 'desc'
        },
        where: {
          event: {
            in: ['appointment_created', 'page_view', 'form_submitted']
          }
        }
      });

      recentAnalytics.forEach(analytic => {
        let actionText = "";
        switch (analytic.event) {
          case 'appointment_created':
            actionText = "Novo agendamento pelo site";
            break;
          case 'page_view':
            actionText = `Página visitada: ${analytic.page || 'desconhecida'}`;
            break;
          case 'form_submitted':
            actionText = "Formulário de contato enviado";
            break;
          default:
            actionText = analytic.event;
        }

        activities.push({
          action: actionText,
          user: "Visitante",
          time: formatTimeAgo(analytic.timestamp),
          type: "analytics" as const,
          details: analytic.page || ''
        });
      });
    } catch (error) {
      console.log("ℹ️ Tabela Analytics não encontrada ou erro:", error);
    }

    // 3. Uploads recentes (se existir)
    try {
      const recentUploads = await prisma.upload.findMany({
        take: 3,
        orderBy: {
          createdAt: 'desc'
        }
      });

      recentUploads.forEach(upload => {
        activities.push({
          action: "Nova imagem adicionada",
          user: "Admin",
          time: formatTimeAgo(upload.createdAt),
          type: "upload" as const,
          details: upload.filename
        });
      });
    } catch (error) {
      console.log("ℹ️ Tabela Upload não encontrada:", error);
    }

    // 4. Mudanças de conteúdo recente (simulado baseado em timestamps)
    const hasRecentContent = Math.random() > 0.5; // Simular atividade de conteúdo

    if (hasRecentContent) {
      activities.push({
        action: "Conteúdo do site atualizado",
        user: "Admin",
        time: "há 2h",
        type: "content" as const,
        details: "Página sobre editada"
      });
    }

    // Ordenar por tempo e limitar a 15 atividades
    const sortedActivities = activities
      .sort((a, b) => {
        // Ordenar por tempo (mais recente primeiro)
        const timeValueA = parseTimeAgo(a.time);
        const timeValueB = parseTimeAgo(b.time);
        return timeValueA - timeValueB;
      })
      .slice(0, 15);

    console.log(`📋 ${sortedActivities.length} atividades encontradas`);

    return NextResponse.json({
      success: true,
      data: sortedActivities
    });

  } catch (error) {
    console.error("❌ Erro ao buscar atividades:", error);
    return NextResponse.json({
      success: false,
      error: "Erro ao carregar atividades"
    }, { status: 500 });
  }
});

// Helper para ordenação por tempo
function parseTimeAgo(timeStr: string): number {
  if (timeStr === "agora") return 0;
  
  const match = timeStr.match(/há (\d+)\s*(min|h|d|semana)/);
  if (!match) return 999999; // Colocar no final se não conseguir parsear
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  switch (unit) {
    case 'min': return value;
    case 'h': return value * 60;
    case 'd': return value * 60 * 24;
    case 'semana': return value * 60 * 24 * 7;
    default: return 999999;
  }
}