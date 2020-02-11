/* --------------------------------- EXPORTS ---------------------------------*/
module.exports = {
  up: (queryInterface, Sequelize) => {
    /** Adiciona coluna 'lab_id' a tabela 'rooms' */
    return queryInterface.addColumn('rooms', 'lab_id', {
      /** Tipo inteiro */
      type: Sequelize.INTEGER,
      /** Referencia a tabela 'labs' usando a chave id */
      references: { model: 'labs', key: 'id' },
      /** Se o lab for alterado, a alteração será atualizada na tabela de rooms */
      onUpdate: 'CASCADE',
      /** Se um lab for deletado, ele será definido como nulo */
      onDelete: 'SET NULL',
      /** Permite valores nulos */
      allowNull: true,
    });
  },
  down: queryInterface => {
    /** No método 'down' remove coluna 'lab_id' da tabela 'rooms' */
    return queryInterface.removeColumn('rooms', 'lab_id');
  },
};
