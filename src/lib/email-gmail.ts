// src/lib/email-gmail.ts - Sistema de email com Gmail SMTP

import nodemailer from "nodemailer";
import {
  createCancellationTemplate,
  createClinicCancellationTemplate,
  createClinicNotificationTemplate,
  createConfirmationTemplate,
} from "./email-templates";

// Interface para dados do email
interface EmailData {
  to: string;
  nome: string;
  data: string;
  horario: string;
  modalidade: string;
  codigo?: string;
  telefone?: string;
  endereco?: string; // ✅ ADICIONADO
}

// Configurar transporter do Gmail SMTP
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true para 465, false para outras portas
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // Para desenvolvimento
    },
  };

  console.log("📧 Configurando Gmail SMTP:", {
    host: config.host,
    port: config.port,
    user: config.auth.user?.substring(0, 5) + "***",
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
  const clinicEmail = process.env.CLINIC_EMAIL || "florirsentidos@gmail.com";
  const clinicName = process.env.CLINIC_NAME || "Michel de Camargo - Psicólogo";

  try {
    // Verificar configuração
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return true;
    }

    const transporter = createTransporter();

    // 🚀 PREPARAR TEMPLATES EM PARALELO
    const [htmlUsuario, htmlClinica] = await Promise.all([
      // Template usuário
      Promise.resolve(
        createConfirmationTemplate({
          nome: dados.nome,
          data: dataFormatada,
          horario: dados.horario,
          modalidade: dados.modalidade,
          codigo: dados.codigo,
          endereco: dados.endereco, // ✅ ADICIONADO
        }),
      ),
      // Template clínica
      Promise.resolve(
        createClinicNotificationTemplate({
          nome: dados.nome,
          email: dados.to,
          telefone: dados.telefone,
          data: dataFormatada,
          horario: dados.horario,
          modalidade: dados.modalidade,
          codigo: dados.codigo,
          endereco: dados.endereco, // ✅ ADICIONADO
        }),
      ),
    ]);

    // 🚀 ENVIAR EMAILS EM PARALELO (não sequencial)
    const [resultUsuario, resultClinica] = await Promise.allSettled([
      // Email para usuário
      transporter.sendMail({
        from: `"${clinicName}" <${clinicEmail}>`,
        to: dados.to,
        subject: "Confirmação de Agendamento de Consulta",
        html: htmlUsuario,
      }),
      // Email para clínica
      transporter.sendMail({
        from: `"Sistema de Agendamento" <${clinicEmail}>`,
        to: clinicEmail,
        subject: `[CLÍNICA] Novo Agendamento: ${dados.nome} - ${dataFormatada}`,
        html: htmlClinica,
      }),
    ]);

    // Análise dos resultados
    const usuarioOk = resultUsuario.status === "fulfilled";
    const clinicaOk = resultClinica.status === "fulfilled";

    // Sucesso se pelo menos um email foi enviado
    return usuarioOk || clinicaOk;
  } catch {
    return false;
  }
}

/**
 * Envia email de cancelamento para usuário e clínica
 */
export async function enviarEmailCancelamentoGmail(dados: EmailData): Promise<boolean> {
  const dataFormatada = formatarData(dados.data);
  const clinicEmail = process.env.CLINIC_EMAIL || "florirsentidos@gmail.com";
  const clinicName = process.env.CLINIC_NAME || "Michel de Camargo - Psicólogo";

  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return true;
    }

    const transporter = createTransporter();

    // Criar templates com identidade visual
    const htmlUsuario = createCancellationTemplate({
      nome: dados.nome,
      data: dataFormatada,
      horario: dados.horario,
      modalidade: dados.modalidade,
      endereco: dados.endereco, // ✅ ADICIONADO
    });

    const htmlClinica = createClinicCancellationTemplate({
      nome: dados.nome,
      email: dados.to,
      data: dataFormatada,
      horario: dados.horario,
      modalidade: dados.modalidade,
      endereco: dados.endereco, // ✅ ADICIONADO
    });

    // Enviar email para o usuário
    await transporter.sendMail({
      from: `"${clinicName}" <${clinicEmail}>`,
      to: dados.to,
      subject: "Confirmação de Cancelamento de Consulta",
      html: htmlUsuario,
    });

    // Enviar cópia para a clínica
    await transporter.sendMail({
      from: `"Sistema de Agendamento" <${clinicEmail}>`,
      to: clinicEmail,
      subject: `[CLÍNICA] Cancelamento: ${dados.nome} - ${dataFormatada}`,
      html: htmlClinica,
    });

    return true;
  } catch {
    return false;
  }
}
