/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Seleciona a próxima data disponível no calendário (próxima segunda-feira)
       */
      selectNextAvailableDate(): Chainable<Element>
      
      /**
       * Completa todo o fluxo de agendamento até a confirmação
       */
      completeAppointmentFlow(): Chainable<Element>
      
      /**
       * Navega usando Tab
       */
      tab(): Chainable<Element>
      
      /**
       * Preenche formulário de contato
       */
      fillContactForm(name?: string, email?: string, phone?: string, message?: string): Chainable<Element>
    }
  }
}

// Comando para selecionar próxima data disponível
Cypress.Commands.add('selectNextAvailableDate', () => {
  // Aguardar calendário estar visível
  cy.get('[data-testid="calendar"]', { timeout: 10000 }).should('be.visible')
  
  // Encontrar próxima segunda ou terça disponível
  const today = new Date()
  let nextAvailableDay = new Date(today)
  
  // Calcular próxima segunda-feira (dia 1) ou terça-feira (dia 2)
  const currentDay = today.getDay()
  let daysToAdd = 1 // próxima segunda
  
  if (currentDay === 0) { // domingo
    daysToAdd = 1
  } else if (currentDay >= 1 && currentDay <= 4) { // seg-qui
    daysToAdd = 1
  } else { // sex-sab
    daysToAdd = (8 - currentDay) % 7 || 1
  }
  
  nextAvailableDay.setDate(today.getDate() + daysToAdd)
  const dayToSelect = nextAvailableDay.getDate()
  
  // Clicar na data no calendário
  cy.get('[data-testid="calendar"]')
    .find('button')
    .contains(dayToSelect.toString())
    .not('[disabled]')
    .first()
    .click()
    
  // Aguardar a data ser processada
  cy.wait(2000)
})

// Comando para completar fluxo de agendamento
Cypress.Commands.add('completeAppointmentFlow', () => {
  // Passo 1: Seleção de data e horário
  cy.contains('Presencial').click()
  cy.selectNextAvailableDate()
  cy.get('[data-testid="time-slot"]').first().click()
  cy.contains('Próximo').click()
  
  // Passo 2: Informações de contato
  cy.fillContactForm()
  cy.contains('Próximo').click()
  
  // Agora está na tela de confirmação
  cy.contains('Confirme seus Dados').should('be.visible')
})

// Comando para navegar com Tab
Cypress.Commands.add('tab', { prevSubject: 'element' }, (subject) => {
  return cy.wrap(subject).trigger('keydown', { key: 'Tab' })
})

// Comando para preencher formulário de contato
Cypress.Commands.add('fillContactForm', (
  name = Cypress.env('testName'),
  email = Cypress.env('testEmail'), 
  phone = Cypress.env('testPhone'),
  message = 'Teste automatizado - favor ignorar'
) => {
  cy.get('input[name="nome"]').clear().type(name)
  cy.get('input[name="email"]').clear().type(email)
  cy.get('input[name="telefone"]').clear().type(phone)
  if (message) {
    cy.get('textarea[name="mensagem"]').clear().type(message)
  }
})