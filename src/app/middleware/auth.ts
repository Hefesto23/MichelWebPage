import { verifyToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token || !verifyToken(token)) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
    // Redireciona para a página de login
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"], // Aplica o middleware às rotas do dashboard
};
