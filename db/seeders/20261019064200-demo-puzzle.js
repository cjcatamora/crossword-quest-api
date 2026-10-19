'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('question_sets', [{ name: 'Demo: General Knowledge' }]);

    const [sets] = await queryInterface.sequelize.query(
      "SELECT set_id FROM question_sets WHERE name = 'Demo: General Knowledge'"
    );
    const setId = sets[0].set_id;

    await queryInterface.bulkInsert('clues', [
      { set_id: setId, direction: 'ACROSS', start_row: 0, start_col: 0, clue_text: 'Philippine national hero', answer_text: 'RIZAL', answer_length: 5 },
      { set_id: setId, direction: 'DOWN', start_row: 0, start_col: 0, clue_text: 'Flowing body of water', answer_text: 'RIVER', answer_length: 5 },
      { set_id: setId, direction: 'DOWN', start_row: 0, start_col: 4, clue_text: 'Largest island in the Philippines', answer_text: 'LUZON', answer_length: 5 },
      { set_id: setId, direction: 'ACROSS', start_row: 4, start_col: 0, clue_text: 'Sticky substance from trees', answer_text: 'RESIN', answer_length: 5 },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('clues', null, {});
    await queryInterface.bulkDelete('question_sets', { name: 'Demo: General Knowledge' });
  },
};