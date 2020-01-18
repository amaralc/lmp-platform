# Iniciando back end do gobarber

## Configurando estrutura

Objetivo: estruturar pastas e arquivos basicos da aplicacao.

  * (terminal) inicializa projeto: `yarn init -y` ;
  * (terminal) instala express: `yarn add express` ;
  * cria estrutura: 
  
    src/
      app.js
      server.js
      routes.js

  * define arquivo **app.js**;
  * define arquivo **server.js**;
    * estrutura da aplicacao (app.js) separado do servidor e das rotas para facilitar trabalho com testes unitarios e de integracao que trabalha diretamente com a classe App;
  * define arquivo **routes.js** ;
  * (terminal) testa projeto: `node src/server.js` ;

## Nodemon & Sucrase

Objetivo: utilizar sintaxe de 'import' e 'export'com *sucrase*, automatizar acionamento do servidor com *nodemon* e adapta debugger para rodar com sucrase;

  * (terminal) instala sucrase e nodemon como dependencia de desenvolvimento: `yarn add sucrase nodemon -D`;
  * altera sintaxe de import e export nos arquivos:

    Imports:
    * de: const foo = require('Foo');
    * para: import foo from 'Foo';

    Exports:
    * de: module.exports = new Foo();
    * para: export default new Foo();

  * cria script personalizado 'dev' em **package.json** para rodar nodemon:

  ```
      "scripts": {
      "dev": "nodemon src/server.js"
    },
  ```

  * cria arquivo **nodemon.json** para que nodemon utilize sucrase-node ao inves de node:

  ```
  {
    "execMap: {
      "js": "node -r sucrase/register"
    }
  }
  ```
    ... para todo arquivo '.js' rode node mas antes, registre (-r) sucrase/register;

  * adiciona script em **package.json** para que debugger rode com *sucrase*:

    ```
    "scripts": {
      "dev": "nodemon src/server.js",
      "dev:debug":"nodemon --inspect src/server.js"
    },
    
    ```

  * cria nova configuracao na aba do bug do VSCode:
    
    aba bug > add configuration... > node.js e altera **launch.json**:

    de: "request": "launch"
    para: "request": "attach"

    deleta: "program": "${workspaceFolder}/index.js"
    cria: "protocol": "inspector"

    cria: "restart": true,

    cria: "skipFiles": [
            "<node_internals>/**",
            "${workspaceRoot}/node_modules/**/*.js"
          ],

  * testa debugger com: `yarn dev:debug`
  * ATENCAO: mantenha pasta *.vscode* para manter configuracoes do debugger com *sucrase*

## Conceitos do Docker

  * Como funciona?

    * Funciona como um ambiente isolado na maquina (container);

    * Containers expoem portas para comunicacao. Ex.:

      App
        > :5432 (PostgreSQL)
        > :2707 (MongoDB)

  * Principais conceitos

    * Imagem: servico disponivel do docker. Tecnologias e ferramentas que podemos colocar em containers;

    * Container: instancia de uma imagem. Ex.: se imagem for PostGreSQL, podemos ter tres containers rodando esta imagem;

    * Docker Registry (Docker Hub): analogo ao npm do node, que contem os registros das dependencias em nuvem. O registro do docker é o docker register. Podemos até cadastrar nossas próprias imagens lá.

    * Dockerfile:
      
      * Receita de uma imagem: define como nossa aplicacao pode rodar em um ambiente a partir do zero. Ex.:


        ```
        # Partimos de uma imagem existente
        FROM node:10

        # Definimos a pasta e copiamos os arquivos
        WORKDIR /usr/app
        COPY . ./

        # Instalamos as depencias
        RUN yarn

        # Qual porta queremos expor?
        EXPOSE 3333

        # Executamos nossa aplicacao
        CMD yarn start

        ```
        