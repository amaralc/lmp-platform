import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;
    /**
     * Maneira que o nodemailer chama a conexão com algum serviço externo de
     *  envio de email
     */
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      /**
       * Verifica se dentro do auth existe um usuário, se não existir,retorna
       * nulo
       */
      auth: auth.user ? auth : null,
    });
  }

  /**
   * Método sendMail recebe 'message' e retorna os dados do remetente e
   * a 'message'
   */
  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
