const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

router.post('/new-post', postController.new_post);
router.post('/find-posts', postController.findPosts);
router.post('/like-post', postController.like_post);
router.post('/unlike-post', postController.unlike_post);

module.exports = router;