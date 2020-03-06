/* --------------------------------- IMPORTS ---------------------------------*/
/**
 * Carrega todas as variáveis ambiente e coloca dentro de variável global do
 * node chamada process.env
 * Necessário utilizar sintaxe 'require';
 */
require('dotenv/config');

/* --------------------------------- EXPORTS ---------------------------------*/
module.exports = {
  /* Define dados para conexao com banco de dados */
  dialect: 'postgres', // informa qual sera o dialeto utilizado
  host: process.env.DB_HOST, // informa o host onde se encontra a base de dados
  username: process.env.DB_USER, // informa username para acesso
  password: process.env.DB_PASS, // password para acesso
  database: process.env.DB_NAME, // nome do banco de dados criado

  // define funcinalidades extra
  define: {
    timestamps: true, // garante coluna 'created_at' e 'updated_at' em cada tabela do banco de dados
    underscored: true, // padroniza nomenclatura de tabelas
    underscoredAll: true, // padroniza nomenclatura de colunas com o padrao underscore '_'
  },
};
