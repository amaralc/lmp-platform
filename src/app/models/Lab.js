/* --------------------------------- IMPORTS ---------------------------------*/
import Sequelize, { Model } from 'sequelize';

/* --------------------------------- CONTENT ---------------------------------*/
/**
 * Cria classe Lab extendendo os metodos da classe Model, da dependencia
 * 'sequelize'
 */
class Lab extends Model {
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
        /** Nome completo do laboratório */
        name: Sequelize.STRING,
        /** Sigla do laboratório */
        initials: Sequelize.STRING,
        /** ID do usuário responsável pelo laboratório */
        responsible_id: Sequelize.INTEGER,
        /** Endereço físico do laboratório */
        physical_adress: Sequelize.STRING,
        /** Website do laboratório */
        website_adress: Sequelize.STRING,
        /** Email do laboratório */
        email_adress: Sequelize.STRING,
        /** Telefone do laboratório */
        phone_number: Sequelize.STRING,
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
    /** Coluna 'responsible_id' pertence a 'models.User' */
    this.belongsTo(models.User, {
      foreignKey: 'responsible_id',
    });
  }
}

/* --------------------------------- EXPORTS ---------------------------------*/
export default Lab;
