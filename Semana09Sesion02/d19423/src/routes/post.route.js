const controller = require('../controllers/post.controller');
const postRouter = require('express').Router();


postRouter.post('/:authorId',controller.addPost);
postRouter.get('/',controller.getPosts);
postRouter.delete('/:id',controller.deletePost)
postRouter.get('/:id',controller.getPostsById);

module.exports = {postRouter}