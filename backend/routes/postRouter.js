const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

router.post('/new-post', postController.new_post);
router.post('/find-posts', postController.findPosts);
router.post('/like-post', postController.like_post);
router.post('/unlike-post', postController.unlike_post);
router.post('/delete-post', postController.delete_post);
router.post('/new-comment', postController.new_comment);
router.post('/like-comment', postController.like_comment);
router.post('/unlike-comment', postController.unlike_comment);
router.post('/delete-comment', postController.delete_comment);

module.exports = router;