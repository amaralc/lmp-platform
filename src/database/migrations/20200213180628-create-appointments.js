/* --------------------------------- EXPORTS ---------------------------------*/
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      /** Cria uma coluna user_id para referênciar o usuário que está agendando, marcará então qual o usuário que está realizando o agendamento.  */
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        /** Se o usuário for alterado, repasse a alteracao para tabela de usuarios */
        onUpdate: 'CASCADE',
        /** Se o usuário for deletado, defina como nulo e assim, mesmo que o usuário seja deletado, teremos um histórico dos agendamentos do prestador de serviços */
        onDelete: 'SET NULL',
        /** Permita valores nulos para o campo */
        allowNull: true,
      },
      /** Cria uma coluna provider_id, que irá identificar qual prestador de serviço que irá atender esse agendamento */
      provider_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        /** Se o provedor for alterado, repasse a alteracao para tabela de usuarios */
        onUpdate: 'CASCADE',
        /** Se o provedor for deletado, defina como nulo e o histórico de atendimento para o usuário não irá se perder. */
        onDelete: 'SET NULL',
        /** Permita valores nulos para o campo */
        allowNull: true,
      },
      canceled_at: {
        type: Sequelize.DATE,
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
    return queryInterface.dropTable('files');
  },
};
