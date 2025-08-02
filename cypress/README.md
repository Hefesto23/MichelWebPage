# Testes E2E do Sistema de Agendamento

Este diretório contém testes end-to-end (E2E) usando Cypress para o sistema de agendamento de consultas.

## 📁 Estrutura dos Testes

```
cypress/
├── e2e/
│   ├── appointment-flow.cy.ts    # Testes do fluxo completo de agendamento
│   └── appointment-ui.cy.ts      # Testes de interface e UX
├── support/
│   ├── commands.ts               # Comandos customizados do Cypress
│   └── e2e.ts                   # Configurações globais
└── README.md
```

## 🧪 Tipos de Testes

### 1. **appointment-flow.cy.ts**
Testa o fluxo completo do processo de agendamento:
- ✅ Carregamento da página
- ✅ Alternância entre abas (Novo/Buscar)
- ✅ Seleção de modalidade (Presencial/Online)
- ✅ Seleção de data no calendário
- ✅ Seleção de horários disponíveis
- ✅ Preenchimento de dados de contato
- ✅ Validação de campos obrigatórios
- ✅ Limpeza de dados ao voltar etapas
- ✅ Busca de agendamentos existentes
- ✅ Responsividade (mobile/tablet)
- ✅ Acessibilidade (navegação por teclado)
- ✅ Tratamento de erros (API/servidor)

### 2. **appointment-ui.cy.ts**
Testa aspectos visuais e de experiência do usuário:
- 🎨 Cores e estilos corretos nas abas
- 🎨 Efeitos hover nos elementos interativos
- 🎨 Estados visuais (habilitado/desabilitado)
- 🎨 Transições e animações
- 📱 Layout responsivo em diferentes resoluções
- ♿ Acessibilidade visual e contraste
- 🔄 Estados de carregamento
- 📅 Destaque de datas selecionadas

## 🚀 Como Executar os Testes

### Pré-requisitos
```bash
# Instalar Cypress (se não estiver instalado)
npm install cypress --save-dev

# Certificar que a aplicação está rodando
npm run dev
```

### Comandos Disponíveis

```bash
# Executar todos os testes E2E (headless)
npm run test:e2e

# Abrir interface do Cypress para desenvolvimento
npm run test:e2e:open

# Executar apenas testes de agendamento (headless)
npm run test:appointment

# Abrir apenas testes de agendamento
npm run test:appointment:open
```

### Execução Manual
```bash
# Modo interativo (recomendado para desenvolvimento)
npx cypress open

# Modo headless (recomendado para CI/CD)
npx cypress run

# Executar teste específico
npx cypress run --spec "cypress/e2e/appointment-flow.cy.ts"
```

## 🛠️ Comandos Customizados

### `cy.selectNextAvailableDate()`
Seleciona automaticamente a próxima segunda-feira disponível no calendário.

```typescript
cy.selectNextAvailableDate()
```

### `cy.completeAppointmentFlow()`
Completa todo o fluxo de agendamento até a tela de confirmação.

```typescript
cy.completeAppointmentFlow()
```

### `cy.fillContactForm()`
Preenche o formulário de contato com dados de teste.

```typescript
cy.fillContactForm() // Usa dados padrão
cy.fillContactForm('Nome', 'email@teste.com', '(15) 99999-9999', 'Mensagem')
```

### `cy.tab()`
Navega usando a tecla Tab para testes de acessibilidade.

```typescript
cy.get('body').tab() // Navega para próximo elemento focável
```

## 🎯 Cenários de Teste Cobertos

### ✅ Fluxo Principal
1. **Seleção de Modalidade** → Presencial/Online
2. **Seleção de Data** → Calendário interativo
3. **Seleção de Horário** → Lista de horários disponíveis
4. **Informações de Contato** → Formulário de dados pessoais
5. **Confirmação** → Revisão e envio

### ✅ Validações
- Campos obrigatórios não preenchidos
- Datas passadas ou indisponíveis
- Formato de email inválido
- Telefone em formato incorreto

### ✅ Navegação
- Voltar entre etapas
- Limpeza de dados ao retornar
- Scroll automático entre seções
- Persistência de dados ao avançar

### ✅ Estados de Erro
- Falha no carregamento de horários
- Erro no envio do agendamento
- Problemas de conectividade
- Timeout de requisições

### ✅ Responsividade
- Desktop (1920x1080, 1280x720)
- Tablet (iPad, iPad Pro)
- Mobile (iPhone X, Galaxy S9)

### ✅ Acessibilidade
- Navegação por teclado
- Focus visível em elementos
- Labels adequados para screen readers
- Contraste de cores apropriado

## 🔧 Configurações de Teste

### Variáveis de Ambiente
```typescript
// cypress.config.ts
env: {
  testEmail: 'teste@exemplo.com',
  testPhone: '(15) 99999-9999',
  testName: 'João Silva Teste'
}
```

### Timeouts
- Comando padrão: 10 segundos
- Carregamento de página: 30 segundos
- Requisições API: 15 segundos

### Interceptações
- Analytics automático interceptado
- APIs de agendamento podem ser mockadas
- Horários disponíveis podem ser simulados

## 📊 Relatórios

### Vídeos
Os testes geram vídeos automaticamente em `cypress/videos/`

### Screenshots
Screenshots de falhas são salvos em `cypress/screenshots/`

### Relatórios HTML
Para gerar relatórios mais detalhados:
```bash
npm install mochawesome --save-dev
npx cypress run --reporter mochawesome
```

## 🚨 Problemas Comuns

### 1. **Aplicação não está rodando**
```bash
# Solução: Iniciar aplicação
npm run dev
```

### 2. **Timeout em carregamento**
```bash
# Verificar se banco está rodando
npm run docker:status
npm run docker:up
```

### 3. **Falha na seleção de data**
```bash
# Verificar se está em dia de semana
# Calendário só permite seg-qui
```

### 4. **Elementos não encontrados**
```bash
# Aguardar elementos carregarem
cy.get('[data-testid="calendar"]', { timeout: 10000 })
```

## 🔄 Integração CI/CD

Para integrar no pipeline de CI/CD:

```yaml
# .github/workflows/e2e-tests.yml
- name: Run E2E Tests
  run: |
    npm run docker:up
    npm run dev &
    npm run test:e2e
```

## 📝 Contribuindo

1. Adicione novos testes em `cypress/e2e/`
2. Use `data-testid` para elementos testáveis
3. Mantenha testes independentes e isolados
4. Documente novos comandos customizados
5. Teste em múltiplas resoluções

## 🎓 Recursos Úteis

- [Documentação Cypress](https://docs.cypress.io/)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Seletores Cypress](https://docs.cypress.io/guides/core-concepts/selecting-elements)
- [Comandos Customizados](https://docs.cypress.io/api/cypress-api/custom-commands)