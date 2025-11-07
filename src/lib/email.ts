// src/lib/email.ts

import sgMail from "@sendgrid/mail";

// Inicializar a API do SendGrid com a chave
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailData {
  to: string;
  nome: string;
  data: string;
  horario: string;
  modalidade: string;
  codigo?: string;
}

// Formatar data para exibição
const formatarData = (dataString: string): string => {
  try {
    const data = new Date(dataString);
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
 * Envia email de confirmação de agendamento
 */
export async function enviarEmailConfirmacao(
  dados: EmailData
): Promise<boolean> {
  const dataFormatada = formatarData(dados.data);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #2e5597; text-align: center;">Confirmação de Agendamento</h2>
      <p>Olá <strong>${dados.nome}</strong>,</p>
      <p>Sua consulta foi agendada com sucesso!</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Data:</strong> ${dataFormatada}</p>
        <p><strong>Horário:</strong> ${dados.horario}</p>
        <p><strong>Modalidade:</strong> ${dados.modalidade}</p>
        ${
          dados.codigo
            ? `<p><strong>Código de confirmação:</strong> ${dados.codigo}</p>`
            : ""
        }
      </div>
      
      <p>Guarde este código para futuras consultas, cancelamentos ou remarcações.</p>
      
      ${
        dados.modalidade === "online"
          ? `<p>Um link para a sessão online será enviado para você no dia da consulta.</p>`
          : `<p>O consultório está localizado na Rua Antônio Ferreira, 171 - Parque Campolim, Sorocaba SP.</p>`
      }
      
      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        Em caso de dúvidas, entre em contato pelo WhatsApp: (15) 99764-6421
      </p>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999;">
          © ${new Date().getFullYear()} Consultório de Psicologia - Michel de Camargo<br>
          Rua Antônio Ferreira, 171 - Parque Campolim, Sorocaba SP
        </p>
      </div>
    </div>
  `;

  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.log("\n🧪 === MODO DE DESENVOLVIMENTO - SIMULAÇÃO DE EMAIL ===");
      console.log("📧 Para:", dados.to);
      console.log("📋 Assunto: Confirmação de Agendamento de Consulta");
      console.log("📄 Detalhes do agendamento:");
      console.log("   👤 Nome:", dados.nome);
      console.log("   📅 Data:", dataFormatada);
      console.log("   ⏰ Horário:", dados.horario);
      console.log("   🏥 Modalidade:", dados.modalidade);
      console.log("   🔢 Código:", dados.codigo);
      console.log("✅ Email simulado enviado com sucesso!");
      console.log("🔗 Preview HTML salvo no console abaixo:");
      console.log(htmlContent);
      console.log("=".repeat(60));
      return true;
    }

    const msg = {
      to: dados.to,
      from: {
        email: process.env.EMAIL_FROM || "michelcamargo.psi@gmail.com",
        name: "Michel de Camargo - Psicólogo",
      },
      subject: "Confirmação de Agendamento de Consulta",
      html: htmlContent,
    };

    await sgMail.send(msg);
    console.log("Email de confirmação enviado com sucesso para:", dados.to);
    return true;
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return false;
  }
}

/**
 * Envia email de cancelamento de agendamento
 */
export async function enviarEmailCancelamento(
  dados: EmailData
): Promise<boolean> {
  const dataFormatada = formatarData(dados.data);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #2e5597; text-align: center;">Confirmação de Cancelamento</h2>
      <p>Olá <strong>${dados.nome}</strong>,</p>
      <p>Sua consulta foi cancelada com sucesso.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Data:</strong> ${dataFormatada}</p>
        <p><strong>Horário:</strong> ${dados.horario}</p>
        <p><strong>Modalidade:</strong> ${dados.modalidade}</p>
      </div>
      
      <p>Se desejar reagendar, por favor, visite nosso site ou entre em contato pelo WhatsApp.</p>
      
      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        Em caso de dúvidas, entre em contato pelo WhatsApp: (15) 99764-6421
      </p>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999;">
          © ${new Date().getFullYear()} Consultório de Psicologia - Michel de Camargo<br>
          Rua Antônio Ferreira, 171 - Parque Campolim, Sorocaba SP
        </p>
      </div>
    </div>
  `;

  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.log("\n🧪 === MODO DE DESENVOLVIMENTO - SIMULAÇÃO DE EMAIL CANCELAMENTO ===");
      console.log("📧 Para:", dados.to);
      console.log("📋 Assunto: Confirmação de Cancelamento de Consulta");
      console.log("📄 Detalhes do cancelamento:");
      console.log("   👤 Nome:", dados.nome);
      console.log("   📅 Data:", dataFormatada);
      console.log("   ⏰ Horário:", dados.horario);
      console.log("   🏥 Modalidade:", dados.modalidade);
      console.log("✅ Email de cancelamento simulado enviado com sucesso!");
      console.log("🔗 Preview HTML salvo no console abaixo:");
      console.log(htmlContent);
      console.log("=".repeat(60));
      return true;
    }

    const msg = {
      to: dados.to,
      from: {
        email: process.env.EMAIL_FROM || "michelcamargo.psi@gmail.com",
        name: "Michel de Camargo - Psicólogo",
      },
      subject: "Confirmação de Cancelamento de Consulta",
      html: htmlContent,
    };

    await sgMail.send(msg);
    console.log("Email de cancelamento enviado com sucesso para:", dados.to);
    return true;
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return false;
  }
}
