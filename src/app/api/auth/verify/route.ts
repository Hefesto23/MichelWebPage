// src/app/api/auth/verify/route.ts
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get("Authorization");
    
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json(
        { valid: false, error: "Token não fornecido" },
        { status: 401 }
      );
    }

    const token = authorization.split(" ")[1];

    try {
      const decoded = verifyToken(token);
      
      if (decoded && decoded.adminId && decoded.exp && decoded.exp > Date.now() / 1000) {
        return NextResponse.json(
          { 
            valid: true, 
            user: { 
              adminId: decoded.adminId,
              email: decoded.email 
            } 
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { valid: false, error: "Token expirado ou inválido" },
          { status: 401 }
        );
      }
    } catch (tokenError) {
      console.error("Erro na verificação do token:", tokenError);
      return NextResponse.json(
        { valid: false, error: "Token inválido" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Erro na API de verificação:", error);
    return NextResponse.json(
      { valid: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}