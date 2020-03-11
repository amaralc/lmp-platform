/* --------------------------------- IMPORTS ---------------------------------*/
import nodemailer from 'nodemailer';
import { resolve } from 'path';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
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
    /** Chama o método configureTemplates */
    this.configureTemplates();
  }

  configureTemplates() {
    /**
     * Cria caminho para onde estão os templates
     * Usa resolve para navegar até a pasta emails
     */
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');
    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          /** Usa resolve para viewPath e anexar com o layouts */
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
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
