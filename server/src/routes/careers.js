const express = require('express');
const router = express.Router();
const { getAll, getOne, getAllAdmin, create, update, remove } = require('../controllers/careersController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAll);

// Admin routes must come before /:slug wildcard
router.get('/admin/all', protect, getAllAdmin);
router.post('/', protect, create);
router.patch('/:id', protect, update);
router.delete('/:id', protect, remove);

// Catch-all slug route must be last
router.get('/:slug', getOne);

module.exports = router;
