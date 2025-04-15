# Guia Passo a Passo: Configurando SendGrid para os Emails de Agendamento

Vou te guiar na configuração completa do SendGrid para enviar emails de confirmação e cancelamento no sistema de agendamento do Michel. Vamos começar do zero:

## 1. Criar uma Conta no SendGrid

1. **Acesse o site do SendGrid**:

   - Abra [sendgrid.com](https://sendgrid.com/)
   - Clique em "Start for Free" ou "Sign Up Free"

2. **Crie sua conta**:

   - Preencha o formulário com seu email, nome e senha
   - Aceite os termos de serviço
   - Clique em "Create Account"

3. **Complete o processo de verificação**:
   - Verifique seu email para confirmar sua conta
   - Siga as instruções para configurar sua conta

## 2. Verificar seu Remetente

1. **Acesse o painel do SendGrid** e vá para "Settings" > "Sender Authentication"

2. **Verificar um remetente individual**:
   - Clique em "Verify a Single Sender"
   - Preencha o formulário com:
     - "From Name": Michel de Camargo
     - "From Email Address": michelcamargo.psi@gmail.com (ou o email que será usado como remetente)
     - Preencha as informações de endereço físico
     - Clique em "Create"
3. **Verifique o email**:
   - Acesse a caixa de entrada do email informado
   - Clique no link de verificação enviado pelo SendGrid

## 3. Gerar uma API Key

1. **No painel do SendGrid**, vá para "Settings" > "API Keys"

2. **Crie uma nova API Key**:

   - Clique em "Create API Key"
   - Nomeie como "Michel Agendamento API Key"
   - Selecione "Restricted Access" e marque apenas "Mail Send"
   - Clique em "Create & View"

3. **Guarde sua API Key**:
   - Copie a API Key gerada (ela só será mostrada uma vez)
   - Guarde em um local seguro temporariamente

## 4. Instalar o Pacote do SendGrid

1. **Abra o terminal no diretório do seu projeto** e execute:

```bash
npm install @sendgrid/mail
```

## 5. Configurar Variáveis de Ambiente

1. **Edite seu arquivo `.env.local`** para adicionar sua API Key do SendGrid:

```
# Remova a linha que contém SENDGRID_API_KEY=SUA_CHAVE_API_SENDGRID_AQUI
# E adicione a nova chave
SENDGRID_API_KEY=SG.sua_chave_api_real_aqui
EMAIL_FROM=michelcamargo.psi@gmail.com
```
