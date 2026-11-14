'use strict';

module.exports = {
  async up(queryInterface) {
    // Fictional account only. School ID starts with 2099, email ends in .test
    const fakeHash = '$2b$10$DEMOdemoDEMOdemoDEMOdemoDEMOdemoDEMOdemoDEMOdemoDEMO';

    await queryInterface.bulkInsert('users', [
      { school_id: '2099-0007', full_name: 'Rafa Demo', email: 'rafa@demo.test', username: 'rafa.demo', password_hash: fakeHash, role: 'host' },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { school_id: '2099-0007' }, {});
  },
};