/* --------------------------------- EXPORTS ---------------------------------*/
module.exports = {
  up: (queryInterface, Sequelize) => {
    /** Adiciona coluna 'container_id' a tabela 'tools' */
    return queryInterface.addColumn('tools', 'container_id', {
      /** Tipo inteiro */
      type: Sequelize.INTEGER,
      /** Referencia a tabela 'containers' usando a chave id */
      references: { model: 'containers', key: 'id' },
      /** Se um container for alterado, a alteração será atualizada na tabela de tools */
      onUpdate: 'CASCADE',
      /** Se um container for deletado, ele será definido como nulo */
      onDelete: 'SET NULL',
      /** Permite valores nulos */
      allowNull: true,
    });
  },
  down: queryInterface => {
    /** No método 'down' remove coluna 'container_id' da tabela 'tools' */
    return queryInterface.removeColumn('tools', 'container_id');
  },
};
