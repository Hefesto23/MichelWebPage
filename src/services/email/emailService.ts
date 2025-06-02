// ==========================================
// src/services/email/emailService.ts
// ==========================================
import { CONTACT_INFO } from "@/utils/constants";
import { formatDateWithWeekday } from "@/utils/formatters";
import sgMail from "@sendgrid/mail";

// Inicializar a API do SendGrid com a chave
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface EmailData {
  to: string;
  nome: string;
  data: string;
  horario: string;
  modalidade: string;
  codigo?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
}

/**
 * Classe para gerenciar serviços de email
 */
class EmailService {
  private isDevelopment = !process.env.SENDGRID_API_KEY;
  private fromEmail = process.env.EMAIL_FROM || CONTACT_INFO.EMAIL;
  private fromName = "Michel de Camargo - Psicólogo";

  /**
   * Template base para emails
   */
  private getBaseTemplate(content: string): string {
    const currentYear = new Date().getFullYear();

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        ${content}
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #999;">
            © ${currentYear} Consultório de Psicologia - Michel de Camargo<br>
            ${CONTACT_INFO.ADDRESS.STREET} - ${CONTACT_INFO.ADDRESS.NEIGHBORHOOD}, ${CONTACT_INFO.ADDRESS.CITY} ${CONTACT_INFO.ADDRESS.STATE}
          </p>
        </div>
      </div>
    `;
  }

  /**
   * Template de confirmação de agendamento
   */
  private getConfirmationTemplate(dados: EmailData): EmailTemplate {
    const dataFormatada = formatDateWithWeekday(dados.data);

    const content = `
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
          : `<p>O consultório está localizado na ${CONTACT_INFO.ADDRESS.STREET} - ${CONTACT_INFO.ADDRESS.NEIGHBORHOOD}, ${CONTACT_INFO.ADDRESS.CITY} ${CONTACT_INFO.ADDRESS.STATE}.</p>`
      }
      
      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        Em caso de dúvidas, entre em contato pelo WhatsApp: ${
          CONTACT_INFO.PHONE
        }
      </p>
    `;

    return {
      subject: "Confirmação de Agendamento de Consulta",
      html: this.getBaseTemplate(content),
    };
  }

  /**
   * Template de cancelamento
   */
  private getCancellationTemplate(dados: EmailData): EmailTemplate {
    const dataFormatada = formatDateWithWeekday(dados.data);

    const content = `
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
        Em caso de dúvidas, entre em contato pelo WhatsApp: ${CONTACT_INFO.PHONE}
      </p>
    `;

    return {
      subject: "Confirmação de Cancelamento de Consulta",
      html: this.getBaseTemplate(content),
    };
  }

  /**
   * Template de lembrete
   */
  private getReminderTemplate(dados: EmailData): EmailTemplate {
    const dataFormatada = formatDateWithWeekday(dados.data);

    const content = `
      <h2 style="color: #2e5597; text-align: center;">Lembrete de Consulta</h2>
      <p>Olá <strong>${dados.nome}</strong>,</p>
      <p>Este é um lembrete da sua consulta agendada para amanhã.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Data:</strong> ${dataFormatada}</p>
        <p><strong>Horário:</strong> ${dados.horario}</p>
        <p><strong>Modalidade:</strong> ${dados.modalidade}</p>
      </div>
      
      ${
        dados.modalidade === "online"
          ? `<p>O link para a sessão online será enviado 30 minutos antes do horário agendado.</p>`
          : `<p>O consultório está localizado na ${CONTACT_INFO.ADDRESS.STREET} - ${CONTACT_INFO.ADDRESS.NEIGHBORHOOD}, ${CONTACT_INFO.ADDRESS.CITY} ${CONTACT_INFO.ADDRESS.STATE}.</p>`
      }
      
      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        Em caso de necessidade de cancelamento ou reagendamento, entre em contato pelo WhatsApp: ${
          CONTACT_INFO.PHONE
        }
      </p>
    `;

    return {
      subject: "Lembrete: Consulta Agendada para Amanhã",
      html: this.getBaseTemplate(content),
    };
  }

  /**
   * Envia email (modo desenvolvimento ou produção)
   */
  private async send(to: string, template: EmailTemplate): Promise<boolean> {
    try {
      if (this.isDevelopment) {
        console.log("🔧 Modo de desenvolvimento - Email simulado:");
        console.log("Para:", to);
        console.log("Assunto:", template.subject);
        console.log("Preview:", template.html.substring(0, 200) + "...");
        return true;
      }

      const msg = {
        to,
        from: {
          email: this.fromEmail,
          name: this.fromName,
        },
        subject: template.subject,
        html: template.html,
      };

      await sgMail.send(msg);
      console.log(`✅ Email enviado com sucesso para: ${to}`);
      return true;
    } catch (error) {
      console.error("❌ Erro ao enviar email:", error);
      return false;
    }
  }

  /**
   * Envia email de confirmação de agendamento
   */
  async sendConfirmation(dados: EmailData): Promise<boolean> {
    const template = this.getConfirmationTemplate(dados);
    return this.send(dados.to, template);
  }

  /**
   * Envia email de cancelamento
   */
  async sendCancellation(dados: EmailData): Promise<boolean> {
    const template = this.getCancellationTemplate(dados);
    return this.send(dados.to, template);
  }

  /**
   * Envia email de lembrete
   */
  async sendReminder(dados: EmailData): Promise<boolean> {
    const template = this.getReminderTemplate(dados);
    return this.send(dados.to, template);
  }

  /**
   * Envia email customizado
   */
  async sendCustom(
    to: string,
    subject: string,
    htmlContent: string
  ): Promise<boolean> {
    const template = {
      subject,
      html: this.getBaseTemplate(htmlContent),
    };
    return this.send(to, template);
  }
}

// Exportar instância única do serviço
export const emailService = new EmailService();

// Exportar também as funções antigas para compatibilidade
export const enviarEmailConfirmacao = (dados: EmailData) =>
  emailService.sendConfirmation(dados);
export const enviarEmailCancelamento = (dados: EmailData) =>
  emailService.sendCancellation(dados);
