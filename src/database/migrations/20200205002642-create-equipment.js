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
      // Nome do equipamento (Torno, Torno CNC, Fresadora)
      equipment_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // Empresa que fabricou o equipamento
      company: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // Modelo do equipamento
      model: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // Número de patrimônio da UFSC
      ufsc_patrimony: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true,
      },
      // Número de patrimônio da FEESC
      feesc_patrimony: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true,
      },
      // Cor do equipamento
      color: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // Número de série do equipamento
      serial_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      // Campo para descrição e comentários
      comments: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      // Estado de funcionamento do equipamento (Funcionando, Parado ou Não encontrado)
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // ID da sala da tabela Rooms
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      // Foto do equipamento
      image: {
        type: Sequelize.STRING,
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
    return queryInterface.dropTable('equipment');
  },
};
