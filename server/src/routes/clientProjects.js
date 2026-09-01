const express = require('express');
const router = express.Router();
const { getAll, getFeatured, getOne, getAllAdmin, create, update, remove } = require('../controllers/clientProjectsController');
const { protect } = require('../middleware/authMiddleware');

// Public Static
router.get('/', getAll);
router.get('/featured', getFeatured);

// Admin
router.use(protect);
router.get('/admin/all', getAllAdmin);
router.post('/', create);
router.patch('/:id', update);
router.delete('/:id', remove);

// Public Dynamic - Must be last
router.get('/:slug', getOne);

module.exports = router;
