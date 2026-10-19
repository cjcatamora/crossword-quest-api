'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('device_info', {
      device_id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
      player_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'players', key: 'player_id' },
        onDelete: 'CASCADE',
      },
      platform: { type: Sequelize.STRING(20), allowNull: true },
      browser: { type: Sequelize.STRING(50), allowNull: true },
      last_seen: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('device_info');
  },
};