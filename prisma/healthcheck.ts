// prisma/healthcheck.ts
// ============================================
// 🏥 HEALTHCHECK - Acorda o Neon antes do build
// ============================================
// Este script garante que o banco Neon esteja acordado
// antes do build da Vercel iniciar, evitando timeouts
// durante a geração de páginas estáticas.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

async function healthcheck() {
  const maxAttempts = 5;
  const delayMs = 5000; // 5 segundos entre tentativas

  console.log('🏥 ========================================');
  console.log('🏥 HEALTHCHECK: Verificando conexão com banco...');
  console.log('🏥 ========================================\n');

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`🔄 Tentativa ${attempt}/${maxAttempts}...`);

      // Conectar ao banco
      await prisma.$connect();
      console.log('   ✅ Conexão estabelecida');

      // Testar com query simples
      await prisma.$queryRaw`SELECT 1 as healthcheck`;
      console.log('   ✅ Query executada com sucesso');

      // Verificar se há admin no banco (validação extra)
      const adminCount = await prisma.admin.count();
      console.log(`   ✅ Banco acessível (${adminCount} admin(s) encontrado(s))\n`);

      console.log('🎉 ========================================');
      console.log('🎉 HEALTHCHECK: Banco está saudável e pronto!');
      console.log('🎉 ========================================');

      await prisma.$disconnect();
      process.exit(0);

    } catch (error) {
      console.error(`   ❌ Falha na tentativa ${attempt}/${maxAttempts}:`);
      console.error(`   📝 Erro: ${error instanceof Error ? error.message : String(error)}\n`);

      if (attempt < maxAttempts) {
        console.log(`   ⏳ Aguardando ${delayMs / 1000}s antes da próxima tentativa...\n`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else {
        console.error('💀 ========================================');
        console.error('💀 HEALTHCHECK: FALHOU após todas as tentativas');
        console.error('💀 ========================================');
        console.error('⚠️  O build continuará, mas pode usar dados default\n');

        await prisma.$disconnect();

        // NÃO falhamos o build - permitimos que ele continue
        // O sistema usará dados default temporariamente (self-healing)
        process.exit(0);
      }
    }
  }
}

healthcheck().catch((error) => {
  console.error('💀 HEALTHCHECK: Erro fatal:', error);
  process.exit(0); // Exit 0 para não bloquear o build
});
