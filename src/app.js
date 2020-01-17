// IMPORTS ---------------------------------------------------------------------
const express = require('express');
const routes = require('./routes');

// CONTENT ---------------------------------------------------------------------

// define class app
class App {
  // chamado automaticamente quando classe for instanciada
  constructor(){
    this.server = express();
    this.middlewares();
    this.routes();
  }

  // cadastro dos middlewares da aplicacao
  middlewares(){
    // prepara app para receber requisicoes em formato json
    this.server.use(express.json());
  }

  routes(){
    // importa rotas de outro arquivo e usa no servidor
    this.server.use(routes);
  }
}

// EXPORTS ---------------------------------------------------------------------

// exporta instancia de servidor do app
module.exports = new App().server; 