// src/lib/email-templates.ts - Email templates for Gmail SMTP

interface ConfirmationTemplateData {
  nome: string;
  data: string;
  horario: string;
  modalidade: string;
  codigo?: string;
  endereco?: string;
}

interface ClinicNotificationTemplateData {
  nome: string;
  email: string;
  telefone?: string;
  data: string;
  horario: string;
  modalidade: string;
  codigo?: string;
  endereco?: string;
}

interface CancellationTemplateData {
  nome: string;
  data: string;
  horario: string;
  modalidade: string;
  endereco?: string;
}

interface ClinicCancellationTemplateData {
  nome: string;
  email: string;
  data: string;
  horario: string;
  modalidade: string;
  endereco?: string;
}

/**
 * Template de confirmação para o usuário
 */
export function createConfirmationTemplate(data: ConfirmationTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Consulta Agendada!</h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #333;">Olá, ${data.nome}!</p>
                  <p style="margin: 0 0 30px 0; font-size: 16px; color: #666; line-height: 1.6;">
                    Sua consulta foi agendada com sucesso. Seguem os detalhes:
                  </p>

                  <!-- Details Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                    <tr>
                      <td>
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Data:</strong> ${data.data}</p>
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Horário:</strong> ${data.horario}</p>
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Modalidade:</strong> ${data.modalidade}</p>
                        ${data.codigo ? `<p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Código:</strong> ${data.codigo}</p>` : ''}
                        ${data.endereco ? `<p style="margin: 0; font-size: 14px; color: #666;"><strong>Endereço:</strong> ${data.endereco}</p>` : ''}
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #666; line-height: 1.6;">
                    Aguardamos você! Caso precise cancelar ou remarcar, entre em contato conosco.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0; font-size: 14px; color: #666;">Michel de Camargo - Psicólogo Clínico</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Template de notificação para a clínica
 */
export function createClinicNotificationTemplate(data: ClinicNotificationTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background-color: #28a745; padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Novo Agendamento</h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #333;">Dados do Paciente</h2>

                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <tr>
                      <td>
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Nome:</strong> ${data.nome}</p>
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Email:</strong> ${data.email}</p>
                        ${data.telefone ? `<p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Telefone:</strong> ${data.telefone}</p>` : ''}
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Data:</strong> ${data.data}</p>
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Horário:</strong> ${data.horario}</p>
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Modalidade:</strong> ${data.modalidade}</p>
                        ${data.codigo ? `<p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Código:</strong> ${data.codigo}</p>` : ''}
                        ${data.endereco ? `<p style="margin: 0; font-size: 14px; color: #666;"><strong>Endereço:</strong> ${data.endereco}</p>` : ''}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0; font-size: 14px; color: #666;">Sistema de Agendamento Online</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Template de cancelamento para o usuário
 */
export function createCancellationTemplate(data: CancellationTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background-color: #dc3545; padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Consulta Cancelada</h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #333;">Olá, ${data.nome}!</p>
                  <p style="margin: 0 0 30px 0; font-size: 16px; color: #666; line-height: 1.6;">
                    Sua consulta foi cancelada conforme solicitado:
                  </p>

                  <!-- Details Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                    <tr>
                      <td>
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Data:</strong> ${data.data}</p>
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Horário:</strong> ${data.horario}</p>
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Modalidade:</strong> ${data.modalidade}</p>
                        ${data.endereco ? `<p style="margin: 0; font-size: 14px; color: #666;"><strong>Endereço:</strong> ${data.endereco}</p>` : ''}
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0; font-size: 16px; color: #666; line-height: 1.6;">
                    Caso deseje agendar uma nova consulta, entre em contato conosco.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0; font-size: 14px; color: #666;">Michel de Camargo - Psicólogo Clínico</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Template de cancelamento para a clínica
 */
export function createClinicCancellationTemplate(data: ClinicCancellationTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background-color: #ffc107; padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: #333; font-size: 24px;">Cancelamento de Consulta</h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #333;">Dados do Cancelamento</h2>

                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; padding: 20px;">
                    <tr>
                      <td>
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Paciente:</strong> ${data.nome}</p>
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Email:</strong> ${data.email}</p>
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Data:</strong> ${data.data}</p>
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Horário:</strong> ${data.horario}</p>
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Modalidade:</strong> ${data.modalidade}</p>
                        ${data.endereco ? `<p style="margin: 0; font-size: 14px; color: #666;"><strong>Endereço:</strong> ${data.endereco}</p>` : ''}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0; font-size: 14px; color: #666;">Sistema de Agendamento Online</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
