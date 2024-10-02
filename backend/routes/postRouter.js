const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

router.post('/new-post', postController.new_post);
router.post('/find-posts', postController.findPosts);


module.exports = router;