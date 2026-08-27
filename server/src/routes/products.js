const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/productsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAll);
router.get('/:slug', getOne);

router.use(protect);
router.post('/', create);
router.patch('/:id', update);
router.delete('/:id', remove);

module.exports = router;
