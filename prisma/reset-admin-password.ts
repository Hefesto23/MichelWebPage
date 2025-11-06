// prisma/reset-admin-password.ts
// Script para resetar a senha do admin
// Uso: tsx prisma/reset-admin-password.ts <email> <nova-senha>

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function resetPassword() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error("❌ Uso: tsx prisma/reset-admin-password.ts <email> <nova-senha>");
    console.error("   Exemplo: tsx prisma/reset-admin-password.ts admin@clinica.com novaSenha123");
    process.exit(1);
  }

  const [email, newPassword] = args;

  console.log(`🔐 Resetando senha do admin: ${email}`);

  // Verificar se admin existe
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    console.error(`❌ Admin com email '${email}' não encontrado!`);
    console.log("\n📋 Admins existentes:");
    const admins = await prisma.admin.findMany({
      select: { id: true, email: true, createdAt: true },
    });
    console.table(admins);
    process.exit(1);
  }

  // Hash da nova senha
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Atualizar senha
  await prisma.admin.update({
    where: { email },
    data: { password: hashedPassword },
  });

  console.log("✅ Senha resetada com sucesso!");
  console.log(`   Email: ${email}`);
  console.log(`   Nova senha: ${newPassword}`);
  console.log("\n⚠️  Não esqueça de trocar esta senha após fazer login!");
}

resetPassword()
  .catch((e) => {
    console.error("❌ Erro ao resetar senha:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
