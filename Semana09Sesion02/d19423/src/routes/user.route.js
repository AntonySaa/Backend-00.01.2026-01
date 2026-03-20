const controller = require('../controllers/user.controller');
const userRouter = require('express').Router();

userRouter.post('/',controller.addUser);
userRouter.put('/:id',controller.updateUser);
userRouter.delete('/:id',controller.deleteUser);

module.exports = {userRouter}