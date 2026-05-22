const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isGuest } = require('../middlewares/auth');

router.get('/login', isGuest, authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/register', isGuest, authController.getRegister);
router.post('/register', authController.postRegister);
router.get('/verify-otp', isGuest, authController.getVerifyOTP);
router.post('/verify-otp', authController.postVerifyOTP);
router.get('/forgot-password', isGuest, authController.getForgotPassword);
router.post('/forgot-password', authController.postForgotPassword);
router.get('/reset-password', isGuest, authController.getResetPassword);
router.post('/reset-password', authController.postResetPassword);

router.get('/logout', authController.logout);

module.exports = router;
