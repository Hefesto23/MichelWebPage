import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  // Obter credenciais do admin das variáveis de ambiente
  const adminEmail = process.env.ADMIN_EMAIL || "admin@clinica.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  console.log("🔐 Criando admin inicial...");
  console.log(`📧 Email: ${adminEmail}`);

  // Hash da senha
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Upsert: cria se não existe, ou atualiza se já existe
  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      // Atualiza a senha apenas se ADMIN_PASSWORD foi explicitamente definido
      ...(process.env.ADMIN_PASSWORD ? { password: hashedPassword } : {}),
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
    },
  });

  console.log("✅ Admin criado ou já existente:", {
    id: admin.id,
    email: admin.email,
    createdAt: admin.createdAt,
  });

  console.log("\n⚠️  IMPORTANTE:");
  console.log("   - Faça login com as credenciais definidas nas variáveis de ambiente");
  console.log("   - Troque a senha após o primeiro acesso");
  console.log("   - Não compartilhe as credenciais padrão\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
