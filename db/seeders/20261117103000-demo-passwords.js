'use strict';

const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const DEMO_PASSWORD = 'CrosswordDemo2026!';
const LEGACY_HASH = '$2b$10$DEMOdemoDEMOdemoDEMOdemoDEMOdemoDEMOdemoDEMOdemoDEMO';
const DEMO_SCHOOL_IDS = Array.from({ length: 7 }, (_, index) => `2099-${String(index + 1).padStart(4, '0')}`);

module.exports = {
  async up(queryInterface) {
    const hash = await bcrypt.hash(DEMO_PASSWORD, 10);

    // Earlier seeders still write this placeholder. Clear only that known value,
    // then assign a real password hash only to rows that have no hash.
    await queryInterface.bulkUpdate('users', { password_hash: null }, { password_hash: LEGACY_HASH });
    await queryInterface.bulkUpdate('users', { password_hash: hash }, { password_hash: null });

    await queryInterface.bulkUpdate('users', { role: 'HOST' }, { role: 'host' });
    await queryInterface.bulkUpdate('users', { role: 'PLAYER' }, { role: 'player' });
    await queryInterface.bulkUpdate('users', { role: 'ADMIN' }, { school_id: '2099-0006' });
  },

  async down(queryInterface) {
    await queryInterface.bulkUpdate(
      'users',
      { password_hash: LEGACY_HASH },
      { school_id: { [Op.in]: DEMO_SCHOOL_IDS } }
    );
    await queryInterface.bulkUpdate('users', { role: 'host' }, { school_id: '2099-0001' });
    await queryInterface.bulkUpdate(
      'users',
      { role: 'player' },
      { school_id: { [Op.in]: DEMO_SCHOOL_IDS.slice(1, 6) } }
    );
    await queryInterface.bulkUpdate('users', { role: 'host' }, { school_id: '2099-0007' });
  },
};
