// src/lib/email-gmail.ts - Sistema de email com Gmail SMTP

import nodemailer from 'nodemailer';

// Interface para dados do email
interface EmailData {
  to: string;
  nome: string;
  data: string;
  horario: string;
  modalidade: string;
  codigo?: string;
  telefone?: string;
}

// Configurar transporter do Gmail SMTP
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true para 465, false para outras portas
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // Para desenvolvimento
    },
  };

  console.log('📧 Configurando Gmail SMTP:', {
    host: config.host,
    port: config.port,
    user: config.auth.user?.substring(0, 5) + '***',
    hasPassword: !!config.auth.pass,
  });

  return nodemailer.createTransport(config);
};

// Formatar data para exibição
const formatarData = (dataString: string): string => {
  try {
    const data = new Date(dataString + "T12:00:00");
    return data.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long", 
      year: "numeric",
    });
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return dataString;
  }
};

/**
 * Envia email de confirmação de agendamento para usuário e clínica
 */
export async function enviarEmailConfirmacaoGmail(dados: EmailData): Promise<boolean> {
  const dataFormatada = formatarData(dados.data);
  const clinicEmail = process.env.CLINIC_EMAIL || 'raszlster@gmail.com';
  const clinicName = process.env.CLINIC_NAME || 'Michel de Camargo - Psicólogo';

  try {
    // Verificar configuração
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.log("\n🧪 === MODO DE DESENVOLVIMENTO - Gmail SMTP ===");
      console.log("📧 Para usuário:", dados.to);
      console.log("📧 Para clínica:", clinicEmail);
      console.log("📋 Assunto: Confirmação de Agendamento");
      console.log("📄 Dados:", { nome: dados.nome, data: dataFormatada, horario: dados.horario });
      console.log("⚠️  Configure GMAIL_USER e GMAIL_APP_PASSWORD no .env para envios reais");
      return true;
    }

    const transporter = createTransporter();

    // Template para o usuário
    const htmlUsuario = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2e5597; margin: 0;">✅ Agendamento Confirmado!</h1>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="font-size: 16px; margin-bottom: 15px;">Olá <strong>${dados.nome}</strong>,</p>
          <p style="font-size: 16px; margin-bottom: 20px;">Sua consulta foi agendada com sucesso!</p>
          
          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2e5597;">
            <h3 style="margin-top: 0; color: #2e5597;">📋 Detalhes da Consulta:</h3>
            <p style="margin: 8px 0;"><strong>📅 Data:</strong> ${dataFormatada}</p>
            <p style="margin: 8px 0;"><strong>⏰ Horário:</strong> ${dados.horario}</p>
            <p style="margin: 8px 0;"><strong>🏥 Modalidade:</strong> ${dados.modalidade}</p>
            ${dados.codigo ? `<p style="margin: 8px 0;"><strong>🔢 Código de confirmação:</strong> <span style="background: #fff3e0; padding: 4px 8px; border-radius: 4px; font-weight: bold; color: #e65100; font-size: 18px;">${dados.codigo}</span></p>` : ""}
          </div>
          
          <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800;">
            <p style="margin: 0;"><strong>📝 Importante:</strong> Guarde este código para futuras consultas, cancelamentos ou remarcações.</p>
          </div>
          
          ${dados.modalidade === "online" ? 
            `<div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
              <p style="margin: 0;"><strong>💻 Modalidade Online:</strong> O link para a sessão online será enviado para você no dia da consulta.</p>
            </div>` : 
            `<div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
              <p style="margin: 0;"><strong>📍 Consultório:</strong> Rua Antônio Ferreira, 171 - Parque Campolim, Sorocaba SP.</p>
            </div>`
          }
        </div>
        
        <div style="text-align: center; padding: 20px; border-top: 1px solid #ddd; color: #666;">
          <p style="margin: 5px 0;">📱 WhatsApp: (15) 99764-6421</p>
          <p style="margin: 5px 0; font-size: 12px;">© ${new Date().getFullYear()} ${clinicName}</p>
          <p style="margin: 5px 0; font-size: 12px;">Rua Antônio Ferreira, 171 - Parque Campolim, Sorocaba SP</p>
        </div>
      </div>
    `;

    // Template para a clínica
    const htmlClinica = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f0f8ff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2e5597; margin: 0;">🔔 Novo Agendamento Recebido</h1>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="font-size: 16px; margin-bottom: 20px;"><strong>Um novo agendamento foi realizado no sistema!</strong></p>
          
          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2e5597;">
            <h3 style="margin-top: 0; color: #2e5597;">👤 Dados do Cliente:</h3>
            <p style="margin: 8px 0;"><strong>Nome:</strong> ${dados.nome}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${dados.to}</p>
            ${dados.telefone ? `<p style="margin: 8px 0;"><strong>Telefone:</strong> ${dados.telefone}</p>` : ''}
            <p style="margin: 8px 0;"><strong>Data:</strong> ${dataFormatada}</p>
            <p style="margin: 8px 0;"><strong>Horário:</strong> ${dados.horario}</p>
            <p style="margin: 8px 0;"><strong>Modalidade:</strong> ${dados.modalidade}</p>
            <p style="margin: 8px 0;"><strong>Código:</strong> <span style="background: #fff3e0; padding: 4px 8px; border-radius: 4px; font-weight: bold; color: #e65100; font-size: 16px;">${dados.codigo}</span></p>
          </div>
          
          <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
            <h3 style="margin-top: 0; color: #2e7d32;">📝 Status:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>✅ Cliente recebeu email de confirmação</li>
              <li>📅 Evento criado no Google Calendar</li>
              <li>💬 Pronto para contato se necessário</li>
              ${dados.modalidade === "online" ? 
                `<li>💻 Lembrar de enviar link da sessão online</li>` : 
                `<li>📍 Cliente comparecerá ao consultório</li>`
              }
            </ul>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; border-top: 1px solid #ddd; color: #666;">
          <p style="margin: 5px 0; font-size: 12px;">📧 Notificação automática do sistema de agendamento</p>
          <p style="margin: 5px 0; font-size: 12px;">© ${new Date().getFullYear()} ${clinicName}</p>
        </div>
      </div>
    `;

    console.log('\n📧 Enviando emails de confirmação...');
    
    // Enviar email para o usuário
    console.log('📤 Enviando para usuário:', dados.to);
    await transporter.sendMail({
      from: `"${clinicName}" <${clinicEmail}>`,
      to: dados.to,
      subject: 'Confirmação de Agendamento de Consulta',
      html: htmlUsuario,
    });
    console.log('✅ Email enviado para usuário com sucesso!');

    // Enviar cópia para a clínica
    console.log('📤 Enviando cópia para clínica:', clinicEmail);
    await transporter.sendMail({
      from: `"Sistema de Agendamento" <${clinicEmail}>`,
      to: clinicEmail,
      subject: `[CLÍNICA] Novo Agendamento: ${dados.nome} - ${dataFormatada}`,
      html: htmlClinica,
    });
    console.log('✅ Email enviado para clínica com sucesso!');

    return true;

  } catch (error) {
    console.error('❌ Erro ao enviar emails via Gmail SMTP:', error);
    return false;
  }
}

