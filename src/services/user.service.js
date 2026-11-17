const userRepository = require('../repositories/user.repository');
const { conflict, notFound } = require('../errors/app-error');

async function list() {
  return userRepository.findAll();
}

async function changeRole(userId, role, actor) {
  if (String(userId) === String(actor.user_id)) {
    throw conflict('CANNOT_CHANGE_OWN_ROLE', 'An admin cannot change their own role.');
  }

  const user = await userRepository.findById(userId);
  if (!user) throw notFound('USER_NOT_FOUND', `No user has the id ${userId}.`);
  return userRepository.update(user, { role });
}

module.exports = { list, changeRole };
