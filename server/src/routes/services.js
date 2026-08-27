const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/servicesController');
const { protect } = require('../middleware/authMiddleware');

// Public
router.get('/', getAll);
router.get('/:slug', getOne);

// Admin
router.use(protect);
router.post('/', create);
router.patch('/:id', update);
router.delete('/:id', remove);

module.exports = router;
