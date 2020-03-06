/* --------------------------------- EXPORTS ---------------------------------*/
module.exports = {
  up: (queryInterface, Sequelize) => {
    /** Adiciona nova coluna... */
    return queryInterface.addColumn(
      /** ... à tabela 'users'... */
      'users',
      /** ... com nome 'avatar_id'... */
      'avatar_id',
      {
        /** ... de tipo INTEIRO... */
        type: Sequelize.INTEGER,
        /** ... que referencie... */
        references: {
          /** ... a tabela 'files' */
          model: 'files',
          /** ... usando a chave 'id' */
          key: 'id',
        },
        /** Se 'avatar_id' for alterado, repasse a alteracao para tabela de usuarios */
        onUpdate: 'CASCADE',
        /** Se 'avatar_id' for deletado, defina como nulo */
        onDelete: 'SET NULL',
        /** Permita valores nulos para o campo */
        allowNull: true,
      }
    );
  },

  down: queryInterface => {
    /** No método 'down' remove coluna 'avatar_id' da tabela 'users' */
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
