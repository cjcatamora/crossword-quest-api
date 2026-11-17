const { matchedData } = require('express-validator');
const userService = require('../services/user.service');
const toJson = require('../utils/user-json');

async function list(req, res) {
  const users = await userService.list();
  res.status(200).json({ users: users.map(toJson) });
}

async function changeRole(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const { role } = matchedData(req, { locations: ['body'] });
  const user = await userService.changeRole(id, role, req.user);
  res.status(200).json({ user: toJson(user) });
}

module.exports = { list, changeRole };
