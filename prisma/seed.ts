import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10); // Senha padrão 'admin123'

  const admin = await prisma.admin.upsert({
    where: { email: "admin@clinica.com" },
    update: {},
    create: {
      email: "admin@clinica.com",
      password: hashedPassword,
    },
  });

  console.log("Admin criado ou já existente:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
