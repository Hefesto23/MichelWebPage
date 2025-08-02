// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Configurações globais
beforeEach(() => {
  // Configurar viewport padrão
  cy.viewport(1280, 720)
  
  // Interceptar requisições de analytics para evitar interferência
  cy.intercept('POST', '**/analytics/**', { statusCode: 200 }).as('analytics')
  
  // Configurar timeout padrão
  Cypress.config('defaultCommandTimeout', 10000)
})

// Lidar com exceções não capturadas
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignorar erros específicos que não afetam os testes
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  if (err.message.includes('Non-Error promise rejection captured')) {
    return false
  }
  
  // Permitir que outros erros falhem o teste
  return true
})