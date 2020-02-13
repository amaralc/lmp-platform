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
