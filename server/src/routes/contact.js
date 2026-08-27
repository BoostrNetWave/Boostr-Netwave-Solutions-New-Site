const express = require('express');
const router = express.Router();
const { submit, getAll, updateStatus } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const { strictLimiter } = require('../middleware/rateLimiter');

// Public
router.post('/', strictLimiter, submit);

// Admin
router.use(protect);
router.get('/', getAll);
router.patch('/:id', updateStatus);

module.exports = router;
