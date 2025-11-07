// src/lib/audit.ts - Sistema de Auditoria
import prisma from "@/lib/prisma";

// ============================================
// 🏗️ TIPOS
// ============================================
export interface AuditEvent {
  event: string;
  adminId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

// ============================================
// 📊 FUNÇÕES DE AUDITORIA
// ============================================
export const logAuthEvent = async (
  event: "LOGIN_SUCCESS" | "LOGIN_FAILED" | "LOGOUT" | "TOKEN_EXPIRED",
  data: {
    adminId?: string;
    email?: string;
    ipAddress?: string;
    userAgent?: string;
    error?: string;
  }
) => {
  try {
    await prisma.analytics.create({
      data: {
        event: `AUTH_${event}`,
        metadata: {
          adminId: data.adminId,
          email: data.email,
          error: data.error,
        },
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
    
    console.log(`[AUDIT] ${event}:`, {
      adminId: data.adminId,
      email: data.email,
      ip: data.ipAddress?.substring(0, 10) + "...", // Log parcial do IP por privacidade
    });
  } catch (error) {
    console.error("Erro ao registrar evento de auditoria:", error);
  }
};

export const logAdminAction = async (
  action: string,
  adminId: string,
  metadata?: Record<string, unknown>
) => {
  try {
    await prisma.analytics.create({
      data: {
        event: `ADMIN_${action}`,
        metadata: {
          adminId,
          ...metadata,
        },
      },
    });
  } catch (error) {
    console.error("Erro ao registrar ação de admin:", error);
  }
};

// ============================================
// 🔍 HELPERS PARA EXTRAÇÃO DE DADOS
// ============================================
export const extractClientInfo = (request: Request) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ipAddress = forwardedFor?.split(",")[0] || realIp || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  
  return { ipAddress, userAgent };
};