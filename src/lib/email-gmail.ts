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
  const emailStartTime = Date.now();
  console.log('📧 Iniciando processamento de emails em background...');
  
  const dataFormatada = formatarData(dados.data);
  const clinicEmail = process.env.CLINIC_EMAIL || 'raszlster@gmail.com';
  const clinicName = process.env.CLINIC_NAME || 'Michel de Camargo - Psicólogo';

  try {
    // Verificar configuração
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.log("🧪 MODO DE DESENVOLVIMENTO - Simulando envio de emails");
      console.log(`📧 Para usuário: ${dados.to}, Para clínica: ${clinicEmail}`);
      console.log(`📄 ${dados.nome} - ${dataFormatada} às ${dados.horario}`);
      return true;
    }

    const transporter = createTransporter();

    // 🚀 PREPARAR TEMPLATES EM PARALELO
    const [htmlUsuario, htmlClinica] = await Promise.all([
      // Template usuário
      Promise.resolve(createConfirmationTemplate({
        nome: dados.nome,
        data: dataFormatada,
        horario: dados.horario,
        modalidade: dados.modalidade,
        codigo: dados.codigo,
      })),
      // Template clínica
      Promise.resolve(createClinicNotificationTemplate({
        nome: dados.nome,
        email: dados.to,
        telefone: dados.telefone,
        data: dataFormatada,
        horario: dados.horario,
        modalidade: dados.modalidade,
        codigo: dados.codigo,
      }))
    ]);

    // 🚀 ENVIAR EMAILS EM PARALELO (não sequencial)
    console.log('⚡ Enviando emails em paralelo...');
    
    const [resultUsuario, resultClinica] = await Promise.allSettled([
      // Email para usuário
      transporter.sendMail({
        from: `"${clinicName}" <${clinicEmail}>`,
        to: dados.to,
        subject: 'Confirmação de Agendamento de Consulta',
        html: htmlUsuario,
      }),
      // Email para clínica
      transporter.sendMail({
        from: `"Sistema de Agendamento" <${clinicEmail}>`,
        to: clinicEmail,
        subject: `[CLÍNICA] Novo Agendamento: ${dados.nome} - ${dataFormatada}`,
        html: htmlClinica,
      })
    ]);

    // Análise dos resultados
    const usuarioOk = resultUsuario.status === 'fulfilled';
    const clinicaOk = resultClinica.status === 'fulfilled';
    
    const emailTime = Date.now() - emailStartTime;
    console.log(`📧 Emails processados em ${emailTime}ms:`);
    console.log(`  👤 Usuário: ${usuarioOk ? '✅ Sucesso' : '❌ Falha'}`);
    console.log(`  🏥 Clínica: ${clinicaOk ? '✅ Sucesso' : '❌ Falha'}`);
    
    // Log de erros específicos
    if (!usuarioOk) {
      console.error('❌ Erro email usuário:', (resultUsuario as PromiseRejectedResult).reason);
    }
    if (!clinicaOk) {
      console.error('❌ Erro email clínica:', (resultClinica as PromiseRejectedResult).reason);
    }

    // Sucesso se pelo menos um email foi enviado
    return usuarioOk || clinicaOk;

  } catch (error) {
    const emailTime = Date.now() - emailStartTime;
    console.error(`❌ Erro geral nos emails após ${emailTime}ms:`, error);
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