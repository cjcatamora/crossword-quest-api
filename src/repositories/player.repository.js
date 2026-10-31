const { Player } = require('../models');

// The seat of one account in one session, or null. This one query is the rejoin rule.
function findSeat(sessionId, userId) {
  return Player.findOne({ where: { session_id: sessionId, user_id: userId } });
}

async function colorsInUse(sessionId) {
  const rows = await Player.findAll({ where: { session_id: sessionId }, attributes: ['player_color'] });
  return rows.map((row) => row.player_color);
}

function create(data) {
  return Player.create(data);
}

// Nicknames, colors and scores only. Never anything else about a player.
function listBySession(sessionId) {
  return Player.findAll({
    where: { session_id: sessionId },
    attributes: ['nickname', 'player_color', 'score'],
    order: [['score', 'DESC'], ['player_id', 'ASC']],
  });
}

module.exports = { findSeat, colorsInUse, create, listBySession };
