'use strict';

// helper: ask the database for an ID instead of typing it
async function getId(queryInterface, sql) {
  const [rows] = await queryInterface.sequelize.query(sql);
  return rows[0];
}

module.exports = {
  async up(queryInterface) {
    const host = await getId(queryInterface, "SELECT user_id FROM users WHERE username = 'demo.host'");
    const ana = await getId(queryInterface, "SELECT user_id FROM users WHERE username = 'ana.demo'");
    const ben = await getId(queryInterface, "SELECT user_id FROM users WHERE username = 'ben.demo'");
    const carlo = await getId(queryInterface, "SELECT user_id FROM users WHERE username = 'carlo.demo'");
    const dante = await getId(queryInterface, "SELECT user_id FROM users WHERE username = 'dante.demo'");
    const set = await getId(queryInterface, "SELECT set_id FROM question_sets WHERE name = 'Demo: General Knowledge'");

    // grid
    await queryInterface.bulkInsert('crossword_grids', [{ size: 10 }]);
    const grid = await getId(queryInterface, 'SELECT grid_id FROM crossword_grids ORDER BY grid_id DESC LIMIT 1');

    // finished game session
    await queryInterface.bulkInsert('game_sessions', [{
      host_id: host.user_id,
      set_id: set.set_id,
      grid_id: grid.grid_id,
      join_code: 'DEMO01',
      shareable_link: 'https://crossword-quest.test/join/DEMO01',
      status: 'FINISHED',
      started_at: new Date('2026-10-14T09:00:00Z'),
      ended_at: new Date('2026-10-14T09:12:00Z'),
    }]);
    const session = await getId(queryInterface, "SELECT session_id FROM game_sessions WHERE join_code = 'DEMO01'");

    // players: 3 completed, 1 left early
    await queryInterface.bulkInsert('players', [
      { session_id: session.session_id, user_id: ana.user_id, nickname: 'Ana', player_color: 'RED', token: 'demo-token-ana', score: 130, streak: 2, device_platform: 'ANDROID' },
      { session_id: session.session_id, user_id: ben.user_id, nickname: 'Ben', player_color: 'BLUE', token: 'demo-token-ben', score: 65, streak: 1, device_platform: 'IOS' },
      { session_id: session.session_id, user_id: carlo.user_id, nickname: 'Carlo', player_color: 'GREEN', token: 'demo-token-carlo', score: 65, streak: 1, device_platform: 'WINDOWS' },
      // Awkward case: left early, never solved anything
      { session_id: session.session_id, user_id: dante.user_id, nickname: 'Dante', player_color: 'YELLOW', token: 'demo-token-dante', score: 0, streak: 0, device_platform: 'ANDROID' },
    ]);

    const pAna = await getId(queryInterface, "SELECT player_id FROM players WHERE token = 'demo-token-ana'");
    const pBen = await getId(queryInterface, "SELECT player_id FROM players WHERE token = 'demo-token-ben'");
    const pCarlo = await getId(queryInterface, "SELECT player_id FROM players WHERE token = 'demo-token-carlo'");
    const pDante = await getId(queryInterface, "SELECT player_id FROM players WHERE token = 'demo-token-dante'");

    // device_info
    await queryInterface.bulkInsert('device_info', [
      { player_id: pAna.player_id, platform: 'ANDROID', browser: 'Chrome', last_seen: new Date('2026-10-14T09:12:00Z') },
      { player_id: pBen.player_id, platform: 'IOS', browser: 'Safari', last_seen: new Date('2026-10-14T09:12:00Z') },
      { player_id: pCarlo.player_id, platform: 'WINDOWS', browser: 'Edge', last_seen: new Date('2026-10-14T09:12:00Z') },
      { player_id: pDante.player_id, platform: 'ANDROID', browser: 'Chrome', last_seen: new Date('2026-10-14T09:04:00Z') }, // left early
    ]);

    // solved_words (65 = 5 letters x 10 + 15 speed bonus)
    const clueRizal = await getId(queryInterface, `SELECT clue_id FROM clues WHERE answer_text = 'RIZAL' AND set_id = ${set.set_id}`);
    const clueRiver = await getId(queryInterface, `SELECT clue_id FROM clues WHERE answer_text = 'RIVER' AND set_id = ${set.set_id}`);
    const clueLuzon = await getId(queryInterface, `SELECT clue_id FROM clues WHERE answer_text = 'LUZON' AND set_id = ${set.set_id}`);
    const clueResin = await getId(queryInterface, `SELECT clue_id FROM clues WHERE answer_text = 'RESIN' AND set_id = ${set.set_id}`);

    await queryInterface.bulkInsert('solved_words', [
      { session_id: session.session_id, clue_id: clueRizal.clue_id, player_id: pAna.player_id, points_awarded: 65, solved_at: new Date('2026-10-14T09:02:00Z') },
      { session_id: session.session_id, clue_id: clueRiver.clue_id, player_id: pBen.player_id, points_awarded: 65, solved_at: new Date('2026-10-14T09:05:00Z') },
      { session_id: session.session_id, clue_id: clueLuzon.clue_id, player_id: pAna.player_id, points_awarded: 65, solved_at: new Date('2026-10-14T09:08:00Z') },
      { session_id: session.session_id, clue_id: clueResin.clue_id, player_id: pCarlo.player_id, points_awarded: 65, solved_at: new Date('2026-10-14T09:11:00Z') },
    ]);
  },

  async down(queryInterface) {
    // cascades to players, device_info, solved_words
    await queryInterface.bulkDelete('game_sessions', { join_code: 'DEMO01' });
    await queryInterface.bulkDelete('crossword_grids', null, {});
  },
};