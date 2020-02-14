/* --------------------------------- IMPORTS ---------------------------------*/
import Sequelize, { Model } from 'sequelize';

/* --------------------------------- CONTENT ---------------------------------*/
/*
 ** Cria classe Room extendendo os metodos da classe Model, da dependencia
 ** 'sequelize'
 */
class Room extends Model {
  /*
   ** Metodo estatico que sera chamado automaticamente pelo sequelize
   */
  static init(sequelize) {
    /*
     ** Chama metodo init da classe superior (Model) enviando colunas da base de dados
     ** Envia somente o que o usuario vai fornecer como input (chave primaria, etc, nao sao necessarias)
     */
    super.init(
      {
        /** Número de identificação na etiqueta da sala */
        number: Sequelize.INTEGER,
        /** Descrição breve da sala */
        description: Sequelize.STRING,
        /** ID (primary key) do lab onde a sala se encontra */
        lab_id: Sequelize.INTEGER,
        /** ID (primary key) do usuario que registrou a sala */
        created_by: Sequelize.INTEGER,
        /**
         * ID (primary key) do usuario que fez a ultima atualizacao dos dados
         * da sala.
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

  /** Método que salva referencia de 'id' de Lab dentro da tabela de salas  */
  static associate(models) {
    /** Coluna 'lab_id' pertence a 'models.Lab' */
    this.belongsTo(models.Lab, {
      foreignKey: 'lab_id',
    });
  }
}

/* --------------------------------- EXPORTS ---------------------------------*/
export default Room;
