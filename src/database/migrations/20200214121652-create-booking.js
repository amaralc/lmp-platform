/* --------------------------------- EXPORTS ---------------------------------*/
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('bookings', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      /** Data do agendamento */
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
        /** Se o usuário for alterado, repasse a alteracao para tabela de agendamentos */
        onUpdate: 'CASCADE',
        /** Se o usuário for deletado, defina como nulo e assim, mesmo que o usuário seja deletado, teremos um histórico dos agendamentos do prestador de serviços */
        onDelete: 'SET NULL',
        /** Permita valores nulos para o campo */
        allowNull: true,
      },
      /** Cria uma coluna equipment_id, que irá identificar qual equipamento está sendo agendado */
      equipment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'equipment',
          key: 'id',
        },
        /** Se o equipamento for alterado, repasse a alteracao para tabela de agendamentos */
        onUpdate: 'CASCADE',
        /** Se o equipmaneto for deletado, defina como nulo e o histórico de atendimento para o usuário não irá se perder. */
        onDelete: 'SET NULL',
        /** Permita valores nulos para o campo */
        allowNull: true,
      },
      /** Timestamp do cancelamento */
      canceled_at: {
        type: Sequelize.DATE,
      },
      /** Timestamp de criação */
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      /** Timestamp do update */
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('bookings');
  },
};