/**
 * Envia email de cancelamento para usuário e clínica
 */
export async function enviarEmailCancelamentoGmail(dados: EmailData): Promise<boolean> {
  const dataFormatada = formatarData(dados.data);
  const clinicEmail = process.env.CLINIC_EMAIL || 'raszlster@gmail.com';
  const clinicName = process.env.CLINIC_NAME || 'Michel de Camargo - Psicólogo';

  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.log("\n🧪 === MODO DE DESENVOLVIMENTO - CANCELAMENTO Gmail SMTP ===");
      console.log("📧 Para usuário:", dados.to);
      console.log("📧 Para clínica:", clinicEmail);
      console.log("📋 Assunto: Cancelamento de Consulta");
      return true;
    }

    const transporter = createTransporter();

    // Template para o usuário (cancelamento)
    const htmlUsuario = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #fff5f5;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #d32f2f; margin: 0;">❌ Consulta Cancelada</h1>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="font-size: 16px; margin-bottom: 15px;">Olá <strong>${dados.nome}</strong>,</p>
          <p style="font-size: 16px; margin-bottom: 20px;">Sua consulta foi cancelada com sucesso.</p>
          
          <div style="background-color: #ffebee; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d32f2f;">
            <h3 style="margin-top: 0; color: #d32f2f;">📋 Consulta Cancelada:</h3>
            <p style="margin: 8px 0;"><strong>📅 Data:</strong> ${dataFormatada}</p>
            <p style="margin: 8px 0;"><strong>⏰ Horário:</strong> ${dados.horario}</p>
            <p style="margin: 8px 0;"><strong>🏥 Modalidade:</strong> ${dados.modalidade}</p>
          </div>
          
          <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
            <p style="margin: 0;"><strong>🔄 Para reagendar:</strong> Visite nosso site ou entre em contato pelo WhatsApp.</p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; border-top: 1px solid #ddd; color: #666;">
          <p style="margin: 5px 0;">📱 WhatsApp: (15) 99764-6421</p>
          <p style="margin: 5px 0; font-size: 12px;">© ${new Date().getFullYear()} ${clinicName}</p>
        </div>
      </div>
    `;

    // Template para a clínica (cancelamento)
    const htmlClinica = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #fff8f0;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #d32f2f; margin: 0;">🚫 Agendamento Cancelado</h1>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="font-size: 16px; margin-bottom: 20px;"><strong>Um agendamento foi cancelado no sistema!</strong></p>
          
          <div style="background-color: #ffebee; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d32f2f;">
            <h3 style="margin-top: 0; color: #d32f2f;">👤 Dados do Cancelamento:</h3>
            <p style="margin: 8px 0;"><strong>Cliente:</strong> ${dados.nome}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${dados.to}</p>
            <p style="margin: 8px 0;"><strong>Data:</strong> ${dataFormatada}</p>
            <p style="margin: 8px 0;"><strong>Horário:</strong> ${dados.horario}</p>
            <p style="margin: 8px 0;"><strong>Modalidade:</strong> ${dados.modalidade}</p>
          </div>
          
          <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800;">
            <h3 style="margin-top: 0; color: #e65100;">📝 Ações:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>📅 Verificar Google Calendar</li>
              <li>⏰ Horário disponível para novos agendamentos</li>
              <li>💬 Cliente notificado sobre cancelamento</li>
            </ul>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; border-top: 1px solid #ddd; color: #666;">
          <p style="margin: 5px 0; font-size: 12px;">📧 Notificação automática do sistema</p>
          <p style="margin: 5px 0; font-size: 12px;">© ${new Date().getFullYear()} ${clinicName}</p>
        </div>
      </div>
    `;

    console.log('\n📧 Enviando emails de cancelamento...');
    
    // Enviar email para o usuário
    await transporter.sendMail({
      from: `"${clinicName}" <${clinicEmail}>`,
      to: dados.to,
      subject: 'Confirmação de Cancelamento de Consulta',
      html: htmlUsuario,
    });
    console.log('✅ Email de cancelamento enviado para usuário!');

    // Enviar cópia para a clínica
    await transporter.sendMail({
      from: `"Sistema de Agendamento" <${clinicEmail}>`,
      to: clinicEmail,
      subject: `[CLÍNICA] Cancelamento: ${dados.nome} - ${dataFormatada}`,
      html: htmlClinica,
    });
    console.log('✅ Email de cancelamento enviado para clínica!');

    return true;

  } catch (error) {
    console.error('❌ Erro ao enviar emails de cancelamento via Gmail SMTP:', error);
    return false;
  }
}