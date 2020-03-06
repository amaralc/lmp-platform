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

  /** Método que salva referencia de 'id' de arquivo dentro da tabela de usuario  */
  static associate(models) {
    /** Coluna 'room_id' pertence a 'models.Room' */
    this.belongsTo(models.Room, {
      foreignKey: 'room_id',
    });
  }
}

/* --------------------------------- EXPORTS ---------------------------------*/
export default Container;
