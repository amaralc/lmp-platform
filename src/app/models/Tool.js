/* --------------------------------- IMPORTS ---------------------------------*/
import Sequelize, { Model } from 'sequelize';

/* --------------------------------- CONTENT ---------------------------------*/
/**
 * Cria classe Tool extendendo os metodos da classe Model, da dependencia
 * 'sequelize'
 */
class Tool extends Model {
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
        /** Name of the tool */
        tool_name: Sequelize.STRING,
        /** Type of fit (parallel or conic) */
        fit_type: Sequelize.STRING,
        /** Milling cutter type (cyllindrical, top, etc) */
        milling_cutter_type: Sequelize.STRING,
        /** External diameter of the milling cutter (mm) */
        external_diameter: Sequelize.DOUBLE,
        /** Thickness of the milling cutter (mm) */
        thickness: Sequelize.DOUBLE,
        /** Internal diameter of the milling cutter (mm) */
        internal_diameter: Sequelize.DOUBLE,
        /** ID (primary key) do container onde ferramenta se encontra */
        container_id: Sequelize.INTEGER,
        /** ID (primary key) do usuario que registrou a ferramenta */
        created_by: Sequelize.INTEGER,
        /**
         * ID (primary key) do usuario que fez a ultima atualizacao dos dados
         * da ferramenta.
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
  }

  /** Método que salva referencia de 'id' de Container dentro da tabela de ferramenta  */
  static associate(models) {
    /** Coluna 'container_id' pertence a 'models.Container' */
    this.belongsTo(models.Container, {
      foreignKey: 'container_id',
    });
  }
}

/* --------------------------------- EXPORTS ---------------------------------*/
export default Tool;
