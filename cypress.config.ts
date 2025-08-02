import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      // Variáveis de ambiente para os testes
      testEmail: 'teste@exemplo.com',
      testPhone: '(15) 99999-9999',
      testName: 'João Silva Teste'
    }
  },
})