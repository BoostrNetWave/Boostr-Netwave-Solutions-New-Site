const express = require('express');
const router = express.Router();
const { login, logout, getMe, register } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);  // open for first-admin setup, then auto-locks
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
