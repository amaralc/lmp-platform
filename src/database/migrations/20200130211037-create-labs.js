/* --------------------------------- EXPORTS ---------------------------------*/
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('labs', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      /** Nome do laboratório */
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      /** Número de identificação na etiqueta do container */
      initials: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      /** ID (primary key) da sala do container */
      responsible_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /** ... que referencie... */
        references: {
          /** ... a tabela 'files' */
          model: 'users',
          /** ... usando a chave 'id' */
          key: 'id',
        },
        /** Se 'room_id' for alterado, repasse a alteracao para tabela de container */
        onUpdate: 'CASCADE',
        /** Se 'room_id' for deletado, defina como nulo */
        onDelete: 'SET NULL',
      },
      /** Endereço físico do laboratório */
      physical_adress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      /** Website do laboratório */
      website_adress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      /** Email do laboratório */
      email_adress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      /** Número do telefone do laboratório */
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true,
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
    return queryInterface.dropTable('labs');
  },
};
