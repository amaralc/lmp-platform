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
      /** ID (primary key) do container onde ferramenta se encontra */
      container_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /** ... que referencie... */
        references: {
          /** ... a tabela 'containers' */
          model: 'containers',
          /** ... usando a chave 'id' */
          key: 'id',
        },
        /** Se 'room_id' for alterado, repasse a alteracao para tabela de container */
        onUpdate: 'CASCADE',
        /** Se 'room_id' for deletado, defina como nulo */
        onDelete: 'SET NULL',
      },
      /** ID (primary key) do usuário que registrou a ferramenta */
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      /** ID (primary key) do usuário que fez o último update da ferramenta */
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('tools');
  },
};
