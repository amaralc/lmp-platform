/* --------------------------------- IMPORTS ---------------------------------*/
import Sequelize, { Model } from 'sequelize';
/* --------------------------------- CONTENT ---------------------------------*/
class Equipment extends Model {
  static init(sequelize) {
    super.init(
      {
        category: Sequelize.STRING,
        responsible_id: Sequelize.INTEGER,
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
        hourly_rate_brl: Sequelize.DOUBLE,
        created_by: Sequelize.INTEGER,
        updated_by: Sequelize.INTEGER,
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

    /** Coluna 'responsible_id' pertence a 'models.User' */
    this.belongsTo(
      models.User,
      {
        foreignKey: 'responsible_id',
        as: 'responsible',
      },
      {
        foreignKey: 'created_by',
        as: 'creator',
      },
      {
        foreignKey: 'updated_by',
        as: 'updater',
      }
    );
  }
}
/* --------------------------------- EXPORTS ---------------------------------*/
export default Equipment;
