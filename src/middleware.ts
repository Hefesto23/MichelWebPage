// middleware.ts - MIDDLEWARE NEXT.JS
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// 🔐 VERIFICAÇÃO JWT (Server-side)
// ============================================
function verifyJWT(token: string): boolean {
  try {
    const payload = verifyToken(token);
    return payload !== null;
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
    const cookieToken = request.cookies.get("token")?.value;
    const headerToken = request.headers.get("authorization")?.replace("Bearer ", "");
    const token = cookieToken || headerToken;

    console.log("Middleware - Rota admin:", pathname);
    console.log("Middleware - Cookie token:", cookieToken ? "existe" : "não existe");
    console.log("Middleware - Header token:", headerToken ? "existe" : "não existe");
    console.log("Middleware - Token final:", token ? "existe" : "não existe");

    if (!token) {
      console.log("Middleware - Sem token, redirecionando para login");
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    const isValidToken = verifyJWT(token);
    console.log("Middleware - Token válido:", isValidToken);

    if (!isValidToken) {
      console.log("Middleware - Token inválido, redirecionando para login");
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    console.log("Middleware - Token válido, permitindo acesso");
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
