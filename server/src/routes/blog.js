const express = require('express');
const router = express.Router();
const { getAll, getOne, getAllAdmin, create, update, remove } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

// ── Public routes ──────────────────────────────────────────────────────────────
router.get('/', getAll);

// ── Admin routes (MUST be before /:slug to avoid 'admin' matching as a slug) ───
router.get('/admin/all', protect, getAllAdmin);
router.post('/', protect, create);
router.patch('/:id', protect, update);
router.delete('/:id', protect, remove);

// ── Public slug route (must be last, catches everything) ──────────────────────
router.get('/:slug', getOne);

module.exports = router;
