## Instruções para Implementação do Sistema de Agendamento

Você agora tem todos os arquivos necessários para implementar um sistema completo de agendamento integrado ao Google Calendar para o site do psicólogo Michel. Aqui está um guia de implementação passo a passo:

### 1. Configurar o Google Cloud e Permissões

1. **Criar um projeto no Google Cloud Console**:

   - Acesse [console.cloud.google.com](https://console.cloud.google.com/)
   - Crie um novo projeto
   - Ative a API Google Calendar para o projeto

2. **Criar uma conta de serviço**:

   - No Google Cloud Console, vá para "IAM & Admin" > "Service Accounts"
   - Clique em "Create Service Account"
   - Dê um nome como "calendar-integration"
   - Conceda as permissões necessárias (pelo menos "Cloud Calendar API > Calendar API")
   - Crie uma chave JSON e faça o download

3. **Configurar permissões do calendário**:
   - Acesse [calendar.google.com](https://calendar.google.com/)
   - Vá para as configurações do calendário
   - Compartilhe seu calendário com o email da conta de serviço (ex: `calendar-integration@seu-projeto.iam.gserviceaccount.com`)
   - Dê permissão "Make changes to events"

### 2. Configurar o Envio de E-mails

1. **Para Gmail**:

   - Vá para as configurações da sua conta Google
   - Ative a verificação em duas etapas
   - Gere uma "Senha de App" para usar no sistema
   - Use essa senha no arquivo `.env.local`

2. **Ou use outro serviço de e-mail**:
   - Se preferir, você pode usar serviços como SendGrid, Mailgun, etc.
   - Ajuste o código do nodemailer no arquivo da API conforme necessário

### 3. Instalar Dependências

Instale os pacotes necessários para o projeto:

```bash
npm install googleapis nodemailer
```

### 4. Adicionar Arquivos ao Projeto

1. **Página de Agendamento**:

   - Copie o código completo da página de agendamento para `src/app/agendamento/page.tsx`

2. **APIs**:

   - Crie a estrutura de pastas `src/app/api/calendario/horarios` e adicione o arquivo `route.ts`
   - Crie a estrutura de pastas `src/app/api/calendario/agendar` e adicione o arquivo `route.ts`
   - Crie a estrutura de pastas `src/app/api/calendario/buscar` e adicione o arquivo `route.ts`
   - Crie a estrutura de pastas `src/app/api/calendario/cancelar` e adicione o arquivo `route.ts`

3. **Variáveis de Ambiente**:
   - Crie o arquivo `.env.local` na raiz do projeto
   - Substitua os valores pelas suas credenciais reais

### 5. Testar a Implementação

1. **Inicie o servidor de desenvolvimento**:

   ```bash
   npm run dev
   ```

2. **Teste o fluxo completo**:
   - Teste o agendamento de uma consulta
   - Verifique se o evento aparece no Google Calendar
   - Teste o cancelamento usando o código de confirmação
   - Verifique se os e-mails são enviados corretamente

### 6. Verificações Finais

1. **Verificar segurança**:

   - Certifique-se de que as credenciais estão seguras e não expostas no código-fonte
   - Adicione `.env.local` ao `.gitignore` se já não estiver

2. **Otimizar**:

   - Considere adicionar cache para consultas frequentes
   - Adicione tratamento de erros mais detalhado
   - Adicione logs para monitoramento

3. **Considerar limitações**:
   - Lembre-se que o Google Calendar API tem limites de uso diário
   - Implemente tratamento de erros para quando esses limites forem atingidos

Com esta implementação, você terá um sistema completo de agendamento que atende a todos os requisitos solicitados:

- Visualização de horários disponíveis (RF010)
- Formulário para agendamento (RF011)
- Confirmação por e-mail (RF012)
- Opção para cancelamento de consultas (RF013)

E o melhor: tudo integrado perfeitamente ao Google Calendar do Michel!
