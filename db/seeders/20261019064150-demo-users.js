'use strict';

module.exports = {
  async up(queryInterface) {
    // Fictional accounts only. School IDs start with 2099, emails end in .test
    const fakeHash = '$2b$10$DEMOdemoDEMOdemoDEMOdemoDEMOdemoDEMOdemoDEMOdemoDEMO';

    await queryInterface.bulkInsert('users', [
      { school_id: '2099-0001', full_name: 'Demo Host', email: 'host@demo.test', username: 'demo.host', password_hash: fakeHash, role: 'host' },
      { school_id: '2099-0002', full_name: 'Ana Demo', email: 'ana@demo.test', username: 'ana.demo', password_hash: fakeHash, role: 'player' },
      { school_id: '2099-0003', full_name: 'Ben Demo', email: 'ben@demo.test', username: 'ben.demo', password_hash: fakeHash, role: 'player' },
      { school_id: '2099-0004', full_name: 'Carlo Demo', email: 'carlo@demo.test', username: 'carlo.demo', password_hash: fakeHash, role: 'player' },
      { school_id: '2099-0005', full_name: 'Dante Demo', email: 'dante@demo.test', username: 'dante.demo', password_hash: fakeHash, role: 'player' },
      // Awkward case: account that never joined a game
      { school_id: '2099-0006', full_name: 'Eli Demo', email: 'eli@demo.test', username: 'eli.demo', password_hash: fakeHash, role: 'player' },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: { [require('sequelize').Op.like]: '%@demo.test' } });
  },
};