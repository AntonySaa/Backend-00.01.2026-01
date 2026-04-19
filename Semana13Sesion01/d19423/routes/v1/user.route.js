const router = require("express").Router();

const {validateUser, async} = require('../../middlewares');

const controller = require('../../controllers/user.controller');

router.post('/', [validateUser.validateCreateUser, validateUser.validateAccess], async(controller.createUser))

module.exports = router;
