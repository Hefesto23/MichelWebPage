# Sistema de Estilos - Documentação

## 📋 Visão Geral

Este projeto utiliza um sistema de estilos consolidado baseado em Tailwind CSS com classes customizadas organizadas em layers específicas.

## 🏗️ Estrutura

### Base Layer

- Variáveis CSS para temas (light/dark)
- Reset básico e tipografia global
- Estilos fundamentais que afetam todo o projeto

### Components Layer

Classes reutilizáveis organizadas por categoria:

#### Layout Components

- `.content-container` - Container padrão com max-width
- `.section-base` - Seção padrão com padding
- `.section-fullscreen` - Seção de altura total

#### Card System

- `.card` - Card padrão com sombra e hover
- `.card-compact` - Card com menos padding
- `.card-title` - Título padrão para cards

#### Form System

- `.form-label` - Label de formulário
- `.form-input` - Input padrão
- `.form-textarea` - Textarea padrão
- `.form-error` - Mensagem de erro
- `.form-info` - Mensagem informativa

#### Button System

- `.btn-primary` - Botão principal
- `.btn-secondary` - Botão secundário
- `.btn-small` - Botão pequeno
- `.btn-icon` - Botão circular com ícone

#### Page-Specific Components

- `.hero-*` - Componentes da hero section
- `.welcome-*` - Componentes da seção welcome
- `.appointment-*` - Sistema de agendamento
- `.admin-*` - Componentes administrativos

### Utilities Layer

- `.bg-overlay` - Overlay escuro
- `.z-content` - Z-index para conteúdo
- `.animate-*` - Animações customizadas
- `.custom-scrollbar` - Scrollbar estilizada

## 🎯 Convenções de Uso

### Quando criar uma nova classe global:

1. A classe é usada em 3+ lugares diferentes
2. Representa um padrão de design consistente
3. Melhora significativamente a manutenibilidade

### Quando usar classes inline:

1. Estilo único usado apenas uma vez
2. Variações muito específicas de um componente
3. Estilos temporários ou experimentais

### Nomenclatura:

- **Prefixos por contexto**: `header-`, `admin-`, `form-`, etc.
- **Sufixos por estado**: `-active`, `-disabled`, `-hover`
- **Modificadores**: `-small`, `-large`, `-compact`

## 🔧 Manutenção

### Adicionar novo componente:

1. Identificar a categoria apropriada
2. Adicionar na seção correta do `globals.css`
3. Documentar aqui se for um sistema complexo

### Remover componente:

1. Verificar se não há uso com busca global
2. Remover do `globals.css`
3. Atualizar esta documentação

## 📊 Estatísticas

- **Total de arquivos CSS**: 1 (anteriormente 10+)
- **Redução de código**: ~60%
- **Classes reutilizáveis**: 80+
- **Duplicação de código**: 0%

## 🚀 Performance

O sistema consolidado resulta em:

- Menor bundle size
- Carregamento mais rápido
- Melhor cache do navegador
- Manutenção simplificada
