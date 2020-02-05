


## feature/migration-create-containers

  Objetivo: registrar containers (objetos que podem ser usados para guardar outros objetos) na aplicacao;

  * (terminal) Cria migration 'create-containers' usando sequelize-cli: `yarn sequelize migration:create --name=create-containers` ;

  * Edita arquivo de migration para definir formato da tabela no banco de dados:

    ```js
    /* --------------------------------- EXPORTS ---------------------------------*/
    module.exports = {
      up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('containers', {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          /** Descrição breve do container */
          description: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          /** Número de identificação na etiqueta do container */
          number: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          /** ID (primary key) da sala do container */
          room_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          /** Timestamp de registro do container no sistema */
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          /** ID (primary key) do usuário que registrou o container */
          created_by: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          /** Timestamp da última edição dos dados do container no sistema */
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          /** ID (primary key) do usuário que fez o último update do container */
          updated_by: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
        });
      },

      down: queryInterface => {
        return queryInterface.dropTable('containers');
      },
    };
    ```

  * (terminal) Executa migração do banco de dados para criar nova tabela: `yarn sequelize db:migrate` ;

  * Cria model **models/Container.js**:

    ```js
    /* --------------------------------- IMPORTS ---------------------------------*/
    import Sequelize, { Model } from 'sequelize';

    /* --------------------------------- CONTENT ---------------------------------*/
    /**
    * Cria classe User extendendo os metodos da classe Model, da dependencia
    * 'sequelize'
    */
    class Container extends Model {
      /**
      * Metodo estatico que sera chamado automaticamente pelo sequelize
      */
      static init(sequelize) {
        /**
        * Chama metodo init da classe superior (Model) enviando colunas da base
        * de dados e envia somente o que o usuario vai fornecer como input.
        * (chave primaria, etc, nao sao necessarias)
        */
        super.init(
          {
            /** Descrição breve do container */
            description: Sequelize.STRING,
            /** Número de identificação na etiqueta do container */
            number: Sequelize.STRING,
            /** ID (primary key) da sala onde o container se encontra */
            room_id: Sequelize.INTEGER,
            /** ID (primary key) do usuario que registrou o container */
            created_by: Sequelize.INTEGER,
            /**
            * ID (primary key) do usuario que fez a ultima atualizacao dos dados
            * do container.
            */
            updated_by: Sequelize.INTEGER,
          },
          {
            /*
            ** Argumento que sera enviado pelo loader de models
            */
            sequelize,
          }
        );

        /** Retorna model que acaba de ser inicializado */
        return this;
      }
    }

    /* --------------------------------- EXPORTS ---------------------------------*/
    export default Container;

    ```

  * Cria controller **controllers/ContainerController.js** para gerir fluxo de criação de containers:

    ```js
    /* --------------------------------- IMPORTS ---------------------------------*/
    /** Importa tudo de yup como Yup (dependencia nao tem export default) */
    import * as Yup from 'yup';
    import Container from '../models/Container';

    /* --------------------------------- CONTENT ---------------------------------*/
    class ContainerController {
      /**
      * Metodo store com mesma face de um middleware no node.
      * Recebe dados do usuario e cria novo registro dentro da base de dados.
      */
      async store(req, res) {
        /** Define schema to validate req.body prior to 'store()' data */
        const schema = Yup.object().shape({
          /** Attribute 'description' is a required string */
          description: Yup.string().required(),
          /** Attribute 'number' is a required number */
          number: Yup.number().required(),
          /** Attribute 'room_id' is a required number */
          room_id: Yup.number().required(),
        });

        /** If 'req.body' do not attend to the schema requirements (is not valid) */
        if (!(await schema.isValid(req.body))) {
          /** Return error status 400 with message 'Validation has failed' */
          return res.status(400).json({ error: 'Validation has failed' });
        }

        const { description, room_id, number } = req.body;

        /**
        * Cria usuario na base de dados usando resposta asincrona e retorna apenas
        * dados uteis.
        */
        const { id, created_by, updated_by } = await Container.create({
          description,
          number,
          room_id,
          created_by: req.userId,
          updated_by: req.userId,
        });

        /** Retorna json apenas com dados uteis ao frontend */
        return res.json({
          id,
          description,
          number,
          room_id,
          created_by,
          updated_by,
        });
      }
    }

    /* --------------------------------- EXPORTS ---------------------------------*/
    export default new ContainerController();

    ```

  * Cria rota para criar novo registro de Container em **src/routes.js** referenciando **ContainerController.js** e usando token para garantir que apenas usuário logado crie novo container:

    ```js
    /* --------------------------------- IMPORTS ---------------------------------*/
    import { Router } from 'express';
    import UserController from './app/controllers/UserController';
    import SessionController from './app/controllers/SessionController';
    import ContainerController from './app/controllers/ContainerController';
    import authMiddleware from './app/middlewares/auth';

    /* --------------------------------- CONTENT ---------------------------------*/
    const routes = new Router();

    /** Define rota PUT para criar novo usuario */
    routes.post('/users', UserController.store);
    /** Define rota POST para criar nova session */
    routes.post('/sessions', SessionController.store);

    /** Define MIDDLEWARE GLOBAL que vale para rotas que vem apos sua declaracao */
    routes.use(authMiddleware);
    /** Define rota PUT para editar dados do usuario */
    routes.put('/users', UserController.update);
    /** Define rota POST para criar novo container */
    routes.post('/containers', ContainerController.store);

    /* --------------------------------- EXPORTS ---------------------------------*/
    export default routes;

    ```

  * (insomnia):
    * Clica em 'No Environment' > 'Manage Environments' e adiciona variável 'token' copiando o valor do token recebido ao criar uma nova session (volte para a etapa de criação de sessions caso tenha dúvidas):

      ```js
      {
        "base_url": "http://localhost:3333",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTgwODQxMDQwLCJleHAiOjE1ODE0NDU4NDB9.NaLMxFimkZ-EBZAn6uDr8iamZEIB-az9IA96aHNdakM"
      }
      ```

    * Cria pasta 'Container';
    * Dentro da pasta, cria rota 'Create' tipo POST para `base_url/containers`;
    * Adiciona corpo de requisição em formato JSON:

      ```js
      {
	      "description":"My first container",
        "number":"001",
        "room_id": "1"
      }
      ```

    * Na aba 'Auth' adiciona o 'Bearer token' e digite 'token' no valor token;

  * (terminal) Rode o servidor: `yarn dev` ;
  * (insomnia) Envie a requisicao POST para 'base_url/containers':
  * Verifique se um novo container foi criado na tabela containers em seu banco de dados;
    Obs: Certifique-se de que seu banco de dados está conectado;
