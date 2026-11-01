const { body, param } = require('express-validator');

const idParam = param('id')
  .isInt({ min: 1 }).withMessage('id must be a positive whole number')
  .toInt();

const name = () => body('name') // name VARCHAR(100) NOT NULL
  .exists().withMessage('name is required')
  .bail()
  .isString().withMessage('name must be text')
  .bail()
  .trim()
  .isLength({ min: 2, max: 100 }).withMessage('name must be 2 to 100 characters long');

const createRules = [name()];

// PATCH changes only what is sent. This table has one editable field, so it is required.
const updateRules = [idParam, name()];

module.exports = { idParam, createRules, updateRules };