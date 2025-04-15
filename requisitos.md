# Requisitos do Projeto - Site Psicólogo Michel

## 1. Visão Geral

Este documento apresenta os requisitos para o site do psicólogo Michel de Camargo, uma plataforma web destinada a promover seus serviços de psicoterapia, com foco especial no tratamento de ansiedade usando a Análise Comportamental (TCC).

## 2. Requisitos Funcionais

### 2.1. Navegação e Interface do Usuário

- [x] **RF001:** Barra de navegação com links para Home, Sobre, Terapias, Avaliações, Agendamento e Contato
- [x] **RF002:** Alternância entre modo claro e escuro
- [x] **RF003:** Botão de WhatsApp flutuante para contato rápido
- [x] **RF004:** Animações e transições entre páginas

### 2.2. Conteúdo Informativo

- [x] **RF005:** Página sobre o psicólogo, incluindo formação e abordagem profissional
- [x] **RF006:** Página com detalhes sobre os serviços e terapias oferecidos
- [x] **RF007:** Página com informações sobre avaliações psicológicas
- [x] **RF008:** Galeria com imagens do espaço clínico
- [ ] **RF009:** Conteúdo educativo sobre saúde mental, focado em ansiedade

### 2.3. Agendamento

- [x] **RF010:** Visualização de horários disponíveis para consultas
- [x] **RF011:** Formulário para agendamento de consultas
- [ ] **RF012:** Confirmação de agendamento (e-mail ou WhatsApp)
- [ ] **RF013:** Opção para cancelamento ou remarcação de consultas

### 2.4. Contato

- [ ] **RF014:** Formulário de contato para dúvidas e informações
- [x] **RF015:** Exibição de informações de contato (WhatsApp, endereço, horário)

### 2.5. Área Administrativa

- [x] **RF016:** Página de login para administração
- [x] **RF017:** Dashboard para visualização e gerenciamento de agendamentos
- [ ] **RF018:** Interface para atualização de conteúdo do site
- [ ] **RF019:** Configuração dos horários disponíveis para consultas
- [ ] **RF020:** Métricas e estatísticas básicas de uso do site

## 3. Requisitos Não Funcionais

### 3.1. Usabilidade e Design

- [ ] **RNF001:** Interface responsiva (desktop, tablet, mobile)
- [ ] **RNF002:** Tempo de carregamento rápido
- [x] **RNF003:** Navegação intuitiva
- [x] **RNF004:** Design que transmite profissionalismo e confiança

### 3.2. Técnicos

- [x] **RNF005:** Implementação com Next.js, React e Tailwind CSS
- [ ] **RNF006:** Banco de dados com Prisma ORM
- [ ] **RNF007:** Comunicações criptografadas (HTTPS)
- [x] **RNF008:** Proteção básica contra ataques comuns (XSS, CSRF)
- [x] **RNF009:** Autenticação segura para área administrativa
- [ ] **RNF010:** Compatibilidade com navegadores principais (Chrome, Firefox, Safari, Edge)

## 4. Considerações de Negócio

- [ ] **RN001:** Transmitir a identidade visual e abordagem do psicólogo
- [ ] **RN002:** Facilitar o agendamento de consultas, reduzindo trabalho manual
- [ ] **RN003:** Apresentar informações claras sobre serviços e valores
- [ ] **RN004:** Funcionar como uma ferramenta de primeiro contato com potenciais clientes
- [ ] **RN005:** Cumprir normas do conselho de psicologia referentes à divulgação de serviços

## 5. Entregas

- [x] **E001:** Layout e design de todas as páginas
- [x] **E002:** Implementação front-end (responsivo, temas claro/escuro)
- [ ] **E003:** Implementação do sistema de agendamento
- [x] **E004:** Área administrativa funcional
- [x] **E005:** Integração com WhatsApp para comunicação
- [ ] **E006:** Teste e depuração
- [ ] **E007:** Lançamento e configuração no servidor

## 6. Ajustes

- [x] **AJ01:** Tirar os shapes decorativos
- [ ] **AJ02:** Alterar e criar os logos em vetor de alta resolução
- [ ] **AJ03:** Adicionar o símbolo da Logomarca nas telas de transição
- [x] **AJ04:** Modularizar o css por página com .modules.css
- [x] **AJ05:** Ajustar o tamanho do carrossel na página principal
- [x] **AJ06:** Ajustar o espaçamento horizontal de todo o site(uniforme)
- [ ] **AJ07:** Bug: Transições de página não funcionam para Agendamento e Home
- [ ] **AJ08:** Ajustar o alinhamento do Logo do Michel no Footer
- [ ] **AJ09:** Ajustar o carrossel da galeria de imagem

---

**Notas:**

- Este documento serve como checklist para o desenvolvimento do site
- Os requisitos podem ser marcados como concluídos à medida que forem implementados
- Qualquer alteração nos requisitos deve ser discutida e documentada
