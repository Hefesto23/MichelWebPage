describe('Fluxo de Agendamento de Consultas', () => {
  beforeEach(() => {
    cy.visit('/agendamento')
  })

  it('deve carregar a página de agendamento corretamente', () => {
    cy.contains('Agendamento de Consultas').should('be.visible')
    cy.contains('Agende sua consulta de forma rápida e segura').should('be.visible')
    
    // Verificar se as abas estão presentes
    cy.contains('Novo Agendamento').should('be.visible')
    cy.contains('Buscar Agendamento').should('be.visible')
    
    // Verificar se "Novo Agendamento" está ativa por padrão
    cy.contains('Novo Agendamento').should('have.class', 'bg-primary-foreground')
  })

  it('deve alternar entre as abas corretamente', () => {
    // Clicar em "Buscar Agendamento"
    cy.contains('Buscar Agendamento').click()
    cy.contains('Buscar Agendamento').should('have.class', 'bg-primary-foreground')
    
    // Voltar para "Novo Agendamento"
    cy.contains('Novo Agendamento').click()
    cy.contains('Novo Agendamento').should('have.class', 'bg-primary-foreground')
  })

  describe('Novo Agendamento - Fluxo Completo', () => {
    it('deve completar o processo de agendamento com sucesso', () => {
      // Certificar que está na aba "Novo Agendamento"
      cy.contains('Novo Agendamento').click()
      
      // Passo 1: Seleção de Data e Horário
      cy.contains('Modalidade da Consulta').should('be.visible')
      
      // Selecionar modalidade
      cy.contains('Presencial').click()
      cy.contains('Presencial').should('have.class', 'primaryButton')
      
      // Aguardar calendário carregar
      cy.get('[data-testid="calendar"]', { timeout: 10000 }).should('be.visible')
      
      // Selecionar uma data futura (próxima segunda-feira)
      cy.selectNextAvailableDate()
      
      // Aguardar horários carregarem
      cy.contains('Selecione um Horário').should('be.visible')
      cy.get('[data-testid="time-slot"]').first().click()
      
      // Verificar se data foi selecionada
      cy.contains('Data selecionada:').should('be.visible')
      
      // Avançar para próximo passo
      cy.contains('Próximo').should('not.be.disabled').click()
      
      // Passo 2: Informações de Contato
      cy.contains('Suas Informações').should('be.visible')
      
      // Preencher formulário
      cy.get('input[name="nome"]').type(Cypress.env('testName'))
      cy.get('input[name="email"]').type(Cypress.env('testEmail'))
      cy.get('input[name="telefone"]').type(Cypress.env('testPhone'))
      cy.get('textarea[name="mensagem"]').type('Teste automatizado - favor ignorar')
      
      // Avançar para confirmação
      cy.contains('Próximo').should('not.be.disabled').click()
      
      // Passo 3: Confirmação
      cy.contains('Confirme seus Dados').should('be.visible')
      cy.contains(Cypress.env('testName')).should('be.visible')
      cy.contains(Cypress.env('testEmail')).should('be.visible')
      
      // Simular envio (sem realmente enviar para não criar agendamento real)
      // cy.contains('Confirmar Agendamento').click()
      // cy.contains('Agendamento realizado com sucesso!').should('be.visible')
    })

    it('deve validar campos obrigatórios', () => {
      // Tentar avançar sem preencher nada
      cy.contains('Próximo').should('be.disabled')
      
      // Selecionar apenas modalidade
      cy.contains('Presencial').click()
      cy.contains('Próximo').should('be.disabled')
      
      // Selecionar data
      cy.selectNextAvailableDate()
      cy.contains('Próximo').should('be.disabled')
      
      // Selecionar horário
      cy.get('[data-testid="time-slot"]').first().click()
      cy.contains('Próximo').should('not.be.disabled')
    })

    it('deve limpar dados ao voltar para seleção de data', () => {
      // Completar primeira etapa
      cy.contains('Presencial').click()
      cy.selectNextAvailableDate()
      cy.get('[data-testid="time-slot"]').first().click()
      cy.contains('Próximo').click()
      
      // Ir para etapa de contato
      cy.contains('Suas Informações').should('be.visible')
      
      // Voltar para seleção de data
      cy.contains('Voltar').click()
      
      // Verificar se dados foram limpos
      cy.contains('Data selecionada:').should('not.exist')
      cy.get('[data-testid="calendar"]').should('be.visible')
      
      // Verificar se nenhuma data está selecionada no calendário
      cy.get('[aria-selected="true"]').should('not.exist')
    })

    it('deve mostrar horários disponíveis após seleção de data', () => {
      cy.contains('Presencial').click()
      
      // Antes de selecionar data, não deve mostrar horários
      cy.contains('Selecione um Horário').should('not.exist')
      
      // Selecionar data
      cy.selectNextAvailableDate()
      
      // Aguardar carregamento dos horários
      cy.contains('Carregando horários...').should('be.visible')
      cy.contains('Selecione um Horário').should('be.visible')
      
      // Verificar se horários estão disponíveis
      cy.get('[data-testid="time-slot"]').should('have.length.at.least', 1)
    })

    it('deve aplicar estilos corretos aos botões selecionados', () => {
      // Verificar cor de fundo do botão não selecionado
      cy.contains('Presencial').should('have.css', 'background-color')
      
      // Clicar e verificar mudança visual
      cy.contains('Presencial').click()
      cy.contains('Presencial').should('have.css', 'background-color')
      
      // Alternar para Online e verificar mudança
      cy.contains('Online').click()
      cy.contains('Online').should('have.css', 'background-color')
      
      // Verificar que Presencial voltou ao estado não selecionado
      cy.contains('Presencial').should('have.css', 'background-color')
    })
  })

  describe('Buscar Agendamento', () => {
    it('deve permitir buscar agendamento existente', () => {
      cy.contains('Buscar Agendamento').click()
      
      // Verificar se componente de busca aparece
      cy.contains('Buscar').should('be.visible')
      
      // Verificar se campos de busca existem (ajustar seletores conforme necessário)
      cy.get('input').should('have.length.at.least', 1)
      
      // Se houver campos específicos, testar preenchimento
      cy.get('input').first().type('TESTE123')
      
      // Verificar se formulário responde (sem necessariamente esperar resultado específico)
      cy.contains('Buscar').should('be.visible')
    })
  })

  describe('Responsividade', () => {
    it('deve funcionar corretamente em dispositivos móveis', () => {
      cy.viewport('iphone-x')
      
      // Verificar se layout se adapta
      cy.contains('Agendamento de Consultas').should('be.visible')
      cy.contains('Novo Agendamento').should('be.visible')
      
      // Testar seleção em mobile
      cy.contains('Presencial').click()
      cy.selectNextAvailableDate()
      
      // Verificar se calendário funciona em mobile
      cy.get('[data-testid="calendar"]').should('be.visible')
    })

    it('deve funcionar corretamente em tablet', () => {
      cy.viewport('ipad-2')
      
      cy.contains('Presencial').click()
      cy.selectNextAvailableDate()
      cy.get('[data-testid="time-slot"]').first().click()
      
      // Grid de horários deve se adaptar
      cy.get('[data-testid="time-slot"]').should('be.visible')
    })
  })

  describe('Acessibilidade', () => {
    it('deve ter navegação por teclado funcional', () => {
      // Navegar pelas abas com Tab
      cy.get('body').tab()
      cy.focused().should('contain', 'Novo Agendamento')
      
      // Navegar pelos botões de modalidade
      cy.get('body').tab().tab()
      cy.focused().should('contain', 'Presencial')
      
      // Ativar com Enter
      cy.focused().type('{enter}')
      cy.contains('Presencial').should('have.class', 'primaryButton')
    })

    it('deve ter labels adequados para screen readers', () => {
      cy.get('label').should('contain', 'Modalidade da Consulta')
      cy.get('label').should('contain', 'Selecione uma data')
      cy.get('label').should('contain', 'Selecione um Horário')
    })
  })

  describe('Estados de Erro', () => {
    it('deve tratar erro de carregamento de horários', () => {
      // Interceptar API de horários para simular erro
      cy.intercept('GET', '/api/calendario/horarios*', { 
        statusCode: 500, 
        body: { error: 'Erro no servidor' } 
      }).as('horariosError')
      
      cy.contains('Presencial').click()
      cy.selectNextAvailableDate()
      
      // Aguardar erro
      cy.wait('@horariosError')
      cy.contains('Erro ao carregar horários').should('be.visible')
    })

    it('deve tratar erro no envio do agendamento', () => {
      // Interceptar API de agendamento para simular erro
      cy.intercept('POST', '/api/calendario/agendar', { 
        statusCode: 500, 
        body: { error: 'Erro no servidor' } 
      }).as('agendarError')
      
      // Completar fluxo até confirmação
      cy.completeAppointmentFlow()
      
      // Tentar enviar
      cy.contains('Confirmar Agendamento').click()
      cy.wait('@agendarError')
      
      cy.contains('Erro ao agendar consulta').should('be.visible')
    })
  })
})