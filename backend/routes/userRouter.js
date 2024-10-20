const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/log-in', userController.log_in);
router.post('/logout', userController.logout);
router.post('/sign-up', userController.sign_up);
router.post('/find-users', userController.find_users);
router.post('/trending-users', userController.trending_users);
router.post('/follow-user', userController.follow_user);
router.post('/unfollow-user', userController.unfollow_user);
router.post('/profile/:username', userController.profile)
router.post('/edit-profile', userController.edit_profile);

module.exports = router;