const router = require("express").Router();
const { validateUser, async: asyncHandler } = require('../../middlewares');
const controller = require('../../controllers/user.controller');

router.get('/', asyncHandler(controller.listUsers));
router.post('/', [validateUser.validateCreateUser], asyncHandler(controller.createUser));
router.get('/:id', asyncHandler(controller.getUser));

module.exports = router;
