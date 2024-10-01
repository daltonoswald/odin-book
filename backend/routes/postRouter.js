const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

router.post('/new-post', postController.new_post);


module.exports = router;