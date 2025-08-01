// ============================================
// 📁 src/lib/api-helpers.ts - HELPERS PARA APIs
// ============================================
import { validateAuthHeader } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export interface AuthenticatedHandler {
  (req: NextRequest, userId: string): Promise<Response>;
}

// Wrapper para APIs que precisam de autenticação
export function withAuth(handler: AuthenticatedHandler) {
  return async (req: NextRequest): Promise<Response> => {
    try {
      const authHeader = req.headers.get("authorization");
      const payload = validateAuthHeader(authHeader);

      if (!payload) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
      }

      return await handler(req, payload.adminId);
    } catch (error) {
      console.error("Erro na API:", error);
      return NextResponse.json(
        { error: "Erro interno do servidor" },
        { status: 500 }
      );
    }
  };
}

// Helper para respostas padronizadas
// ============================================
// 📤 RESPOSTAS PADRONIZADAS
// ============================================
export const apiResponse = {
  success: (data: unknown, status: number = 200) =>
    NextResponse.json(data, { status }),

  error: (message: string, status: number = 400) =>
    NextResponse.json({ error: message }, { status }),

  unauthorized: (message: string = "Não autorizado") =>
    NextResponse.json({ error: message }, { status: 401 }),

  forbidden: (message: string = "Acesso negado") =>
    NextResponse.json({ error: message }, { status: 403 }),

  notFound: (message: string = "Não encontrado") =>
    NextResponse.json({ error: message }, { status: 404 }),

  serverError: (message: string = "Erro interno do servidor") =>
    NextResponse.json({ error: message }, { status: 500 }),

  created: (data: unknown) => NextResponse.json(data, { status: 201 }),

  noContent: () => NextResponse.json(null, { status: 204 }),
};

// ============================================
// 🔧 HELPERS UTILITÁRIOS
// ============================================
export async function parseJsonBody<T = unknown>(
  req: NextRequest
): Promise<T | null> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

export function getSearchParams(req: NextRequest) {
  return new URL(req.url).searchParams;
}

export function validateRequiredFields(
  data: Record<string, unknown>,
  fields: string[]
): string | null {
  for (const field of fields) {
    if (!data[field]) {
      return `Campo obrigatório: ${field}`;
    }
  }
  return null;
}
