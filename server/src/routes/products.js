const express = require('express');
const router = express.Router();
const { getAll, getOne, getAllAdmin, create, update, remove } = require('../controllers/productsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAll);

router.use(protect);
router.get('/admin/all', getAllAdmin);
router.post('/', create);
router.patch('/:id', update);
router.delete('/:id', remove);

// Must be last
router.get('/:slug', getOne);

module.exports = router;
