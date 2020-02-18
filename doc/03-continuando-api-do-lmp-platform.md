# Continuando API do GoBarber

## Indice

  * [Envio de arquivos](#envio-de-arquivos)
    * [Configurando Multer](#00-configurando-multer)
    * [Avatar do usuario](#01-avatar-do-usuario)
  * [Funcionalidade de agendamentos](#funcionalidade-de-agendamentos)
    * [Listagem de prestadores de serviço](#02-listagem-de-prestadores-de-serviço)
  * [Envio de notificacoes](#envio-de-notificacoes)
  * [Cancelamento e envio de email](#cancelamento-e-envio-de-email)
  * [Configuracoes avancadas](#configuracoes-avancadas)

## Envio de arquivos
[Voltar para índice](#indice)

### 00 Configurando Multer
[Voltar para índice](#indice)
[Video](https://skylab.rocketseat.com.br/node/continuando-api-do-go-barber/group/envio-de-arquivos/lesson/configurando-multer-2)

  Objtivo: criar funcionalidade de upload da aplicacao para que usuario que for prestador de servico tenha um avatar dentro da aplicacao (foto).

    Obs: Existem varias formas de tratar upload de arquivos dentro da aplicação.
      * Forma 1: enviar enviar imagem junto com outros dados durante o cadastro do usuário em uma única requisição;
      * Forma 2: upload de arquivos, isolado do restante. Imagem enviada ao servidor para um banco de dados e servidor retorna um ID da imagem. Quando preenchemos o restante do cadastro, enviamos apenas o ID em uma segunda requisicao. Assim mantemos a estrutura de JSON para enviar os dados visto que JSON não suporta envio de arquivos.

  * (terminal) Instala biblioteca 'multer' para lidar com 'multipart/form-data': `yarn add multer` ;

    Obs: Quando precisamos lidar com arquivos nas nossas requisicoes de chamadas ao servidor, precisamos enviar essas requisicoes em um formato chamado 'multipart/form-data' (único formato que suporta envio de arquivos físicos). Para lidar com esse tipo de requisição iremos lidar com a biblioteca 'Multer'.

  * Cria pasta 'tmp' na raiz do projeto, fora da pasta 'src';
  * Cria pasta 'uploads' dentro da pasta 'tmp';
  * Cria arquivo **src/config/multer.js** (configuracao da funcao de upload de arquivos):

    ```js
    /* --------------------------------- IMPORTS ---------------------------------*/
    import multer from 'multer';
    import crypto from 'crypto';
    import { extname, resolve } from 'path';

    /* --------------------------------- CONTENT ---------------------------------*/
    /* --------------------------------- EXPORTS ---------------------------------*/
    export default {
      /**
      * Como multer vai guardar nossos arquivos de imagem.
      * Obs.: existem varias formas de armazenar, como em CDNs (Content Delivery
      * Networks) tipo a Amazon s3 e digital ocean spaces). No nosso caso iremos
      * guardar as imagens dentro dos arquivos da aplicacao, na pasta 'tmp' usando
      * o multer.diskStorage ;
      */
      storage: multer.diskStorage({
        /** Destino do arquivo que esta sendo enviado para a aplicacao */
        destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),

        /**
        * Controle da formatacao do nome do arquivo enviado pelo usuario.
        * Evita que usuarios enviem caracteres estranhos ou com nomes de arquivos duplicados.
        */
        filename: (req, file, cb) => {
          /** Configura numero de bytes aleatorios */
          crypto.randomBytes(16, (err, res) => {
            /** Se houber erro, retorna callback com erro */
            if (err) return cb(err);

            /**
            * Se nao houver erro, envia primeiro argumento como nulo e retorna
            * string com random bytes concatenada com a extensao do arquivo;
            */
            return cb(null, res.toString('hex') + extname(file.originalname));
          });
        },
      }),
    };

    ```

  * Edita arquivo de rotas inserindo multer, multerConfig e outros:

    ```js
    /* --------------------------------- IMPORTS ---------------------------------*/
    import { Router } from 'express';
    import multer from 'multer';
    import multerConfig from './config/multer';
    import UserController from './app/controllers/UserController';
    import SessionController from './app/controllers/SessionController';
    import authMiddleware from './app/middlewares/auth';

    /* --------------------------------- CONTENT ---------------------------------*/
    /** Instancia novo roteador Router do express */
    const routes = new Router();
    /** Variavel de configuracao do upload usando multer */
    const upload = multer(multerConfig);

    /** Define rota PUT para criar novo usuario */
    routes.post('/users', UserController.store);
    /** Define rota POST para criar nova session */
    routes.post('/sessions', SessionController.store);

    /** Define MIDDLEWARE GLOBAL que vale para rotas que vem apos sua declaracao */
    routes.use(authMiddleware);
    /** Define rota PUT para editar dados do usuario */
    routes.put('/users', UserController.update);
    /**
    * Define rota POST para upload de arquivos (com middleware e controller local, sem arquivo separado)
    * Middleware chama variavel upload, metodo 'single' para fazer upload de um arquivo por vez */
    routes.post('/files', upload.single('file'), (req, res) => {
      return res.json({ ok: true });
    });

    /* --------------------------------- EXPORTS ---------------------------------*/
    export default routes;

    ```

  * (insomnia):
    * Cria pasta 'Files';
    * Cria nova requisicao 'Create', tipo 'POST' para 'base_url/files';
    * Altera 'Body' para 'Multipart Form';
      * Substitui 'new name' por 'file' (o mesmo valor definido em *upload.single* em **routes.js**);
      * Substitui 'value' pela opcao 'file';
    * Seleciona arquivo que deseja enviar;
    * Em 'environment' cria nova variavel token e salva token:
      Ex.:

        ```js
        {
          "base_url":"http://localhost:3333",
          "token":"blablabla.blablabla.blablabla"
        }
        ```
    * Em 'Auth' seleciona a opcao 'Bearer' e adiciona o token enviado durante login do usuario (salvo na variavel do base environment);
      * Opcao de envio de arquivo estara disponivel apenas na rota de edicao quando usuario for
        editar seu perfil, quando for prestador de servico, na versao web da aplicacao;

  * (terminal) roda servidor: `yarn dev` ;

  * (insomnia) envia requisicao para rota base_url/files e verifica:
    * Se recebeu {ok: true} na resposta;
    * Se arquivo foi salvo na pasta tmp/uploads;

### 01 Avatar do usuario
[Voltar para índice](#indice)
[Video](https://skylab.rocketseat.com.br/node/continuando-api-do-go-barber/group/envio-de-arquivos/lesson/avatar-do-usuario-1)

  Objetivo: salvar informações do arquivo dentro da base de dados.

  Obs.: quando multer está agindo dentro de uma rota, ele libera uma variável dentro do req (req.file, para upload de um único arquivo e req.files para upload de vários arquivos).

  Se rota POST /files retornar req.file:

    ```js
    routes.post('/files', upload.single('file'), (req, res) => {
      return res.json(req.file);
    });
    ```

  O servidor retornará todos os dados do arquivo no res.json:

    ```js
    {
      "fieldname": "file",
      "originalname": "file-01.PNG", // Nome do arquivo na maquina do cliente
      "encoding": "7bit",
      "mimetype": "image/png",
      "destination": "C:\\Users\\Avell\\Dev\\google\\github\\gostack-gobarber\\tmp\\uploads",
      "filename": "02ecf493c52d78f729aee9e39132fa76.PNG", // nome do arquivo na aplicacao
      "path": "C:\\Users\\Avell\\Dev\\google\\github\\gostack-gobarber\\tmp\\uploads\\02ecf493c52d78f729aee9e39132fa76.PNG",
      "size": 253
    }
    ```

  O que importa para nós são duas variáveis: `originalname` e `filename`. Para resgatar esses valores e guardar no banco de dados executaremos os procedimentos a seguir:

  * (terminal) Cria nova tabela de 'Files' no banco de dados: `yarn sequelize migration:create  --name=create-files` ;

  * Edita arquivo de migration criado '...-create-files.js':

    ```js
    /* --------------------------------- EXPORTS ---------------------------------*/
    module.exports = {
      up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('files', {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          path: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        });
      },

      down: queryInterface => {
        return queryInterface.dropTable('files');
      },
    };
    ```

  * Faz migração do banco de dados para criar tabela 'Files': `yarn sequelize db:migrate` ;

  * Cria model **app/models/File.js**:

    ```js
    /* --------------------------------- IMPORTS ---------------------------------*/
    import Sequelize, { Model } from 'sequelize';

    /* --------------------------------- CONTENT ---------------------------------*/
    /**
    * Cria classe File extendendo os metodos da classe Model, da dependencia
    * 'sequelize'
    */
    class File extends Model {
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
            name: Sequelize.STRING,
            path: Sequelize.STRING,
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
    export default File;
    ```

  * Importa 'File' para dentro de **database/index.js** e adiciona no array de models:

    ```js
    /* --------------------------------- IMPORTS ---------------------------------*/
    import Sequelize from 'sequelize';
    import databaseConfig from '../config/database';
    import User from '../app/models/User';
    import File from '../app/models/File';

    /* --------------------------------- CONTENT ---------------------------------*/

    /* Cria array com todos os models da aplicacao */
    const models = [User, File];

    /*
    ** Cria classe Database
    */
    class Database {
      constructor() {
        this.init();
      }

      /*
      ** metodo que faz conexao com base de dados e carrega os models da aplicacao
      */
      init() {
        /*
        ** Variavel esperada dentro dos models no metodo init
        */
        this.connection = new Sequelize(databaseConfig);

        /* Acessa o metodo init de cada model da aplicacao passando a conexao */
        models.map(model => model.init(this.connection));
      }
    }

    /* --------------------------------- EXPORTS ---------------------------------*/
    export default new Database();
    ```

  * Cria arquivo **controllers/FileController.js** e move lógica do req e res (das rotas) pra dentro do **FileController.js**:

    ```js
    /* --------------------------------- IMPORTS ---------------------------------*/
    import File from '../models/File';

    /* --------------------------------- CONTENT ---------------------------------*/
    class FileController {
      async store(req, res) {
        /**
        * Desestrutura 'req.file' salvando apenas informações 'originalname' (multer)
        * como 'name' (model) e 'filename' (multer) como 'path' (model).
        */
        const { originalname: name, filename: path } = req.file;

        /**
        * Cria variável 'file' utilizando 'name' e 'path' obtidos de 'req.file'
        */
        const file = await File.create({
          name,
          path,
        });

        /** Retorna 'file' em formato JSON */
        return res.json(file);
      }
    }

    /* --------------------------------- EXPORTS ---------------------------------*/
    export default new FileController();

    ```

  * Atualiza rotas da aplicação utilizando o FileController criado:

    ```js
    /* --------------------------------- IMPORTS ---------------------------------*/
    import { Router } from 'express';
    import multer from 'multer';
    import multerConfig from './config/multer';
    import authMiddleware from './app/middlewares/auth';
    import UserController from './app/controllers/UserController';
    import SessionController from './app/controllers/SessionController';
    import FileController from './app/controllers/FileController';

    /* --------------------------------- CONTENT ---------------------------------*/
    /** Instancia novo roteador Router do express */
    const routes = new Router();
    /** Variavel de configuracao do upload usando multer */
    const upload = multer(multerConfig);

    /** Define rota PUT para criar novo usuario */
    routes.post('/users', UserController.store);
    /** Define rota POST para criar nova session */
    routes.post('/sessions', SessionController.store);

    /** Define MIDDLEWARE GLOBAL que vale para rotas que vem apos sua declaracao */
    routes.use(authMiddleware);
    /** Define rota PUT para editar dados do usuario */
    routes.put('/users', UserController.update);
    /**
    * Define rota POST para upload de arquivos (com middleware local)
    * Middleware chama variavel upload, metodo 'single' para fazer upload de
    * um arquivo por vez
    */
    routes.post('/files', upload.single('file'), FileController.store);

    /* --------------------------------- EXPORTS ---------------------------------*/
    export default routes;

    ```

  * Adiciona nova coluna na tabela de usuários para correlacionar 'user' com avatar da tabela 'files':

    * (terminal) Cria migration para adicionar coluna à tabela de usuários: `yarn sequelize migration:create --name=add-avatar-field-to-users` ;

    * Edita migration **add-avatar-filed-to-users**:

      ```js
      module.exports = {
        up: (queryInterface, Sequelize) => {
          /** Adiciona nova coluna... */
          return queryInterface.addColumn(
            /** ... à tabela 'users'... */
            'users',
            /** ... com nome 'avatar_id'... */
            'avatar_id',
            {
              /** ... de tipo INTEIRO... */
              type: Sequelize.INTEGER,
              /** ... que referencie... */
              references: {
                /** ... a tabela 'files' */
                model: 'files',
                /** ... usando a chave 'id' */
                key: 'id',
              },
              /** Se 'avatar_id' for alterado, repasse a alteracao para tabela de usuarios */
              onUpdate: 'CASCADE',
              /** Se 'avatar_id' for deletado, defina como nulo */
              onDelete: 'SET NULL',
              /** Permita valores nulos para o campo */
              allowNull: true,
            }
          );
        },

        down: queryInterface => {
          /** No método 'down' remove coluna 'avatar_id' da tabela 'users' */
          queryInterface.removeColumn('users', 'avatar_id');
        },
      };
      ```

    * (terminal) Executa migration do banco de dados: `yarn sequelize db:migrate` ;
    * (postbird) Checa se migration funcionou avaliando se nova coluna 'avatar_id' foi criada na tabela 'users' e se clicando duas vezes na célula e adicionando um 'id', se a tabela 'files' é referenciada.

  Agora precisamos garantir que quando usuário for atualizado, o id do arquivo esteja sendo salvo no banco de dados. Como o model 'User' ainda não reconhece a coluna 'avatar_id' precisamos fazer seu relacionamento com o model de 'File'.

  * Edita model 'User' criando método 'associate' para que esse model seja associado ao método 'File':

    ```js
    /* --------------------------------- IMPORTS ---------------------------------*/
    import Sequelize, { Model } from 'sequelize';
    import bcrypt from 'bcryptjs';

    /* --------------------------------- CONTENT ---------------------------------*/
    /**
    * Cria classe User extendendo os metodos da classe Model, da dependencia
    * 'sequelize'
    */
    class User extends Model {
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
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            password: Sequelize.VIRTUAL, // Campo sem correspondencia no database
            password_hash: Sequelize.STRING,
            provider: Sequelize.BOOLEAN,
          },
          {
            /*
            ** Argumento que sera enviado pelo loader de models
            */
            sequelize,
          }
        );

        /**
        * Hooks: Funcionalidade do sequelize -> trecho de codigo executados de
        * forma automatica baseado em acoes que acontecem no nosso model.
        *
        * Hook 'before save': executa trecho de codigo antes de objeto ser salvo
        * no banco de dados (criado ou editado).
        */
        this.addHook('beforeSave', async user => {
          /** Se houver password na requisicao */
          if (user.password) {
            /**
            * Aguarda e define password_hash como 8 rouds de criptografia da string
            * enviada.
            */
            user.password_hash = await bcrypt.hash(user.password, 8);
          }
        });

        /** Retorna model que acaba de ser inicializado */
        return this;
      }

      /** Método que salva referencia de 'id' de arquivo dentro da tabela de usuario  */
      static associate(models) {
        /** Coluna 'avatar_id' pertence a 'models.File' */
        this.belongsTo(models.File, {
          foreignKey: 'avatar_id',
        });
      }

      /** Recebe senha enviada pelo cliente */
      checkPassword(password) {
        /**
        * Retorna comparacao entre hash da senha enviada com hash salvo no
        * banco de dados.
        *
        * Retorna 'true' caso senhas sejam iguais.
        */
        return bcrypt.compare(password, this.password_hash);
      }
    }

    /* --------------------------------- EXPORTS ---------------------------------*/
    export default User;
    ```

  * Chama método 'associate' em **database/index.js**:

    ```js
    /* --------------------------------- IMPORTS ---------------------------------*/
    import Sequelize from 'sequelize';
    import databaseConfig from '../config/database';
    import User from '../app/models/User';
    import File from '../app/models/File';

    /* --------------------------------- CONTENT ---------------------------------*/

    /* Cria array com todos os models da aplicacao */
    const models = [User, File];

    /*
    ** Cria classe Database
    */
    class Database {
      constructor() {
        this.init();
      }

      /*
      ** metodo que faz conexao com base de dados e carrega os models da aplicacao
      */
      init() {
        /*
        ** Variavel esperada dentro dos models no metodo init
        */
        this.connection = new Sequelize(databaseConfig);

        models
          /* Acessa o metodo init de cada model da aplicacao passando a conexao */
          .map(model => model.init(this.connection))
          /** Se 'model.associate' existir (condição &&) chama metodo passando models */
          .map(model => model.associate && model.associate(this.connection.models));
      }
    }

    /* --------------------------------- EXPORTS ---------------------------------*/
    export default new Database();
    ```

  * (terminal) Roda servidor: `yarn dev` ;
  * (isomnia):
    * Abre requisição de PUT de update de usuários;
    * Troca token da requisição por variável de ambiente 'token';
    * Adiciona atributo 'id' ao corpo (body) da requisição;

      ```js
      {
        "name":"user one",
        "email":"email1@email.com",
        "oldPassword":"123456",
        "password":"123456",
        "confirmPassword":"123456"
        "avatar_id":1,
      }
      ```

    * Envia requisição;
    * Verifica se recebeu resposta;

  * (postbird) Verifica se coluna 'avatar_id' foi atualizada no banco de dados;

## Funcionalidade de agendamentos
[Voltar para índice](#indice)

### 02 Listagem de prestadores de serviço
[Voltar para índice](#indice)

  Objetivo: Criar rota para fazer listagem de todos os prestadores de serviço da aplicação.

  * Cria rota '/providers' em **routes.js**:

    ```js
    /* --------------------------------- IMPORTS ---------------------------------*/
    import { Router } from 'express';
    import multer from 'multer';
    import multerConfig from './config/multer';
    import authMiddleware from './app/middlewares/auth';
    import UserController from './app/controllers/UserController';
    import SessionController from './app/controllers/SessionController';
    import FileController from './app/controllers/FileController';
    import ProviderController from './app/controllers/ProviderController';

    /* --------------------------------- CONTENT ---------------------------------*/
    /** Instancia novo roteador Router do express */
    const routes = new Router();
    /** Variavel de configuracao do upload usando multer */
    const upload = multer(multerConfig);

    /** Define rota PUT para criar novo usuario */
    routes.post('/users', UserController.store);
    /** Define rota POST para criar nova session */
    routes.post('/sessions', SessionController.store);

    /** Define MIDDLEWARE GLOBAL que vale para rotas que vem apos sua declaracao */
    routes.use(authMiddleware);
    /** Define rota PUT para editar dados do usuario */
    routes.put('/users', UserController.update);
    /**
    * Define rota POST para upload de arquivos (com middleware local)
    * Middleware chama variavel upload, metodo 'single' para fazer upload de
    * um arquivo por vez
    */
    routes.post('/files', upload.single('file'), FileController.store);
    /** Define rota GET para listagem de usuários que são providers */
    routes.get('/providers', ProviderController.index);

    /* --------------------------------- EXPORTS ---------------------------------*/
    export default routes;

    ```

  * Cria novo controller **ProviderController.js** com método index para fazer listagem de 'users' que que tem o atributo `provider: true`:

    ```js
    /* --------------------------------- IMPORTS ---------------------------------*/
    import User from '../models/User';
    import File from '../models/File';
    /* --------------------------------- CONTENT ---------------------------------*/
    class ProviderController {
      async index(req, res) {
        /** O User.findAll retornaria todos os usuários cadastrados, entretando... */
        const providers = await User.findAll({
          /**
          * ... ao utilizarmos o WHERE, nos é retornado apenas os usuários cujo
          * provider consta true.
          */
          where: { provider: true },
          /**
          * ATTRIBUTES serve para retornar apenas os dados que desejamos, caso
          * contrário, retornaria os dados de todas as colunas da tabela.
          */
          attributes: ['id', 'name', 'email', 'avatar_id'],
          /**
          * Para retornar todos os dados do avatar do usuários, utilizamos o
          * 'include' como um array para incluir quantos relacionamentos quisermos.
          */
          include: [
            {
              model: File,
              /**
              * Utilizando o AS, podemos alterar o nome que será retornado, ao
              * invés de retornar File, retornará avatar.
              */
              as: 'avatar',
              /**
              * Para retornar apenas o que precisamos, utilizamos ATTRIBUTES
              * novamente para retornar apenas o name e path do File.
              */
              attributes: ['name', 'path', 'url'],
            },
          ],
        });

        /** Retorna objeto 'providers' em formato JSON */
        return res.json(providers);
      }
    }
    /* --------------------------------- EXPORTS ---------------------------------*/
    export default new ProviderController();
    ```

  * (insomnia):
    * Cria nova pasta 'Providers';
    * Cria requisição 'Index' dentro da pasta 'Providers', como método GET para rota 'base_url/providers' com corpo vazio;
    * Adiciona 'token' na aba 'Auth' para autenticação;

  * Adiciona atributo 'as' no metodo 'associate' do model **User.js**;

    ```js
    /* --------------------------------- IMPORTS ---------------------------------*/
    import Sequelize, { Model } from 'sequelize';
    import bcrypt from 'bcryptjs';

    /* --------------------------------- CONTENT ---------------------------------*/
    /**
    * Cria classe User extendendo os metodos da classe Model, da dependencia
    * 'sequelize'
    */
    class User extends Model {
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
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            password: Sequelize.VIRTUAL, // Campo sem correspondencia no database
            password_hash: Sequelize.STRING,
            provider: Sequelize.BOOLEAN,
          },
          {
            /*
            ** Argumento que sera enviado pelo loader de models
            */
            sequelize,
          }
        );

        /**
        * Hooks: Funcionalidade do sequelize -> trecho de codigo executados de
        * forma automatica baseado em acoes que acontecem no nosso model.
        *
        * Hook 'before save': executa trecho de codigo antes de objeto ser salvo
        * no banco de dados (criado ou editado).
        */
        this.addHook('beforeSave', async user => {
          /** Se houver password na requisicao */
          if (user.password) {
            /**
            * Aguarda e define password_hash como 8 rouds de criptografia da string
            * enviada.
            */
            user.password_hash = await bcrypt.hash(user.password, 8);
          }
        });

        /** Retorna model que acaba de ser inicializado */
        return this;
      }

      /** Método que salva referencia de 'id' de arquivo dentro da tabela de usuario  */
      static associate(models) {
        /** Coluna 'avatar_id' pertence a 'models.File' */
        this.belongsTo(models.File, {
          foreignKey: 'avatar_id',
          /**
          * Utilizando o 'as', podemos alterar o nome que será retornado, ao invés
          * de retornar File, retornará 'avatar'.
          */
          as: 'avatar',
        });
      }

      /** Recebe senha enviada pelo cliente */
      checkPassword(password) {
        /**
        * Retorna comparacao entre hash da senha enviada com hash salvo no
        * banco de dados.
        *
        * Retorna 'true' caso senhas sejam iguais.
        */
        return bcrypt.compare(password, this.password_hash);
      }
    }

    /* --------------------------------- EXPORTS ---------------------------------*/
    export default User;

    ```

  * Cria campo virtual 'url' no model **File.js**:

    ```js
    /* --------------------------------- IMPORTS ---------------------------------*/
    import Sequelize, { Model } from 'sequelize';

    /* --------------------------------- CONTENT ---------------------------------*/
    /**
    * Cria classe File extendendo os metodos da classe Model, da dependencia
    * 'sequelize'
    */
    class File extends Model {
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
            name: Sequelize.STRING,
            path: Sequelize.STRING,
            /** Criamos um campo virtual, que não existe na tabela, para passarmos a URL do avatar do user. */
            url: {
              type: Sequelize.VIRTUAL,
              get() {
                /** Retornamos então o prefixo localhost segudo pelo path do arquivo. */
                return `http://localhost:3333/files/${this.path}`;
              },
            },
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
    export default File;

    ```

  * Adiciona middleware em **app.js** para que servidor forneça arquivos estáticos na rota '/files':

    ```js
    /* --------------------------------- IMPORTS ---------------------------------*/
    import express from 'express';
    import path from 'path';
    import routes from './routes';
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
        this.middlewares();
        this.routes();
      }

      /* Cadastro dos middlewares da aplicacao */
      middlewares() {
        /* Prepara app para receber requisicoes em formato json */
        this.server.use(express.json());
        /**
        * Usa recurso express.static para servir arquivos
        * estáticos (PNG, CSS, HTML), acessados diretamente
        * pelo navegador.
        */
        this.server.use(
          '/files',
          express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
        );
      }

      routes() {
        /* Importa rotas de outro arquivo e usa no servidor */
        this.server.use(routes);
      }
    }

    /* --------------------------------- EXPORTS ---------------------------------*/
    export default new App().server;

    ```

  * (insomnia) Envia requisição 'Index' e verifica se servidor responde com lista de usuários do tipo `provider: true`;
  * (insomnia) Clica no link da url da resposta e verifica se é possível visualizar imagem no browser;

## Envio de notificacoes
[Voltar para índice](#indice)
## Cancelamento e envio de email
[Voltar para índice](#indice)
## Configuracoes avancadas
[Voltar para índice](#indice)
