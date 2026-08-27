const express = require('express');
const router = express.Router();
const testimonialsController = require('../controllers/testimonialsController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Public route
router.get('/', testimonialsController.getTestimonials);

// Admin routes
router.use(protect);
router.use(restrictTo('admin'));

router.get('/all', testimonialsController.getAllTestimonials);
router.post('/', testimonialsController.createTestimonial);
router.route('/:id')
  .put(testimonialsController.updateTestimonial)
  .delete(testimonialsController.deleteTestimonial);

module.exports = router;
