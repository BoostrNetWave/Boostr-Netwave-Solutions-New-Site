const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Public route
router.get('/', galleryController.getGallery);

// Admin routes
router.use(protect);
router.use(restrictTo('superadmin', 'editor'));

router.get('/all', galleryController.getAllGallery);
router.post('/', galleryController.createGalleryItem);
router.route('/:id')
  .put(galleryController.updateGalleryItem)    // kept for backward compat
  .patch(galleryController.updateGalleryItem)  // used by admin panel
  .delete(galleryController.deleteGalleryItem);

module.exports = router;
