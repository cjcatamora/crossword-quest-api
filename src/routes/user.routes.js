const { Router } = require('express');
const controller = require('../controllers/user.controller');
const { roleRules } = require('../validators/auth.validator');
const validate = require('../middlewares/validate');
const requireUser = require('../middlewares/require-user');
const { param } = require('express-validator');

const router = Router();

router.use(requireUser('ADMIN'));
router.get('/', controller.list);
router.patch(
  '/:id/role',
  param('id').isInt({ min: 1 }).withMessage('id must be a positive whole number').toInt(),
  roleRules,
  validate,
  controller.changeRole
);

module.exports = router;
