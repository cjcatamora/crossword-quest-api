'use strict';
const { Op } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('crossword_grids', {
      grid_id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
      size: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 10 },
    });

    await queryInterface.addConstraint('crossword_grids', {
      type: 'check',
      name: 'crossword_grids_size_check',
      fields: ['size'],
      where: { size: { [Op.between]: [8, 12] } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('crossword_grids');
  },
};