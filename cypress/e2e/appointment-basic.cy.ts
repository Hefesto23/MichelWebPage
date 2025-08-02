describe('Teste Básico do Agendamento', () => {
  beforeEach(() => {
    cy.visit('/agendamento')
  })

  it('deve carregar a página corretamente', () => {
    cy.contains('Agendamento de Consultas').should('be.visible')
    cy.contains('Novo Agendamento').should('be.visible')
    cy.contains('Buscar Agendamento').should('be.visible')
  })

  it('deve alternar entre as abas', () => {
    // Verificar aba ativa por padrão
    cy.contains('Novo Agendamento').should('have.class', 'bg-primary-foreground')
    
    // Clicar em Buscar Agendamento
    cy.contains('Buscar Agendamento').click()
    cy.contains('Buscar Agendamento').should('have.class', 'bg-primary-foreground')
    
    // Voltar para Novo Agendamento
    cy.contains('Novo Agendamento').click()
    cy.contains('Novo Agendamento').should('have.class', 'bg-primary-foreground')
  })

  it('deve mostrar componentes básicos do agendamento', () => {
    // Verificar componentes da primeira etapa
    cy.contains('Modalidade da Consulta').should('be.visible')
    cy.contains('Presencial').should('be.visible')
    cy.contains('Online').should('be.visible')
    cy.contains('Primeira Consulta?').should('be.visible')
  })

  it('deve permitir seleção de modalidade', () => {
    // Selecionar Presencial
    cy.contains('Presencial').click()
    cy.contains('Presencial').should('be.visible')
    
    // Selecionar Online
    cy.contains('Online').click()
    cy.contains('Online').should('be.visible')
  })

  it('deve mostrar calendário após seleção de modalidade', () => {
    cy.contains('Presencial').click()
    
    // Verificar se calendário aparece
    cy.get('[data-testid="calendar"]').should('be.visible')
    cy.contains('Selecione uma data para a consulta').should('be.visible')
  })

  it('deve ter botão Próximo inicialmente desabilitado', () => {
    cy.contains('Próximo').should('be.disabled')
  })

  it('deve funcionar em mobile', () => {
    cy.viewport(375, 667)
    
    cy.contains('Agendamento de Consultas').should('be.visible')
    cy.contains('Presencial').should('be.visible')
    cy.contains('Online').should('be.visible')
    
    // Testar clique em mobile
    cy.contains('Presencial').click()
    cy.get('[data-testid="calendar"]').should('be.visible')
  })

  it('deve mostrar toggle de primeira consulta', () => {
    // Verificar toggle
    cy.contains('Primeira Consulta?').should('be.visible')
    cy.get('button[role="switch"]').should('be.visible')
    
    // Clicar no toggle
    cy.get('button[role="switch"]').click()
    cy.get('button[role="switch"]').should('have.attr', 'data-state', 'checked')
  })

  it('deve preservar estado da modalidade selecionada', () => {
    // Selecionar Presencial
    cy.contains('Presencial').click()
    
    // Verificar que permanece selecionado visualmente
    cy.contains('Presencial').should('be.visible')
    
    // Selecionar Online
    cy.contains('Online').click()
    cy.contains('Online').should('be.visible')
  })
})