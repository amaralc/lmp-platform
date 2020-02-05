/* --------------------------------- EXPORTS ---------------------------------*/
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tools', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      tool: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fit_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      milling_cutter_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      external_diameter: {
        type: Sequelize.DOUBLE,
        defaultValue: null,
        allowNull: true,
      },
      thickness: {
        type: Sequelize.DOUBLE,
        defaultValue: null,
        allowNull: true,
      },
      internal_diameter: {
        type: Sequelize.DOUBLE,
        defaultValue: null,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('tools');
  },
};
