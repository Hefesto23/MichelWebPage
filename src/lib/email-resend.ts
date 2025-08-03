// src/lib/email-resend.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
 * Envia email de confirmação usando Resend para usuário e clínica
 */
export async function enviarEmailConfirmacaoResend(
  dados: EmailData
): Promise<boolean> {
  const dataFormatada = formatarData(dados.data);
  const emailClinica = process.env.EMAIL_FROM || 'raszlster@gmail.com';

  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("\n🧪 === MODO DE DESENVOLVIMENTO - RESEND ===");
      console.log("📧 Para usuário:", dados.to);
      console.log("📧 Para clínica:", emailClinica);
      console.log("📋 Assunto: Confirmação de Agendamento");
      console.log("📄 Dados:", { nome: dados.nome, data: dataFormatada, horario: dados.horario });
      console.log("⚠️  Configure RESEND_API_KEY no .env para envios reais");
      return true;
    }

    // Email para o usuário (funciona para qualquer email)
    const { data: dataUsuario, error: errorUsuario } = await resend.emails.send({
      from: 'Michel Psicólogo <onboarding@resend.dev>',
      to: dados.to,
      subject: 'Confirmação de Agendamento de Consulta',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2e5597; text-align: center;">✅ Confirmação de Agendamento</h2>
          <p>Olá <strong>${dados.nome}</strong>,</p>
          <p>Sua consulta foi agendada com sucesso!</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>📅 Data:</strong> ${dataFormatada}</p>
            <p><strong>⏰ Horário:</strong> ${dados.horario}</p>
            <p><strong>🏥 Modalidade:</strong> ${dados.modalidade}</p>
            ${dados.codigo ? `<p><strong>🔢 Código de confirmação:</strong> <span style="background: #e1f5fe; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${dados.codigo}</span></p>` : ""}
          </div>
          
          <p>📝 Guarde este código para futuras consultas, cancelamentos ou remarcações.</p>
          
          ${dados.modalidade === "online" 
            ? `<p>💻 Um link para a sessão online será enviado para você no dia da consulta.</p>`
            : `<p>📍 O consultório está localizado na Rua Antônio Ferreira, 171 - Parque Campolim, Sorocaba SP.</p>`
          }
          
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            📱 Em caso de dúvidas: (15) 99764-6421
          </p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #999;">
              © ${new Date().getFullYear()} Consultório de Psicologia - Michel de Camargo<br>
              📍 Rua Antônio Ferreira, 171 - Parque Campolim, Sorocaba SP
            </p>
          </div>
        </div>
      `,
    });

    if (errorUsuario) {
      console.error('❌ Erro Resend (usuário):', errorUsuario);
    } else {
      console.log('✅ Email enviado para usuário via Resend:', dataUsuario?.id);
    }

    // Email para a clínica (notificação interna)
    // NOTA: No plano gratuito do Resend, só podemos enviar para viniciusnegrini0@gmail.com
    const emailParaClinica = 'viniciusnegrini0@gmail.com'; // Conta verificada no Resend
    
    const { data: dataClinica, error: errorClinica } = await resend.emails.send({
      from: 'Sistema de Agendamento <onboarding@resend.dev>',
      to: emailParaClinica,
      subject: `[CLÍNICA] Novo Agendamento: ${dados.nome} - ${dataFormatada}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2e5597; text-align: center;">🔔 Novo Agendamento Recebido</h2>
          <p><strong>Um novo agendamento foi realizado no sistema!</strong></p>
          
          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2e5597;">
            <h3 style="margin-top: 0; color: #2e5597;">📋 Dados do Cliente:</h3>
            <p><strong>👤 Nome:</strong> ${dados.nome}</p>
            <p><strong>📧 Email:</strong> ${dados.to}</p>
            <p><strong>📅 Data:</strong> ${dataFormatada}</p>
            <p><strong>⏰ Horário:</strong> ${dados.horario}</p>
            <p><strong>🏥 Modalidade:</strong> ${dados.modalidade}</p>
            <p><strong>🔢 Código de confirmação:</strong> <span style="background: #fff3e0; padding: 4px 8px; border-radius: 4px; font-weight: bold; color: #e65100;">${dados.codigo}</span></p>
          </div>
          
          <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
            <h3 style="margin-top: 0; color: #2e7d32;">🏥 NOTIFICAÇÃO PARA CLÍNICA</h3>
            <p><strong>📧 Este email é uma cópia da confirmação para a clínica Michel de Camargo.</strong></p>
            <p>📍 <strong>Email oficial da clínica:</strong> ${emailClinica}</p>
            <p>⚠️ <strong>Recebido via:</strong> viniciusnegrini0@gmail.com (conta sistema)</p>
          </div>
          
          <div style="background-color: #f1f8e9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
            <h3 style="margin-top: 0; color: #2e7d32;">📝 Próximos Passos:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>✅ Cliente recebeu email de confirmação</li>
              <li>📅 Evento criado no Google Calendar</li>
              <li>💬 Entre em contato se necessário</li>
              ${dados.modalidade === "online" ? 
                `<li>💻 Enviar link da sessão online próximo ao horário</li>` : 
                `<li>📍 Cliente virá ao consultório</li>`
              }
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #999;">
              📧 Email automático do sistema de agendamento<br>
              © ${new Date().getFullYear()} Consultório de Psicologia - Michel de Camargo
            </p>
          </div>
        </div>
      `,
    });

    if (errorClinica) {
      console.error('❌ Erro Resend (clínica):', errorClinica);
    } else {
      console.log('✅ Email CLÍNICA enviado para viniciusnegrini0@gmail.com (cópia para clínica) via Resend:', dataClinica?.id);
    }

    // Retorna true se pelo menos um email foi enviado com sucesso
    return !errorUsuario || !errorClinica;
  } catch (error) {
    console.error('❌ Erro ao enviar email via Resend:', error);
    return false;
  }
}

/**
 * Envia email de cancelamento usando Resend para usuário e clínica
 */
export async function enviarEmailCancelamentoResend(
  dados: EmailData
): Promise<boolean> {
  const dataFormatada = formatarData(dados.data);
  const emailClinica = process.env.EMAIL_FROM || 'raszlster@gmail.com';

  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("\n🧪 === MODO DE DESENVOLVIMENTO - CANCELAMENTO RESEND ===");
      console.log("📧 Para usuário:", dados.to);
      console.log("📧 Para clínica:", emailClinica);
      console.log("📋 Assunto: Cancelamento de Consulta");
      return true;
    }

    // Email para o usuário
    const { data: dataUsuario, error: errorUsuario } = await resend.emails.send({
      from: 'Michel Psicólogo <onboarding@resend.dev>',
      to: dados.to,
      subject: 'Confirmação de Cancelamento de Consulta',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #d32f2f; text-align: center;">❌ Consulta Cancelada</h2>
          <p>Olá <strong>${dados.nome}</strong>,</p>
          <p>Sua consulta foi cancelada com sucesso.</p>
          
          <div style="background-color: #ffebee; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d32f2f;">
            <p><strong>📅 Data:</strong> ${dataFormatada}</p>
            <p><strong>⏰ Horário:</strong> ${dados.horario}</p>
            <p><strong>🏥 Modalidade:</strong> ${dados.modalidade}</p>
          </div>
          
          <p>🔄 Se desejar reagendar, visite nosso site ou entre em contato pelo WhatsApp.</p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #999;">
              © ${new Date().getFullYear()} Consultório de Psicologia - Michel de Camargo
            </p>
          </div>
        </div>
      `,
    });

    if (errorUsuario) {
      console.error('❌ Erro Resend cancelamento (usuário):', errorUsuario);
    } else {
      console.log('✅ Email de cancelamento enviado para usuário via Resend:', dataUsuario?.id);
    }

    // Email para a clínica (notificação de cancelamento)
    // NOTA: No plano gratuito do Resend, só podemos enviar para viniciusnegrini0@gmail.com
    const emailParaClinica = 'viniciusnegrini0@gmail.com'; // Conta verificada no Resend
    
    const { data: dataClinica, error: errorClinica } = await resend.emails.send({
      from: 'Sistema de Agendamento <onboarding@resend.dev>',
      to: emailParaClinica,
      subject: `[CLÍNICA] Cancelamento: ${dados.nome} - ${dataFormatada}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #d32f2f; text-align: center;">🚫 Agendamento Cancelado</h2>
          <p><strong>Um agendamento foi cancelado no sistema!</strong></p>
          
          <div style="background-color: #ffebee; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d32f2f;">
            <h3 style="margin-top: 0; color: #d32f2f;">📋 Dados do Cancelamento:</h3>
            <p><strong>👤 Cliente:</strong> ${dados.nome}</p>
            <p><strong>📧 Email:</strong> ${dados.to}</p>
            <p><strong>📅 Data:</strong> ${dataFormatada}</p>
            <p><strong>⏰ Horário:</strong> ${dados.horario}</p>
            <p><strong>🏥 Modalidade:</strong> ${dados.modalidade}</p>
          </div>
          
          <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
            <h3 style="margin-top: 0; color: #2e7d32;">🏥 NOTIFICAÇÃO PARA CLÍNICA</h3>
            <p><strong>📧 Este email é uma cópia da confirmação para a clínica Michel de Camargo.</strong></p>
            <p>📍 <strong>Email oficial da clínica:</strong> ${emailClinica}</p>
            <p>⚠️ <strong>Recebido via:</strong> viniciusnegrini0@gmail.com (conta sistema)</p>
          </div>
          
          <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800;">
            <h3 style="margin-top: 0; color: #e65100;">📝 Ações Necessárias:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>📅 Remover do Google Calendar (se necessário)</li>
              <li>⏰ Horário agora disponível para novos agendamentos</li>
              <li>💬 Entre em contato com o cliente se necessário</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #999;">
              📧 Email automático do sistema de agendamento<br>
              © ${new Date().getFullYear()} Consultório de Psicologia - Michel de Camargo
            </p>
          </div>
        </div>
      `,
    });

    if (errorClinica) {
      console.error('❌ Erro Resend cancelamento (clínica):', errorClinica);
    } else {
      console.log('✅ Email CANCELAMENTO CLÍNICA enviado para viniciusnegrini0@gmail.com (cópia para clínica) via Resend:', dataClinica?.id);
    }

    // Retorna true se pelo menos um email foi enviado com sucesso
    return !errorUsuario || !errorClinica;
  } catch (error) {
    console.error('❌ Erro ao enviar cancelamento via Resend:', error);
    return false;
  }
}