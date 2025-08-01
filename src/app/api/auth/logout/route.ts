// src/app/api/auth/logout/route.ts
import { validateAuthHeader } from "@/lib/auth";
import { extractClientInfo, logAuthEvent } from "@/lib/audit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const clientInfo = extractClientInfo(req);
  
  try {
    // Tenta identificar o usuário pelo token
    const authHeader = req.headers.get("authorization");
    const payload = validateAuthHeader(authHeader);
    
    if (payload) {
      // Log de logout
      await logAuthEvent("LOGOUT", {
        adminId: payload.adminId,
        ...clientInfo,
      });
    }

    // Cria resposta de sucesso
    const response = NextResponse.json(
      { message: "Logout realizado com sucesso" },
      { status: 200 }
    );

    // Remove o cookie
    response.cookies.set("token", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expira imediatamente
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Erro no logout:", error);
    return NextResponse.json({ error: "Erro no logout" }, { status: 500 });
  }
}