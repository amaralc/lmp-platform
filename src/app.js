/* --------------------------------- IMPORTS ---------------------------------*/
import express from 'express';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
/**
 * Biblioteca 'express-async-erros' utilizada em conjunto com sentry para
 * exibir erros dentro de funcoes assíncronas (async) precisa ser chamada antes
 * de importar as rotas e depois de importar 'express'
 */
import 'express-async-errors';
import routes from './routes';
import sentryConfig from './config/sentry';

/*
 ** Importa arquivo que faz conexao com banco de dados. Nao é necessario passar
 ** o caminho completo com '.../index.js', pois ele ja assimila automaticamente
 ** esse nome.
 */
import './database';

/* --------------------------------- CONTENT ---------------------------------*/
class App {
  /* Chamado automaticamente quando classe for instanciada */
  constructor() {
    this.server = express();

    /**
     * Inicializa Sentry conforme disponivel em conta
     * https://sentry.io/onboarding/amaralc/get-started/
     */
    Sentry.init(sentryConfig);

    /** Call middlewares and routes methods */
    this.middlewares();
    this.routes();

    this.exceptionHandler();
  }

  /* Cadastro dos middlewares da aplicacao */
  middlewares() {
    /** The request handler must be the first middleware on the app */
    this.server.use(Sentry.Handlers.requestHandler());
    /* Prepara app para receber requisicoes em formato json */
    this.server.use(express.json());
    /** Usaremos o recurso express.static que serve para servir arquivos estáticos (PNG, CSS, HTML), arquivos acessados diretamente pelo navegador. */
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    /* Importa rotas de outro arquivo e usa no servidor */
    this.server.use(routes);
    /**
     * The error handler must be before any other error middleware and after
     * all controllers
     */
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();
      /**
       * Retorna erro de servidor em formato json
       */
      return res.status(500).json(errors);
    });
  }
}

/* --------------------------------- EXPORTS ---------------------------------*/
export default new App().server;
