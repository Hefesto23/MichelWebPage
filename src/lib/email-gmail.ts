// src/lib/email-gmail.ts - Sistema de email com Gmail SMTP

import nodemailer from 'nodemailer';
import { 
  createConfirmationTemplate, 
  createClinicNotificationTemplate,
  createCancellationTemplate,
  createClinicCancellationTemplate 
} from './email-templates';

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

    // Criar templates com identidade visual
    const htmlUsuario = createConfirmationTemplate({
      nome: dados.nome,
      data: dataFormatada,
      horario: dados.horario,
      modalidade: dados.modalidade,
      codigo: dados.codigo,
    });

    const htmlClinica = createClinicNotificationTemplate({
      nome: dados.nome,
      email: dados.to,
      telefone: dados.telefone,
      data: dataFormatada,
      horario: dados.horario,
      modalidade: dados.modalidade,
      codigo: dados.codigo,
    });

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

    // Criar templates com identidade visual
    const htmlUsuario = createCancellationTemplate({
      nome: dados.nome,
      data: dataFormatada,
      horario: dados.horario,
      modalidade: dados.modalidade,
    });

    const htmlClinica = createClinicCancellationTemplate({
      nome: dados.nome,
      email: dados.to,
      data: dataFormatada,
      horario: dados.horario,
      modalidade: dados.modalidade,
    });

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