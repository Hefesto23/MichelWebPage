// src/lib/email-templates.ts - Templates de email com identidade visual

// Cores do tema escuro
const THEME_COLORS = {
  background: '#001046',
  foreground: '#fafafa',
  card: '#0a0a0a',
  cardForeground: '#fafafa',
  btn: '#c4d6ed',
  btnFg: '#001046',
  btnBorder: '#626b77',
  primary: '#1a2859',
  primaryForeground: '#ffbf9e',
  secondary: '#2a2a2a',
  secondaryForeground: '#fafafa',
  muted: '#2a2a2a',
  mutedForeground: '#a3a3a3',
  accent: '#3a3a3a',
  accentForeground: '#fafafa',
  border: '#2a2a2a',
  destructive: '#991b1b',
  destructiveForeground: '#ffffff',
};


// Template base com identidade visual
export const createEmailTemplate = (content: string, title: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;400;700&display=swap');
        
        * { box-sizing: border-box; }
        body { 
            margin: 0; 
            padding: 0; 
            font-family: 'Roboto Slab', serif; 
            background-color: ${THEME_COLORS.background};
            color: ${THEME_COLORS.foreground};
            line-height: 1.6;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: ${THEME_COLORS.background};
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .header {
            background: linear-gradient(135deg, ${THEME_COLORS.primary} 0%, ${THEME_COLORS.background} 100%);
            padding: 40px 20px 35px 20px;
            text-align: center;
            border-bottom: 2px solid ${THEME_COLORS.primaryForeground};
        }
        
        .clinic-name {
            font-size: 32px;
            font-weight: 900;
            color: ${THEME_COLORS.primaryForeground};
            margin: 0 0 8px 0;
            letter-spacing: 1px;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
        }
        
        .clinic-subtitle {
            font-size: 16px;
            color: ${THEME_COLORS.mutedForeground};
            margin: 0;
            font-weight: 400;
            letter-spacing: 0.5px;
        }
        
        .clinic-crp {
            font-size: 14px;
            color: ${THEME_COLORS.primaryForeground};
            margin: 5px 0 0 0;
            font-weight: 600;
            opacity: 0.9;
        }
        
        .content {
            padding: 30px 20px;
            background-color: ${THEME_COLORS.card};
        }
        
        .title {
            font-size: 22px;
            font-weight: 700;
            color: ${THEME_COLORS.primaryForeground};
            margin: 0 0 20px 0;
            text-align: center;
        }
        
        .card {
            background-color: ${THEME_COLORS.secondary};
            border: 1px solid ${THEME_COLORS.border};
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid ${THEME_COLORS.primaryForeground};
        }
        
        .card-title {
            font-size: 18px;
            font-weight: 700;
            color: ${THEME_COLORS.primaryForeground};
            margin: 0 0 15px 0;
        }
        
        .info-row {
            display: flex;
            align-items: center;
            margin: 12px 0;
            padding: 8px 0;
        }
        
        .info-icon {
            margin-right: 12px;
            font-size: 18px;
        }
        
        .info-label {
            font-weight: 600;
            color: ${THEME_COLORS.mutedForeground};
            margin-right: 8px;
            min-width: 80px;
        }
        
        .info-value {
            color: ${THEME_COLORS.foreground};
            font-weight: 500;
        }
        
        .highlight-box {
            background: linear-gradient(135deg, ${THEME_COLORS.primaryForeground} 0%, #cf9373 100%);
            color: ${THEME_COLORS.btnFg};
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
            font-weight: 700;
            font-size: 16px;
        }
        
        .alert-box {
            background-color: rgba(255, 191, 158, 0.1);
            border: 1px solid ${THEME_COLORS.primaryForeground};
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
        }
        
        .alert-title {
            font-weight: 700;
            color: ${THEME_COLORS.primaryForeground};
            margin: 0 0 8px 0;
        }
        
        .footer {
            background-color: ${THEME_COLORS.primary};
            padding: 25px 20px;
            text-align: center;
            border-top: 2px solid ${THEME_COLORS.primaryForeground};
        }
        
        .footer-info {
            color: ${THEME_COLORS.mutedForeground};
            font-size: 14px;
            margin: 5px 0;
        }
        
        .footer-contact {
            color: ${THEME_COLORS.primaryForeground};
            font-weight: 600;
            font-size: 16px;
            margin: 10px 0;
            text-decoration: none;
        }
        
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, ${THEME_COLORS.border} 50%, transparent 100%);
            margin: 20px 0;
        }
        
        @media (max-width: 600px) {
            .email-container { margin: 10px; }
            .content, .header, .footer { padding: 20px 15px; }
            .clinic-name { font-size: 20px; }
            .title { font-size: 18px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1 class="clinic-name">Michel de Camargo</h1>
            <p class="clinic-subtitle">Psicólogo Clínico</p>
            <p class="clinic-crp">CRP 06/123456</p>
        </div>
        
        <div class="content">
            ${content}
        </div>
        
        <div class="footer">
            <p class="footer-info">📍 Rua Antônio Ferreira, 171 - Parque Campolim, Sorocaba SP</p>
            <a href="https://wa.me/5515997646421" class="footer-contact">📱 WhatsApp: (15) 99764-6421</a>
            <div class="divider"></div>
            <p class="footer-info">© ${new Date().getFullYear()} Michel de Camargo - Psicólogo</p>
            <p class="footer-info">Este é um email automático do sistema de agendamento</p>
        </div>
    </div>
</body>
</html>
`;

// Template para confirmação de agendamento (usuário)
export const createConfirmationTemplate = (dados: {
  nome: string;
  data: string;
  horario: string;
  modalidade: string;
  codigo?: string;
}) => {
  const content = `
    <h2 class="title">✅ Agendamento Confirmado!</h2>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
        Olá <strong>${dados.nome}</strong>,<br>
        Sua consulta foi agendada com sucesso!
    </p>
    
    <div class="card">
        <h3 class="card-title">📋 Detalhes da Consulta</h3>
        
        <div class="info-row">
            <span class="info-icon">📅</span>
            <span class="info-label">Data:</span>
            <span class="info-value">${dados.data}</span>
        </div>
        
        <div class="info-row">
            <span class="info-icon">⏰</span>
            <span class="info-label">Horário:</span>
            <span class="info-value">${dados.horario}</span>
        </div>
        
        <div class="info-row">
            <span class="info-icon">🏥</span>
            <span class="info-label">Modalidade:</span>
            <span class="info-value">${dados.modalidade}</span>
        </div>
    </div>
    
    ${dados.codigo ? `
    <div class="highlight-box">
        🔢 Código de Confirmação: <strong>${dados.codigo}</strong>
    </div>
    ` : ''}
    
    <div class="alert-box">
        <p class="alert-title">📝 Importante:</p>
        <p style="margin: 0; color: ${THEME_COLORS.foreground};">
            Guarde este código para futuras consultas, cancelamentos ou remarcações.
        </p>
    </div>
    
    ${dados.modalidade === "online" ? `
    <div class="alert-box">
        <p class="alert-title">💻 Modalidade Online:</p>
        <p style="margin: 0; color: ${THEME_COLORS.foreground};">
            O link para a sessão online será enviado para você no dia da consulta.
        </p>
    </div>
    ` : `
    <div class="alert-box">
        <p class="alert-title">📍 Consultório:</p>
        <p style="margin: 0; color: ${THEME_COLORS.foreground};">
            Rua Antônio Ferreira, 171 - Parque Campolim, Sorocaba SP.
        </p>
    </div>
    `}
  `;
  
  return createEmailTemplate(content, 'Confirmação de Agendamento');
};

// Template para notificação da clínica
export const createClinicNotificationTemplate = (dados: {
  nome: string;
  email: string;
  telefone?: string;
  data: string;
  horario: string;
  modalidade: string;
  codigo?: string;
}) => {
  const content = `
    <h2 class="title">🔔 Novo Agendamento Recebido</h2>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
        <strong>Um novo agendamento foi realizado no sistema!</strong>
    </p>
    
    <div class="card">
        <h3 class="card-title">👤 Dados do Cliente</h3>
        
        <div class="info-row">
            <span class="info-icon">👨‍💼</span>
            <span class="info-label">Nome:</span>
            <span class="info-value">${dados.nome}</span>
        </div>
        
        <div class="info-row">
            <span class="info-icon">📧</span>
            <span class="info-label">Email:</span>
            <span class="info-value">${dados.email}</span>
        </div>
        
        ${dados.telefone ? `
        <div class="info-row">
            <span class="info-icon">📱</span>
            <span class="info-label">Telefone:</span>
            <span class="info-value">${dados.telefone}</span>
        </div>
        ` : ''}
        
        <div class="info-row">
            <span class="info-icon">📅</span>
            <span class="info-label">Data:</span>
            <span class="info-value">${dados.data}</span>
        </div>
        
        <div class="info-row">
            <span class="info-icon">⏰</span>
            <span class="info-label">Horário:</span>
            <span class="info-value">${dados.horario}</span>
        </div>
        
        <div class="info-row">
            <span class="info-icon">🏥</span>
            <span class="info-label">Modalidade:</span>
            <span class="info-value">${dados.modalidade}</span>
        </div>
    </div>
    
    ${dados.codigo ? `
    <div class="highlight-box">
        🔢 Código de Confirmação: <strong>${dados.codigo}</strong>
    </div>
    ` : ''}
    
    <div class="card">
        <h3 class="card-title">📝 Status do Sistema</h3>
        <ul style="margin: 0; padding-left: 20px; color: ${THEME_COLORS.foreground};">
            <li>✅ Cliente recebeu email de confirmação</li>
            <li>📅 Evento criado no Google Calendar</li>
            <li>💾 Dados salvos no banco de dados</li>
            <li>💬 Pronto para contato se necessário</li>
            ${dados.modalidade === "online" ? 
                '<li>💻 Lembrar de enviar link da sessão online</li>' : 
                '<li>📍 Cliente comparecerá ao consultório</li>'
            }
        </ul>
    </div>
  `;
  
  return createEmailTemplate(content, 'Novo Agendamento - Sistema');
};

// Template para cancelamento (usuário)
export const createCancellationTemplate = (dados: {
  nome: string;
  data: string;
  horario: string;
  modalidade: string;
}) => {
  const content = `
    <h2 class="title" style="color: ${THEME_COLORS.destructive};">❌ Consulta Cancelada</h2>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
        Olá <strong>${dados.nome}</strong>,<br>
        Sua consulta foi cancelada com sucesso.
    </p>
    
    <div class="card" style="border-left-color: ${THEME_COLORS.destructive};">
        <h3 class="card-title" style="color: ${THEME_COLORS.destructive};">📋 Consulta Cancelada</h3>
        
        <div class="info-row">
            <span class="info-icon">📅</span>
            <span class="info-label">Data:</span>
            <span class="info-value">${dados.data}</span>
        </div>
        
        <div class="info-row">
            <span class="info-icon">⏰</span>
            <span class="info-label">Horário:</span>
            <span class="info-value">${dados.horario}</span>
        </div>
        
        <div class="info-row">
            <span class="info-icon">🏥</span>
            <span class="info-label">Modalidade:</span>
            <span class="info-value">${dados.modalidade}</span>
        </div>
    </div>
    
    <div class="alert-box">
        <p class="alert-title">🔄 Para reagendar:</p>
        <p style="margin: 0; color: ${THEME_COLORS.foreground};">
            Visite nosso site ou entre em contato pelo WhatsApp para agendar uma nova consulta.
        </p>
    </div>
  `;
  
  return createEmailTemplate(content, 'Cancelamento de Consulta');
};

// Template para cancelamento (clínica)
export const createClinicCancellationTemplate = (dados: {
  nome: string;
  email: string;
  data: string;
  horario: string;
  modalidade: string;
}) => {
  const content = `
    <h2 class="title" style="color: ${THEME_COLORS.destructive};">🚫 Agendamento Cancelado</h2>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
        <strong>Um agendamento foi cancelado no sistema!</strong>
    </p>
    
    <div class="card" style="border-left-color: ${THEME_COLORS.destructive};">
        <h3 class="card-title" style="color: ${THEME_COLORS.destructive};">👤 Dados do Cancelamento</h3>
        
        <div class="info-row">
            <span class="info-icon">👨‍💼</span>
            <span class="info-label">Cliente:</span>
            <span class="info-value">${dados.nome}</span>
        </div>
        
        <div class="info-row">
            <span class="info-icon">📧</span>
            <span class="info-label">Email:</span>
            <span class="info-value">${dados.email}</span>
        </div>
        
        <div class="info-row">
            <span class="info-icon">📅</span>
            <span class="info-label">Data:</span>
            <span class="info-value">${dados.data}</span>
        </div>
        
        <div class="info-row">
            <span class="info-icon">⏰</span>
            <span class="info-label">Horário:</span>
            <span class="info-value">${dados.horario}</span>
        </div>
        
        <div class="info-row">
            <span class="info-icon">🏥</span>
            <span class="info-label">Modalidade:</span>
            <span class="info-value">${dados.modalidade}</span>
        </div>
    </div>
    
    <div class="card">
        <h3 class="card-title">📝 Ações Realizadas</h3>
        <ul style="margin: 0; padding-left: 20px; color: ${THEME_COLORS.foreground};">
            <li>📅 Verificar Google Calendar</li>
            <li>⏰ Horário disponível para novos agendamentos</li>
            <li>💬 Cliente notificado sobre cancelamento</li>
            <li>💾 Status atualizado no banco de dados</li>
        </ul>
    </div>
  `;
  
  return createEmailTemplate(content, 'Cancelamento - Sistema');
};