'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const columns = await queryInterface.describeTable('users');

    if (columns.password_hash) {
      await queryInterface.changeColumn('users', 'password_hash', {
        type: Sequelize.STRING(60),
        allowNull: true,
      });
    } else {
      await queryInterface.addColumn('users', 'password_hash', {
        type: Sequelize.STRING(60),
        allowNull: true,
      });
    }

    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'PLAYER',
    });
    await queryInterface.bulkUpdate('users', { role: 'HOST' }, { role: 'host' });
    await queryInterface.bulkUpdate('users', { role: 'PLAYER' }, { role: 'player' });

    // Keep the Week 10 usernames, but allow new account registration without one.
    if (columns.username) {
      await queryInterface.changeColumn('users', 'username', {
        type: Sequelize.STRING(50),
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const columns = await queryInterface.describeTable('users');
    const legacyHash = '$2b$10$DEMOdemoDEMOdemoDEMOdemoDEMOdemoDEMOdemoDEMOdemoDEMO';

    if (columns.username) {
      await queryInterface.sequelize.query(
        "UPDATE users SET username = 'legacy-' || user_id WHERE username IS NULL"
      );
      await queryInterface.changeColumn('users', 'username', {
        type: Sequelize.STRING(50),
        allowNull: false,
      });
    }

    await queryInterface.bulkUpdate('users', { password_hash: legacyHash }, { password_hash: null });
    await queryInterface.changeColumn('users', 'password_hash', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
    await queryInterface.bulkUpdate('users', { role: 'host' }, { role: 'HOST' });
    await queryInterface.bulkUpdate('users', { role: 'host' }, { role: 'ADMIN' });
    await queryInterface.bulkUpdate('users', { role: 'player' }, { role: 'PLAYER' });
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'host',
    });
  },
};
