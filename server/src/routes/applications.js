const express = require('express');
const router = express.Router();
const { submitApplication, getAllApplications, updateApplicationStatus } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { strictLimiter } = require('../middleware/rateLimiter');

// Public
router.post('/', strictLimiter, submitApplication);

// Admin
router.use(protect);
router.get('/', getAllApplications);
router.patch('/:id', updateApplicationStatus);

module.exports = router;
