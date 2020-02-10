/* --------------------------------- EXPORTS ---------------------------------*/
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('tools', 'container', {
      type: Sequelize.INTEGER,
      references: { model: 'tools', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },
  down: queryInterface => {
    return queryInterface.removeColumn('tools', 'container');
  },
};
