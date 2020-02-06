/* --------------------------------- IMPORTS ---------------------------------*/
import Sequelize, { Model } from 'sequelize';
/* --------------------------------- CONTENT ---------------------------------*/
class Equipment extends Model {
  static init(sequelize) {
    super.init(
      {
        category: Sequelize.STRING,
        equipament: Sequelize.STRING,
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
}
/* --------------------------------- EXPORTS ---------------------------------*/
export default Equipment;
