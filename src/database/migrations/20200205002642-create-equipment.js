/* --------------------------------- EXPORTS ---------------------------------*/
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('equipment', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      // Categoria do equipamento (Metalografia, Metrologia, Máquina-Ferramenta)
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      /** Nome do equipamento (Torno, Torno CNC, Fresadora) */
      equipment_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      /** Empresa que fabricou o equipamento */
      company: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      /** Modelo do equipamento */
      model: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      /** Número de patrimônio da UFSC */
      ufsc_patrimony: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true,
      },
      /** Número de patrimônio da FEESC */
      feesc_patrimony: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true,
      },
      /** Cor do equipamento */
      color: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      /** Número de série do equipamento */
      serial_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      /** Campo para descrição e comentários */
      comments: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      /** Estado de funcionamento do equipamento (Funcionando, Parado ou Não encontrado) */
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      /** Foto do equipamento */
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      /** Valor da hora do equipamento em reais (BRL) */
      hourly_rate_brl: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      /** ID (primary key) do responsável pelo equipamento */
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
      /** ID (primary key) da sala onde equipamento se encontra */
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /** ... que referencie... */
        references: {
          /** ... a tabela 'salas' */
          model: 'rooms',
          /** ... usando a chave 'id' */
          key: 'id',
        },
        /** Se 'lab_id' for alterado, repasse a alteracao para tabela de room */
        onUpdate: 'CASCADE',
        /** Se 'lab_id' for deletado, defina como nulo */
        onDelete: 'SET NULL',
      },
      /** Timestamp de registro do equipamento */
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      /** ID (primary key) do usuário que registrou o container */
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      /** ID (primary key) do usuário que fez o último update do container */
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('equipment');
  },
};
