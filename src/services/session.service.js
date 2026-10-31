const questionSetRepository = require('../repositories/question-set.repository');
const sessionRepository = require('../repositories/session.repository');
const { notFound, forbidden, conflict } = require('../errors/app-error');
const { constraintOf } = require('../errors/db-errors');

// Hub Contract rule: six digits. 100000 to 999999 never starts with 0.
function randomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function shareableLink(code) {
  return `https://crossword-quest.test/join/${code}`;
}

// Rule: which status may follow which.
const NEXT_STATUS = {
  WAITING: ['PLAYING', 'FINISHED'],
  PLAYING: ['FINISHED'],
  FINISHED: [],
};

// BIGINT ids arrive from PostgreSQL as strings, so compare them as text.
function sameId(a, b) {
  return String(a) === String(b);
}

async function findOrFail(code) {
  const session = await sessionRepository.findByCode(code);
  if (!session) throw notFound('SESSION_NOT_FOUND', `No game has the code ${code}.`);
  return session;
}

// The client sends only which question set to play. The server makes the code.
async function create(setId, user) {
  const questionSet = await questionSetRepository.findById(setId);
  if (!questionSet) throw notFound('QUESTION_SET_NOT_FOUND', `No question set has the id ${setId}.`);
  if (!sameId(questionSet.host_id, user.user_id)) {
    throw forbidden('This question set belongs to another host.');
  }

  // A random code can already be in use. The UNIQUE rule on join_code tells us, and we try again.
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const code = randomCode();
    try {
      return await sessionRepository.createWithGrid({
        host_id: user.user_id,
        set_id: questionSet.set_id,
        join_code: code,
        shareable_link: shareableLink(code),
      });
    } catch (error) {
      if (constraintOf(error) !== 'game_sessions_join_code_key') throw error;
    }
  }
  throw new Error('Could not find a free join code after 5 attempts.');
}

function get(code) {
  return findOrFail(code);
}

async function changeStatus(code, status, user) {
  const session = await findOrFail(code);
  if (!sameId(session.host_id, user.user_id)) {
    throw forbidden('This game belongs to another host.');
  }
  if (!NEXT_STATUS[session.status].includes(status)) {
    throw conflict('INVALID_STATUS_CHANGE', `A ${session.status} game cannot become ${status}.`);
  }
  const changes = { status };
  if (status === 'PLAYING') changes.started_at = new Date();
  if (status === 'FINISHED') changes.ended_at = new Date();
  return sessionRepository.update(session, changes);
}

module.exports = { findOrFail, create, get, changeStatus };
