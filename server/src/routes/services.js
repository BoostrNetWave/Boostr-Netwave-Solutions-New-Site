const express = require('express');
const router = express.Router();
const { getAll, getOne, getAllAdmin, create, update, remove } = require('../controllers/servicesController');
const { protect } = require('../middleware/authMiddleware');

// Public (Static)
router.get('/', getAll);

// Admin
router.use(protect);
router.get('/admin/all', getAllAdmin);
router.post('/', create);
router.patch('/:id', update);
router.delete('/:id', remove);

// Public (Dynamic - MUST be last)
router.get('/:slug', getOne);

module.exports = router;
