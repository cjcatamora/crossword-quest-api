'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('solved_words', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
      session_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'game_sessions', key: 'session_id' },
        onDelete: 'CASCADE',
      },
      clue_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'clues', key: 'clue_id' },
        onDelete: 'CASCADE',
      },
      player_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'players', key: 'player_id' },
        onDelete: 'CASCADE',
      },
      points_awarded: { type: Sequelize.INTEGER, allowNull: false },
      solved_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    await queryInterface.addConstraint('solved_words', {
      type: 'unique',
      name: 'solved_words_session_clue_unique',
      fields: ['session_id', 'clue_id'],
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('solved_words');
  },
};