/* --------------------------------- EXPORTS ---------------------------------*/
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('containers', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      /** Descrição breve do container */
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      /** Número de identificação na etiqueta do container */
      number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      /** ID (primary key) da sala do container */
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      /** Timestamp de registro do container no sistema */
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      /** ID (primary key) do usuário que registrou o container */
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      /** Timestamp da última edição dos dados do container no sistema */
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      /** ID (primary key) do usuário que fez o último update do container */
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('containers');
  },
};
