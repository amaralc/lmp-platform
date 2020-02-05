/* --------------------------------- IMPORTS ---------------------------------*/
import Sequelize, { Model } from 'sequelize';

/* --------------------------------- CONTENT ---------------------------------*/
/**
 * Cria classe Container extendendo os metodos da classe Model, da dependencia
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
        /** ID da sala onde o container se encontra */
        room_id: Sequelize.INTEGER,
      },
      {
        /*
         ** Argumento que será enviado pelo loader de models
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
