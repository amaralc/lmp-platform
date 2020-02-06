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
      /** Name of the tool */
      tool_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      /** Type of fit (parallel or conic) */
      fit_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      /** Milling cutter type (cyllindrical, top, etc) */
      milling_cutter_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      /** External diameter of the milling cutter (mm) */
      external_diameter: {
        type: Sequelize.DOUBLE,
        defaultValue: null,
        allowNull: true,
      },
      /** Thickness of the milling cutter (mm) */
      thickness: {
        type: Sequelize.DOUBLE,
        defaultValue: null,
        allowNull: true,
      },
      /** Internal diameter of the milling cutter (mm) */
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
