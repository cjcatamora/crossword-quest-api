const { matchedData } = require('express-validator');
const authService = require('../services/auth.service');
const toJson = require('../utils/user-json');

async function register(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const user = await authService.register(data);
  res.status(201).json({ user: toJson(user) });
}

async function login(req, res) {
  const { school_id: schoolId, password } = matchedData(req, { locations: ['body'] });
  const result = await authService.login(schoolId, password);
  res.status(200).json({
    token: result.token,
    token_type: 'Bearer',
    expires_in: result.expiresIn,
    user: toJson(result.user),
  });
}

function me(req, res) {
  res.status(200).json({ user: toJson(req.account) });
}

module.exports = { register, login, me };
