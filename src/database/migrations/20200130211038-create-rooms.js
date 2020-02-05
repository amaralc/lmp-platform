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
      /* Atribui a qual laboratorio pertence a sala. Referencia o banco de dados de laboratorios */
      lab: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      /* Atribui quais containers pertencem a sala. Referencia a tabela de containers */
      containers: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
  /* Reverting commands */
  down: queryInterface => {
    return queryInterface.dropTable('rooms');
  },
};
