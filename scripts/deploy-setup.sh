#!/bin/bash

# 🚀 Script de Setup para Deploy - Michel PSI Webpage
# Execute este script após configurar as variáveis de ambiente no Vercel

echo "🚀 Iniciando setup do ambiente de produção..."

# Verificar se estamos em produção
if [ "$VERCEL_ENV" != "production" ]; then
    echo "⚠️  Este script deve ser executado apenas em produção"
    exit 1
fi

echo "📊 Verificando variáveis de ambiente..."

# Verificar variáveis obrigatórias
REQUIRED_VARS=(
    "DATABASE_URL"
    "JWT_SECRET"
    "SENDGRID_API_KEY"
    "FROM_EMAIL"
    "NEXTAUTH_SECRET"
    "ADMIN_EMAIL"
    "ADMIN_PASSWORD"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Variável $var não encontrada"
        exit 1
    else
        echo "✅ $var configurada"
    fi
done

echo "🗄️ Executando migrações do banco..."
npm run db:migrate:deploy

if [ $? -eq 0 ]; then
    echo "✅ Migrações executadas com sucesso"
else
    echo "❌ Erro nas migrações"
    exit 1
fi

echo "🌱 Executando seed do banco..."
npm run db:seed

if [ $? -eq 0 ]; then
    echo "✅ Seed executado com sucesso"
else
    echo "❌ Erro no seed"
    exit 1
fi

echo "🎉 Setup concluído com sucesso!"
echo "🌐 Seu site está disponível em: $VERCEL_URL"