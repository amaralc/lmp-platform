/* --------------------------------- EXPORTS ---------------------------------*/
module.exports = {
  /* Altering commands */
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rooms', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      /* Atribui o numero da sala. e.g.: "101" */
      number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      /* Atribui o nome da sala. e.g.: "MEV" */
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      /** ID (primary key) do lab responsavel pelo room */
      lab_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /** ... que referencie... */
        references: {
          /** ... a tabela 'labs' */
          model: 'labs',
          /** ... usando a chave 'id' */
          key: 'id',
        },
        /** Se 'room_id' for alterado, repasse a alteracao para tabela de container */
        onUpdate: 'CASCADE',
        /** Se 'room_id' for deletado, defina como nulo */
        onDelete: 'SET NULL',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      /** ID (primary key) do usuário que registrou o container */
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
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
  /* Reverting commands */
  down: queryInterface => {
    return queryInterface.dropTable('rooms');
  },
};
