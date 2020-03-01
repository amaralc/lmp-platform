/* ---------------------------------- NOTES ----------------------------------*/
/**
 * Existem vários serviços de envio de e-mail que fornecem algumas das
 * informações das quais precisamos. Exemplos de fornecedores:
 *
 * Para ambiente de desenvolvimento:
 * - Mailtrap (www.mailtrap.io);
 *
 * Para ambiente de produção:
 * - Amazon SES;
 * - Mailgun;
 * - Sparkpost;
 * - Mandril (para quem usa Mailchimp);
 *
 * Não é uma boa idéia utilizar o SMTP do próprio Gmail pois ele tem um limite
 * e pode bloquear o envio de emails.
 */

/* --------------------------------- EXPORTS ---------------------------------*/
/**
 * Para SMTP (Simple Mail Transfer Protocol), exportamos um objeto com
 * informações necessárias para fazer o envio.
 */
export default {
  /** Servidor */
  host: 'smtp.mailtrap.io',
  /** Porta */
  port: '2525',
  /** Está usando SSL ou não (padrão 'false') */
  secure: false,
  /** Autenticação do email */
  auth: {
    /** Usuario (email) */
    user: '4b734618a4df6d',
    /** Senha */
    pass: '244d07327ae007',
  },
  /** Configurações padrão para todo envio de email */
  default: {
    /** Remetente */
    from: 'LMP <noreply@lmp.ufsc.br',
  },
};
