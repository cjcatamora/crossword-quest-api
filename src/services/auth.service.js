const userRepository = require('../repositories/user.repository');
const password = require('../security/password');
const token = require('../security/token');
const { unauthorized } = require('../errors/app-error');

async function register(data) {
  const passwordHash = await password.hash(data.password);
  return userRepository.create({
    school_id: data.school_id,
    full_name: data.full_name,
    email: data.email,
    password_hash: passwordHash,
    role: 'PLAYER',
  });
}

async function login(schoolId, plainPassword) {
  const user = await userRepository.findForLogin(schoolId);
  const matches = await password.matches(plainPassword, user ? user.password_hash : null);
  if (!matches) {
    throw unauthorized('School ID or password is incorrect.', 'INVALID_CREDENTIALS');
  }

  const signedToken = token.issue(user);
  return {
    token: signedToken,
    expiresIn: token.expiresInSeconds(signedToken),
    user,
  };
}

module.exports = { register, login };
