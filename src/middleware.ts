// middleware.ts - MIDDLEWARE NEXT.JS
import { NextRequest, NextResponse } from "next/server";

// ============================================
// 🔐 VERIFICAÇÃO JWT (Server-side)
// ============================================
function verifyJWT(token: string): boolean {
  try {
    // Decodificação simples para verificar estrutura
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    // Decodifica o payload
    const payload = JSON.parse(atob(parts[1]));

    // Verifica se não expirou
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

// ============================================
// 🛡️ MIDDLEWARE PRINCIPAL
// ============================================
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ============================================
  // 🎯 ROTAS QUE NÃO PRECISAM DE PROTEÇÃO
  // ============================================
  const publicRoutes = [
    "/",
    "/about",
    "/terapias",
    "/avaliacoes",
    "/agendamento",
    "/contato",
    "/admin/login",
    "/api/auth/login",
    "/api/calendario", // APIs públicas de agendamento
  ];

  // Verifica se é rota pública ou asset
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  const isAsset =
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/uploads/") ||
    pathname.includes(".");

  if (isPublicRoute || isAsset) {
    return NextResponse.next();
  }

  // ============================================
  // 🔐 VERIFICAÇÃO DE AUTENTICAÇÃO
  // ============================================

  // Para rotas admin (exceto login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token =
      request.cookies.get("token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token || !verifyJWT(token)) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Para APIs admin
  if (pathname.startsWith("/api/admin")) {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token || !verifyJWT(token)) {
      return new NextResponse(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return NextResponse.next();
}

// ============================================
// ⚙️ CONFIGURAÇÃO DO MATCHER
// ============================================
export const config = {
  matcher: [
    /*
     * Aplica middleware a todas as rotas exceto:
     * - api routes que não precisam de auth
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/admin/dashboard/:path*",
  ], // Aplica o middleware às rotas do dashboard
};
