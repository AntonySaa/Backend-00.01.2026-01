const conversationRouter = require('express').Router();
const conversationController = require('../controllers/conversation.controller');

conversationRouter.get('/', conversationController.getConversations);
conversationRouter.post('/', conversationController.createConversation);
conversationRouter.put('/:id', conversationController.editConversation);
conversationRouter.delete('/:id', conversationController.deleteConversation);

module.exports = { conversationRouter };