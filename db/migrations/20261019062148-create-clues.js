'use strict';
const { Op } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clues', {
      clue_id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
      set_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'question_sets', key: 'set_id' },
        onDelete: 'CASCADE',
      },
      direction: { type: Sequelize.STRING(10), allowNull: false },
      start_row: { type: Sequelize.INTEGER, allowNull: false },
      start_col: { type: Sequelize.INTEGER, allowNull: false },
      clue_text: { type: Sequelize.TEXT, allowNull: false },
      answer_text: { type: Sequelize.STRING(100), allowNull: false },
      answer_length: { type: Sequelize.INTEGER, allowNull: false },
    });

    await queryInterface.addConstraint('clues', {
      type: 'check',
      name: 'clues_direction_check',
      fields: ['direction'],
      where: { direction: { [Op.in]: ['ACROSS', 'DOWN'] } },
    });
    await queryInterface.addConstraint('clues', {
      type: 'check',
      name: 'clues_start_row_check',
      fields: ['start_row'],
      where: { start_row: { [Op.between]: [0, 20] } },
    });
    await queryInterface.addConstraint('clues', {
      type: 'check',
      name: 'clues_start_col_check',
      fields: ['start_col'],
      where: { start_col: { [Op.between]: [0, 20] } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('clues');
  },
};