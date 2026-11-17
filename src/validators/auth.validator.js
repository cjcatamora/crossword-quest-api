const { body } = require('express-validator');

const registerRules = [
  body('school_id')
    .exists().withMessage('school_id is required')
    .bail()
    .isString().withMessage('school_id must be text')
    .bail()
    .trim()
    .matches(/^\d{4}-\d{4}$/).withMessage('school_id must use the format 0000-0000'),
  body('full_name')
    .exists().withMessage('full_name is required')
    .bail()
    .isString().withMessage('full_name must be text')
    .bail()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('full_name must be 2 to 100 characters long'),
  body('email')
    .exists().withMessage('email is required')
    .bail()
    .isString().withMessage('email must be text')
    .bail()
    .trim()
    .isEmail().withMessage('email must be a valid email address')
    .normalizeEmail(),
  body('password')
    .exists().withMessage('password is required')
    .bail()
    .isString().withMessage('password must be text')
    .bail()
    .isLength({ min: 8, max: 72 }).withMessage('password must be 8 to 72 characters long')
    .bail()
    .isByteLength({ max: 72 }).withMessage('password must be no more than 72 bytes')
    .bail()
    .matches(/\p{L}/u).withMessage('password must contain a letter')
    .bail()
    .matches(/\p{N}/u).withMessage('password must contain a number'),
];

const loginRules = [
  body('school_id')
    .exists().withMessage('school_id is required')
    .bail()
    .isString().withMessage('school_id must be text')
    .bail()
    .trim(),
  body('password')
    .exists().withMessage('password is required')
    .bail()
    .isString().withMessage('password must be text'),
];

const roleRules = [
  body('role')
    .exists().withMessage('role is required')
    .bail()
    .isString().withMessage('role must be text')
    .bail()
    .isIn(['PLAYER', 'HOST', 'ADMIN']).withMessage('role must be PLAYER, HOST or ADMIN'),
];

module.exports = { registerRules, loginRules, roleRules };
