'use strict';
const { Op } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('players', {
      player_id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
      session_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'game_sessions', key: 'session_id' },
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: true, // guest players allowed; palitan ng false kung required
        references: { model: 'users', key: 'user_id' },
        onDelete: 'CASCADE',
      },
      nickname: { type: Sequelize.STRING(30), allowNull: false },
      player_color: { type: Sequelize.STRING(10), allowNull: false },
      token: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      score: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      streak: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      device_platform: { type: Sequelize.STRING(20), allowNull: true },
      joined_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    await queryInterface.addConstraint('players', {
      type: 'check',
      name: 'players_color_check',
      fields: ['player_color'],
      where: { player_color: { [Op.in]: ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE'] } },
    });
    await queryInterface.addConstraint('players', {
      type: 'check',
      name: 'players_score_check',
      fields: ['score'],
      where: { score: { [Op.gte]: 0 } },
    });
    await queryInterface.addConstraint('players', {
      type: 'check',
      name: 'players_streak_check',
      fields: ['streak'],
      where: { streak: { [Op.gte]: 0 } },
    });
    await queryInterface.addConstraint('players', {
      type: 'unique',
      name: 'players_session_nickname_unique',
      fields: ['session_id', 'nickname'],
    });
    await queryInterface.addConstraint('players', {
      type: 'unique',
      name: 'players_session_color_unique',
      fields: ['session_id', 'player_color'],
    });
    await queryInterface.addConstraint('players', {
      type: 'unique',
      name: 'players_session_user_unique',
      fields: ['session_id', 'user_id'],
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('players');
  },
};