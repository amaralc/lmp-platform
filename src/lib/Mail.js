/* --------------------------------- IMPORTS ---------------------------------*/
import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

/* --------------------------------- CONTENT ---------------------------------*/
class Mail {
  constructor() {
    /** Desestrutura mailconfig em seus atributos */
    const { host, port, secure, auth } = mailConfig;

    /** Objeto que nodemailer usa para criar conexão com serviço externo */
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      /**
       * Existem algumas estratégias de envio de email que não possuem autenticação.
       * Nesses casos, se nao houver usuario na autenticação, envia nulo
       */
      auth: auth.user ? auth : null,
    });
  }

  /** Método responsável por enviar o e-mail */
  sendMail(message) {
    /** Retorna método sendMail padrão do nodemailer... */
    return this.transporter.sendMail({
      /** ... com tudo o default de dentro do mailConfig ... */
      ...mailConfig.default,
      /** ... e com a mensagem passada como argumento */
      ...message,
    });
  }
}
/* --------------------------------- EXPORTS ---------------------------------*/
export default new Mail();
