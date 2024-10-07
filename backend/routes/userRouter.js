const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/log-in', userController.log_in);
router.post('/logout', userController.logout);
router.post('/sign-up', userController.sign_up);
router.post('/find-users', userController.find_users);
router.post('/follow-user', userController.follow_user);
router.post('/unfollow-user', userController.unfollow_user);

router.post('/testUser', userController.testUser);


module.exports = router;