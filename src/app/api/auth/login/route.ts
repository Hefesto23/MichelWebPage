import { generateToken } from "@/lib/auth"; // Função para gerar o token JWT
import { extractClientInfo, logAuthEvent } from "@/lib/audit";
import prisma from "@/lib/prisma"; // Importa o Prisma para acessar o banco de dados
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// Função que lida com a requisição POST para o login de Admin
export async function POST(req: Request) {
  const clientInfo = extractClientInfo(req);
  
  try {
    const { email, password } = await req.json();

    // Procura o admin pelo e-mail
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      // Log de tentativa de login falhada
      await logAuthEvent("LOGIN_FAILED", {
        email,
        error: "Admin não encontrado",
        ...clientInfo,
      });
      
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // Verifica a senha usando bcrypt
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      // Log de tentativa de login falhada
      await logAuthEvent("LOGIN_FAILED", {
        adminId: admin.id.toString(),
        email,
        error: "Senha inválida",
        ...clientInfo,
      });
      
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // Gera o token JWT
    const token = generateToken(admin.id);

    // Log de login bem-sucedido
    await logAuthEvent("LOGIN_SUCCESS", {
      adminId: admin.id.toString(),
      email,
      ...clientInfo,
    });

    // Cria resposta com cookie
    const response = NextResponse.json({ token }, { status: 200 });
    
    const sameSiteValue = process.env.NODE_ENV === "production" ? "strict" : "lax";
    const cookieOptions = {
      httpOnly: false, // Precisa ser false para acesso via JavaScript
      secure: process.env.NODE_ENV === "production",
      sameSite: sameSiteValue as "strict" | "lax",
      maxAge: 60 * 60, // 1 hora
      path: "/",
    };

    // Define cookie httpOnly para maior segurança
    response.cookies.set("token", token, cookieOptions);

    return response;
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: "Erro no login" }, { status: 500 });
  }
}

export const runtime = 'nodejs';
