const messageRouter = require('express').Router();
const messageController = require('../controllers/message.controller');

messageRouter.post('/', messageController.createMessage);
messageRouter.get('/:conversation_id', messageController.getMessagesByConversation);
messageRouter.put('/:id', messageController.updateMessage);

module.exports = { messageRouter };