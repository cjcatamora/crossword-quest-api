const crypto = require('crypto');
const playerRepository = require('../repositories/player.repository');
const sessionService = require('./session.service');
const { conflict } = require('../errors/app-error');
const { constraintOf } = require('../errors/db-errors');

const COLORS = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE'];

// Questions in a fixed order. The first "no" decides the answer.
async function join(code, nickname, user) {
  const session = await sessionService.findOrFail(code);

  // 1. Rejoin: this account already has a seat here. Same row, same score.
  const seat = await playerRepository.findSeat(session.session_id, user.user_id);
  if (seat) return { session, player: seat, created: false };

  // 2. A new seat only while the game is still waiting.
  if (session.status === 'FINISHED') throw conflict('SESSION_ENDED', 'This game has ended.');
  if (session.status !== 'WAITING') {
    throw conflict('SESSION_NOT_JOINABLE', 'This game has already started.');
  }

  // 3. A free color is a free seat. Six colors means six players at most.
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const taken = await playerRepository.colorsInUse(session.session_id);
    const color = COLORS.find((c) => !taken.includes(c));
    if (!color) throw conflict('SESSION_FULL', 'This game is full.');

    try {
      const player = await playerRepository.create({
        session_id: session.session_id,
        user_id: user.user_id,
        nickname,
        player_color: color,
        token: crypto.randomBytes(24).toString('hex'),
      });
      return { session, player, created: true };
    } catch (error) {
      const constraint = constraintOf(error);
      // The same account sent two join requests at the same instant, and the other one won.
      if (constraint === 'players_session_user_unique') {
        const existing = await playerRepository.findSeat(session.session_id, user.user_id);
        return { session, player: existing, created: false };
      }
      // Someone took that color a moment ago: look again and pick the next free one.
      if (constraint === 'players_session_color_unique') continue;
      throw error; // a taken nickname reaches the error handler and answers 409
    }
  }
  throw conflict('JOIN_BUSY', 'Many players joined at once. Please try again.');
}

async function list(code) {
  const session = await sessionService.findOrFail(code);
  return playerRepository.listBySession(session.session_id);
}

module.exports = { join, list };
