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
        number: Sequelize.INTEGER,
        lab: Sequelize.INTEGER,
        description: Sequelize.STRING,
      },
      {
        /*
         ** Argumento que sera enviado pelo loader de models
         */
        sequelize,
      }
    );
  }
}

/* --------------------------------- EXPORTS ---------------------------------*/
export default Room;
