'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('question_sets', 'host_id', {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: { model: 'users', key: 'user_id' },
      onDelete: 'RESTRICT',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('question_sets', 'host_id');
  },
};