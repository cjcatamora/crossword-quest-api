const questionSetRepository = require('../repositories/question-set.repository');
const { notFound, forbidden } = require('../errors/app-error');

const NOT_OWNER = 'This question set belongs to another host.';

async function findOrFail(id) {
  const questionSet = await questionSetRepository.findById(id);
  if (!questionSet) throw notFound('QUESTION_SET_NOT_FOUND', `No question set has the id ${id}.`);
  return questionSet;
}

// BIGINT ids arrive from PostgreSQL as strings, so compare them as text.
function isOwner(questionSet, user) {
  return String(questionSet.host_id) === String(user.user_id);
}

// Rule: a host sees only their own sets.
function list(user) {
  return questionSetRepository.findAllByHost(user.user_id);
}

// Rule: only the owner may read a set.
async function get(id, user) {
  const questionSet = await findOrFail(id);
  if (!isOwner(questionSet, user)) throw forbidden(NOT_OWNER);
  return questionSet;
}

// Rule: the owner is the caller. A client can never choose host_id.
function create(data, user) {
  return questionSetRepository.create({ ...data, host_id: user.user_id });
}

// Rule: only the owner may change or delete a set.
async function update(id, changes, user) {
  const questionSet = await findOrFail(id);
  if (!isOwner(questionSet, user)) throw forbidden(NOT_OWNER);
  return questionSetRepository.update(questionSet, changes);
}

async function remove(id, user) {
  const questionSet = await findOrFail(id);
  if (!isOwner(questionSet, user)) throw forbidden(NOT_OWNER);
  await questionSetRepository.remove(questionSet);
}

module.exports = { list, get, create, update, remove };