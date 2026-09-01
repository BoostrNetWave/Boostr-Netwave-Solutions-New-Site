const express = require('express');
const router = express.Router();
const testimonialsController = require('../controllers/testimonialsController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Public route
router.get('/', testimonialsController.getTestimonials);

// Admin routes
router.use(protect);
router.use(restrictTo('superadmin', 'editor'));

router.get('/all', testimonialsController.getAllTestimonials);
router.post('/', testimonialsController.createTestimonial);
router.route('/:id')
  .put(testimonialsController.updateTestimonial)    // kept for backward compat
  .patch(testimonialsController.updateTestimonial)  // used by admin panel
  .delete(testimonialsController.deleteTestimonial);

module.exports = router;
