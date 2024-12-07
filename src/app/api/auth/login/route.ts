import { generateToken } from "@/lib/jwt"; // Função para gerar o token JWT
import prisma from "@/lib/prisma"; // Importa o Prisma para acessar o banco de dados
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// Função que lida com a requisição POST para o login de Admin
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Procura o admin pelo e-mail
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // Verifica a senha usando bcrypt
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // Gera o token JWT
    const token = generateToken(admin.id);

    return NextResponse.json({ token }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: "Erro no login" }, { status: 500 });
  }
}
