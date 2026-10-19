'use strict';
const { Op } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('game_sessions', {
      session_id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
      host_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
        onDelete: 'CASCADE',
      },
      set_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'question_sets', key: 'set_id' },
        onDelete: 'CASCADE',
      },
      grid_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
        references: { model: 'crossword_grids', key: 'grid_id' },
        onDelete: 'CASCADE',
      },
      join_code: { type: Sequelize.CHAR(6), allowNull: false, unique: true },
      shareable_link: { type: Sequelize.STRING(255), allowNull: false },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'WAITING' },
      started_at: { type: Sequelize.DATE, allowNull: true },
      ended_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    await queryInterface.addConstraint('game_sessions', {
      type: 'check',
      name: 'game_sessions_status_check',
      fields: ['status'],
      where: { status: { [Op.in]: ['WAITING', 'PLAYING', 'FINISHED'] } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('game_sessions');
  },
};