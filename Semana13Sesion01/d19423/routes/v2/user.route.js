const router = require("express").Router();

const {validateUser, async} = require('../../middlewares');

const controller = require('../../controllers/user.controller');

router.post('/', [validateUser.validateCreateUser, validateUser.validateAccess], async(controller.createUser))
router.get('/',(req,res)=>{
    res.json({
        message: "Version 2"
    })
})

module.exports = router;
