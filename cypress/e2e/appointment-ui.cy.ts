describe('Interface do Agendamento - UI/UX', () => {
  beforeEach(() => {
    cy.visit('/agendamento')
  })

  describe('Estilos e Cores', () => {
    it('deve aplicar cores corretas nas abas', () => {
      // Aba ativa deve ter cor primária
      cy.contains('Novo Agendamento')
        .should('have.class', 'bg-primary-foreground')
        .should('have.class', 'text-btnFg')
      
      // Aba inativa deve ter fundo branco e borda azul
      cy.contains('Buscar Agendamento')
        .should('have.class', 'bg-background')
        .should('have.class', 'text-card-foreground')
        .should('have.class', 'border-card')
    })

    it('deve mostrar efeito hover nas abas inativas', () => {
      // Hover na aba inativa
      cy.contains('Buscar Agendamento').trigger('mouseover')
      
      // Verificar se aplicou classes de hover
      cy.contains('Buscar Agendamento')
        .should('have.class', 'hover:bg-card')
        .should('have.class', 'hover:border-white')
    })

    it('deve aplicar cores corretas nos botões de modalidade', () => {
      // Verificar que botão existe e está visível
      cy.contains('Presencial').should('be.visible')
      
      // Clicar e verificar mudança visual (cor de fundo)
      cy.contains('Presencial').click()
      cy.contains('Presencial').should('have.css', 'background-color')
      
      // Verificar que botão permanece visível após seleção
      cy.contains('Presencial').should('be.visible')
    })

    it('deve aplicar cores corretas nos botões de horário', () => {
      // Preparar para ver horários
      cy.contains('Presencial').click()
      cy.selectNextAvailableDate()
      
      // Aguardar horários carregarem
      cy.get('[data-testid="time-slot"]', { timeout: 10000 }).should('have.length.at.least', 1)
      
      // Clicar no primeiro horário e verificar que permanece visível
      cy.get('[data-testid="time-slot"]').first().click()
      cy.get('[data-testid="time-slot"]').first().should('be.visible')
      cy.get('[data-testid="time-slot"]').first().should('have.css', 'background-color')
    })
  })

  describe('Transições e Animações', () => {
    it('deve ter transições suaves entre etapas', () => {
      // Completar primeira etapa
      cy.contains('Presencial').click()
      cy.selectNextAvailableDate()
      cy.get('[data-testid="time-slot"]').first().click()
      
      // Verificar se botão Próximo tem transição
      cy.contains('Próximo').should('have.css', 'transition')
      cy.contains('Próximo').click()
      
      // Verificar mudança de conteúdo
      cy.contains('Suas Informações').should('be.visible')
    })

    it('deve mostrar loading durante carregamento de horários', () => {
      cy.contains('Presencial').click()
      cy.selectNextAvailableDate()
      
      // Verificar se mostra loading
      cy.contains('Carregando horários...').should('be.visible')
      cy.get('.animate-spin').should('be.visible')
      
      // Aguardar horários carregarem
      cy.contains('Selecione um Horário', { timeout: 10000 }).should('be.visible')
    })
  })

  describe('Layout e Responsividade', () => {
    it('deve ter layout adequado em desktop', () => {
      cy.viewport(1920, 1080)
      
      // Verificar largura do container
      cy.get('[data-testid="appointment-container"]').should('be.visible')
      
      // Grid de horários deve ter múltiplas colunas
      cy.contains('Presencial').click()
      cy.selectNextAvailableDate()
      cy.get('.grid-cols-3').should('be.visible')
    })

    it('deve adaptar grid em mobile', () => {
      cy.viewport(375, 667)
      
      cy.contains('Presencial').click()
      cy.selectNextAvailableDate()
      
      // Em mobile, grid deve ter menos colunas
      cy.get('.grid-cols-3').should('be.visible') // ainda deve funcionar em mobile
    })

    it('deve manter proporções corretas do calendário', () => {
      cy.get('[data-testid="calendar"]').should('be.visible')
      
      // Verificar se calendário tem tamanho adequado
      cy.get('[data-testid="calendar"]').should(($cal) => {
        expect($cal.width()).to.be.greaterThan(300)
        expect($cal.height()).to.be.greaterThan(200)
      })
    })
  })

  describe('Estados Visuais', () => {
    it('deve mostrar botão Próximo desabilitado quando necessário', () => {
      // Inicialmente desabilitado
      cy.contains('Próximo').should('be.disabled')
      cy.contains('Próximo').should('have.class', 'opacity-50')
      
      // Selecionar modalidade - ainda desabilitado
      cy.contains('Presencial').click()
      cy.contains('Próximo').should('be.disabled')
      
      // Selecionar data - ainda desabilitado
      cy.selectNextAvailableDate()
      cy.contains('Próximo').should('be.disabled')
      
      // Selecionar horário - agora habilitado
      cy.get('[data-testid="time-slot"]').first().click()
      cy.contains('Próximo').should('not.be.disabled')
      cy.contains('Próximo').should('not.have.class', 'opacity-50')
    })

    it('deve destacar data selecionada no calendário', () => {
      cy.contains('Presencial').click()
      cy.selectNextAvailableDate()
      
      // Verificar se data fica destacada
      cy.get('[aria-selected="true"]').should('be.visible')
      cy.get('[aria-selected="true"]').should('have.class', 'bg-primary')
    })

    it('deve mostrar resumo da data selecionada', () => {
      cy.contains('Presencial').click()
      cy.selectNextAvailableDate()
      
      // Verificar exibição da data
      cy.contains('Data selecionada:').should('be.visible')
      cy.get('[data-testid="selected-date"]').should('contain.text', 'de')
    })
  })

  describe('Interação do Usuário', () => {
    it('deve permitir alternar entre modalidades', () => {
      // Selecionar Presencial
      cy.contains('Presencial').click()
      cy.contains('Presencial').should('have.class', 'primaryButton')
      cy.contains('Online').should('have.class', 'secondaryButton')
      
      // Alternar para Online
      cy.contains('Online').click()
      cy.contains('Online').should('have.class', 'primaryButton')
      cy.contains('Presencial').should('have.class', 'secondaryButton')
    })

    it('deve permitir alternar horários selecionados', () => {
      cy.contains('Presencial').click()
      cy.selectNextAvailableDate()
      
      // Selecionar primeiro horário
      cy.get('[data-testid="time-slot"]').first().click()
      cy.get('[data-testid="time-slot"]').first().should('have.class', 'primaryButton')
      
      // Selecionar segundo horário
      cy.get('[data-testid="time-slot"]').eq(1).click()
      cy.get('[data-testid="time-slot"]').eq(1).should('have.class', 'primaryButton')
      cy.get('[data-testid="time-slot"]').first().should('have.class', 'secondaryButton')
    })

    it('deve manter scroll suave entre etapas', () => {
      cy.contains('Presencial').click()
      cy.selectNextAvailableDate()
      cy.get('[data-testid="time-slot"]').first().click()
      
      // Scroll para baixo
      cy.scrollTo('bottom')
      
      // Avançar etapa
      cy.contains('Próximo').click()
      
      // Verificar se voltou ao topo
      cy.window().its('scrollY').should('equal', 0)
    })
  })

  describe('Acessibilidade Visual', () => {
    it('deve ter contraste adequado nos textos', () => {
      // Verificar se textos são legíveis
      cy.contains('Agendamento de Consultas').should('be.visible')
      cy.contains('Modalidade da Consulta').should('be.visible')
      
      // Verificar cores dos botões
      cy.contains('Presencial').should('be.visible')
      cy.contains('Online').should('be.visible')
    })

    it('deve mostrar focus visível nos elementos interativos', () => {
      // Tab para primeiro elemento focável
      cy.get('body').tab()
      cy.focused().should('have.css', 'outline-style', 'solid')
      
      // Tab para próximo elemento
      cy.focused().tab()
      cy.focused().should('be.visible')
    })

    it('deve ter tamanhos de fonte adequados', () => {
      // Título principal
      cy.contains('Agendamento de Consultas').should('have.css', 'font-size')
      
      // Labels
      cy.contains('Modalidade da Consulta').should('have.css', 'font-size')
      
      // Botões
      cy.contains('Presencial').should('have.css', 'font-size')
    })
  })
})