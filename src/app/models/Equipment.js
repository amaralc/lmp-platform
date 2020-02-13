/* --------------------------------- IMPORTS ---------------------------------*/
import Sequelize, { Model } from 'sequelize';
/* --------------------------------- CONTENT ---------------------------------*/
class Equipment extends Model {
  static init(sequelize) {
    super.init(
      {
        category: Sequelize.STRING,
        equipment_name: Sequelize.STRING,
        company: Sequelize.STRING,
        model: Sequelize.STRING,
        ufsc_patrimony: Sequelize.INTEGER,
        feesc_patrimony: Sequelize.INTEGER,
        color: Sequelize.STRING,
        serial_number: Sequelize.STRING,
        comments: Sequelize.STRING,
        state: Sequelize.STRING,
        room_id: Sequelize.INTEGER,
        image: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }

  /** Método que salva referencia de 'id' de sala dentro da tabela de equipamentos  */
  static associate(models) {
    /** Coluna 'room_id' pertence a 'models.Rooms' */
    this.belongsTo(models.Room, {
      foreignKey: 'room_id',
    });
  }
}
/* --------------------------------- EXPORTS ---------------------------------*/
export default Equipment;
